import React, { useCallback } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type NodeMouseHandler,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Button, Space, Tooltip } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { useFlowStore } from '../../store/flowStore'

const FlowCanvas: React.FC = () => {
  const {
    nodes,
    edges,
    selectedNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNode,
    addNode,
    deleteNode,
  } = useFlowStore()

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_evt, node) => setSelectedNode(node),
    [setSelectedNode],
  )

  const handlePaneClick = useCallback(
    () => setSelectedNode(null),
    [setSelectedNode],
  )

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* 工具栏 */}
      <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10 }}>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => addNode()}
          >
            添加节点
          </Button>
          {selectedNode && (
            <Tooltip title="删除选中节点">
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => deleteNode(selectedNode.id)}
              >
                删除节点
              </Button>
            </Tooltip>
          )}
        </Space>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        deleteKeyCode="Delete"
        fitView
      >
        <Background gap={16} />
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
      </ReactFlow>
    </div>
  )
}

export default FlowCanvas

