from pydantic import BaseModel
class ChatRequestModel(BaseModel):
    prompt: str
    session_id: int