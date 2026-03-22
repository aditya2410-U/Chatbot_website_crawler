from pydantic import BaseModel

class ChatRequestModel(BaseModel):
    prompt: str
    session_id: str  # MongoDB ObjectId string