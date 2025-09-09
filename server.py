# server.py
from fastapi import FastAPI, UploadFile
from pydantic import BaseModel
import torch, torchvision.transforms as T
from PIL import Image
import io, numpy as np
from transformers import AutoImageProcessor, AutoModel

device = "cuda" if torch.cuda.is_available() else "cpu"
processor = AutoImageProcessor.from_pretrained("facebook/dinov2-small")
model = AutoModel.from_pretrained("facebook/dinov2-small").to(device).eval()

app = FastAPI()

@app.post("/dinov2")
async def dinov2(file: UploadFile):
    img = Image.open(io.BytesIO(await file.read())).convert("RGB")
    inputs = processor(images=img, return_tensors="pt").to(device)
    with torch.no_grad():
        feat = model(**inputs).last_hidden_state[:, 0].cpu().numpy().squeeze()
    return {"feat": feat.tolist()}   # 768 维
