/**
 * ====================================
 * JARVIS DESKTOP APPLICATION
 * ====================================
 * Electron Main Process
 * All-in-One Desktop Experience with Auto-Setup
 */

import { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, shell, session } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import SetupWizard from './setup-wizard.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Keep references to prevent garbage collection
let mainWindow = null;
let setupWindow = null;
let tray = null;
let serverModule = null;
let setupWizard = null;

// Configuration
const CONFIG = {
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    serverPort: 3000
};

// Store setup state
const SETUP_STATE_FILE = path.join(app.getPath('userData'), 'setup-complete.json');

/**
 * Check if first-run setup has been completed
 */
function isSetupComplete() {
    try {
        if (fs.existsSync(SETUP_STATE_FILE)) {
            const data = JSON.parse(fs.readFileSync(SETUP_STATE_FILE, 'utf8'));
            return data.complete === true;
        }
    } catch (e) {
        console.error('[SETUP] Error reading setup state:', e);
    }
    return false;
}

/**
 * Mark setup as complete
 */
function markSetupComplete(useCloudAI = false) {
    try {
        fs.writeFileSync(SETUP_STATE_FILE, JSON.stringify({
            complete: true,
            timestamp: new Date().toISOString(),
            useCloudAI: useCloudAI
        }));
    } catch (e) {
        console.error('[SETUP] Error saving setup state:', e);
    }
}

/**
 * Create the setup wizard window
 */
function createSetupWindow() {
    setupWindow = new BrowserWindow({
        width: 600,
        height: 500,
        title: 'JARVIS Setup',
        icon: path.join(__dirname, 'assets', 'icon.ico'),
        frame: false,
        transparent: false,
        backgroundColor: '#0a0a0a',
        resizable: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.cjs')
        },
        show: false
    });

    setupWindow.loadFile(path.join(__dirname, 'public', 'setup.html'));

    setupWindow.once('ready-to-show', () => {
        setupWindow.show();
        console.log('[SETUP] Setup window ready');

        // Start the setup process
        runSetup();
    });
}

/**
 * Run the setup wizard
 */
async function runSetup() {
    try {
        setupWizard = new SetupWizard();

        const success = await setupWizard.runSetup((status, progress, message) => {
            // Send status to setup window
            if (setupWindow && !setupWindow.isDestroyed()) {
                setupWindow.webContents.send('setup:status', status, progress, message);
            }
            console.log(`[SETUP] ${status}: ${message} (${progress}%)`);
        });

        if (success) {
            markSetupComplete(false);

            // Wait a moment then transition to main app
            await new Promise(r => setTimeout(r, 2000));

            if (setupWindow && !setupWindow.isDestroyed()) {
                setupWindow.close();
            }

            // Start the main application
            await launchMainApp();
        }
        // If not successful, the setup window remains open with error state
        // User can retry or skip to cloud AI
    } catch (error) {
        console.error('[SETUP] Unexpected error:', error);
        if (setupWindow && !setupWindow.isDestroyed()) {
            setupWindow.webContents.send('setup:status', 'error', 0, `Setup failed: ${error.message}`);
        }
    }
}

/**
 * Create the main application window
 */
function createWindow() {
    mainWindow = new BrowserWindow({
        width: CONFIG.width,
        height: CONFIG.height,
        minWidth: CONFIG.minWidth,
        minHeight: CONFIG.minHeight,
        title: 'J.A.R.V.I.S. Mark IV',
        icon: path.join(__dirname, 'assets', 'icon.ico'),
        frame: false, // Frameless for custom titlebar
        transparent: false,
        backgroundColor: '#000000',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.cjs'),
            spellcheck: false
        },
        show: false // Don't show until ready
    });

    // Load the app
    mainWindow.loadURL(`http://localhost:${CONFIG.serverPort}`);

    // Maximize on startup for full screen experience
    // Forward console logs to terminal
    mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
        const type = level === 0 ? 'INFO' : level === 1 ? 'WARN' : 'ERROR';
        console.log(`[RENDERER-${type}] ${message}`);
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow.maximize(); // Auto-maximize
        mainWindow.show();
        console.log('[ELECTRON] Window ready and maximized');
    });



    // Handle window close - minimize to tray instead
    mainWindow.on('close', (event) => {
        if (!app.isQuitting) {
            event.preventDefault();
            mainWindow.hide();
            return false;
        }
        return true;
    });

    // Handle external links
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    // Dev tools in development
    if (process.argv.includes('--dev')) {
        mainWindow.webContents.openDevTools();
    }
}

/**
 * Create system tray icon
 */
function createTray() {
    // Create tray icon (use a simple icon or create one)
    const iconPath = path.join(__dirname, 'assets', 'tray-icon.png');

    // Create a simple colored icon if asset doesn't exist
    let trayIcon;
    try {
        trayIcon = nativeImage.createFromPath(iconPath);
    } catch (e) {
        // Create a simple 16x16 cyan icon
        trayIcon = nativeImage.createEmpty();
    }

    tray = new Tray(trayIcon.isEmpty() ? createDefaultIcon() : trayIcon);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show JARVIS',
            click: () => {
                mainWindow.show();
                mainWindow.focus();
            }
        },
        {
            label: 'Minimize to Tray',
            click: () => mainWindow.hide()
        },
        { type: 'separator' },
        {
            label: 'Restart',
            click: () => {
                app.relaunch();
                app.quit();
            }
        },
        { type: 'separator' },
        {
            label: 'Quit JARVIS',
            click: () => {
                app.isQuitting = true;
                app.quit();
            }
        }
    ]);

    tray.setToolTip('J.A.R.V.I.S. Mark IV');
    tray.setContextMenu(contextMenu);

    // Double-click to show window
    tray.on('double-click', () => {
        mainWindow.show();
        mainWindow.focus();
    });
}

/**
 * Create a default tray icon
 */
function createDefaultIcon() {
    // Create a simple 16x16 icon programmatically
    const size = 16;
    const canvas = Buffer.alloc(size * size * 4);

    // Fill with cyan color
    for (let i = 0; i < size * size; i++) {
        canvas[i * 4] = 0;      // R
        canvas[i * 4 + 1] = 242; // G
        canvas[i * 4 + 2] = 255; // B
        canvas[i * 4 + 3] = 255; // A
    }

    return nativeImage.createFromBuffer(canvas, { width: size, height: size });
}

/**
 * Start the embedded server
 */
async function startServer() {
    console.log('[ELECTRON] Starting embedded server...');

    try {
        // Import and start the server
        serverModule = await import('./server.js');
        console.log('[ELECTRON] Server started successfully');
        return true;
    } catch (error) {
        console.error('[ELECTRON] Failed to start server:', error);
        return false;
    }
}

/**
 * IPC Handlers for renderer communication
 */
function setupIPC() {
    // Window controls
    ipcMain.on('window:minimize', () => mainWindow?.minimize());
    ipcMain.on('window:maximize', () => {
        if (mainWindow?.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow?.maximize();
        }
    });
    ipcMain.on('window:close', () => mainWindow?.hide());

    // Get window state
    ipcMain.handle('window:isMaximized', () => mainWindow?.isMaximized());

    // App info
    ipcMain.handle('app:getVersion', () => app.getVersion());
    ipcMain.handle('app:getName', () => app.getName());

    // Setup wizard controls
    ipcMain.on('setup:retry', () => {
        runSetup();
    });

    ipcMain.on('setup:skip', async () => {
        console.log('[SETUP] User chose to skip local AI setup, using cloud fallback');
        markSetupComplete(true);

        if (setupWindow && !setupWindow.isDestroyed()) {
            setupWindow.close();
        }

        await launchMainApp();
    });
}

/**
 * Launch the main application
 */
async function launchMainApp() {
    // Start embedded server
    const serverStarted = await startServer();

    if (!serverStarted) {
        console.error('[ELECTRON] Cannot start without server. Exiting...');
        app.quit();
        return;
    }

    // Wait a moment for server to be fully ready
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create window and tray
    createWindow();
    createTray();

    console.log('[ELECTRON] Application ready');
}

/**
 * Application lifecycle
 */
app.whenReady().then(async () => {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║     JARVIS DESKTOP - INITIALIZING     ║');
    console.log('╚════════════════════════════════════════╝\n');


    // Grant permissions globally for all sessions
    session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
        if (permission === 'media' || permission === 'mediaKeySystem') {
            return callback(true);
        }
        callback(false);
    });

    // Setup IPC handlers early
    setupIPC();

    // Check if setup is needed
    const setupComplete = isSetupComplete();

    if (!setupComplete) {
        // Check if Ollama is available
        setupWizard = new SetupWizard();
        const needsSetup = await setupWizard.isSetupNeeded();

        if (needsSetup) {
            console.log('[SETUP] First-time setup required');
            createSetupWindow();
            return;
        } else {
            // Ollama already installed and ready
            markSetupComplete(false);
        }
    }

    // Setup already complete, launch main app
    await launchMainApp();
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Re-create window on macOS when dock icon is clicked
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Cleanup before quit
app.on('before-quit', () => {
    app.isQuitting = true;
    console.log('[ELECTRON] Shutting down JARVIS...');
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('[ELECTRON] Uncaught exception:', error);
});
