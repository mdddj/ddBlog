import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Tabs, Select, Card, Form, Input, Row, Col, Avatar, Button, Modal, Alert, Typography } from 'antd';
import { connect } from 'dva';

import styles from './style.less';

const { TabPane } = Tabs;
const { Title } = Typography;
const { TextArea } = Input;

@connect(({ user: { currentUser } }) => ({
  currentUser
}))
class Page extends Component {


  formRef = React.createRef();

  state = {
    updateHeaderModal: false
  }

  componentDidMount() {
    this.initUserData();
  }

  fetchUser = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent'
    })
  }

  initUserData = () => {
    const { currentUser } = this.props;
    this.formRef.current.setFieldsValue({
      username: currentUser.user.username,
      introduce: currentUser.user.introduce,
      remark: currentUser.user.remark
    })
  }

  onFinish = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'me/update',
      payload: values
    })
    this.setState({ updateHeaderModal: false })
  }

  render() {
    const { currentUser } = this.props;
    console.log(currentUser)
    return (
      <PageHeaderWrapper className={styles.container}>
        <Card>
          <Tabs tabPosition='left'>
            <TabPane tab="基本设置" key="1">
              <div className={styles.title}>基本设置</div>
              <Row gutter={64}>
                <Col span={8}>
                  <Form ref={this.formRef} layout='vertical' onFinish={this.onFinish}>
                    <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="introduce" label="个人介绍" rules={[{ required: true }]}>
                      <TextArea autoSize />
                    </Form.Item>
                    <Form.Item name="remark" label="备注" rules={[{ required: true }]}>
                      <TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
                    </Form.Item>
                    <Form.Item >
                      <Button type="primary" htmlType="submit">提交修改</Button>
                    </Form.Item>
                  </Form>
                </Col>
                <Col span={8}>
                  <div>头像</div>
                  <div className={styles.avabtn}>
                    <div>
                      <Avatar src={currentUser.user.avatar} size={148} />
                    </div>
                    <Button onClick={() => this.setState({ updateHeaderModal: true })}>更换头像</Button>
                  </div>
                </Col>
              </Row>

            </TabPane>
            <TabPane tab="安全设置" key="2">
              <div className={styles.title}>安全设置</div>
              <Form forceRender ref={this.formRef} layout='vertical' onFinish={this.onFinish}>
                <Form.Item name="password" label="更改密码" rules={[{ required: true, message: '密码不能为空' }]}>
                 <Input.Password className={styles.pass} />
                </Form.Item>
                <Form.Item >
                  <Button htmlType="submit">提交修改</Button>
                </Form.Item>
              </Form>
            </TabPane>

          </Tabs>
        </Card>
        <Modal
        forceRender
          title="修改头像"
          visible={this.state.updateHeaderModal}
          footer={null}
          onCancel={() => this.setState({ updateHeaderModal: false })}
        >

          <Form  ref={this.formRef} layout='vertical' onFinish={this.onFinish}>
            <Alert message="建议使用图床上传目标图片获取src地址" type="success" closable showIcon />
            <Form.Item name="avatar" label="头像地址" rules={[{ required: true, message: '头像不能为空' }, { type: 'url', message: '输入合法的URL' }]}>
              <TextArea rows={4} placeholder='输入URL' />
            </Form.Item>
            <Form.Item >
              <Button htmlType="submit">提交修改</Button>
            </Form.Item>
          </Form>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default Page;
