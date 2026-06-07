import React, { useEffect } from 'react'
import { Card, Form, Input, Button, Typography, Space, Divider } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useFlowStore } from '../../store/flowStore'

const NodeEditor: React.FC = () => {
  const { selectedNode, updateNodeLabel, deleteNode, setSelectedNode } = useFlowStore()
  const [form] = Form.useForm()

  // 切换选中节点时，同步表单初始值
  useEffect(() => {
    if (selectedNode) {
      form.setFieldsValue({ label: selectedNode.data.label })
    } else {
      form.resetFields()
    }
  }, [selectedNode, form])

  if (!selectedNode) {
    return (
      <Card
        title={
          <Space>
            <EditOutlined />
            节点属性
          </Space>
        }
        size="small"
      >
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          点击画布中的节点进行编辑
        </Typography.Text>
      </Card>
    )
  }

  const handleSave = (values: { label: string }) => {
    updateNodeLabel(selectedNode.id, values.label)
  }

  const handleDelete = () => {
    deleteNode(selectedNode.id)
    setSelectedNode(null)
  }

  return (
    <Card
      title={
        <Space>
          <EditOutlined />
          节点属性
        </Space>
      }
      size="small"
      extra={
        <Typography.Text type="secondary" style={{ fontSize: 11 }}>
          ID: {selectedNode.id}
        </Typography.Text>
      }
    >
      <Form form={form} layout="vertical" onFinish={handleSave}>
        <Form.Item
          label="节点名称"
          name="label"
          rules={[{ required: true, message: '请输入节点名称' }]}
        >
          <Input placeholder="请输入节点名称" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Space>
            <Button type="primary" htmlType="submit" size="small">
              确认修改
            </Button>
            <Button size="small" onClick={() => setSelectedNode(null)}>
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <Divider style={{ margin: '12px 0' }} />

      <Button
        danger
        size="small"
        icon={<DeleteOutlined />}
        onClick={handleDelete}
        block
      >
        删除此节点
      </Button>
    </Card>
  )
}

export default NodeEditor

