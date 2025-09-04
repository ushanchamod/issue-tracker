from typing import TypedDict, Sequence, Annotated, Optional
from langchain_core.messages import BaseMessage, SystemMessage, ToolMessage
from langchain_core.tools import tool, StructuredTool
from langchain_openai import ChatOpenAI
from langgraph.graph.message import add_messages
from langgraph.graph import StateGraph, START, END
from langchain_community.tools import DuckDuckGoSearchRun
import requests
import json

from pydantic import BaseModel


# ---- State ----
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    user_id: Optional[str]  # Store the provided user_id
    auth_token: Optional[str]  # Store the auth token for the user

# ---- LLM ----
llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)

# ---- Tools ----
search_tool = DuckDuckGoSearchRun(
    name="search",
    description="Useful for when you need to answer questions about current events or find specific information on the web.",
)

@tool
def addition(a: int, b: int) -> int:
    """Adds two integers and returns the result."""
    print('Use addition tool')
    return a + b

# Real function for fetching issues (takes only state, no LLM args)
def fetch_issue_by_user_id_func(state: AgentState) -> dict:
    """
    Fetch issues for the given user from the API.

    Returns:
        dict with:
        - "response": a human-readable message
        - "issues": a list of issue objects
    """
    user_id = state.get("user_id")
    auth_token = state.get("auth_token")

    if not user_id or not auth_token:
        return {"error": "To fetch issues, user should be logged in."}

    try:
        url = "http://localhost:8080/api/user/my-issues"
        response = requests.get(
            url,
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": f"Bearer {auth_token}"
            },
            timeout=5
        )

        if response.status_code == 200:
            result = response.json()

            issues = [
                {
                    "id": item["issueId"],
                    "title": item["title"],
                    "description": item["description"],
                    "severity": item["severity"],
                    "priority": item["priority"],
                    "status": item["status"],
                    "createdAt": item["createdAt"],
                    "updatedAt": item.get("updatedAt")
                }
                for item in result.get("data", [])
            ]

            return {
                "response": f"Retrieved {len(issues)} issue(s) successfully.",
                "issues": issues
            }

        else:
            return {
                "error": {
                    "code": response.status_code,
                    "message": response.text
                }
            }

    except requests.exceptions.Timeout:
        return {"error": {"code": "TIMEOUT", "message": "Request timeout."}}
    except requests.exceptions.ConnectionError:
        return {"error": {"code": "CONNECTION", "message": "Connection error."}}
    except Exception as e:
        return {"error": {"code": "UNKNOWN", "message": str(e)}}

# Empty input schema for the tool (no args required from LLM)
class EmptyInput(BaseModel):
    pass

# Fake tool for LLM binding (schema only, dummy func)
fake_fetch_tool = StructuredTool.from_function(
    func=lambda **kwargs: None,  # Dummy - not used for execution
    name="fetch_issue_by_user_id",
    description="Fetches issues for the current user. No input required.",
    args_schema=EmptyInput
)

tools = [addition, search_tool]
tools_for_binding = tools + [fake_fetch_tool]

llm_with_tools = llm.bind_tools(tools_for_binding)

# ---- Agent Node ----
def llm_call(state: AgentState) -> AgentState:
    """Invokes the LLM with a system prompt and the current state messages."""
    print('Inside llm_call')
    system_prompt = SystemMessage(content=f"""
            You are a helpful AI assistant. Answer clearly and concisely, using tools only when needed. Never access user_id or auth_token; they are system-managed.
            Rules:
            - Use 'fetch_issue_by_user_id' for user issues, but return an error if a different user_id is requested (current: {state.get('user_id')}).
            - Use the search tool for general info queries.
            - Use the addition tool for calculations.
            - If you use a tool, wait for the result before responding.
            - If no tools are needed, respond directly.
            - Always provide a final answer to the user.
            - If you encounter an error from a tool, acknowledge it and try another approach.
            - you need politely inform the user to login if user_id or auth_token is missing for fetching issues.
            - For unsupported requests, respond: "I cannot assist with that."
        """)
    response = llm_with_tools.invoke([system_prompt] + state["messages"])
    return {"messages": [response]}

def decision_node(state: AgentState) -> str:
    """Determines whether to continue to the tools node or end the workflow."""
    print('Inside decision_node')
    last_message = state["messages"][-1]
    if isinstance(last_message, ToolMessage) and "error" in json.loads(last_message.content).get("error", ""):
        return "end"
    return "continue" if getattr(last_message, "tool_calls", None) else "end"

# ---- Custom Tools Node ----
def tools_node(state: AgentState) -> dict:
    print("Inside tools_node")
    last_message = state["messages"][-1]
    tool_calls = getattr(last_message, "tool_calls", [])
    tool_messages = []

    if not tool_calls:
        return {"messages": [ToolMessage(
            content="No tool calls found in the last message.",
            tool_call_id="no_tool_call",
            name="error"
        )]}

    for tool_call in tool_calls:
        tool_name = tool_call["name"]
        tool_args = tool_call.get("args", {})
        tool_call_id = tool_call["id"]

        if tool_name == "fetch_issue_by_user_id":
            print('calling fetch_issue_by_user_id with state')
            result = fetch_issue_by_user_id_func(state)
        else:
            tool = next((t for t in tools if t.name == tool_name), None)
            if tool is None:
                result = {"error": f"Tool '{tool_name}' not found"}
            else:
                result = tool.invoke(tool_args)

        try:
            content = json.dumps(result) if isinstance(result, dict) else str(result)
        except TypeError:
            content = str(result)  # Fallback for non-serializable objects
        tool_msg = ToolMessage(
            content=content,
            tool_call_id=tool_call_id,
            name=tool_name
        )
        tool_messages.append(tool_msg)

    return {"messages": tool_messages}

# ---- Workflow ----
workflow = StateGraph(AgentState)
workflow.add_node("agent", llm_call)
workflow.add_node("tools", tools_node)

workflow.add_edge(START, "agent")
workflow.add_conditional_edges("agent", decision_node, {"continue": "tools", "end": END})
workflow.add_edge("tools", "agent")

app_graph = workflow.compile()

# ---- Public function for FastAPI ----
def run_agent(user_message: str, user_id: str, auth_token: str) -> str:
    inputs = {
        "messages": [("user", user_message)],
        "user_id": user_id,
        "auth_token": auth_token
    }
    result = app_graph.invoke(inputs)
    return result["messages"][-1].content