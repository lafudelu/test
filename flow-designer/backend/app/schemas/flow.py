from pydantic import BaseModel
from typing import Any, Dict, Optional
from datetime import datetime


class FlowCreate(BaseModel):
    name: str
    flow_json: Dict[str, Any]


class FlowUpdate(BaseModel):
    name: Optional[str] = None
    flow_json: Dict[str, Any]


class FlowResponse(BaseModel):
    id: int
    name: str
    flow_json: Dict[str, Any]
    create_time: datetime
    update_time: datetime

    model_config = {"from_attributes": True}


class FlowVersionResponse(BaseModel):
    id: int
    flow_id: int
    version: int
    flow_json: Dict[str, Any]
    create_time: datetime

    model_config = {"from_attributes": True}

