import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Card, Button, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined,ExclamationCircleOutlined } from '@ant-design/icons';

import styles from './index.less';

const { Option } = Select;

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 80
  },
  {
    title: '标题',
    dataIndex: 'name',
  },
  {
    title: '图片',
    dataIndex: 'src',
  },
  {
    title: '跳转链接',
    dataIndex: 'url',
    ellipsis: true,
  },
  {
    title: '平台',
    dataIndex: 'type',
  },
  {
    title: '页面',
    dataIndex: 'view',
  },
  {
    title: '点击',
    dataIndex: 'clickCount',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
];

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
};

const validateMessages = {
  required: '该项不能为空!',
  types: {
    url: '不是合法的URL链接!',
    number: 'Not a validate number!',
  }
};



class Index extends Component {

  state = {
    showModal: false,
    selectedRowKeys: [],
    updateItem: null,
    list: []
  }

  formRef = React.createRef();

  componentDidMount() {
    this.fetchData({ page: 0, limit: 10 })
  }

  fetchData = ({ page, limit }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'carousel/fetchAll',
      payload: {
        page,
        limit
      }
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination)
  };

  onFinish = values => {
    const { dispatch } = this.props;
    const { updateItem } = this.state;
    const data = values.c;
    if (updateItem) data.id = updateItem.id
    dispatch({
      type: 'carousel/add',
      payload: data
    })
    this.resetFormDate(false);
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  update = () => {
    const { selectedRowKeys } = this.state
    const { data } = this.props
    if (selectedRowKeys.length === 0) {
      message.warning("请先勾选要编辑的项目")
    } else if (selectedRowKeys.length > 1) {
      message.warning("请勾选一个");
    } else {
      const updateItem = data.content.find(item => item.id === selectedRowKeys[0]);
      this.setState({ updateItem, showModal: true })
      this.formRef.current.setFieldsValue({ c: updateItem })
    }
  }

  resetFormDate = showModal => {
    this.setState({ updateItem: null, showModal })
    this.formRef.current.resetFields();
  }

  del = () => {
    const { selectedRowKeys } = this.state
    const { dispatch } = this.props;
    if (selectedRowKeys.length === 0) {
      message.warning("请选择要删除的项");
    } else {
      Modal.confirm({
        title: '确定删除吗?',
        icon: <ExclamationCircleOutlined />,
        content: '此操作将不可逆转',
        okText: '是的',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          dispatch({
            type: 'carousel/del',
            payload: selectedRowKeys
          })
        },
        onCancel() {
        },
      });
     
    }
  }

  render() {
    const { data, dataLoading } = this.props;
    const { showModal, selectedRowKeys, updateItem } = this.state;
    let { list } = this.state
    if (data) {
      list = [...data.content]
    }
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <PageHeaderWrapper content="这是一个新页面，从这里进行开发！">
        <Card
          title='轮播列表'
          extra={
            <div className={styles.action_buttons}>
              <Button type='primary' icon={<PlusOutlined />} onClick={() => this.setState({ showModal: true })}>新建</Button>
              <Button onClick={this.update}>编辑</Button>
              <Button onClick={this.del}>删除选中</Button>
            </div>
          }
        >
          <Table
            rowSelection={rowSelection}
            columns={columns}
            rowKey={record => record.id}
            dataSource={list}
            pagination={{ current: data ? data.number + 1 : 1, total: data ? data.totalElements : 0 }}
            loading={dataLoading}
            onChange={this.handleTableChange}
          />
        </Card>
        <Modal
          forceRender
          footer={null}
          title={updateItem ? '修改' : '添加'}
          visible={showModal}
          onCancel={() => {
            this.resetFormDate(false)
          }}
        >
          <Form {...layout} ref={this.formRef} name="nest-messages" onFinish={this.onFinish} validateMessages={validateMessages}>
            <Form.Item name={['c', 'name']} label="标题" rules={[{ required: true, max: 30 }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['c', 'src']} label="图片地址" rules={[{ type: 'url', required: true }]}>
              <Input.TextArea placeholder='要显示的图片地址' />
            </Form.Item>
            <Form.Item name={['c', 'url']} label="跳转链接" rules={[{ type: 'url', required: true }]}>
              <Input.TextArea placeholder='点击跳转的url链接' />
            </Form.Item>
            <Form.Item name={['c', 'type']} label="平台" rules={[{ required: true }]}>
              <Select
                placeholder="编译平台"
                onChange={this.onGenderChange}
                allowClear
              >
                <Option value="H5">H5</Option>
                <Option value="MP-WEIXIN">微信小程序</Option>
                <Option value="MP-ALIPAY">支付宝小程序</Option>
                <Option value="MP-BAIDU">百度小程序</Option>
                <Option value="MP-TOUTIAO">头条小程序</Option>
                <Option value="MP-QQ">QQ小程序</Option>
                <Option value="App nvue">App nvue</Option>
                <Option value="APP-PLUS">APP</Option>
                <Option value="MP">微信小程序/支付宝小程序/百度小程序/头条小程序/QQ小程序</Option>
              </Select>
            </Form.Item>
            <Form.Item name={['c', 'view']} label="页面" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['c', 'remark']} label="备注" rules={[{ max: 100 }]}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button type="primary" htmlType="submit">
                {updateItem ? '提交修改' : '添加'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default connect(
  (
    { carousel: { data }, loading }) => ({
      data,
      dataLoading: loading.effects['carousel/fetchAll']
    })
)(Index);
