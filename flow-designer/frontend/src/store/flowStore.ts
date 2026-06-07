import { create } from 'zustand'
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from 'reactflow'
import type { Flow, FlowVersion, FlowDefinition } from '../types/flow'
import { flowApi } from '../api/flowApi'

// ---------- helpers ----------

/** 后端节点 → ReactFlow Node */
const toRFNodes = (nodes: FlowDefinition['nodes']): Node[] =>
  nodes.map((n) => ({
    id: n.id,
    type: n.type ?? 'default',
    position: n.position ?? { x: 100, y: 100 },
    data: { label: n.label },
  }))

/** 后端边 → ReactFlow Edge */
const toRFEdges = (edges: FlowDefinition['edges']): Edge[] =>
  edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
  }))

/** ReactFlow 状态 → 后端 FlowDefinition */
const toFlowDef = (nodes: Node[], edges: Edge[]): FlowDefinition => ({
  nodes: nodes.map((n) => ({
    id: n.id,
    label: n.data.label as string,
    position: n.position,
    type: n.type,
  })),
  edges: edges.map((e) => ({
    id: e.id!,
    source: e.source,
    target: e.target,
  })),
})

// ---------- store ----------

interface FlowStore {
  /* 数据 */
  currentFlow: Flow | null
  nodes: Node[]
  edges: Edge[]
  selectedNode: Node | null
  history: FlowVersion[]
  loading: boolean
  saveSuccess: boolean

  /* 流程数据操作 */
  loadFlow: (id: number) => Promise<void>
  saveFlow: () => Promise<void>

  /* ReactFlow 回调 */
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void

  /* 节点编辑 */
  setSelectedNode: (node: Node | null) => void
  updateNodeLabel: (id: string, label: string) => void
  addNode: (label?: string) => void
  deleteNode: (id: string) => void

  /* 历史版本 */
  loadHistory: (flowId: number) => Promise<void>
  restoreVersion: (versionId: number) => Promise<void>
}

export const useFlowStore = create<FlowStore>((set, get) => ({
  currentFlow: null,
  nodes: [],
  edges: [],
  selectedNode: null,
  history: [],
  loading: false,
  saveSuccess: false,

  // ---- 加载流程 ----
  loadFlow: async (id) => {
    set({ loading: true })
    try {
      const { data: flow } = await flowApi.getFlow(id)
      set({
        currentFlow: flow,
        nodes: toRFNodes(flow.flow_json.nodes),
        edges: toRFEdges(flow.flow_json.edges),
        loading: false,
      })
    } catch {
      set({ loading: false })
    }
  },

  // ---- 保存流程 ----
  saveFlow: async () => {
    const { currentFlow, nodes, edges } = get()
    if (!currentFlow) return
    set({ loading: true, saveSuccess: false })
    try {
      const { data: flow } = await flowApi.updateFlow(
        currentFlow.id,
        toFlowDef(nodes, edges),
        currentFlow.name,
      )
      set({ currentFlow: flow, loading: false, saveSuccess: true })
      setTimeout(() => set({ saveSuccess: false }), 2000)
    } catch {
      set({ loading: false })
    }
  },

  // ---- ReactFlow 内置回调 ----
  onNodesChange: (changes) =>
    set((s) => ({ nodes: applyNodeChanges(changes, s.nodes) })),

  onEdgesChange: (changes) =>
    set((s) => ({ edges: applyEdgeChanges(changes, s.edges) })),

  onConnect: (connection) =>
    set((s) => ({
      edges: addEdge({ ...connection, id: `e-${Date.now()}` }, s.edges),
    })),

  // ---- 节点编辑 ----
  setSelectedNode: (node) => set({ selectedNode: node }),

  updateNodeLabel: (id, label) =>
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, label } } : n,
      ),
      selectedNode:
        s.selectedNode?.id === id
          ? { ...s.selectedNode, data: { ...s.selectedNode.data, label } }
          : s.selectedNode,
    })),

  addNode: (label) => {
    const id = `node_${Date.now()}`
    const newNode: Node = {
      id,
      type: 'default',
      position: { x: 100 + Math.random() * 300, y: 100 + Math.random() * 200 },
      data: { label: label ?? `节点 ${get().nodes.length + 1}` },
    }
    set((s) => ({ nodes: [...s.nodes, newNode] }))
  },

  deleteNode: (id) =>
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== id),
      edges: s.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNode: s.selectedNode?.id === id ? null : s.selectedNode,
    })),

  // ---- 历史版本 ----
  loadHistory: async (flowId) => {
    try {
      const { data } = await flowApi.getHistory(flowId)
      set({ history: data })
    } catch {
      /* ignore */
    }
  },

  restoreVersion: async (versionId) => {
    const { currentFlow } = get()
    if (!currentFlow) return
    set({ loading: true })
    try {
      const { data: flow } = await flowApi.restoreVersion(currentFlow.id, versionId)
      set({
        currentFlow: flow,
        nodes: toRFNodes(flow.flow_json.nodes),
        edges: toRFEdges(flow.flow_json.edges),
        loading: false,
      })
    } catch {
      set({ loading: false })
    }
  },
}))

