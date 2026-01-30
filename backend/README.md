

### 1. Installation

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install chromium firefox webkit
```

### 2. Configure Ollama

```bash
# Start Ollama (in a separate terminal)
ollama serve

# Pull a model (7B recommended for local use)
ollama pull mistral:7b
# or
ollama pull llama3:8b
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your settings
```

### 4. Run the Server

```bash
# Development mode with hot reload
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# Production mode
python -m app.main
```


