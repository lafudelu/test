from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.flow import FlowCreate, FlowUpdate, FlowResponse, FlowVersionResponse
from app.services import flow_service

router = APIRouter()


@router.get("/flows", response_model=List[FlowResponse])
def list_flows(db: Session = Depends(get_db)):
    return flow_service.get_flows(db)


@router.post("/flows", response_model=FlowResponse, status_code=201)
def create_flow(flow: FlowCreate, db: Session = Depends(get_db)):
    return flow_service.create_flow(db, flow)


@router.get("/flow/{flow_id}", response_model=FlowResponse)
def get_flow(flow_id: int, db: Session = Depends(get_db)):
    flow = flow_service.get_flow(db, flow_id)
    if not flow:
        raise HTTPException(status_code=404, detail="Flow not found")
    return flow


@router.put("/flow/{flow_id}", response_model=FlowResponse)
def update_flow(flow_id: int, body: FlowUpdate, db: Session = Depends(get_db)):
    flow = flow_service.update_flow(db, flow_id, body)
    if not flow:
        raise HTTPException(status_code=404, detail="Flow not found")
    return flow


@router.get("/flow/{flow_id}/history", response_model=List[FlowVersionResponse])
def get_history(flow_id: int, db: Session = Depends(get_db)):
    return flow_service.get_flow_history(db, flow_id)


@router.post("/flow/{flow_id}/restore/{version_id}", response_model=FlowResponse)
def restore_version(flow_id: int, version_id: int, db: Session = Depends(get_db)):
    flow = flow_service.restore_flow_version(db, flow_id, version_id)
    if not flow:
        raise HTTPException(status_code=404, detail="Flow or version not found")
    return flow

