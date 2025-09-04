## AI Service (FastAPI)

### Overview
Small FastAPI service that exposes an AI agent endpoint powered by LangGraph and OpenAI. It can also call the Issue Tracker API to fetch a user's issues when the user is authenticated.

### Tech
- **Runtime**: Python 3.13+
- **Framework**: FastAPI + Uvicorn
- **LLM**: OpenAI (via `langchain_openai`)
- **Search Tool**: DuckDuckGo (optional)

### Project structure (high-level)
- `app/main.py`: FastAPI app and routes
- `app/agent.py`: LangGraph agent and tools
- `app/config.py`: Environment variable loading

### Prerequisites
- Python 3.13 installed
- An OpenAI API key

### Setup
1) Create and activate a virtual environment (recommended):
```bash
python -m venv .venv
./.venv/Scripts/activate  # Windows PowerShell
# Or: source .venv/bin/activate (macOS/Linux)
```

2) Install dependencies:
```bash
pip install -r requirements.txt
```

3) Create a `.env` file in `ai-service/` with:
```bash
OPENAI_API_KEY=sk-...
```

### Run
Development (reload):
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

The service will be available at `http://localhost:8001`.

### CORS
By default, CORS is limited to a specific origin in `app/main.py`. Update `allow_origins` to include your frontend or backend origins as needed.

### API
- `GET /` — Health check
  - 200: `{ "message": "AI Agent is running 🚀" }`

- `POST /chat` — Query the agent
  - Request body:
    ```json
    {
      "message": "string",
      "user_id": "string (optional)",
      "auth_token": "JWT or token (optional)"
    }
    ```
  - Behavior:
    - General Q&A uses tools like web search when helpful.
    - If `user_id` and `auth_token` are provided, the agent can fetch issues from the Issue Tracker API (`/api/user/my-issues`).
    - If auth is missing for issue-fetching, the agent will ask the user to log in.

### Examples
Health check:
```bash
curl http://localhost:8001/
```

Chat (unauthenticated):
```bash
curl -X POST http://localhost:8001/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What can you do?"}'
```

Chat (with auth for issue fetching):
```bash
curl -X POST http://localhost:8001/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Show my issues",
    "user_id": "<your-user-id>",
    "auth_token": "<your-jwt-token>"
  }'
```

### Notes
- The agent uses `gpt-3.5-turbo` by default. You can change the model in `app/agent.py`.
- The Issue Tracker API base URL for fetching issues is `http://localhost:8080` (adjust in `app/agent.py` if needed).

