from fastapi import FastAPI
from pydantic import BaseModel
from gemini_client import ask
from hazard import calculateHazard
from fastapi.middleware.cors import CORSMiddleware


class aiChatRequest(BaseModel):
    message: str


class hzIndexRequest(BaseModel):
    lat: str
    lon: str


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/aichat/")
async def create_item(aiChatRequest: aiChatRequest):
    print(aiChatRequest.message)
    res = ask(aiChatRequest)
    print(res)
    return {"response": res}


@app.post("/aichat/")
async def create_item(req: hzIndexRequest):
    hz = calculateHazard(req.lat, req.lon)["hazard_index"]
    print(hz)
    return {"hz": hz}
