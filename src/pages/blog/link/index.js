import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Table, Form, Button, Input, Modal, Popconfirm } from 'antd';
import { connect } from 'dva';
import styles from './style.less'

const { TextArea } = Input;


@connect(({ link: { data }, loading }) => ({
  data,
  dataLoading: loading.effects['link/list'],
  addLoading: loading.effects['link/add'],
  delLoading: loading.effects['link/del'],
}))
class Page extends Component {


  formRef = React.createRef();

  columns = [
    {
      title: 'id',
      dataIndex: 'id'
    },
    {
      title: '标题',
      dataIndex: 'name'
    }, {
      title: 'url',
      dataIndex: 'url'
    }, {
      title: '操作',
      render: (text, item) => (
        <span>
          <a href={item.url} target={'_blank'}>查看</a>
          <Popconfirm title="确定删除吗？" okText="是" cancelText="否" onConfirm={this.del.bind(this, item.id)}>
            <a style={{ color: 'red', marginLeft: 8 }}>删除</a></Popconfirm>
        </span>
      )
    }
  ]

  state = {
    updateItem: null,
    showModal: false,
    current: 1,
    name: ''
  }

  componentDidMount() {
    this.fetch({ page: 1, limit: 10, name: '' })
  }

  fetch = obj => {
    const { dispatch } = this.props;
    const { name } = this.state;
    if (!obj.name) obj.name = name
    dispatch({
      type: 'link/list',
      payload: obj
    });
  }

  del = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'link/del',
      payload: id
    })
  }


  onFinish = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'link/add',
      payload: values
    })
    this.formRef.current.resetFields();
    this.setState({ showModal: false })
  }

  handleTableChange = pagination => {

    const { current } = pagination;
    this.setState({ current })
    this.fetch({ page: current, limit: 10 })
  };

  search = value => {
    this.fetch({ page: 1, limit: 10, name: value })
  }

  render() {
    const { data, dataLoading, addLoading, delLoading } = this.props;
    let dataSource = [];
    if (data) dataSource = [...data.rows]

    const extraActions = (
      <div className={styles.actionButtons}>
        <Button type='primary' onClick={() => this.setState({ showModal: true })}>添加友链</Button>
        <Button loading={dataLoading} onClick={() => { this.fetch({ page: 1, limit: 10 }) }}>刷新</Button>
        <Input.Search
          className={styles.searchInput}
          placeholder="标题关键字"
          onSearch={this.search}
        />
      </div>
    )
    return (
      <PageHeaderWrapper>

        {/* 列表 */}
        <Card loading={dataLoading || delLoading} extra={extraActions}>
          <Table columns={this.columns} rowKey={record => record.id} dataSource={dataSource} pagination={{ total: data ? data.total : 0, current: this.state.current }} onChange={this.handleTableChange} />
        </Card>
        {/* 列表END */}

        {/* 添加/修改弹窗 */}
        <Modal
          forceRender
          title='添加友链'
          visible={this.state.showModal}
          footer={null}
          onCancel={() => {
            this.formRef.current.resetFields();
            this.setState({ showModal: false, })
          }}
        >
          <Form layout='vertical' ref={this.formRef} name="control-ref" onFinish={this.onFinish}>
            <Form.Item name="name" label="标题" rules={[{ required: true, message: '填写内容' }, { max: 18, message: '不能超过18字' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="url" label="跳转链接" rules={[{ required: true, message: '填写内容' }, { type: 'url', message: '链接不合法' }]}>
              <TextArea
                placeholder="输入合法的URL链接"
                autoSize={{ minRows: 2, maxRows: 6 }}
              />
            </Form.Item>
            <Form.Item >
              <Button type="primary" loading={addLoading} htmlType="submit">
                提交
          </Button>
              <Button style={{ marginLeft: 8 }} htmlType="button" onClick={() => this.formRef.current.resetFields()}>
                重置
          </Button>

            </Form.Item>
          </Form></Modal>
        {/* 添加/修改弹窗End */}
      </PageHeaderWrapper>
    );
  }
}

export default Page;
