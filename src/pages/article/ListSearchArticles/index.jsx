import React, { Component } from 'react';
import { Button, Card, Col, List, Row, Select, Tag, DatePicker, Input, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons'
import '@ant-design/compatible/assets/index.css';
import { connect } from 'dva';
import ArticleListContent from './components/ArticleListContent';
import StandardFormRow from './components/StandardFormRow';
import styles from './style.less';
import settings from '../../../../config/defaultSettings';//未完成:修改为dva获取
import { Link } from 'umi';

const { siteUrl } = settings;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { CheckableTag } = Tag;
const pageSize = 5;
const dateFormat = 'YYYY-MM-DD';

class ListSearchArticles extends Component {

  constructor(props) {
    super(props);
    this.state = {
      authorName: '',
      titleKeyWord: '',
      state: -1,
      startDate: '',
      endDate: '',
      categoryIds: [],
      page: 1,
      limit: 5
    }

    // this.startSearch = this.startSearch.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'category/fetchAll',
    });
    this.startSearch();
  }

  fetchMore = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'articleAndListSearchArticles/appendFetch',
      payload: {
        count: pageSize,
      },
    });
  };

  authorOnChange = v => this.setState({ authorName: v.target.value })

  titleOnChange = v => this.setState({ titleKeyWord: v.target.value })

  stateOnChange = value => this.setState({ state: value })

  dateOnChange = (date, dateString) => {
    this.setState({ startDate: dateString[0], endDate: dateString[1] })
  }

  startSearch = (page = 1, limit = 5) => {
    this.setState({ page, limit })
    const { authorName, titleKeyWord, state, startDate, endDate, categoryIds } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'article/search',
      payload: {
        categroys: categoryIds,
        author: authorName,
        state,
        title: titleKeyWord,
        startDate,
        endDate,
        page,
        limit
      }
    })
  }

  handleChange(id, checked) {
    const { categoryIds } = this.state;
    const nextSelectedTags = checked ? [...categoryIds, id] : categoryIds.filter(t => t !== id);
    this.setState({ categoryIds: nextSelectedTags });
  }

  pageOnChange(page, limit) {
    this.startSearch(page, limit);
  }

  delOne = id => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '确认删除吗?',
      icon: <ExclamationCircleOutlined />,
      content: '注意,此操作将不可逆转!',
      okText: '确定并删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'article/del',
          payload: { id }
        })
      }
    });


  }

  render() {
    const {
      categorys,
      loading,
      searchData,
      searchDataLoading
    } = this.props;
    const { categoryIds, page, limit } = this.state;
    console.log(searchData);
    return (
      <>
        {/* 搜索卡片 */}
        <Card bordered={false} >
          <StandardFormRow
            title="所属分类"
            block
            style={{
              paddingBottom: 11,
            }}
          >
            <CheckableTag
              checked={categoryIds.length === 0}
              onChange={() => this.setState({ categoryIds: [] })}
            >
              全部
              </CheckableTag>
            {categorys.map(v => (
              <CheckableTag
                key={v.id}
                checked={categoryIds.indexOf(v.id) > -1}
                onChange={checked => this.handleChange(v.id, checked)}
              >
                {v.name}
              </CheckableTag>))}
          </StandardFormRow>
          <StandardFormRow
            title="文章标题"
            block
            style={{
              paddingBottom: 11,
            }}
          >
            <Input placeholder="输入关键字" onChange={this.titleOnChange} />
          </StandardFormRow>
          <StandardFormRow title="其它选项" grid >
            <Row gutter={16}>
              <Col xl={8} lg={10} md={12} sm={24} xs={24}>
                <span>发布时间: </span> <RangePicker
                  onChange={this.dateOnChange}
                  format={dateFormat}
                />
              </Col>
              <Col xl={8} lg={10} md={12} sm={24} xs={24}>
                <span>发布状态: </span> <Select
                  placeholder="不限"
                  style={{ width: 120 }}
                  onChange={this.stateOnChange}
                >
                  <Option value="-1">不限</Option>
                  <Option value="1">正式发布</Option>
                  <Option value="0">草稿箱</Option>
                  <Option value="2">定时发布</Option>
                </Select>,
                </Col>
              <Col xl={8} lg={10} md={12} sm={24} xs={24}>
                <span>作者:</span><Input placeholder="用户名" onChange={this.authorOnChange} style={{ width: 120 }} />
              </Col>
            </Row>
          </StandardFormRow>
          <Button loading={searchDataLoading} onClick={() => this.startSearch(1, 5)}>检索</Button>
        </Card>
        {/* 搜索卡片end */}

        {/* 列表卡片 */}
        <Card
          style={{
            marginTop: 24,
          }}
          bordered={false}
          bodyStyle={{
            padding: '8px 32px 32px 32px',
          }}
          loading={searchDataLoading}
        >
          <List
            size="large"
            loading={categorys.length === 0 ? loading : false}
            rowKey="id"
            itemLayout="vertical"
            pagination={{
              current: page,
              total: searchData ? searchData.pager.total : 0,
              pageSize: limit,
              showQuickJumper: true,
              onChange: this.pageOnChange.bind(this)
            }}
            dataSource={searchData ? searchData.rows : []}
            renderItem={item => (
              <List.Item
                key={item.id}
                extra={<div className={styles.listItemExtra} ><Button><Link to={{ pathname: '/article/add', query: { update: item.id } }}>编辑</Link></Button><Button onClick={this.delOne.bind(this, item.id)} type='danger'>删除</Button></div>}
              >
                <List.Item.Meta
                  title={
                    <a className={styles.listItemMetaTitle} href={`${siteUrl}/article/${item.id}`}>
                      {item.title}
                    </a>
                  }
                  description={
                    <span>
                      {
                        item.tags.map(v => <Tag key={v.id}>{v.name}</Tag>)
                      }
                    </span>
                  }
                />
                <ArticleListContent data={item} />
              </List.Item>
            )}
          />
        </Card>
        {/* 列表卡片end */}
      </>
    );
  }
}

export default connect(
  ({ category: { categorys }, article: { searchData }, loading }) => ({
    categorys,
    searchData,
    searchDataLoading: loading.effects['article/search'],
    categorysLoading: loading.effects['category/fetchAll'],
  })
)(ListSearchArticles);
