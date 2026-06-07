import React, { useEffect } from 'react'
import {
  Card,
  List,
  Button,
  Tag,
  Typography,
  Empty,
  Popconfirm,
  Space,
} from 'antd'
import { HistoryOutlined, RollbackOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useFlowStore } from '../../store/flowStore'

const HistoryPanel: React.FC = () => {
  const { currentFlow, history, loadHistory, restoreVersion, loading } =
    useFlowStore()

  useEffect(() => {
    if (currentFlow?.id) {
      loadHistory(currentFlow.id)
    }
  }, [currentFlow?.id])

  return (
    <Card
      title={
        <Space>
          <HistoryOutlined />
          历史版本
        </Space>
      }
      size="small"
      style={{ marginTop: 12 }}
      bodyStyle={{ padding: '8px 0' }}
    >
      {history.length === 0 ? (
        <Empty description="暂无历史版本" imageStyle={{ height: 40 }} />
      ) : (
        <List
          size="small"
          dataSource={history}
          renderItem={(ver) => (
            <List.Item
              style={{ padding: '6px 12px' }}
              actions={[
                <Popconfirm
                  key="restore"
                  title="确认恢复到该版本？"
                  onConfirm={() => restoreVersion(ver.id)}
                  okText="确认"
                  cancelText="取消"
                >
                  <Button
                    size="small"
                    type="link"
                    icon={<RollbackOutlined />}
                    loading={loading}
                  >
                    恢复
                  </Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={
                  <Space size={4}>
                    <Tag color="blue" style={{ margin: 0 }}>
                      v{ver.version}
                    </Tag>
                    <Typography.Text style={{ fontSize: 12 }}>
                      {dayjs(ver.create_time).format('MM-DD HH:mm:ss')}
                    </Typography.Text>
                  </Space>
                }
                description={
                  <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                    {ver.flow_json.nodes.length} 节点 /{' '}
                    {ver.flow_json.edges.length} 连线
                  </Typography.Text>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  )
}

export default HistoryPanel

