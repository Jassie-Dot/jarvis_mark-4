Create .env file in main folder : 
# JARVIS MARK IV Configuration

# Server Configuration
PORT=3000

# ====================================
# AI PROVIDER SETTINGS
# ====================================

# Ollama Configuration (Local AI - Primary)
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3.2

# Groq Cloud Configuration (Cloud AI - Fallback)
# Get your free API key at: https://console.groq.com/keys
GROQ_API_KEY= your api free key

# ====================================
# NOTES
# ====================================
# - Ollama is the primary AI provider (runs locally)
# - Groq is the fallback when Ollama is unavailable
# - If neither is available, JARVIS uses offline mode
# - Run 'ollama list' to see your installed models
copy exactly 
