import { PlusOutlined, QuestionOutlined, FileImageOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Card, List, Typography, Avatar, Input, Upload, message, Modal, Spin } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import urls from '@/utils/url';
import styles from './style.less';

const { Paragraph } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

class CategoryList extends Component {

  state = {
    addIng: false,
    temporaryFile: '',
    temporaryName: '',
    temporaryIntro: '',
    curItemId: 0,
    updateItem: null
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'category/fetchAll'
    });
  }

  handleChange(info) {
    const that = this;
    if (info.file.status === 'done') {
      if (info.file.response.code === 200) {
        that.setState({ temporaryFile: info.file.response.data.url })
      } else {
        message.error(`${info.file.name} 上传失败`);
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  }

  addCateOk() {
    const { temporaryFile, temporaryName, temporaryIntro, updateItem } = this.state;
    const { dispatch, categorys } = this.props;

    if (updateItem && updateItem.id) {
      const updateObj = {
        name: temporaryName,
        intro: temporaryIntro,
        icon: temporaryFile,
        id: updateItem.id
      }
      dispatch({
        type: 'category/update',
        payload: updateObj,
        callback: () => {
          categorys.splice(categorys.findIndex(obj => obj.id === updateItem.id), 1, updateObj);
        }
      })

    } else {
      dispatch({
        type: 'category/add',
        payload: {
          name: temporaryName,
          intro: temporaryIntro,
          icon: temporaryFile
        }
      })
    }
    this.setState({ temporaryFile: '', temporaryIntro: '', temporaryName: '', addIng: false, updateItem: null, curItemId: 0 })
  }

  /**
   * 要删除的对象
   * @param {Object} obj 
   */
  verificationCount(obj) {
    const that = this;
    const { dispatch } = that.props;
    that.setState({ curItemId: obj.id, updateItem: null })
    const data = dispatch({
      type: 'category/articleCount',
      payload: { id: obj.id }
    })

    data.then(res => {
      if (res.code === 200) {
        const count = res.data;
        if (count !== 0) {
          Modal.warning({
            title: '重要提醒',
            content: `此分类下存在${count}篇文章,删除此分类后所有文章的分类属性将为null或者为空,请谨慎删除!`,
            onOk() {
              that.showDeleteConfirm(obj);
            },
            okText: '我已了解',
          });
        } else {
          that.showDeleteConfirm(obj);
        }
      }
    })
  }

  showDeleteConfirm(obj) {
    const that = this;
    const { dispatch } = that.props;
    that.setState({ updateItem: null })
    confirm({
      title: '删除操作确认',
      icon: <ExclamationCircleOutlined />,
      content: `确认删除<${obj.name}>分类吗?此操作不可逆转!`,
      okText: '确认',
      okType: 'danger',
      cancelText: '我再想想',
      onOk() {
        dispatch({
          type: 'category/del',
          payload: { id: obj.id }
        })
        that.setState({ curItemId: 0 })
      },
      onCancel() {
        that.setState({ curItemId: 0 })
      },
    });
  }

  updateCategory(item) {
    this.setState({ updateItem: item, addIng: true, curItemId: item.id, temporaryFile: item.icon, temporaryIntro: item.intro, temporaryName: item.name })
  }

  initState() {
    this.setState({ addIng: false, curItemId: 0, updateItem: null, temporaryFile: '', temporaryIntro: '', temporaryName: '' })
  }

  render() {
    const {
      categorysLoading,
      delCategoryLoading,
    } = this.props;
    const { addIng, temporaryFile, curItemId, updateItem, temporaryIntro, temporaryName } = this.state;

    let { categorys } = this.props;
    categorys = [...categorys];

    const nullData = {};
    const props = {
      name: 'file',
      action: urls.upload,
      headers: {
        authorization: 'authorization-text',
      },
      showUploadList: false,
      onChange: this.handleChange.bind(this)
    }


    return (
      <PageHeaderWrapper loading={delCategoryLoading}>
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={categorysLoading}
            grid={{
              gutter: 24,
              lg: 3,
              md: 2,
              sm: 1,
              xs: 1,
            }}
            dataSource={[nullData, ...categorys]}
            renderItem={item => {
              if (item && item.id) {
                return (
                  <List.Item key={item.id}>
                    <Spin tip={updateItem ? '编辑中...' : '删除中...'} spinning={item && item.id && curItemId === item.id}>
                      <Card
                        hoverable
                        className={styles.card}
                        actions={[<a onClick={() => this.updateCategory(item)}>编辑</a>, <a onClick={() => this.verificationCount(item)}>删除</a>]}
                      >
                        <Card.Meta
                          avatar={item.icon ? <img alt="" className={styles.cardAvatar} src={item.icon} /> : <Avatar size="large" icon={<QuestionOutlined />} />}
                          title={<a>{item.name}</a>}
                          description={
                            <Paragraph
                              className={styles.item}
                              ellipsis={{
                                rows: 3,
                              }}
                            >
                              {item.intro}
                            </Paragraph>
                          }
                        />
                      </Card></Spin>
                  </List.Item>
                );
              }

              return (
                <List.Item>
                  <Button onClick={() => this.setState({ addIng: true })} type="dashed" className={styles.newButton}>
                    <PlusOutlined /> 新增分类
                  </Button>
                </List.Item>
              );
            }}
          />
        </div>
        {/* 添加或者修改弹窗 */}
        <Modal
          title={updateItem ? '修改分类' : '添加分类'}
          visible={addIng}
          onOk={this.addCateOk.bind(this)}
          onCancel={this.initState.bind(this)}
          okText={updateItem ? '修改' : '添加'}
        >
          <div style={{ textAlign: 'center' }}>
            {temporaryFile && temporaryFile !== '' ?
              <Upload {...props}><img alt="" style={{ width: 64, height: 64 }} className={styles.cardAvatar} src={temporaryFile} /></Upload> :
              <Upload {...props}><Avatar style={{ width: 64, height: 64 }} icon={<FileImageOutlined style={{ fontSize: 32, marginTop: 16 }} />} /></Upload>}
          </div>
          <div style={{ marginTop: 16 }}>
            {<Input placeholder={updateItem ? updateItem.name : '分类名称'} value={temporaryName} onChange={v => this.setState({ temporaryName: v.target.value })} />}
          </div>
          <div style={{ marginTop: 16 }}>
            {
              <TextArea placeholder={updateItem ? updateItem.intro : '介绍'} value={temporaryIntro} onChange={v => this.setState({ temporaryIntro: v.target.value })} autoSize={{ minRows: 2, maxRows: 6 }} />
            }
          </div>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default connect(
  ({ category: { categorys }, loading }) => ({
    categorys,
    categorysLoading: loading.effects['category/fetchAll'],
    addCategoryLoading: loading.effects['category/add'],
    delCategoryLoading: loading.effects['category/del']
  })
)(CategoryList);
