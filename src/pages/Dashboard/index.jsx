import { Avatar, Card, Col, List, Skeleton, Row, Statistic } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import styles from './style.less';
import settings from '../../../config/defaultSettings';

const siteUrl = settings.siteUrl;

const PageHeaderContent = ({ currentUser }) => {
  const loading = currentUser && Object.keys(currentUser.user).length;

  if (!loading) {
    return (
      <Skeleton
        avatar
        paragraph={{
          rows: 1,
        }}
        active
      />
    );
  }

  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.avatar}>
        <Avatar size="large" src={currentUser.user.avatar} />
      </div>
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          早安，
          {currentUser.user.username}
          ，祝你开心每一天！
        </div>
        <div>
          上次登入时间:{currentUser.lastLoginTime}
        </div>
      </div>
    </div>
  );
};

const ExtraContent = ({ currentUser: { todayIp, articleCount, commentCount } }) => (
  <div className={styles.extraContent}>
    <div className={styles.statItem}>
      <Statistic title="今日IP" value={todayIp} />
    </div>
    <div className={styles.statItem}>
      <Statistic title="总文章数" value={articleCount} />
    </div>
    <div className={styles.statItem}>
      <Statistic title="总评论数" value={commentCount} />
    </div>
  </div>
);

class Dashboard extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboard/init',
      payload: {
        page: 1,
        limit: 10
      }
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboard/clear',
    });
  }

  renderArticle = item => {
    return (
      <List.Item key={item.id}>
        <List.Item.Meta
          avatar={<Avatar src={item.authorHeader} />}
          title={
            <span>
              <a className={styles.username}>{item.author}</a>
              &nbsp;
          <span className={styles.event}>在 <a href={`${siteUrl}/category/${item.categoryId}`}>{item.category} </a> 发表新文章<a href={`${siteUrl}/article/${item.id}`}> {item.title}</a></span>
            </span>
          }
          description={
            <span className={styles.datetime} title={item.updatedAt}>
              {moment(item.createTime).fromNow()}
            </span>
          }
        />
      </List.Item>
    );
  };

  render() {
    const {
      currentUser,
      articles,
      articlesLoading,
    } = this.props;
    if (!currentUser || !currentUser.user) {
      return null;
    }

    return (
      <PageHeaderWrapper
        content={<PageHeaderContent currentUser={currentUser} />}
        extraContent={<ExtraContent currentUser={currentUser} />}
      >
        <Row gutter={24}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card
              bodyStyle={{
                padding: 0,
              }}
              bordered={false}
              className={styles.activeCard}
              title="最近文章"
              loading={articlesLoading}
            >
              <List
                loading={articlesLoading}
                renderItem={item => this.renderArticle(item)}
                dataSource={articles}
                className={styles.activitiesList}
                size="large"
              />
            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card
              style={{
                marginBottom: 24,
              }}
              title="快速开始 / 便捷导航"
              bordered={false}
              bodyStyle={{
                padding: 0,
              }}
            >
            </Card>


          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default connect(
  ({ dashboard: { currentUser, articles }, loading }) => ({
    currentUser,
    articles,
    currentUserLoading: loading.effects['dashboard/fetchUserCurrent'],
    articlesLoading: loading.effects['dashboard/fetchArticles'],
  }),
)(Dashboard);
