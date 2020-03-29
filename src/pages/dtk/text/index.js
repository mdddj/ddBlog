import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Drawer, Input, Form, Radio, message } from 'antd';
import { connect } from 'dva';
import BraftEditor from 'braft-editor';

import styles from './style.less';
const { TextArea } = Input;

@connect(({ text: { listData } }) => ({
  listData,
}))
class Page extends Component {
  formRef = React.createRef();

  state = {
    showDrawer: false,
    editorState: BraftEditor.createEditorState(''),
    outputHTML: '<p></p>',
    type: 'textArea',
  };

  columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '表单类型',
      dataIndex: 'field',
      key: 'field',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a style={{ marginRight: 16 }}>Invite {record.name}</a>
          <a>Delete</a>
        </span>
      ),
    },
  ];

  componentDidMount() {
    this.fetchListData({ page: 0, limit: 10 });
  }

  /**
   * 富文本编辑器内容变更
   */
  handleChange = editorState => {
    this.setState({
      editorState: editorState,
      outputHTML: editorState.toHTML(),
    });
  };

  fetchListData = ({ page, limit }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'text/list',
      payload: { page, limit },
    });
  };

  submitData = () => {
    // this.formRef.current.submit();
    const { dispatch } = this.props;
    this.formRef.current
      .validateFields()
      .then(values => {
        const dataObj = this.getContext(values);
        console.log(dataObj);
        dispatch({
          type: 'text/add',
          payload: dataObj,
        });
        this.setState({ showDrawer: false });
      })
      .catch(errorInfo => {
        message.error('请按提示修改正确内容!');
      });
  };

  //获取提交的对象
  getContext = values => {
    if (values.field === 'braftEditor') {
      const { outputHTML } = this.state;
      values.content = outputHTML;
      return values;
    }
    return values;
  };

  fieldTypeChange = e => {
    const { value } = e.target;
    console.log(value);
    this.setState({ type: value });
  };

  render() {
    const { listData } = this.props;
    const { type } = this.state;

    let content = [];
    if (listData !== null) {
      content = [...listData.content];
    }
    console.log(content);
    const textAreaItem = (
      <TextArea
        onChange={this.onChange}
        autoSize={{ minRows: 5, maxRows: 9 }}
        style={{ border: '1px solid #d9d9d9', height: 400 }}
      />
    );

    const braftEditor = (
      <BraftEditor
        id="content"
        value={this.state.editorState}
        onChange={this.handleChange}
        style={{ border: '1px solid #d9d9d9' }}
      />
    );

    return (
      <PageHeaderWrapper>
        <Card>
          <Button type="primary" onClick={() => this.setState({ showDrawer: true })}>
            添加新的
          </Button>
        </Card>
        <Card>
          <Table
            columns={this.columns}
            dataSource={content}
            pagination={{
              current: listData ? listData.size : 1,
              total: listData ? listData.totalElements : 0,
              limit: listData ? listData.number : 10,
            }}
          />
        </Card>

        <Drawer
          title=""
          width={720}
          onClose={() => this.setState({ showDrawer: false })}
          visible={this.state.showDrawer}
          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button onClick={this.submitData.bind(this)} type="primary">
                Submit
              </Button>
            </div>
          }
        >
          <Form
            ref={this.formRef}
            layout="vertical"
            initialValues={{ field: 'textArea', extra: '' }}
          >
            <Form.Item
              label="类型"
              rules={[{ required: true, message: '关键字不能为空' }]}
              name="type"
            >
              <Input></Input>
            </Form.Item>

            <Form.Item label="值类型" name="field">
              <Radio.Group onChange={this.fieldTypeChange}>
                <Radio.Button value="textArea">普通文本</Radio.Button>
                <Radio.Button value="braftEditor">富文本</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="正文内容"
              name="content"
              rules={[{ required: true, message: '正文内容不能为空' }]}
            >
              {type === 'textArea' ? textAreaItem : braftEditor}
            </Form.Item>
            <Form.Item label="备注" name="extra">
              {textAreaItem}
            </Form.Item>
          </Form>
        </Drawer>
      </PageHeaderWrapper>
    );
  }
}

export default Page;
