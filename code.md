# Flow Designer Demo

## 项目简介

可交互式修改流程图的项目

---

# Demo 目标

验证以下能力：

1. 后端 JSON 数据驱动前端页面生成
2. 流程图可视化渲染
3. 流程节点编辑
4. 数据持久化

---

# 核心功能

## 1. 流程图渲染

系统从后端获取流程定义 JSON：

```json
{
  "nodes": [
    {
      "id": "start",
      "label": "开始"
    },
    {
      "id": "approval",
      "label": "审批"
    }
  ],
  "edges": [
    {
      "source": "start",
      "target": "approval"
    }
  ]
}
```

前端根据 JSON 自动渲染流程图。

支持：

* 节点展示
* 连线展示
* 自动布局

---

## 2. 流程编辑

支持：

* 新增节点
* 删除节点
* 修改节点名称
* 拖拽节点位置
* 新增连线
* 删除连线

所有修改实时同步到前端状态。

---

## 3. 数据持久化

用户点击保存后：

```text
Flow Graph
      ↓
JSON
      ↓
REST API
      ↓
Database
```

系统将最新流程结构存储至数据库。

再次进入页面时自动恢复最新流程状态。

---

## 4. 历史版本管理（扩展能力）

保存流程时自动记录版本。

支持：

* 查看历史版本
* 恢复历史版本
* 对比流程变更

---

# 技术方案

## 前端

* React
* TypeScript
* React Flow
* Ant Design

选择 React Flow 的原因：

* 开箱即用
* 支持拖拽
* 支持节点连线
* 学习成本低
* 适合快速原型开发

---

## 后端

* Python3.10
* FastAPI
* SQLAlchemy
* SQLite

接口设计：

```text
GET /api/flow/{id}

获取流程定义
```

```text
PUT /api/flow/{id}

更新流程定义
```

```text
GET /api/flow/{id}/history

查看历史版本
```

---

## 数据库设计

Flow


| 字段        | 类型     |
| ----------- | -------- |
| id          | int      |
| name        | varchar  |
| flow_json   | json     |
| create_time | datetime |
| update_time | datetime |

FlowVersion


| 字段        | 类型     |
| ----------- | -------- |
| id          | int      |
| flow_id     | int      |
| version     | int      |
| flow_json   | json     |
| create_time | datetime |


```
