from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.flow import Flow, FlowVersion
from app.schemas.flow import FlowCreate, FlowUpdate


def create_flow(db: Session, flow: FlowCreate) -> Flow:
    db_flow = Flow(name=flow.name, flow_json=flow.flow_json)
    db.add(db_flow)
    db.commit()
    db.refresh(db_flow)
    db.add(FlowVersion(flow_id=db_flow.id, version=1, flow_json=flow.flow_json))
    db.commit()
    return db_flow


def get_flow(db: Session, flow_id: int) -> Optional[Flow]:
    return db.query(Flow).filter(Flow.id == flow_id).first()


def get_flows(db: Session) -> List[Flow]:
    return db.query(Flow).all()


def update_flow(db: Session, flow_id: int, body: FlowUpdate) -> Optional[Flow]:
    db_flow = db.query(Flow).filter(Flow.id == flow_id).first()
    if not db_flow:
        return None
    if body.name is not None:
        db_flow.name = body.name
    db_flow.flow_json = body.flow_json
    db.commit()
    db.refresh(db_flow)

    latest = (
        db.query(FlowVersion)
        .filter(FlowVersion.flow_id == flow_id)
        .order_by(FlowVersion.version.desc())
        .first()
    )
    new_ver = (latest.version + 1) if latest else 1
    db.add(FlowVersion(flow_id=flow_id, version=new_ver, flow_json=body.flow_json))
    db.commit()
    return db_flow


def get_flow_history(db: Session, flow_id: int) -> List[FlowVersion]:
    return (
        db.query(FlowVersion)
        .filter(FlowVersion.flow_id == flow_id)
        .order_by(FlowVersion.version.desc())
        .all()
    )


def restore_flow_version(
    db: Session, flow_id: int, version_id: int
) -> Optional[Flow]:
    ver = (
        db.query(FlowVersion)
        .filter(FlowVersion.id == version_id, FlowVersion.flow_id == flow_id)
        .first()
    )
    if not ver:
        return None
    db_flow = db.query(Flow).filter(Flow.id == flow_id).first()
    if not db_flow:
        return None
    db_flow.flow_json = ver.flow_json
    db.commit()
    db.refresh(db_flow)

    latest = (
        db.query(FlowVersion)
        .filter(FlowVersion.flow_id == flow_id)
        .order_by(FlowVersion.version.desc())
        .first()
    )
    new_ver = (latest.version + 1) if latest else 1
    db.add(FlowVersion(flow_id=flow_id, version=new_ver, flow_json=ver.flow_json))
    db.commit()
    return db_flow

