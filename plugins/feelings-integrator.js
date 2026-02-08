import fetch from 'node-fetch';

const plugin = {
    name: 'feelings-integrator',
    version: '1.0.0',
    initialize() { 
        console.log('[PLUGIN] feelings-integrator loaded'); 
    },
    canHandle(intent, text) { 
        return /^integrate|emotions|sentiments$/i.test(text); 
    },
    async handle(intent, text, context) {
        try {
            if (!text || text.trim().length === 0) {
                return { 
                    success: false, 
                    message: "No text provided for sentiment analysis." 
                };
            }

            const feelingsData = {
                text: text,
                timestamp: new Date().toISOString(),
                mood: context?.mood || 'neutral',
                intensity: context?.intensity || 1
            };

            const sentimentResult = await this.analyzeSentiment(text);
            
            const integratedData = {
                ...feelingsData,
                sentimentScore: sentimentResult.score,
                sentimentComparison: sentimentResult.comparative,
                positiveWords: sentimentResult.positive,
                negativeWords: sentimentResult.negative
            };

            return { 
                success: true, 
                message: "Feelings integration completed successfully.",
                data: integratedData
            };
            
        } catch (error) {
            return { 
                success: false, 
                message: `Error processing feelings: ${error.message}` 
            };
        }
    },
    
    async analyzeSentiment(text) {
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        
        const positiveWords = ['happy', 'good', 'great', 'excellent', 'awesome', 'love', 'like', 'joy', 'pleased'];
        const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'hate', 'dislike', 'angry', 'upset'];
        
        let positiveCount = 0;
        let negativeCount = 0;
        
        words.forEach(word => {
            if (positiveWords.includes(word)) positiveCount++;
            if (negativeWords.includes(word)) negativeCount++;
        });
        
        const score = positiveCount - negativeCount;
        const comparative = words.length > 0 ? score / words.length : 0;
        
        return {
            score: score,
            comparative: comparative,
            positive: positiveCount,
            negative: negativeCount,
            words: words.length
        };
    }
};

export default plugin;