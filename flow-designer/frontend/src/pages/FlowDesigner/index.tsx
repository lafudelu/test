import React, { useEffect, useState } from 'react'
import {
  Layout,
  Button,
  Typography,
  Space,
  App as AntApp,
  Spin,
  Divider,
} from 'antd'
import {
  SaveOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import FlowCanvas from '../../components/FlowCanvas'
import NodeEditor from '../../components/NodeEditor'
import HistoryPanel from '../../components/HistoryPanel'
import { useFlowStore } from '../../store/flowStore'
import { flowApi } from '../../api/flowApi'

const { Header, Content, Sider } = Layout

const FlowDesigner: React.FC = () => {
  const { message } = AntApp.useApp()
  const { loadFlow, saveFlow, currentFlow, loading, saveSuccess } =
    useFlowStore()
  const [showHistory, setShowHistory] = useState(false)

  // 启动时加载第一条流程
  useEffect(() => {
    ;(async () => {
      try {
        const { data: flows } = await flowApi.listFlows()
        if (flows.length > 0) {
          await loadFlow(flows[0].id)
        }
      } catch {
        message.error('加载流程失败，请检查后端是否启动')
      }
    })()
  }, [])

  // 保存成功提示
  useEffect(() => {
    if (saveSuccess) message.success('流程已保存')
  }, [saveSuccess])

  const handleSave = async () => {
    await saveFlow()
  }

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      {/* ── Header ── */}
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          background: '#001529',
        }}
      >
        <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>
          🔀 Flow Designer
          {currentFlow && (
            <Typography.Text
              style={{ color: '#aaa', fontSize: 13, marginLeft: 12 }}
            >
              {currentFlow.name}
            </Typography.Text>
          )}
        </Typography.Title>

        <Space>
          <Button
            icon={<HistoryOutlined />}
            onClick={() => setShowHistory((v) => !v)}
            type={showHistory ? 'primary' : 'default'}
          >
            历史版本
          </Button>
          <Button
            type="primary"
            icon={saveSuccess ? <CheckCircleOutlined /> : <SaveOutlined />}
            onClick={handleSave}
            loading={loading}
          >
            {saveSuccess ? '已保存' : '保存'}
          </Button>
        </Space>
      </Header>

      {/* ── Body ── */}
      <Layout style={{ overflow: 'hidden' }}>
        {/* 画布区域 */}
        <Content style={{ position: 'relative' }}>
          <Spin spinning={loading} tip="加载中..." style={{ height: '100%' }}>
            <div style={{ width: '100%', height: 'calc(100vh - 64px)' }}>
              <FlowCanvas />
            </div>
          </Spin>
        </Content>

        {/* 右侧面板 */}
        <Sider
          width={280}
          style={{
            background: '#f5f5f5',
            padding: 12,
            overflowY: 'auto',
            borderLeft: '1px solid #e8e8e8',
          }}
        >
          <NodeEditor />

          {showHistory && (
            <>
              <Divider style={{ margin: '12px 0' }} />
              <HistoryPanel />
            </>
          )}
        </Sider>
      </Layout>
    </Layout>
  )
}

export default FlowDesigner

