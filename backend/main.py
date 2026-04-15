from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AIML Learning Platform API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeExecutionRequest(BaseModel):
    code: str

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

@app.post("/api/execute")
async def execute_python_code(request: CodeExecutionRequest):
    # Simple sandbox simulation for now
    # In a real app, this would use a secure subprocess or container
    try:
        # Prevent dangerous imports
        forbidden = ["os", "sys", "subprocess", "shutil", "socket"]
        for word in forbidden:
            if word in request.code:
                return {"error": f"Import or use of '{word}' is not allowed for security reasons."}

        # Redirect stdout to capture print statements
        import sys
        from io import StringIO
        
        old_stdout = sys.stdout
        redirected_output = sys.stdout = StringIO()
        
        try:
            exec(request.code, {"__builtins__": __builtins__}, {})
        finally:
            sys.stdout = old_stdout
            
        return {"output": redirected_output.getvalue()}
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/simulate/sentiment")
async def analyze_sentiment(data: dict):
    from textblob import TextBlob
    text = data.get("text", "")
    blob = TextBlob(text)
    sentiment = blob.sentiment
    
    return {
        "polarity": sentiment.polarity,
        "subjectivity": sentiment.subjectivity,
        "classification": "Positive" if sentiment.polarity > 0 else "Negative" if sentiment.polarity < 0 else "Neutral"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
