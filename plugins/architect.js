/**
 * ARCHITECT - Autonomous Plugin Generator
 * "I build the things that build the things."
 */

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const plugin = {
    name: 'Architect',
    version: '1.0.0',
    description: 'Autonomous capability generator and system evolver.',

    // The Architect needs access to the system internals
    context: null,

    initialize() {
        console.log('[ARCHITECT] Online and ready to evolve.');
    },

    canHandle(intent, userInput) {
        return intent === 'system.evolve' ||
            /(create|add|learn|write|integrate) (a )?(plugin|feature|skill|functionality)/i.test(userInput);
    },

    async handle(intent, userInput, context) {
        this.context = context;
        const { systemTools, aiProviders, notify, updateStatus, pluginLoader } = context;

        notify("Initiating genesis sequence... Analyzing requirements.");
        updateStatus("Analyzing integration request...");

        // 1. RESEARCH & PLAN
        // Extract the core requirement
        const requirement = userInput.replace(/(create|add|learn|write|integrate) (a )?(plugin|feature|skill|functionality)?/i, '').trim();

        // 2. GENERATE CODE
        updateStatus(`Architecting solution for: ${requirement}`);

        try {
            // We use the CODING model (DeepSeek) if available, else standard
            const model = aiProviders.ollama.codingModel || aiProviders.ollama.model;
            const endpoint = aiProviders.ollama.endpoint;

            const prompt = `
            You are The Architect, an advanced AI system capable of expanding your own codebase.
            
            TASK: Create a JARVIS plugin (JavaScript ESModule) that fulfills this requirement: "${requirement}"
            
            CONTEXT:
            - Target Interface: 
              export default {
                  name: "PluginName",
                  description: "...",
                  initialize() {},
                  canHandle(intent, userInput) { return ... },
                  async handle(intent, userInput, context) { return { success: true, message: "..." }; }
              }
            - Context 'context' has: systemTools, aiProviders, etc.
            - Use 'systemTools' for file/system ops. 
            - NO placeholder code. Write FULL functioning code.
            - If external libs are absolutely needed, prefer standard node modules or assume they are installed.
            
            OUTPUT FORMAT:
            ONLY return the JavaScript code. No markdown. No conversation.
            `;

            const response = await fetch(`${endpoint}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: model,
                    prompt: prompt,
                    stream: false,
                    options: { temperature: 0.2 } // Low temp for precise code
                })
            });

            const data = await response.json();
            let code = data.response.trim();

            // Cleanup markdown if present
            code = code.replace(/```javascript/g, '').replace(/```/g, '').trim();

            // 3. VALIDATE & REFINE
            // Extract plugin name to save file
            const nameMatch = code.match(/name:\s*['"]([^'"]+)['"]/);
            let pluginName = nameMatch ? nameMatch[1] : 'generated_feature_' + Date.now();

            // Sanitize filename
            pluginName = pluginName.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();

            updateStatus(`Compiling ${pluginName}...`);

            // Validate syntax (basic)
            const validation = pluginLoader.validatePlugin ? pluginLoader.validatePlugin(code) : { valid: true };
            if (!validation.valid) {
                throw new Error(`Generated code invalid: ${validation.error}`);
            }

            // 4. DEPLOY
            const pluginsDir = path.join(process.cwd(), 'plugins');
            const filePath = path.join(pluginsDir, `${pluginName}.js`);

            await systemTools.executeTool('write_file', {
                path: filePath,
                content: code
            });

            notify(`Module written to ${pluginName}.js. Initializing integration...`);

            // 5. LOAD
            const success = await pluginLoader.loadPlugin(pluginName);

            if (success) {
                return {
                    success: true,
                    message: `feature "${pluginName}" has been successfully active. I can now ${requirement}.`
                };
            } else {
                return {
                    success: false,
                    message: `Module "${pluginName}" failed to load. Check logs for syntax errors.`
                };
            }

        } catch (error) {
            console.error('[ARCHITECT] Evolution failed:', error);
            return {
                success: false,
                message: `Evolution protocol failed: ${error.message}`
            };
        }
    }
};

export default plugin;
