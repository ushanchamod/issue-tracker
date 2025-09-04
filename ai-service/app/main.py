from typing import Optional

from fastapi import FastAPI, Request
import time
from pydantic import BaseModel
from app.agent import run_agent
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="LangGraph AI Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8001"],  # Replace with actual Node.js backend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()

    # Before processing request
    print(f"Incoming request: {request.method} {request.url}")

    # Call the actual endpoint
    response = await call_next(request)

    # After response
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)

    print(f"Completed in {process_time:.4f} seconds")
    return response

class Query(BaseModel):
    message: str
    user_id: Optional[str]  # Store the provided user_id
    auth_token: Optional[str]  # Store the auth token for the user

@app.post("/chat")
def chat(query: Query):
    print(f"""USHAN {query}""")
    response = run_agent(query.message, query.user_id, query.auth_token)
    return {"response": response}

@app.get("/")
def root():
    return {"message": "AI Agent is running 🚀"}

# uvicorn app.main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8001)