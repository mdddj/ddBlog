import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { Form, Card, Input, Button, Row, Col, Select, Radio, Divider, Spin,Modal,Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { connect } from 'dva';
import BraftEditor from 'braft-editor'
import CodeHighlighter from 'braft-extensions/dist/code-highlighter'
import 'braft-editor/dist/index.css'
import 'braft-extensions/dist/code-highlighter.css'

import 'prismjs/components/prism-java'
import 'prismjs/components/prism-php'

const options = {
  includeEditors: ['content'],
  excludeEditors: ['content'],
  syntaxs: [
    {
      name: 'JavaScript',
      syntax: 'javascript'
    }, {
      name: 'HTML',
      syntax: 'html'
    }, {
      name: 'CSS',
      syntax: 'css'
    }, {
      name: 'Java',
      syntax: 'java',
    }, {
      name: 'PHP',
      syntax: 'php'
    }
  ]
}

BraftEditor.use(CodeHighlighter(options))

const { Option } = Select;
const { TextArea } =Input;
class ArticleAdd extends Component {

  state = {
    editorState: BraftEditor.createEditorState('<p>请输入文章内容 <b>Hello World!</b></p>'),
    newTagNameIs: '',
    updateItem: null,
    showCoverModal:false,
    cover:''
  }

  formRef = React.createRef();

  formRef2 = React.createRef();

  componentDidMount() {
    const { query: { update } } = this.props.location;
    if (update) this.getUpdateInfo(update);
    const { dispatch } = this.props;
    dispatch({
      type: 'category/fetchAll',
    });
    dispatch({
      type: 'tag/fetchAll',
    });
  }

  getUpdateInfo = id => {
    const { dispatch } = this.props;
    const data = dispatch({
      type: 'article/findById',
      payload: { id }
    });

    data.then(obj => {
      if (obj) {
        this.setState({ updateItem: obj })
        console.log(obj)
        this.formRef.current.setFieldsValue({
          title: obj.title,
          category: obj.category ? parseFloat(obj.category) : '',
          tags: this.getSelectedTags(obj.tags),
          state: obj.state
        });
        this.formRef2.current.setFieldsValue({cover:obj.cover})
        // console.log(this.formRef2)
        this.setState({ editorState: BraftEditor.createEditorState(obj.content) })
      }
    })

  }

  getSelectedTags = tags => {
    const ss = [];
    tags.map(v =>
      ss.push(v.id)
    )
    return ss;
  }

  handleChange = editorState => {
    this.setState({ editorState })
  }

  onFinish = values =>{
    this.setState({cover:values.cover})
  }

  handleSubmit = values => {
    const data = values;
    const { dispatch } = this.props;
    const { editorState, updateItem, cover } = this.state;
    const outputHTML = editorState.toHTML();
    data.content = outputHTML;
    const { tags } = data;
    const arr = [];
    tags.map(v => arr.push({ id: v }))
    data.tags = arr;
    data.cover = cover;
    if (updateItem) data.id = updateItem.id
    dispatch({
      type: 'article/add',
      payload: data
    });
  };

  addNewTagOk = () => {
    const { dispatch } = this.props;
    const { newTagNameIs } = this.state;
    dispatch({
      type: 'tag/add',
      payload: {
        name: newTagNameIs
      }
    })
    this.setState({ newTagNameIs: '' })
  }

  render() {
    const {
      categorys,
      tags,
      categorysLoading,
      updateItemLoading,
      tagsLoading,
    } = this.props;
    const { editorState, updateItem } = this.state;
    let updateLoading = false;
    if (updateItemLoading) {
      updateLoading = true
    }
    return (
      <PageHeaderWrapper>
        <Spin spinning={updateLoading}>
          <Card
            title={updateItem ? '修改文章' : '撰写文章'}
          >
            <Form layout='vertical' ref={this.formRef} onFinish={this.handleSubmit} >
              <Form.Item name='title' label="文章标题" rules={[{ required: true, message: '请输入标题' }]}>
                <Input placeholder="请输入标题" />
              </Form.Item>
              <Row gutter={16}>
                <Col span={6} push={18}>
                  <Form.Item name='category' label="文章分类" rules={[{ required: true, message: '请选择分类' }]}>
                    <Select style={{ width: '100%' }} placeholder="请选择" loading={categorysLoading}
                    >
                      {
                        categorys.length > 0 ? categorys.map(v => <Option key={`categ-${v.id}`} value={v.id}>{v.name}</Option>) : ''
                      }
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={18} pull={6}>
                  <Form.Item name='tags' label="文章标签" rules={[{ required: true, message: '请添加标签' }]}>
                    <Select
                      loading={tagsLoading}
                      mode="multiple"
                      style={{ width: '100%' }}
                      placeholder="请选择"
                      dropdownRender={menu => (
                        <div>
                          {menu}
                          <Divider style={{ margin: '4px 0' }} />
                          <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                            <Input style={{ flex: 'auto' }} value={this.state.newTagNameIs} onChange={v => this.setState({ newTagNameIs: v.target.value })} />
                            <a
                              style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                              onClick={this.addNewTagOk}
                            >
                              <PlusOutlined /> 添加新标签
                          </a>
                          </div>
                        </div>
                      )}
                    >
                      {
                        tags.map(v => <Option key={`categ-${v.id}`} value={v.id}>{v.name}</Option>)
                      }
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="文章正文">
                <BraftEditor id='content'
                  value={editorState}
                  onChange={this.handleChange}
                  style={{ border: '1px solid #d9d9d9' }}
                />
              </Form.Item>
              <Form.Item name='state' label='发布类型' rules={[{ required: true, message: '请选择发布类型' }]}>
                <Radio.Group>
                  <Radio value="1">立即发布</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">提交</Button>
                <Button style={{marginLeft:10}} onClick={()=>this.setState({showCoverModal:true})}>添加文章头图</Button>
              </Form.Item>
            </Form>
          </Card>
        </Spin>

        <Modal
          forceRender
          title="修改头像"
          visible={this.state.showCoverModal}
          footer={null}
          onCancel={() => this.setState({ showCoverModal: false })}
        >

          <Form ref={this.formRef2} layout='vertical' onFinish={this.onFinish}>
            <Alert message="建议使用图床上传目标图片获取src地址" type="success" closable showIcon />
            <Form.Item name="cover" label="文章缩略图" rules={[{ type: 'url', message: '输入合法的URL' }]}>
              <TextArea rows={4} placeholder='输入URL' />
            </Form.Item>
            <Form.Item >
              <Button htmlType="submit" onClick={()=>this.setState({showCoverModal:false})}>提交</Button>
            </Form.Item>
          </Form>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}


export default connect(
  ({ category: { categorys }, tag: { tags }, loading }) => ({
    categorys,
    tags,
    categorysLoading: loading.effects['category/fetchAll'],
    tagsLoading: loading.effects['tag/fetchAll'],
    updateItemLoading: loading.effects['article/findById']
  }),
)(ArticleAdd);

