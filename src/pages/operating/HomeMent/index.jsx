import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Tag, Input, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './style.less';

class ProductDetail extends Component {
  // 初始化状态
  state = {
    tags: [],
    inputVisible: false,
    inputValue: '',
    editInputIndex: -1,
    editInputValue: '',
  };

  // 生命周期函数 第一次渲染后调用
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'homeMent/getTerms',
      payload: {},
    });
  }

  // 删除标签
  handleClose = removedTag => {
    const { dispatch } = this.props;
    const arrIndex = this.props.homeMent.homeMent.terms.indexOf(removedTag);
    this.props.homeMent.homeMent.terms.splice(arrIndex, 1);
    const inputArr = this.props.homeMent.homeMent.terms;
    dispatch({
      type: 'homeMent/updateTerms',
      payload: { terms: inputArr },
    });
    setTimeout(() => {
      dispatch({
        type: 'homeMent/getTerms',
        payload: {},
      });
    }, 100);
  };

  // 打开新增输入框
  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  // 新增框改变
  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  // 新增标签
  handleInputConfirm = () => {
    const { dispatch } = this.props;
    const { inputValue } = this.state;
    const inputArr = this.props.homeMent.homeMent.terms.concat(inputValue);
    dispatch({
      type: 'homeMent/updateTerms',
      payload: { terms: inputArr },
    });
    setTimeout(() => {
      dispatch({
        type: 'homeMent/getTerms',
        payload: {},
      });
    }, 100);
    this.setState({
      inputVisible: false,
      inputValue: '',
    });
  };

  handleEditInputChange = e => {
    this.setState({ editInputValue: e.target.value });
  };

  handleEditInputConfirm = () => {
    this.setState(({ tags, editInputIndex, editInputValue }) => {
      const newTags = [...tags];
      newTags[editInputIndex] = editInputValue;

      return {
        tags: newTags,
        editInputIndex: -1,
        editInputValue: '',
      };
    });
  };

  saveInputRef = input => {
    this.input = input;
  };

  saveEditInputRef = input => {
    this.editInput = input;
  };

  render() {
    const { homeMent } = this.props.homeMent;
    const termsTags = homeMent.terms ? homeMent.terms : [];
    const { inputVisible, inputValue, editInputIndex, editInputValue } = this.state;
    return (
      <PageHeaderWrapper>
        <Card title="首页推荐搜索关键词">
          {termsTags.map((tag, index) => {
            if (editInputIndex === index) {
              return (
                <Input
                  ref={this.saveEditInputRef}
                  key={tag}
                  size="small"
                  className={styles.tagInput}
                  value={editInputValue}
                  onChange={this.handleEditInputChange}
                />
              );
            }

            const isLongTag = tag.length > 20;
            const tagElem = (
              <Tag
                style={{ marginTop: '10px', padding: '5px 15px' }}
                className={styles.editTag}
                key={tag}
                closable
                onClose={() => this.handleClose(tag)}
              >
                <span>{isLongTag ? `${tag.slice(0, 20)}...` : tag}</span>
              </Tag>
            );
            return isLongTag ? (
              <Tooltip title={tag} key={tag} style={{ padding: '100px' }}>
                {tagElem}
              </Tooltip>
            ) : (
              tagElem
            );
          })}
          {inputVisible && (
            <Input
              style={{ marginTop: '10px', padding: '5px 15px' }}
              ref={this.saveInputRef}
              type="text"
              size="small"
              className={styles.tagInput}
              value={inputValue}
              onChange={this.handleInputChange}
              onBlur={this.handleInputConfirm}
              onPressEnter={this.handleInputConfirm}
            />
          )}
          {!inputVisible && (
            <Tag className={styles.siteTagPlus} onClick={this.showInput}>
              <PlusOutlined /> New Tag
            </Tag>
          )}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ homeMent, loading }) => ({
  homeMent,
  loading: loading.effects['homeMent/getTerms'],
}))(ProductDetail);
