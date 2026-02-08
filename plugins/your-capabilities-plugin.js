import { Intent } from './intent.js';
import { UserInput } from './user-input.js';

const plugin = {
    name: 'YourCapabilities',
    version: '1.0.0',
    description: 'This is a plugin to handle your capabilities.',
    async initialize() {
        console.log('Init');
    },
    canHandle(intent, userInput) {
        const intentName = Intent.getIntentName(intent);
        return intentName === 'your-intent-name';
    },
    async handle(intent, userInput, context) {
        if (this.canHandle(intent, userInput)) {
            // Your logic to handle the input
            console.log('Handling your capabilities');
            return { success: true, message: 'Your capabilities handled successfully' };
        } else {
            return { success: false, message: 'Not handling your capabilities' };
        }
    },
};

export default plugin;