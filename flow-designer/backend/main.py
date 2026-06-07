from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine, SessionLocal
from app.models.flow import Base
from app.api.flow import router as flow_router
from app.services.flow_service import get_flows, create_flow
from app.schemas.flow import FlowCreate

Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """首次启动时初始化示例流程"""
    db = SessionLocal()
    try:
        if not get_flows(db):
            create_flow(
                db,
                FlowCreate(
                    name="示例审批流程",
                    flow_json={
                        "nodes": [
                            {"id": "start",    "label": "开始",     "position": {"x": 250, "y": 50}},
                            {"id": "apply",    "label": "提交申请", "position": {"x": 250, "y": 160}},
                            {"id": "approval", "label": "审批",     "position": {"x": 250, "y": 270}},
                            {"id": "end",      "label": "结束",     "position": {"x": 250, "y": 380}},
                        ],
                        "edges": [
                            {"id": "e1", "source": "start",    "target": "apply"},
                            {"id": "e2", "source": "apply",    "target": "approval"},
                            {"id": "e3", "source": "approval", "target": "end"},
                        ],
                    },
                ),
            )
    finally:
        db.close()
    yield


app = FastAPI(title="Flow Designer API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(flow_router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Flow Designer API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


