// ---- 后端数据结构 ----
export interface FlowNodeDef {
  id: string
  label: string
  position: { x: number; y: number }
  type?: string
}

export interface FlowEdgeDef {
  id: string
  source: string
  target: string
}

export interface FlowDefinition {
  nodes: FlowNodeDef[]
  edges: FlowEdgeDef[]
}

export interface Flow {
  id: number
  name: string
  flow_json: FlowDefinition
  create_time: string
  update_time: string
}

export interface FlowVersion {
  id: number
  flow_id: number
  version: number
  flow_json: FlowDefinition
  create_time: string
}

