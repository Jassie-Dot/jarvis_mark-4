/**
 * Location Plugin for JARVIS
 * Provides geolocation and location-based services
 */

import fetch from 'node-fetch';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const plugin = {
    name: 'Location',
    version: '1.0.0',
    description: 'Geolocation and location-based services',
    cachedLocation: null,
    cacheTime: null,

    async initialize() {
        console.log('[LOCATION] Plugin initialized');
        // Pre-cache location on startup
        await this.getCurrentLocation();
    },

    async cleanup() {
        console.log('[LOCATION] Plugin cleanup');
    },

    canHandle(intent, userInput) {
        return intent === 'location.get' ||
            /where am i|my location|current location|find me|geolocation/i.test(userInput);
    },

    async handle(intent, userInput, context) {
        try {
            // Check if asking for specific place
            if (/find|search|nearest|nearby/i.test(userInput)) {
                return await this.searchNearby(userInput);
            }

            // Get current location
            const location = await this.getCurrentLocation();

            const message = `Current Location, Sir:

📍 ${location.city}, ${location.region}
🌍 ${location.country} (${location.countryCode})
🗺️ Coordinates: ${location.lat}, ${location.lon}
🕐 Timezone: ${location.timezone}
🌐 ISP: ${location.isp}

${this.getLocationInsight(location)}`;

            return {
                success: true,
                message: message,
                data: location
            };
        } catch (error) {
            console.error('[LOCATION] Error:', error.message);
            return {
                success: false,
                message: "Unable to determine location, Sir. Geolocation services may be unavailable."
            };
        }
    },

    /**
     * Get current location using IP geolocation
     */
    async getCurrentLocation() {
        // Return cached location if recent (< 5 minutes)
        if (this.cachedLocation && this.cacheTime && (Date.now() - this.cacheTime) < 300000) {
            return this.cachedLocation;
        }

        try {
            // Use ip-api.com for free IP geolocation
            const response = await fetch('http://ip-api.com/json/?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,query');

            if (!response.ok) {
                throw new Error('Geolocation API unavailable');
            }

            const data = await response.json();

            if (data.status === 'fail') {
                throw new Error(data.message || 'Geolocation failed');
            }

            const location = {
                ip: data.query,
                city: data.city,
                region: data.regionName,
                regionCode: data.region,
                country: data.country,
                countryCode: data.countryCode,
                zip: data.zip,
                lat: data.lat,
                lon: data.lon,
                timezone: data.timezone,
                isp: data.isp,
                org: data.org
            };

            // Cache the result
            this.cachedLocation = location;
            this.cacheTime = Date.now();

            return location;
        } catch (error) {
            console.error('[LOCATION] Geolocation error:', error.message);
            throw error;
        }
    },

    /**
     * Search for nearby places
     */
    async searchNearby(userInput) {
        const location = await this.getCurrentLocation();

        // Extract search query
        const searchPatterns = [
            /find (?:nearest |nearby )?(.+)/i,
            /search (?:for )?(.+)/i,
            /nearest (.+)/i,
            /nearby (.+)/i
        ];

        let query = '';
        for (const pattern of searchPatterns) {
            const match = userInput.match(pattern);
            if (match) {
                query = match[1];
                break;
            }
        }

        if (!query) {
            query = 'places of interest';
        }

        const message = `Searching for "${query}" near ${location.city}, ${location.region}...

I can provide the coordinates (${location.lat}, ${location.lon}) for you to search on Google Maps or other mapping services, Sir.

Would you like me to open this in your browser?`;

        return {
            success: true,
            message: message,
            data: {
                query: query,
                location: location,
                searchUrl: `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${location.lat},${location.lon},13z`
            }
        };
    },

    /**
     * Get location-based insights
     */
    getLocationInsight(location) {
        const insights = [];

        // Time-based greeting
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
            insights.push("Good morning, Sir.");
        } else if (hour >= 12 && hour < 17) {
            insights.push("Good afternoon, Sir.");
        } else if (hour >= 17 && hour < 21) {
            insights.push("Good evening, Sir.");
        } else {
            insights.push("Working late, Sir?");
        }

        return insights.join(' ');
    }
};

export default plugin;
