/* JARVIS MARK IV — DUAL MODE INTERFACE */

import { SoundManager } from './sound-manager.js';

window.addEventListener("load", () => {
  // --- SOUND SYSTEM (PROCEDURAL) ---
  const sfx = new SoundManager();

  // Attach sounds to UI
  document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('mouseenter', () => sfx.playHover());
    btn.addEventListener('click', () => sfx.playClick());
  });

  // Attach to inputs
  if (document.getElementById('input')) {
    document.getElementById('input').addEventListener('keydown', () => {
      // Subtle typing sound
      sfx.playTone(800 + Math.random() * 200, 'sine', 0.03, 0.05);
    });
  }

  // --- DOM ELEMENTS ---
  const reactorParallax = document.getElementById("reactorParallax");
  const inputEl = document.getElementById("input");
  const sendBtn = document.getElementById("send");
  const micBtn = document.getElementById("mic");
  const messagesEl = document.getElementById("messages");
  const typingEl = document.getElementById("typing");
  const statusDot = document.getElementById("statusDot");
  const statusText = document.getElementById("statusText");
  const hudClock = document.getElementById("hudClock");
  const hudDate = document.getElementById("hudDate");
  const tempBar = document.getElementById("tempBar");
  const powerBar = document.getElementById("powerBar");

  // Mode UI Elements
  const voiceModeBtn = document.getElementById("voiceModeBtn");
  const chatModeBtn = document.getElementById("chatModeBtn");
  const hackerModeBtn = document.getElementById("hackerModeBtn");
  const modeStatus = document.getElementById("modeStatus");
  const voiceControls = document.getElementById("voiceControls");
  const voiceStatus = document.getElementById("voiceStatus");
  const voiceTerminate = document.getElementById("voiceTerminate");
  const chatTerminate = document.getElementById("chatTerminate");
  const chatPanel = document.getElementById("chatPanel");

  // --- STATE & CONFIG ---
  let micActive = false;
  let currentMode = "chat"; // "voice" or "chat"
  let isVoiceAutoListening = false;
  let currentAbortController = null;
  let voiceOutputEnabled = true; // Toggle for voice output in chat mode
  const synth = window.speechSynthesis;
  const recognition = initSpeechRecognition();

  // WebSocket connection
  const socket = io();
  let currentStreamingMessage = null;
  let isStreaming = false;

  // Image Attachment State
  let pendingImages = []; // Array of base64 image strings
  const fileInputEl = document.getElementById("fileInput");
  const attachBtn = document.getElementById("attach");
  const fileArea = document.getElementById("fileArea");

  // --- ADVANCED BOOT SEQUENCE ---
  // --- ADVANCED RETRO BIOS STARTUP ---
  // --- ADVANCED BOOT SEQUENCE ---
  async function runBiosSequence() {
    const biosScreen = document.getElementById("bios-screen");
    const biosLog = document.getElementById("bios-log");
    const memCounter = document.getElementById("memCounter");
    const dateEl = document.getElementById("bios-date");

    if (!biosScreen || !biosLog) {
      initSystem();
      return;
    }

    // Set Assembly Date
    if (dateEl) {
      const now = new Date();
      dateEl.textContent = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${now.getFullYear()}`;
    }

    // Helper: Add Log Line
    const addLine = (text, type = 'log-info', speed = 0) => {
      return new Promise(resolve => {
        const p = document.createElement("div");
        p.className = `log-line ${type}`;
        biosLog.appendChild(p);
        biosLog.scrollTop = biosLog.scrollHeight;

        if (speed > 0) {
          // Typing effect
          let i = 0;
          p.classList.add('typing-cursor');
          p.textContent = "";
          const timer = setInterval(() => {
            p.textContent += text.charAt(i);
            i++;
            // Randomize typing sound pitch for realism
            sfx.playTone(800 + Math.random() * 200, 'square', 0.02, 0.05);
            if (i >= text.length) {
              clearInterval(timer);
              p.classList.remove('typing-cursor');
              resolve();
            }
          }, speed);
        } else {
          // Instant
          p.textContent = text;
          resolve();
        }
      });
    };

    const delay = ms => new Promise(r => setTimeout(r, ms));

    // START SEQUENCE
    try {
      // Initial Glitch
      biosScreen.classList.add('glitch-text');
      sfx.playTone(50, 'sawtooth', 0.2, 0.1); // Glitch sound
      setTimeout(() => biosScreen.classList.remove('glitch-text'), 400);

      // 1. BIOS Header Info
      await addLine("BIOS DATE 02/03/2026 14:22:56 VER 4.2.0", "white", 10);
      await addLine("CPU: QUANTUM NEURAL PROCESSOR @ 10.5 GHz", "white", 5);

      // 2. Memory Check (Fast)
      let mem = 0;
      const total = 524288; // 512GB (display value)

      // Start memory hum
      sfx.playTone(100, 'square', 1.0, 0.05);

      const memStep = () => {
        mem += Math.floor(Math.random() * 50000) + 10000;
        if (mem > total) mem = total;
        if (memCounter) memCounter.textContent = mem;

        if (mem < total) {
          requestAnimationFrame(memStep);
        }
      };
      memStep();

      await delay(1200); // Wait for mem check to visually finish

      // 3. System Modules
      const modules = [
        "ACPI Controller... OK",
        "Neural Engine... INITIALIZED",
        "Cryptographic Core... MOUNTED",
        "Liquid Cooling... 34°C",
        "Drive 0: QUANTUM_CORE_DRIVE... MOUNTED",
        "Web Interface... LISTENING",
        "Voice Synthesis... READY",
        "Vision Processing... ONLINE",
        "Security Subsystem... ARMED"
      ];

      for (const mod of modules) {
        addLine(mod, "log-info");
        await delay(60);
      }

      await delay(600);

      // 4. Connection Sequence
      await addLine("Initializing AI Core...", "white", 40);
      await addLine(">> LOADING NEURAL WEIGHTS", "log-warn", 20);
      await delay(400);
      await addLine(">> CONNECTING TO SATELLITE UPLINK", "log-warn", 20);
      await delay(800);

      sfx.playTone(2000, 'sine', 0.5, 0.1); // Connection ping
      await addLine(">> UPLINK ESTABLISHED", "log-success", 0);

      await delay(800);

      // 5. Handover
      await addLine("SYSTEM READY.", "log-success");
      await addLine("BOOTING J.A.R.V.I.S. INTERFACE...", "white");

      // Startup Swell
      sfx.playStartup();

      await delay(1500);

      // 6. Transition
      const flash = document.createElement('div');
      flash.className = 'flash-white';
      document.body.appendChild(flash);

      biosScreen.style.display = 'none';

      // Start Main System
      initSystem();

      // Cleanup
      setTimeout(() => flash.remove(), 2000);

    } catch (e) {
      console.error("Boot Sequence Error:", e);
      // Fallback if anything crashes
      biosScreen.style.display = 'none';
      initSystem();
    }
  }

  function initSystem() {
    setStatus("idle");
    document.body.style.opacity = "1";
    updateClock();
    setInterval(updateClock, 1000);
    simulateTelemetry();
    initArcReactor();
    console.log("JARVIS: System initialized.");
  }

  // Start BIOS
  runBiosSequence();

  // --- THOUGHT PROCESS UI LOGIC ---
  const thoughtContainer = document.getElementById('thoughtContainer');
  const thoughtContent = document.getElementById('thoughtContent');
  const thoughtTimer = document.getElementById('thoughtTimer');
  const thoughtHeader = document.getElementById('thoughtHeader');
  let validThoughtStartTime = 0;
  let thoughtInterval = null;

  function startThinking() {
    thoughtContainer.classList.remove('hidden');
    thoughtContent.innerHTML = ''; // Clear previous
    validThoughtStartTime = Date.now();
    thoughtTimer.textContent = "0.0s";

    if (thoughtInterval) clearInterval(thoughtInterval);
    thoughtInterval = setInterval(() => {
      const diff = ((Date.now() - validThoughtStartTime) / 1000).toFixed(1);
      thoughtTimer.textContent = `${diff}s`;
    }, 100);
  }

  function addThought(text) {
    if (thoughtContainer.classList.contains('hidden')) startThinking();
    const div = document.createElement('div');
    div.className = 'thought-step';
    div.textContent = text;
    thoughtContent.appendChild(div);
    thoughtContent.scrollTop = thoughtContent.scrollHeight;
  }

  function stopThinking() {
    if (thoughtInterval) clearInterval(thoughtInterval);
    const diff = ((Date.now() - validThoughtStartTime) / 1000).toFixed(1);
    thoughtTimer.textContent = `Completed in ${diff}s`;
  }

  // Toggle Collapse
  thoughtHeader?.addEventListener('click', () => {
    thoughtContainer.classList.toggle('collapsed');
  });


  // --- SOCKET EVENTS ---

  socket.on("system:status", (data) => {
    // Pipe status updates to Thought UI instead of Chat
    console.log("[STATUS]", data.status);
    addThought(data.status);
  });

  socket.on("connect", () => {
    setStatus("connected");
    console.log("[Socket] Connected");
    addMessage("SYSTEM ONLINE. AWAITING INPUT.", "assistant");
  });

  socket.on("disconnect", () => {
    console.log("[WebSocket] Disconnected from server");
    setStatus("idle");
    addMessage("⚠️ Connection lost. Attempting to reconnect...", "system");
  });

  socket.on("reconnect", () => {
    console.log("[WebSocket] Reconnected to server");
    addMessage("✓ Connection restored. All systems nominal.", "system");
  });

  socket.on("system:status", (data) => {
    console.log("[System Status]", data);
  });

  socket.on("metrics:update", (metrics) => {
    updateSystemMetrics(metrics);
  });

  socket.on("intent:detected", (intentData) => {
    console.log(`[Intent] ${intentData.intent} (${(intentData.confidence * 100).toFixed(1)}%)`);
  });

  // --- REASONING STREAM HANDLERS ---
  socket.on("chat:thought:start", () => {
    startThinking();
    // Auto-expand for new thoughts
    thoughtContainer.classList.remove('collapsed');
    thoughtContainer.classList.remove('hidden');

    // Create a new thought block
    const thoughtBlock = document.createElement('div');
    thoughtBlock.className = 'thought-block active';
    thoughtContent.appendChild(thoughtBlock);
    thoughtContent.scrollTop = thoughtContent.scrollHeight;
  });

  socket.on("chat:thought", (data) => {
    const activeBlock = thoughtContent.querySelector('.thought-block.active');
    if (activeBlock) {
      activeBlock.textContent += data.token;
      thoughtContent.scrollTop = thoughtContent.scrollHeight;

      // Auto-formatting for list items in thoughts
      if (data.token.includes('\n')) {
        // simple format cleanups if needed
      }
    }
  });

  socket.on("chat:thought:end", () => {
    const activeBlock = thoughtContent.querySelector('.thought-block.active');
    if (activeBlock) {
      activeBlock.classList.remove('active');
      activeBlock.classList.add('completed');
    }
    stopThinking();
    // Optional: auto-collapse after delay?
    // setTimeout(() => thoughtContainer.classList.add('collapsed'), 5000);
  });

  let streamingRawText = ''; // Track raw text during streaming

  socket.on("chat:stream:start", () => {
    isStreaming = true;
    streamingRawText = '';
    typingEl.classList.add("hidden");
    setStatus("speaking");

    // Create a simple streaming container (will be re-formatted on end)
    currentStreamingMessage = document.createElement("div");
    currentStreamingMessage.className = "message jarvis streaming";
    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content streaming-text";
    currentStreamingMessage.appendChild(contentDiv);
    messagesEl.appendChild(currentStreamingMessage);
  });

  socket.on("chat:stream:token", (data) => {
    if (currentStreamingMessage) {
      streamingRawText += data.token;
      // Show raw text during streaming for performance
      const contentDiv = currentStreamingMessage.querySelector('.streaming-text');
      if (contentDiv) {
        contentDiv.textContent = streamingRawText;
      }
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  });

  socket.on("chat:stream:end", () => {
    isStreaming = false;

    // Apply markdown formatting to completed message
    if (currentStreamingMessage && streamingRawText) {
      const contentDiv = currentStreamingMessage.querySelector('.streaming-text');
      if (contentDiv) {
        contentDiv.className = 'message-content formatted';
        contentDiv.innerHTML = parseMarkdown(streamingRawText);
      }
      currentStreamingMessage.classList.remove('streaming');
    }

    currentStreamingMessage = null;
    streamingRawText = '';
    setStatus("idle");

    // Trigger thunder when response completes
    // if (window.triggerThunder) {
    //   setTimeout(() => window.triggerThunder(), 200);
    // }
  });



  socket.on("chat:response", (data) => {
    // Handle standard plugin response
    setStatus("idle");
    typingEl.classList.add("hidden");
    stopThinking(); // Safety: Ensure thought UI is closed
    addMessage(data.message, "jarvis"); // Use 'jarvis' class for formatting

    // Handle specific actions
    if (data.data) {
      if (data.data.action === "camera_capture") {
        openCamera();
      } else if (data.data.action === "camera_close") {
        closeCamera();
      }
    }
  });

  socket.on("chat:error", (data) => {
    typingEl.classList.add("hidden");
    setStatus("idle");
    addMessage(`⚠️ Error: ${data.error}`, "system");
  });

  socket.on("tts:speak", (data) => {
    // Only speak if voice output is enabled or in voice mode
    if (voiceOutputEnabled || currentMode === "voice") {
      speak(data.text);
    }
  });

  // --- SYSTEM METRICS UPDATE ---
  function updateSystemMetrics(metrics) {
    // Update CPU/RAM indicators in the HUD
    if (tempBar && metrics.cpu) {
      tempBar.style.width = `${metrics.cpu.usage}%`;
    }
    if (powerBar && metrics.memory) {
      powerBar.style.width = `${metrics.memory.usagePercent}%`;
    }
  }

  // --- ARC REACTOR (3D HIGH FIDELITY) ---
  function initArcReactor() {
    const container = document.getElementById("threejs-container");
    if (!container) return;

    // cleanup
    while (container.firstChild) container.removeChild(container.firstChild);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });

    // Fit to container
    const rect = container.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    camera.position.z = 5;

    // GROUP FOR ROTATION
    const reactorGroup = new THREE.Group();
    scene.add(reactorGroup);

    // --- MATERIALS ---
    const metalDark = new THREE.MeshStandardMaterial({
      color: 0x111111,
      metalness: 0.8,
      roughness: 0.4
    });

    const metalLight = new THREE.MeshStandardMaterial({
      color: 0x88aabb,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x002244,
      emissiveIntensity: 0.1
    });

    const glowBlue = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const glowCore = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    // --- GEOMETRY ---

    // 1. Neural Core (The Brain)
    const coreGeo = new THREE.IcosahedronGeometry(0.8, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    const neuralCore = new THREE.Mesh(coreGeo, coreMat);
    reactorGroup.add(neuralCore);

    // 2. Quantum Shells (Nested Data Layers)
    const shell1Geo = new THREE.IcosahedronGeometry(1.2, 1);
    const shell1 = new THREE.Mesh(shell1Geo, glowBlue);
    reactorGroup.add(shell1);

    const shell2Geo = new THREE.IcosahedronGeometry(1.6, 0);
    const shell2 = new THREE.Mesh(shell2Geo, glowCore);
    shell2.material.wireframe = true;
    reactorGroup.add(shell2);

    // 3. Synaptic Data Streams (Floating Bits)
    const synapseGroup = new THREE.Group();
    const dataGeo = new THREE.BoxGeometry(0.05, 0.2, 0.05);
    for (let i = 0; i < 40; i++) {
      const d = new THREE.Mesh(dataGeo, glowBlue);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.0 + Math.random() * 0.5;

      d.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      d.lookAt(0, 0, 0);
      d.userData = {
        drift: Math.random() * 0.02,
        pulseOffset: Math.random() * 10
      };
      synapseGroup.add(d);
    }
    reactorGroup.add(synapseGroup);

    // 4. Energy Spike Rings (Fast orbital data)
    const orbitalRingGeo = new THREE.TorusGeometry(2.5, 0.02, 16, 100);
    const orbitalRing = new THREE.Mesh(orbitalRingGeo, glowBlue);
    reactorGroup.add(orbitalRing);


    // --- LIGHTING (Enhanced) ---
    const pointLight = new THREE.PointLight(0x00ffff, 3, 15);
    pointLight.position.set(0, 0, 0);
    reactorGroup.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);

    // --- ANIMATION STATE ---
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    // --- ANIMATION ---
    function animate() {
      requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // 1. LIVE FLOATING ANIMATION (No Cursor)
      const floatX = Math.sin(time * 0.7) * 0.15 + Math.sin(time * 0.3) * 0.05;
      const floatY = Math.cos(time * 0.5) * 0.15 + Math.sin(time * 0.2) * 0.05;

      reactorGroup.rotation.x = floatX;
      reactorGroup.rotation.y = floatY;

      // 2. Spin Inner Ring & Expansion
      innerRing.rotation.z -= 0.04;
      innerRing.rotation.x = Math.sin(time * 1.5) * 0.2;

      // Mechanical Expansion: Ring breathes in/out slightly
      const expansion = 1.0 + Math.sin(time * 2) * 0.05;
      innerRing.scale.setScalar(expansion);

      // 3. Pulse Core & Color Shift
      const pulse = Math.sin(time * 4) + Math.sin(time * 12) * 0.3;
      const breathe = (pulse + 1.2) * 0.5;

      plasma.scale.setScalar(0.9 + breathe * 0.2);
      pointLight.intensity = 2.0 + breathe * 2.5; // Brighter light caps

      // COLOR SHIFTING (Cyan -> White Hot)
      const shift = Math.max(0, breathe - 0.4) * 1.8;
      pointLight.color.setHSL(0.5 + shift * 0.08, 1.0 - shift * 0.5, 0.5 + shift * 0.45);

      // MATERIAL PULSING (New)
      // Pulse opacity of the blue glow ring
      innerRing.material.opacity = 0.6 + Math.sin(time * 5) * 0.2;

      // Pulse emissive core material
      plasma.material.opacity = 0.8 + breathe * 0.2;

      // 5. Spin Segments (Counter-Rotation Effect via oscillation)
      // Instead of just spinning, let's make them oscillate like a mechanism
      segmentGroup.rotation.z = Math.sin(time * 0.5) * 0.5;
      // And individual blocks expand out
      segmentGroup.children.forEach((child, i) => {
        // Push blocks in/out from center
        const baseDist = 2.0;
        const dist = baseDist + Math.sin(time * 10 + i) * 0.05;
        child.position.setLength(dist);
      });

      renderer.render(scene, camera);
    }
    animate();

    // Mouse Tracking REMOVED for "Live" autonomous feel
    // if (reactorParallax) { ... }

    // Resize Handler
    const resizeObserver = new ResizeObserver(() => {
      const newRect = container.getBoundingClientRect();
      renderer.setSize(newRect.width, newRect.height);
      camera.aspect = newRect.width / newRect.height;
      camera.updateProjectionMatrix();
    });
    resizeObserver.observe(container);
  }

  // --- STATUS MANAGEMENT ---
  let thunderInterval = null;

  function setStatus(mode) {
    const modes = {
      idle: { text: "IDLE", class: "", dotColor: "#00f2ff" },
      thinking: { text: "PROCESSING", class: "thinking", dotColor: "#ffcc00" },
      speaking: { text: "RESPONDING", class: "speaking", dotColor: "#ff3b3b" },
      listening: { text: "LISTENING", class: "listening", dotColor: "#00ff88" }
    };

    const config = modes[mode] || modes.idle;
    statusText.textContent = config.text;
    document.body.className = config.class;
    statusDot.style.background = config.dotColor;
    statusDot.style.boxShadow = `0 0 10px ${config.dotColor}`;

    // Intense thunder during thinking/speaking
    // if (thunderInterval) {
    //   clearInterval(thunderInterval);
    //   thunderInterval = null;
    // }

    // if (mode === "thinking" || mode === "speaking") {
    //   // Trigger immediate thunder burst
    //   if (window.triggerThunder) {
    //     window.triggerThunder();
    //   }
    //   // Continuous fast thunder
    //   thunderInterval = setInterval(() => {
    //     if (window.triggerThunder) {
    //       window.triggerThunder();
    //     }
    //   }, mode === "thinking" ? 150 : 250);
    // }
  }

  // --- CLOCK & DATE ---
  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    hudClock.textContent = `${hours}:${minutes}:${seconds}`;

    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const dateStr = `${months[now.getMonth()]}. ${String(now.getDate()).padStart(2, "0")}, ${now.getFullYear()}`;
    hudDate.textContent = dateStr;
  }

  // --- TELEMETRY SIMULATION (Enhanced) ---
  function simulateTelemetry() {
    // Faster, smoother updates
    setInterval(() => {
      const tempBase = 42;
      const tempJitter = (Math.random() - 0.5) * 5;
      const temp = tempBase + tempJitter;

      const powerBase = 8.8;
      const powerJitter = (Math.random() - 0.5) * 0.4;
      const power = powerBase + powerJitter;

      if (tempBar) {
        tempBar.style.width = `${Math.min(100, Math.max(0, temp))}%`;
        const tempValEl = tempBar.parentElement.nextElementSibling;
        if (tempValEl) tempValEl.textContent = `${temp.toFixed(1)}°C`;

        // Color warning
        if (temp > 50) tempBar.style.background = "#ff3b3b";
        else tempBar.style.background = "#00efff";
      }

      if (powerBar) {
        powerBar.style.width = `${Math.min(100, Math.max(0, power * 10))}%`;
        const powerValEl = powerBar.parentElement.nextElementSibling;
        if (powerValEl) powerValEl.textContent = `${power.toFixed(2)} GW`;
      }
    }, 800); // 800ms updates
  }

  // --- TEXT DECRYPTION EFFECT ---
  function decryptText(element, originalText, speed = 50) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
    let iterations = 0;

    const interval = setInterval(() => {
      element.textContent = originalText
        .split("")
        .map((letter, index) => {
          if (index < iterations) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      if (iterations >= originalText.length) {
        clearInterval(interval);
      }

      iterations += 1 / 3;
    }, speed);
  }

  // Apply decryption to headers on load
  setTimeout(() => {
    document.querySelectorAll('.telemetry-item .label, .jarvis-title, .mode-label').forEach(el => {
      decryptText(el, el.textContent.trim());
    });
  }, 1000);

  // --- LIVE LOCATION ---
  function initGeolocation() {
    const locationEl = document.getElementById("weatherLocation");
    if (!locationEl) return;

    if ("geolocation" in navigator) {
      locationEl.textContent = "LOCATING...";

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Reverse geocoding using free API
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();

            const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || "UNKNOWN";
            const country = data.address?.country_code?.toUpperCase() || "";

            locationEl.textContent = `${city.toUpperCase()}${country ? ', ' + country : ''}`;
            console.log(`[JARVIS] Location: ${city}, ${country}`);
          } catch (err) {
            locationEl.textContent = `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`;
            console.log("[JARVIS] Using coordinates as fallback");
          }
        },
        (error) => {
          console.warn("[JARVIS] Geolocation error:", error.message);
          locationEl.textContent = "LOCATION N/A";
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      locationEl.textContent = "GEO UNAVAILABLE";
    }
  }

  // Initialize location on boot
  initGeolocation();

  // --- IMAGE ATTACHMENT HANDLERS ---

  // Create image preview container if not exists
  function createImagePreviewContainer() {
    let container = document.getElementById('imagePreviewContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'imagePreviewContainer';
      container.className = 'image-preview-container';
      // Insert before the input area
      const inputArea = document.querySelector('.input-area');
      if (inputArea && inputArea.parentNode) {
        inputArea.parentNode.insertBefore(container, inputArea);
      }
    }
    return container;
  }

  // Add image preview to UI
  function addImagePreview(imageData, index) {
    const container = createImagePreviewContainer();
    const preview = document.createElement('div');
    preview.className = 'image-preview';
    preview.dataset.index = index;
    preview.innerHTML = `
      <img src="data:image/jpeg;base64,${imageData}" alt="Attached image" />
      <button class="remove-image" title="Remove">&times;</button>
    `;

    preview.querySelector('.remove-image').addEventListener('click', () => {
      pendingImages.splice(index, 1);
      refreshImagePreviews();
    });

    container.appendChild(preview);
    container.classList.remove('hidden');
  }





  // Refresh all image previews
  function refreshImagePreviews() {
    const container = document.getElementById('imagePreviewContainer');
    if (container) {
      container.innerHTML = '';
      if (pendingImages.length === 0) {
        container.classList.add('hidden');
      } else {
        pendingImages.forEach((img, i) => addImagePreview(img, i));
      }
    }
  }

  // Clear all image previews
  function clearImagePreviews() {
    pendingImages = [];
    const container = document.getElementById('imagePreviewContainer');
    if (container) {
      container.innerHTML = '';
      container.classList.add('hidden');
    }
  }

  // Attach button click handler
  if (attachBtn && fileInputEl) {
    attachBtn.addEventListener('click', () => {
      fileInputEl.click();
    });

    // File input change handler
    fileInputEl.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);

      files.forEach(file => {
        if (!file.type.startsWith('image/')) {
          console.warn('[JARVIS] Skipping non-image file:', file.name);
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          // Extract base64 data (remove the "data:image/...;base64," prefix)
          const base64Data = event.target.result.split(',')[1];
          pendingImages.push(base64Data);
          addImagePreview(base64Data, pendingImages.length - 1);
          console.log(`[JARVIS] Image attached: ${file.name}`);
        };
        reader.readAsDataURL(file);
      });

      // Reset file input for future selections
      fileInputEl.value = '';
    });
  }

  // Handle paste events for clipboard images (Ctrl+V)
  document.addEventListener('paste', (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) continue;

        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Data = event.target.result.split(',')[1];
          pendingImages.push(base64Data);
          addImagePreview(base64Data, pendingImages.length - 1);
          console.log('[JARVIS] Image pasted from clipboard');
        };
        reader.readAsDataURL(file);
      }
    }
  });

  // Handle drag and drop for images
  if (fileArea) {
    fileArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      fileArea.classList.add('drag-over');
    });

    fileArea.addEventListener('dragleave', () => {
      fileArea.classList.remove('drag-over');
    });

    fileArea.addEventListener('drop', (e) => {
      e.preventDefault();
      fileArea.classList.remove('drag-over');

      const files = Array.from(e.dataTransfer.files);
      files.forEach(file => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Data = event.target.result.split(',')[1];
          pendingImages.push(base64Data);
          addImagePreview(base64Data, pendingImages.length - 1);
          console.log(`[JARVIS] Image dropped: ${file.name}`);
        };
        reader.readAsDataURL(file);
      });
    });
  }

  // --- SEND MESSAGE ---
  function sendMessage(text) {
    const hasText = text && text.trim();
    const hasImages = pendingImages.length > 0;

    if (!hasText && !hasImages) return;

    const msg = hasText ? text.trim() : 'Analyze this image.';
    inputEl.value = "";

    // Display user message (with image indicator if applicable)
    if (hasImages) {
      addMessage(`📷 [Image attached] ${msg}`, "user");
    } else {
      addMessage(msg, "user");
    }

    // Show typing indicator
    typingEl.classList.remove("hidden");
    setStatus("thinking");

    // If images are pending, send via chat:image
    if (hasImages) {
      // Send first image (or loop for multiple)
      socket.emit("chat:image", {
        imageData: pendingImages[0],
        prompt: msg
      });
      clearImagePreviews();
    } else {
      // Send via WebSocket for text-only
      socket.emit("chat:message", {
        message: msg,
        history: []
      });
    }
  }

  // --- MARKDOWN PARSER FOR RICH TEXT ---
  function parseMarkdown(text) {
    if (!text) return '';

    let html = text;

    // Escape HTML first to prevent XSS
    html = html.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Code blocks (triple backticks with optional language)
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const langLabel = lang ? `<span class="code-lang">${lang}</span>` : '';
      return `<div class="code-block">${langLabel}<pre><code>${code.trim()}</code></pre><button class="copy-code-btn" onclick="copyCode(this)">📋 Copy</button></div>`;
    });

    // Inline code (single backticks)
    html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    // Headers (# ## ###)
    html = html.replace(/^### (.+)$/gm, '<h4 class="md-h4">$1</h4>');
    html = html.replace(/^## (.+)$/gm, '<h3 class="md-h3">$1</h3>');
    html = html.replace(/^# (.+)$/gm, '<h2 class="md-h2">$1</h2>');

    // Bold (**text** or __text__)
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

    // Italic (*text* or _text_)
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

    // Strikethrough (~~text~~)
    html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');

    // Unordered lists (- item or * item)
    html = html.replace(/^[\-\*] (.+)$/gm, '<li class="md-li">$1</li>');
    html = html.replace(/(<li class="md-li">.*<\/li>\n?)+/g, '<ul class="md-ul">$&</ul>');

    // Ordered lists (1. item)
    html = html.replace(/^\d+\. (.+)$/gm, '<li class="md-oli">$1</li>');
    html = html.replace(/(<li class="md-oli">.*<\/li>\n?)+/g, '<ol class="md-ol">$&</ol>');

    // Blockquotes (> text)
    html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="md-quote">$1</blockquote>');

    // Horizontal rule (--- or ***)
    html = html.replace(/^(---|\*\*\*)$/gm, '<hr class="md-hr">');

    // Links [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="md-link">$1</a>');

    // Line breaks (preserve double newlines as paragraphs)
    html = html.replace(/\n\n/g, '</p><p class="md-p">');
    html = html.replace(/\n/g, '<br>');

    // Wrap in paragraph if not already structured
    if (!html.startsWith('<')) {
      html = `<p class="md-p">${html}</p>`;
    }

    return html;
  }

  // Copy code function
  window.copyCode = function (btn) {
    const codeBlock = btn.previousElementSibling;
    const code = codeBlock.textContent;
    navigator.clipboard.writeText(code).then(() => {
      btn.textContent = '✓ Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = '📋 Copy';
        btn.classList.remove('copied');
      }, 2000);
    });
  };

  // --- MESSAGE CREATION ---
  function createMessage(text, sender) {
    const div = document.createElement("div");
    div.className = `message ${sender}`;

    if (sender === 'jarvis' || sender === 'system') {
      // Parse markdown for JARVIS responses
      const contentDiv = document.createElement('div');
      contentDiv.className = 'message-content formatted';
      contentDiv.innerHTML = parseMarkdown(text);
      div.appendChild(contentDiv);
    } else {
      // Plain text for user messages
      div.textContent = text;
    }

    return div;
  }

  function addMessage(text, sender) {
    const div = createMessage(text, sender);
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function speak(text) {
    if (!synth) return;
    const utter = new SpeechSynthesisUtterance(text);

    // Deep Masculine Bass Tuning
    const voices = synth.getVoices();
    const voice = voices.find(v => v.name.includes("David") || v.name.includes("Male") || v.name.includes("Daniel") || v.lang.startsWith("en-GB")) || voices[0];
    if (voice) utter.voice = voice;

    utter.pitch = 0.5; // Heavy Bass
    utter.rate = 0.8;  // Dangerous and Authoritative

    // Clean text for TTS (remove markdown, code blocks, URLs, and thought tags)
    let cleanText = text
      .replace(/<thought>[\s\S]*?<\/thought>/gi, '') // Remove thought tags content
      .replace(/```[\s\S]*?```/g, ' [Code Block] ')   // Replace code blocks with short pause descriptive text
      .replace(/`([^`]+)`/g, '$1')                    // Inline code to normal text
      .replace(/\[.*?\]\(.*?\)/g, '')                 // Remove markdown links
      .replace(/(https?:\/\/[^\s]+)/g, 'Link')        // Replace raw URLs with "Link"
      .replace(/[*_#]/g, '')                          // Remove formatting chars
      .replace(/\n/g, '. ');                          // Newlines to pauses

    utter.text = cleanText;

    // Track what is being said for Echo Cancellation
    window.lastSpokenText = cleanText;
    window.lastSpeakTime = Date.now(); // Track WHEN it was said

    utter.onstart = () => {
      setStatus("speaking");
      // Stop mic to prevent echo (Hard Echo Cancellation)
      if (micActive && recognition) {
        try { recognition.stop(); } catch (e) { console.log('Mic stop error:', e); }
      }
    };

    utter.onend = () => {
      setStatus("idle");
      // Restart mic after speaking
      if ((currentMode === "voice" || micActive)) {
        console.log("[Voice] Resuming listener...");
        try { recognition.start(); } catch (e) { console.log('Mic restart error:', e); }
      }
    };
    synth.speak(utter);
  }

  // --- SPEECH RECOGNITION ---
  function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const rec = new SpeechRecognition();
    rec.continuous = true; // Key for real-time interaction
    rec.interimResults = true; // Required for faster barge-in detection

    rec.onresult = (e) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal) {
          finalTranscript += e.results[i][0].transcript;
        } else {
          interimTranscript += e.results[i][0].transcript;
        }
      }

      // --- BARGE-IN LOGIC (DISABLED) ---
      // User reported issues, so we are keeping it continuous but NOT stopping TTS.
      /*
      if ((interimTranscript.trim().length > 3 || finalTranscript.trim().length > 3) && synth.speaking) {
        console.log("[Voice] Barge-in detected! Stopping TTS.");
        synth.cancel();
        setStatus("listening");
      }
      */

      // Only send FINAL results to the AI logic
      if (finalTranscript && finalTranscript.trim().length > 1) {

        // --- ECHO CANCELLATION ---
        // Clean input and last spoken text for comparison
        const cleanInput = finalTranscript.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
        const cleanLastSpoken = (window.lastSpokenText || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

        // Calculate overlap/similarity
        const isEcho = cleanLastSpoken.includes(cleanInput) || cleanInput.includes(cleanLastSpoken);

        // Check if echo AND if it's within the "echo danger window" (e.g., 5 seconds from last speech)
        const timeSinceSpeak = Date.now() - (window.lastSpeakTime || 0);

        if (isEcho && cleanInput.length > 3) { // Lowered threshold to 3 chars
          console.log(`[Voice] Echo Detected (Ignored): "${finalTranscript}"`);
          // statusText.textContent = "ECHO IGNORED";
          // return; // BLOCK THE ECHO
        }

        console.log(`[Voice] Processing: "${finalTranscript}"`);
        sendMessage(finalTranscript);
      }
    };

    rec.onerror = (e) => {
      console.warn("[Voice] Error:", e.error);
      if (e.error === 'no-speech') return;

      // Auto-restart on error if in voice mode
      if (currentMode === "voice" && micActive && e.error !== 'aborted') {
        setTimeout(() => {
          try { rec.start(); } catch (err) { }
        }, 100);
      }
    };

    rec.onend = () => {
      // Auto-restart if in voice mode or listening mode
      if ((currentMode === "voice" || micActive) && !synth.speaking) {
        console.log("[Voice] Restarting listener...");
        try { rec.start(); } catch (e) { }
      } else {
        micActive = false;
        micBtn.classList.remove("active");
        if (statusText.textContent === "LISTENING") setStatus("idle");
      }
    };

    return rec;
  }

  // --- EVENT LISTENERS ---
  sendBtn.addEventListener("click", () => sendMessage(inputEl.value));
  inputEl.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(inputEl.value); });

  micBtn.addEventListener("click", () => {
    if (micActive || !recognition) return;
    micActive = true;
    micBtn.classList.add("active");
    setStatus("listening");
    recognition.start();
  });

  // Voice Output Toggle
  const voiceToggleBtn = document.getElementById("voiceToggle");
  if (voiceToggleBtn) {
    voiceToggleBtn.addEventListener("click", () => {
      voiceOutputEnabled = !voiceOutputEnabled;
      voiceToggleBtn.classList.toggle("active", voiceOutputEnabled);
      voiceToggleBtn.textContent = voiceOutputEnabled ? "🔊" : "🔇";
      voiceToggleBtn.title = voiceOutputEnabled ? "Voice Output: ON" : "Voice Output: OFF";

      // Stop any current speech if disabling
      if (!voiceOutputEnabled && synth) {
        synth.cancel();
      }

      console.log(`[JARVIS] Voice output ${voiceOutputEnabled ? 'enabled' : 'disabled'}`);
    });
  }

  // === NOVA AI ENHANCEMENTS ===

  // Voice Visualizer
  const voiceVisualizer = document.getElementById('voiceVisualizer');
  const waveformCanvas = document.getElementById('waveformCanvas');
  let audioContext = null;
  let analyser = null;
  let animationId = null;

  function initVoiceVisualizer() {
    if (!waveformCanvas) return;

    const ctx = waveformCanvas.getContext('2d');
    waveformCanvas.width = waveformCanvas.offsetWidth;
    waveformCanvas.height = waveformCanvas.offsetHeight;

    function drawWaveform() {
      if (!analyser) {
        // Draw idle state
        ctx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
        ctx.strokeStyle = '#00f2ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const time = Date.now() * 0.001;
        for (let x = 0; x < waveformCanvas.width; x++) {
          const y = waveformCanvas.height / 2 + Math.sin((x + time * 50) * 0.02) * 20;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        animationId = requestAnimationFrame(drawWaveform);
        return;
      }

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteTimeDomainData(dataArray);

      ctx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
      ctx.strokeStyle = '#00f2ff';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const sliceWidth = waveformCanvas.width / dataArray.length;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * waveformCanvas.height / 2;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.stroke();
      animationId = requestAnimationFrame(drawWaveform);
    }

    drawWaveform();
  }

  // Command Palette
  const commandPalette = document.getElementById('commandPalette');
  const paletteInput = document.getElementById('paletteInput');
  const paletteResults = document.getElementById('paletteResults');
  const paletteClose = document.getElementById('paletteClose');

  const quickCommands = [
    { name: 'Where am I?', command: 'where am i', icon: '📍' },
    { name: 'Take Screenshot', command: 'take screenshot', icon: '📸' },
    { name: 'Show Clipboard', command: 'show clipboard', icon: '📋' },
    { name: 'List Processes', command: 'show running processes', icon: '⚙️' },
    { name: 'System Status', command: 'system status', icon: '💻' },
    { name: 'Recent Files', command: 'show recent files', icon: '📁' },
    { name: 'Weather', command: 'whats the weather', icon: '🌤️' }
  ];

  function openCommandPalette() {
    commandPalette.classList.remove('hidden');
    paletteInput.value = '';
    paletteInput.focus();
    updatePaletteResults('');
  }

  function closeCommandPalette() {
    commandPalette.classList.add('hidden');
  }

  function updatePaletteResults(query) {
    const filtered = query ? quickCommands.filter(cmd =>
      cmd.name.toLowerCase().includes(query.toLowerCase()) ||
      cmd.command.toLowerCase().includes(query.toLowerCase())
    ) : quickCommands;

    paletteResults.innerHTML = filtered.map(cmd =>
      `<div class="palette-result-item" data-command="${cmd.command}">
        <span style="font-size: 1.2rem; margin-right: 10px;">${cmd.icon}</span>
        <span>${cmd.name}</span>
      </div>`
    ).join('');

    paletteResults.querySelectorAll('.palette-result-item').forEach(item => {
      item.addEventListener('click', () => {
        sendMessage(item.dataset.command);
        closeCommandPalette();
      });
    });
  }

  paletteInput?.addEventListener('input', (e) => updatePaletteResults(e.target.value));
  paletteInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && paletteInput.value.trim() !== "") {
      const text = paletteInput.value;
      sendMessage(text);
      paletteInput.value = "";
      startThinking(); // Start thought timer
      closeCommandPalette();
    }
  });
  paletteClose?.addEventListener('click', closeCommandPalette);
  commandPalette?.querySelector('.palette-backdrop')?.addEventListener('click', closeCommandPalette);

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openCommandPalette();
    }
    if (e.key === 'Escape' && !commandPalette.classList.contains('hidden')) {
      closeCommandPalette();
    }
  });

  // Notification Toast System
  function showToast(message, type = 'info', duration = 4000) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-header">
        <span class="toast-title">${type.toUpperCase()}</span>
        <button class="toast-close">✕</button>
      </div>
      <div class="toast-message">${message}</div>
    `;

    toastContainer.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => toast.remove());

    setTimeout(() => toast.remove(), duration);
  }

  // Quick Actions
  document.getElementById('quickLocation')?.addEventListener('click', () => sendMessage('where am i'));
  document.getElementById('quickScreenshot')?.addEventListener('click', () => sendMessage('take screenshot'));
  document.getElementById('quickClipboard')?.addEventListener('click', () => sendMessage('show clipboard'));
  document.getElementById('quickProcesses')?.addEventListener('click', () => sendMessage('show running processes'));

  // Enhanced voice recognition with visualizer
  if (recognition && voiceVisualizer) {
    recognition.addEventListener('start', () => {
      voiceVisualizer.classList.remove('hidden');
      initVoiceVisualizer();
    });

    recognition.addEventListener('end', () => {
      voiceVisualizer.classList.add('hidden');
      if (animationId) cancelAnimationFrame(animationId);

      // Auto-restart in voice mode
      if (currentMode === "voice" && isVoiceAutoListening && !isStreaming) {
        setTimeout(() => startVoiceListening(), 500);
      }
    });
  }

  // Initialize
  initVoiceVisualizer();

  // === MODE SWITCHING ===
  function setMode(mode) {
    currentMode = mode;
    document.body.setAttribute("data-mode", mode);

    voiceModeBtn.classList.toggle("active", mode === "voice");
    chatModeBtn.classList.toggle("active", mode === "chat");
    modeStatus.textContent = mode === "voice" ? "VOICE MODE" : "CHAT MODE";

    if (mode === "voice") {
      startVoiceMode();
    } else {
      stopVoiceMode();
    }
  }

  function startVoiceMode() {
    isVoiceAutoListening = true;
    updateVoiceStatus("LISTENING");
    startVoiceListening();
  }

  function stopVoiceMode() {
    isVoiceAutoListening = false;
    if (recognition && micActive) {
      recognition.stop();
      micActive = false;
    }
    synth.cancel();
  }

  function startVoiceListening() {
    if (!recognition || micActive || isStreaming) return;
    micActive = true;
    micBtn.classList.add("active");
    setStatus("listening");
    updateVoiceStatus("LISTENING");
    recognition.start();
  }

  function updateVoiceStatus(status) {
    const voiceLabel = document.querySelector(".voice-label");
    const pulseRing = document.querySelector(".pulse-ring");

    if (voiceLabel) voiceLabel.textContent = status;

    if (pulseRing) {
      if (status === "PROCESSING") {
        pulseRing.style.background = "#ffcc00";
      } else if (status === "SPEAKING") {
        pulseRing.style.background = "#ff3b3b";
      } else {
        pulseRing.style.background = "#00ff88";
      }
    }
  }

  // Mode button handlers
  voiceModeBtn.addEventListener("click", () => setMode("voice"));
  chatModeBtn.addEventListener("click", () => setMode("chat"));

  // === TERMINATE FUNCTIONALITY ===
  function terminateResponse() {
    // Stop streaming
    if (isStreaming) {
      isStreaming = false;
      socket.emit("chat:abort");
    }

    // Stop TTS
    synth.cancel();

    // Stop listening
    if (recognition && micActive) {
      recognition.stop();
      micActive = false;
    }

    // Clear thunder effects
    // if (thunderInterval) {
    //   clearInterval(thunderInterval);
    //   thunderInterval = null;
    // }

    setStatus("idle");
    updateVoiceStatus("LISTENING");

    // Resume listening in voice mode
    if (currentMode === "voice" && isVoiceAutoListening) {
      setTimeout(() => startVoiceListening(), 300);
    }

    console.log("[JARVIS] Response terminated");
  }

  voiceTerminate.addEventListener("click", terminateResponse);
  chatTerminate.addEventListener("click", terminateResponse);

  // === INTERRUPT FEATURE ===
  // Interrupt when user starts speaking during response
  if (recognition) {
    recognition.addEventListener("audiostart", () => {
      if (isStreaming || synth.speaking) {
        console.log("[JARVIS] Interrupt detected");
        terminateResponse();
      }
    });
  }

  // Update voice status based on JARVIS state
  socket.on("chat:stream:start", () => {
    updateVoiceStatus("PROCESSING");
  });

  // === CAMERA REALITY SYSTEM (Restored & Enhanced) ===
  const cameraOverlay = document.getElementById('cameraOverlay');
  const cameraVideo = document.getElementById('cameraVideo');
  const cameraCanvas = document.getElementById('cameraCanvas');
  const cameraCountdown = document.getElementById('cameraCountdown');
  const captureBtn = document.getElementById('captureBtn');
  const closeCameraBtn = document.getElementById('closeCameraBtn');

  let cameraStream = null;

  async function openCamera() {
    try {
      if (!cameraOverlay) return;
      cameraOverlay.classList.remove('hidden');

      // 1. Enumerate all devices to find the "Integrated" or "Webcam" specifically
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');

      console.log("[CAMERA] Available Devices:", videoDevices.map(d => d.label));

      // 2. Try to find the built-in laptop camera
      // Keywords: "integrated", "webcam", "facetime", "internal"
      const laptopCamera = videoDevices.find(device => {
        const label = device.label.toLowerCase();
        return label.includes("integrated") ||
          label.includes("webcam") ||
          label.includes("internal") ||
          label.includes("hp") ||
          label.includes("dell") ||
          label.includes("lenovo");
      });

      let constraints = {
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      if (laptopCamera) {
        console.log("[CAMERA] Selecting Laptop Camera:", laptopCamera.label);
        constraints = {
          video: {
            deviceId: { exact: laptopCamera.deviceId },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        };
      } else {
        console.log("[CAMERA] No specific laptop camera found, using default 'user' mode details.");
      }

      console.log("[CAMERA] Requesting access with constraints:", JSON.stringify(constraints));

      try {
        cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (e) {
        console.warn("[CAMERA] Specific device request failed, falling back to default 'user'...", e);
        // Fallback: Just ask for any user-facing camera
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      }

      if (cameraVideo) {
        cameraVideo.srcObject = cameraStream;
        // Ensure video plays
        cameraVideo.onloadedmetadata = () => cameraVideo.play();
      }

      speak("Visual sensors online.");
    } catch (err) {
      console.error("[CAMERA] Access error:", err);
      speak("Unable to access the primary camera. Please check your device settings.");
      if (cameraOverlay) cameraOverlay.classList.add('hidden');
    }
  }

  function closeCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      cameraStream = null;
    }
    if (cameraVideo) cameraVideo.srcObject = null;
    if (cameraOverlay) cameraOverlay.classList.add('hidden');
    if (cameraCountdown) cameraCountdown.classList.add('hidden');
  }

  async function takePicture() {
    if (!cameraStream) return;
    if (!cameraCountdown || !cameraCanvas || !cameraVideo) return;

    // Countdown
    cameraCountdown.classList.remove('hidden');
    const countSequence = ['3', '2', '1'];

    for (const count of countSequence) {
      cameraCountdown.textContent = count;
      speak(count);
      await new Promise(r => setTimeout(r, 1000));
    }

    cameraCountdown.classList.add('hidden');

    // Capture
    cameraCanvas.width = cameraVideo.videoWidth;
    cameraCanvas.height = cameraVideo.videoHeight;
    const ctx = cameraCanvas.getContext('2d');

    // Mirror effect for user experience
    ctx.translate(cameraVideo.videoWidth, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(cameraVideo, 0, 0, cameraVideo.videoWidth, cameraVideo.videoHeight);

    // Convert to Base64
    const imageData = cameraCanvas.toDataURL('image/jpeg', 0.9);

    // Close camera immediately after capture
    closeCamera();

    // Send to backend
    socket.emit("camera:capture", { imageData });

    speak("Image captured.");
  }

  // Handle manual buttons
  if (captureBtn) captureBtn.addEventListener('click', takePicture);
  if (closeCameraBtn) closeCameraBtn.addEventListener('click', closeCamera);

  if (hackerModeBtn) {
    hackerModeBtn.addEventListener('click', () => {
      openDashboard();
    });
  }

  // Expose to window for external calls if needed (though we use local functions here)
  window.openCamera = openCamera;
  window.closeCamera = closeCamera;


  socket.on("tts:speak", () => {
    updateVoiceStatus("SPEAKING");
  });

  socket.on("chat:stream:end", () => {
    if (currentMode === "voice") {
      setTimeout(() => {
        updateVoiceStatus("LISTENING");
        if (isVoiceAutoListening && !synth.speaking) {
          startVoiceListening();
        }
      }, 1000);
    }
  });


  // === CYBER SECURITY MODULE (DASHBOARD) ===
  const hackerDashboard = document.getElementById('hackerDashboard');
  const consoleOutput = document.getElementById('consoleOutput');
  const consoleInput = document.getElementById('consoleInput');
  const closeDashBtn = document.getElementById('closeDashBtn');
  const matrixBg = document.getElementById('matrixBg');
  const deviceList = document.getElementById('deviceList');
  let matrixInterval = null;

  socket.on('security:activate', (data) => {
    openDashboard(data.mode);
  });

  socket.on('security:output', (data) => {
    openDashboard();
    printToConsole(data.content, data.type);

    // Update specific panels if data type matches
    if (data.type === 'local_scan' || data.type === 'wifi_scan') {
      updateNetworkPanel(data.content);
    }
  });

  // --- THREAT MAP VISUALIZATION ---
  const threatCanvas = document.getElementById('threatMapCanvas');
  let threatCtx = null;
  let threatInterval = null;
  const threats = [];

  function initThreatMap() {
    if (!threatCanvas) return;
    threatCanvas.width = threatCanvas.parentElement.offsetWidth;
    threatCanvas.height = threatCanvas.parentElement.offsetHeight;
    threatCtx = threatCanvas.getContext('2d');

    // Generate random initial threats
    for (let i = 0; i < 5; i++) spawnThreat();
  }

  function spawnThreat() {
    if (!threatCanvas) return;
    threats.push({
      x: Math.random() * threatCanvas.width,
      y: Math.random() * threatCanvas.height,
      life: 100,
      color: Math.random() > 0.8 ? '#ff0000' : '#ffaa00'
    });
  }

  function drawThreatMap() {
    if (!threatCtx) return;
    // Fade out trail
    threatCtx.fillStyle = 'rgba(0, 20, 30, 0.1)';
    threatCtx.fillRect(0, 0, threatCanvas.width, threatCanvas.height);

    // Draw Grid
    threatCtx.strokeStyle = 'rgba(0, 239, 255, 0.05)';
    threatCtx.lineWidth = 1;

    // Update Threats
    for (let i = threats.length - 1; i >= 0; i--) {
      const t = threats[i];
      t.life--;

      // Draw target
      threatCtx.beginPath();
      threatCtx.strokeStyle = t.color;
      threatCtx.arc(t.x, t.y, 20 - (t.life / 5), 0, Math.PI * 2);
      threatCtx.stroke();

      // Draw connecting line
      if (i > 0) {
        const prev = threats[i - 1];
        threatCtx.beginPath();
        threatCtx.strokeStyle = `rgba(255, 50, 50, ${t.life / 100})`;
        threatCtx.moveTo(t.x, t.y);
        threatCtx.lineTo(prev.x, prev.y);
        threatCtx.stroke();
      }

      if (t.life <= 0) threats.splice(i, 1);
    }

    // Randomly spawn new
    if (Math.random() > 0.95) spawnThreat();

    // Text update
    const countEl = document.getElementById('threatCount');
    if (countEl) countEl.textContent = threats.length;
  }

  function startThreatSimulation() {
    initThreatMap();
    if (threatInterval) clearInterval(threatInterval);
    threatInterval = setInterval(drawThreatMap, 50);
  }

  function stopThreatSimulation() {
    if (threatInterval) clearInterval(threatInterval);
  }

  function openDashboard(mode = 'idle') {
    if (hackerDashboard) {
      hackerDashboard.classList.remove('hidden');
      startThreatSimulation(); // Start Map
      if (consoleInput) setTimeout(() => consoleInput.focus(), 100);

      // Handle Illegal Mode
      if (mode === 'illegal') {
        hackerDashboard.classList.add('illegal-mode');
        printToConsole("WARNING: ROOT ACCESS GRANTED. ILLEGAL MODE ACTIVE.", 'warning');
      } else {
        hackerDashboard.classList.remove('illegal-mode');
      }
    }
    if (mode !== 'idle') printToConsole(`System Access Granted. Mode: ${mode.toUpperCase()}`);

    startMatrixEffect();
  }

  function closeDashboard() {
    if (hackerDashboard) hackerDashboard.classList.add('hidden');
    stopMatrixEffect();
    stopThreatSimulation(); // Stop Map
  }

  if (closeDashBtn) {
    closeDashBtn.addEventListener('click', closeDashboard);
  }

  // CLI Input Handling
  if (consoleInput) {
    consoleInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = consoleInput.value.trim();
        if (cmd) {
          printToConsole(`root@jarvis:~# ${cmd}`);
          // Send as chat message
          socket.emit('chat:message', { message: cmd });
          consoleInput.value = '';
        }
      }
    });
  }

  // Toolbox Button Handling
  document.querySelectorAll('.hack-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.dataset.cmd;
      if (cmd) {
        // Intercept Root Access for immediate visual feedback
        if (btn.id === 'rootAccessBtn') {
          openDashboard('illegal');
          return;
        }

        printToConsole(`Executing: ${cmd}...`);
        socket.emit('chat:message', { message: cmd });
      }
    });
  });

  function printToConsole(text, type) {
    if (!consoleOutput) return;

    // Check for AI Analysis separator
    const parts = text.split('=== 🧠 SYSTEM ANALYSIS ===');
    const mainText = parts[0];
    const analysisText = parts[1];

    // Print main text normally
    if (mainText.trim()) {
      const lines = mainText.split('\n');
      lines.forEach(line => {
        const div = document.createElement('div');
        div.className = 'line';
        if (type === 'warning') div.style.color = '#ff0000';
        div.textContent = `> ${line}`;
        consoleOutput.insertBefore(div, consoleOutput.lastElementChild);
      });
    }

    // Print AI Analysis with special typing effect
    if (analysisText) {
      const div = document.createElement('div');
      div.className = 'line analysis-block';
      div.style.color = '#00ffff';
      div.style.marginTop = '10px';
      div.style.padding = '10px';
      div.style.border = '1px dashed #00ffff';
      div.innerHTML = `<strong>[AI INTELLIGENCE]</strong><br>`;
      consoleOutput.insertBefore(div, consoleOutput.lastElementChild);

      let i = 0;
      const typingSpeed = 10;
      const rawText = analysisText.trim();

      function typeWriter() {
        if (i < rawText.length) {
          div.innerHTML += rawText.charAt(i) === '\n' ? '<br>' : rawText.charAt(i);
          i++;
          consoleOutput.scrollTop = consoleOutput.scrollHeight;
          setTimeout(typeWriter, typingSpeed);
        }
      }
      typeWriter();
    }

    consoleOutput.scrollTop = consoleOutput.scrollHeight;
  }

  function updateNetworkPanel(content) {
    if (!deviceList) return;
    deviceList.innerHTML = '';
    const lines = content.split('\n');
    lines.forEach(line => {
      if (!line.trim()) return;
      const div = document.createElement('div');
      div.className = 'device-item';
      div.textContent = line;
      deviceList.appendChild(div);
    });
  }

  function startMatrixEffect() {
    if (matrixInterval) clearInterval(matrixInterval); // Restart to apply color change

    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    matrixBg.innerHTML = '';
    matrixBg.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const chars = "01010101ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const columns = canvas.width / 20;
    const drops = Array(Math.floor(columns)).fill(1);

    // Check for Illegal Mode
    const isIllegal = hackerDashboard && hackerDashboard.classList.contains('illegal-mode');
    const color = isIllegal ? "#FF0000" : "#0F0";

    matrixInterval = setInterval(() => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      ctx.font = "15px monospace";

      drops.forEach((y, i) => {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 20, y * 20);
        if (y * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    }, 50);
  }

  // --- DDoS SIMULATION (VISUAL ONLY) ---
  socket.on('security:activate', (data) => {
    if (data.mode === 'simulation_flood') {
      startFloodSimulation(data.target);
    } else {
      openDashboard(data.mode);
    }
  });

  function startFloodSimulation(target) {
    openDashboard('illegal'); // Force illegal mode visuals
    printToConsole(`[SIMULATION] TARGET: ${target}`, 'warning');
    printToConsole(`[SIMULATION] LAUNCHING ORBITAL ION CANNON (LOIC) PROTOCOL...`, 'warning');

    let packets = 0;
    const protocols = ['UDP', 'TCP-SYN', 'HTTP-GET', 'ICMP'];

    const floodInterval = setInterval(() => {
      packets += Math.floor(Math.random() * 500) + 100;
      const proto = protocols[Math.floor(Math.random() * protocols.length)];
      const size = Math.floor(Math.random() * 1500) + 64;
      const src = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

      const log = `[${proto}] ${src} -> ${target} | Len:${size} | Seq=${packets}`;

      // Direct DOM manipulation for speed
      const div = document.createElement('div');
      div.className = 'line';
      div.style.color = '#ff0000';
      div.style.fontSize = '12px';
      div.textContent = log;
      consoleOutput.appendChild(div);
      consoleOutput.scrollTop = consoleOutput.scrollHeight;

      // Random "Server Status" updates
      if (packets % 2000 > 1800) {
        const statusDiv = document.createElement('div');
        statusDiv.className = 'line';
        statusDiv.style.background = '#ff0000';
        statusDiv.style.color = '#000';
        statusDiv.style.fontWeight = 'bold';
        statusDiv.textContent = `>>> TARGET SERVER LOAD: ${Math.floor(Math.random() * 20) + 80}% [CRITICAL]`;
        consoleOutput.appendChild(statusDiv);
      }

    }, 50); // Fast scroll

    // Stop after 10 seconds
    setTimeout(() => {
      clearInterval(floodInterval);
      printToConsole(`[SIMULATION] ATTACK STOPPED. PACKETS SENT: ${packets}`, 'warning');
      printToConsole(`[SIMULATION] TARGET STATUS: 503 SERVICE UNAVAILABLE (SIMULATED)`, 'warning');
    }, 10000);
  }

  function stopMatrixEffect() {
    if (matrixInterval) clearInterval(matrixInterval);
    matrixInterval = null;
    if (matrixBg) matrixBg.innerHTML = '';
  }

  /* --- REPAIR MODE LOGIC (POPUP) --- */
  const repairModeBtn = document.getElementById('repairModeBtn');

  if (repairModeBtn) {
    repairModeBtn.addEventListener('click', () => {
      sfx.playClick();
      // Open in a new dedicated window
      window.open('repair.html', 'JarvisRepair', 'width=1000,height=800,menubar=no,toolbar=no,location=no,status=no,resizable=yes');
    });
  }

});
