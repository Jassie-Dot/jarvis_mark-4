import { Intent } from './intent.js';
import { Context } from './context.js';

const plugin = {
    name: 'YourCapabilities',
    version: '1.0.0',
    description: 'This is a capabilities plugin for JARVIS.',
    async initialize() {
        console.log('Init');
    },
    canHandle(intent, userInput) {
        if (intent === Intent.YOUR_INTENT && userInput === 'your_input') {
            return true;
        }
        return false;
    },
    async handle(intent, userInput, context) {
        const capabilities = ['YourCapability1', 'YourCapability2'];
        if (capabilities.includes(intent)) {
            return { success: true, message: `You have ${intent} capability.` };
        } else {
            return { success: false, message: `You do not have ${intent} capability.` };
        }
    },
};

export default plugin;