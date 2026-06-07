from sqlalchemy import Column, Integer, String, JSON, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.database import Base


class Flow(Base):
    __tablename__ = "flows"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    flow_json = Column(JSON, nullable=False)
    create_time = Column(DateTime(timezone=True), server_default=func.now())
    update_time = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class FlowVersion(Base):
    __tablename__ = "flow_versions"

    id = Column(Integer, primary_key=True, index=True)
    flow_id = Column(Integer, ForeignKey("flows.id"), nullable=False, index=True)
    version = Column(Integer, nullable=False)
    flow_json = Column(JSON, nullable=False)
    create_time = Column(DateTime(timezone=True), server_default=func.now())

