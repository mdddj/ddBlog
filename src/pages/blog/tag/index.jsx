import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Card, Table, Button, Modal, Form, message, Popconfirm  } from 'antd';


class index extends Component {

  state = {
    list: [],
    name: '',
    showModal: false,
    updateItem: null
  }

  formRef = React.createRef();

  columns = [
    {
      title: 'ID',
      dataIndex: 'id'
    }, {
      title: '名称',
      dataIndex: 'name'
    },
    {
      title: '操作',
      key: 'action',
      render: (text, item) => (
        <span>
          <a style={{ marginRight: 16 }} onClick={this.update.bind(this, item)}>编辑</a>
          <Popconfirm title="确定删除吗？" okText="是" cancelText="否" onConfirm={this.del.bind(this,item.id)}>
          <a style={{ color: 'red' }}>删除</a></Popconfirm>
        </span>
      ),
    },
  ]

  componentDidMount() {
    this.fetchData({ name: '', page: 1, limit: 10 })
  }

  search = name => {
    this.fetchData({ name, page: 1, limit: 10 })
  }

  update = updateItem => {
    this.setState({ updateItem, showModal: true })
    this.formRef.current.setFieldsValue(updateItem);
  }

  del = id => {
    const {dispatch} = this.props;
    dispatch({
      type:'tag/del',
      payload:id
    })
  }

  fetchData = ({ name, page, limit }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tag/list',
      payload: {
        name,
        page,
        limit
      }
    })
  }

  handleTableChange = pagination => {
    const { name } = this.state
    const { current } = pagination;
    this.fetchData({ name, page: current, limit: 10 })
  };

  onFinish = values => {
    const { dispatch } = this.props;
    const { updateItem } = this.state;
    const data = values;
    if (updateItem) {
      data.id = updateItem.id
      dispatch({
        type: 'tag/update',
        payload:
          data
      })
      this.setState({ showModal: false })
      this.formRef.current.resetFields()
    } else {
      const response = dispatch({
        type: 'tag/add',
        payload:
          data
      })
      response.then(res => {
        if (res.code === 200) {
          message.success("添加成功");
          this.fetchData({ name: '', page: 1, limit: 10 })
          this.setState({ showModal: false })
        } else {
          message.error(res.msg)
        }
      })
    }
  };

  render() {
    const { data, dataLoading, addLoading, updateLoading, delLoading } = this.props
    let { list, showModal,updateItem } = this.state
    if (data) list = [...data.records]
    return (
      <PageHeaderWrapper>
        <Card>
          <div style={{ marginBottom: 10 }}>
            <Button type='primary' onClick={() => this.setState({ showModal: true })}>新增</Button>
            <Input.Search
              placeholder="输入关键字检索内容"
              onSearch={value => this.search(value)}
              style={{ width: 200, marginLeft: 8 }}
            />
          </div>
          <Table
            columns={this.columns}
            rowKey={record => record.id}
            dataSource={list}
            pagination={{ total: data ? data.total : 0, current: data ? data.current : 1 }}
            loading={dataLoading || delLoading}
            onChange={this.handleTableChange}
          />
        </Card>
        <Modal
          forceRender
          title={updateItem?`修改[${updateItem.name}]标签`:'新增标签'}
          visible={showModal}
          footer={null}
          onCancel={() => {
            this.formRef.current.resetFields();
            this.setState({ showModal: false, updateItem: null })
          }}
        >
          <Form ref={this.formRef} name="control-ref" onFinish={this.onFinish}>
            <Form.Item name="name" label="名称" rules={[{ required: true, message: '填写内容' }, { max: 18, message: '不能超过18字' }]}>
              <Input />
            </Form.Item>
            <Form.Item >
              <Button type="primary" loading={updateItem? updateLoading : addLoading} htmlType="submit">
                提交
          </Button>
              <Button style={{ marginLeft: 8 }} htmlType="button" onClick={() => this.formRef.current.resetFields()}>
                重置
          </Button>

            </Form.Item>
          </Form>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default connect(
  ({ tag: { data }, loading }) => ({
    data,
    dataLoading: loading.effects['tag/list'],
    addLoading:loading.effects['tag/add'],
    updateLoading:loading.effects['tag/update'],
    delLoading:loading.effects['tag/del']
  }))(index);
