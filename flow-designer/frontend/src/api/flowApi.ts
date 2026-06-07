import axios from 'axios'
import type { Flow, FlowDefinition, FlowVersion } from '../types/flow'

const http = axios.create({ baseURL: '/api' })

export const flowApi = {
  listFlows: () => http.get<Flow[]>('/flows'),
  getFlow: (id: number) => http.get<Flow>(`/flow/${id}`),
  createFlow: (name: string, flow_json: FlowDefinition) =>
    http.post<Flow>('/flows', { name, flow_json }),
  updateFlow: (id: number, flow_json: FlowDefinition, name?: string) =>
    http.put<Flow>(`/flow/${id}`, { flow_json, name }),
  getHistory: (id: number) => http.get<FlowVersion[]>(`/flow/${id}/history`),
  restoreVersion: (flowId: number, versionId: number) =>
    http.post<Flow>(`/flow/${flowId}/restore/${versionId}`),
}

