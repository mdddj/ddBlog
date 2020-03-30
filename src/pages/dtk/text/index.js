import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Modal, Card, Button, Drawer, Input, Form, Radio, message, List, Menu, Dropdown } from 'antd';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import BraftEditor from 'braft-editor';

import styles from './style.less';

const { TextArea } = Input;

@connect(({ text: { listData }, loading }) => ({
  listData,
  listLoading: loading.effects['text/list'],
}))
class Page extends Component {
  formRef = React.createRef();

  state = {
    editorState: BraftEditor.createEditorState(''),
    showDrawer: false,
    outputHTML: '<p></p>',
    type: 'textArea',
    updateItem: null
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
    },
    {
      title: '表单类型',
      dataIndex: 'field',
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
      editorState,
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

  // 表单提交
  submitData = () => {
    const { dispatch } = this.props;
    const {updateItem}=this.state;
    this.formRef.current
      .validateFields()
      .then(values => {
        const dataObj = this.getValues(values,updateItem);
        
        if(updateItem && updateItem.id){
          // 修改操作
          dispatch({
            type: 'text/update',
            payload: dataObj,
          });
        }else{
          // 新增操作
          dispatch({
            type: 'text/add',
            payload: dataObj,
          });
        }
        this.onClose();
      })
      .catch(() => {
        message.error('请按提示修改正确内容!');
      });
  };

  // 获取提交的对象
  getValues = (values,updateItem) => {
    const resultData = values;
    if (values.field === 'braftEditor') {
      const { outputHTML } = this.state;
      resultData.content = outputHTML;
      return resultData;
    }
    if(updateItem && updateItem.id){
      resultData.id = updateItem.id;
    }
    return resultData;
  };

  // 单选按钮切换(普通/富文本)
  fieldTypeChange = e => {
    const { value } = e.target;
    this.setState({ type: value });
    const {editorState,updateItem}=this.state;
    if(value==='textArea'){
      if(updateItem && updateItem.field==='textArea'){
        this.formRef.current.setFieldsValue({content:updateItem.content});
      }else{
        this.formRef.current.setFieldsValue({content:''});
      }
    }else{
      this.formRef.current.setFieldsValue({content:editorState});
    }
  };

  // 抽屉关闭
  onClose = () => {
    this.setState({ showDrawer: false,editorState:BraftEditor.createEditorState(''),updateItem:null})
    this.formRef.current.resetFields();
  }

  // 删除某个列
  removeItem = id => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '确认删除吗?',
      icon: <ExclamationCircleOutlined />,
      content: '注意该操作不可逆转且不可恢复!',
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'text/del',
          payload: id
        })
      },
      onCancel() {
      },
    });
  }

  // 编辑某个列
  updateItem = item => {
    this.setState({ showDrawer: true, type: item.field, updateItem: item });// 显示抽屉
    // 设置值
    this.formRef.current.setFieldsValue({
      type: item.type,
      field: item.field,
      extra: item.extra,
      content: item.field === 'textArea' ? item.content : BraftEditor.createEditorState(item.content)
    })
    // 如果是富文本,则调用api设置值
    if (item.field === 'braftEditor') {
      this.setState({ editorState: BraftEditor.createEditorState(item.content) })
    }
  }

  render() {
    const { listData, listLoading } = this.props;
    const { type, updateItem } = this.state;

    let content = [];
    if (listData !== null) {
      content = [...listData.content];
      console.log(listData);
    }
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
        <Card style={{ marginTop: 8 }} loading={listLoading}>
          <List
            header='列表'
            pagination={{
              current: listData ? listData.number + 1 : 1,
              total: listData ? listData.totalElements : 0,
              limit: listData ? listData.size : 10,
            }}
            dataSource={content}
            renderItem={item => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  title={item.type}
                  description={`备注:  ${item.extra}`}
                />
                <div>
                  <Dropdown overlay={<Menu>
                    <Menu.Item onClick={this.updateItem.bind(this, item)}>
                      编辑
        </Menu.Item>
                    <Menu.Item onClick={this.removeItem.bind(this, item.id)}>
                      删除
        </Menu.Item>
                  </Menu>}>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                      操作 <DownOutlined />
                    </a>
                  </Dropdown>
                </div>
              </List.Item>
            )}
          />
        </Card>

        {/* 右侧弹窗 */}
        <Drawer
          forceRender
          title={updateItem?'修改':'新增'}
          width={720}
          onClose={this.onClose}
          visible={this.state.showDrawer}
          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button onClick={this.onClose.bind(this)} style={{ marginRight: 8 }}>
                取消
              </Button>
              <Button onClick={this.submitData.bind(this)} type="primary">
                提交
              </Button>
            </div>
          }
        >

          {/* 表单 */}
          <Form
            ref={this.formRef}
            layout="vertical"
            initialValues={{ field: 'textArea', extra: '' }}
          >
            <Form.Item
              label="类型 (建议英文+数字)"
              rules={[{ required: true, message: '关键字不能为空' }]}
              name="type"
            >
              <Input></Input>
            </Form.Item>

            <Form.Item label="值类型" name="field">
              <Radio.Group onChange={this.fieldTypeChange.bind(this)}>
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
          {/* 表单END */}

        </Drawer>
        {/* 右侧弹窗END */}

      </PageHeaderWrapper>
    );
  }
}

export default Page;
