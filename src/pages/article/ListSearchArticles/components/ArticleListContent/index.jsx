import { Avatar } from 'antd';
import React from 'react';
import moment from 'moment';
import styles from './index.less';
import settings from '../../../../../../config/defaultSettings';

const { siteUrl } = settings;

const ArticleListContent = ({ data: { content, createTime, author, authorHeader, category, categoryId } }) => (
  <div className={styles.listContent}>
    <div className={styles.description}>{content}</div>
    <div className={styles.extra}>
      <Avatar src={authorHeader} size="small" />
      <a href={`${siteUrl}/u/${author}`}>{author}</a>&nbsp;&nbsp;{category ? <span>发布在&nbsp;&nbsp;<a href={`${siteUrl}/category/${categoryId}`}>{category}</a> </span> : '无分类'}
      <em>{moment(createTime).format('YYYY-MM-DD HH:mm')}</em>
    </div>
  </div>
);

export default ArticleListContent;
