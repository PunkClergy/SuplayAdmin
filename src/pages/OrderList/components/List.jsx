import React, { useState } from 'react';
import { Checkbox, Divider, message, Dropdown, Tag, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import moment from 'moment';
import CustomerLink from '@/components/Common/CustomerLink';
import Link from 'umi/link';
import styles from '../style.less';
import { postSyncErp, cancelOrder, cancelCabinetOrder } from '../service';

// 待优化
const orderStatus = e => {
  if (e === 0) {
    const status = '需要确认/支付';
    return status;
  }
  if (e === 1) {
    const status = '等待发货';
    return status;
  }
  if (e === 2) {
    const status = '已发货';
    return status;
  }
  if (e === 3) {
    const status = '已完成';
    return status;
  }
  if (e === -2) {
    const status = '订单过期';
    return status;
  }
  if (e === -1) {
    const status = '订单关闭/取消';
    return status;
  }
  return null;
};
const orderType = e => {
  if (e === 1) {
    const status = '盒柜';
    return <Tag color="blue">{status}</Tag>;
  }
  if (e === 2) {
    const status = '直购';
    return <Tag color="green">{status}</Tag>;
  }
  if (e === 3) {
    const status = '抽选';
    return <Tag color="gold">{status}</Tag>;
  }
  // if (e === 3) {
  //   const status = '福袋';
  //   return <Tag color="red">{status}</Tag>;
  // }
  return null;
};
// 同步ERC
const handleSyncErc = erp => {
  const hide = message.loading('正在同步');
  try {
    postSyncErp({ id: erp }).then(() => {
      hide();
      message.success('同步成功');
    });
    return true;
  } catch (error) {
    hide();
    message.error('同步失败请重试！');
    return false;
  }
};

// 取消
const handCancelOrder = e => {
  const hide = message.loading('正在取消');
  try {
    cancelOrder({ id: e }).then(res => {
      if (!res) {
        hide();
        message.success('取消成功');
        window.location.reload();
      }
    });
    return true;
  } catch (error) {
    hide();
    message.error('取消失败请重试！');
    return false;
  }
};

const hangCancelCabinetOrder = e => {
  const hide = message.loading('正在取消');
  try {
    cancelCabinetOrder({ id: e }).then(res => {
      if (!res) {
        hide();
        message.success('取消成功');
        window.location.reload();
      }
    });
    return true;
  } catch (error) {
    hide();
    message.error('取消失败请重试！');
    return false;
  }
};

const menu = text => (
  <Menu>
    <Menu.Item key="0">
      {text.status === 1 ? <a onClick={() => handleSyncErc(text.id)}>同步ERP</a> : null}
    </Menu.Item>
    <Menu.Item key="1">
      {text.type === 2 && text.status !== -1 ? (
        <a onClick={() => handCancelOrder(text.id)}>取消订单并退款</a>
      ) : null}
    </Menu.Item>
    <Menu.Item key="2">
      {text.type === 1 && text.status !== -1 ? (
        <a onClick={() => hangCancelCabinetOrder(text.id)}>取消订单并退回盒柜</a>
      ) : null}
    </Menu.Item>
  </Menu>
);
const ListForm = props => {
  const { list } = props;
  const [box, setBox] = useState(undefined);
  // 函数定义 全选或反选
  const handleCheckAllChangeAll = e => {
    const checkData = [];
    const checkObj = document.querySelectorAll('.checkItem');
    if (e.target.checked) {
      checkObj.forEach(obj => {
        if (checkData.indexOf(Number(obj.value)) === -1) {
          checkData.push(Number(obj.value));
        }
        obj.checked = true;
      });
      setBox(checkData);
    } else {
      checkObj.forEach(objNull => {
        if (!checkObj.checked) {
          objNull.checked = false;
        }
      });
      setBox(undefined);
    }
  };
  // 自定义选择 单选
  const addEntries = e => {
    const boxData = box || [];
    if (boxData.indexOf(e) > -1) {
      const i = boxData.indexOf(e);
      boxData.splice(i, 1);
      setBox(boxData);
      return;
    }
    boxData.push(e);
    setBox(boxData);
  };
  // 批量打印
  const batchPrint = () => {
    const objData = [];
    box.forEach(obj => {
      list.forEach(e => {
        if (obj === e.id) {
          let sum = 0;
          e.detail.forEach(number => {
            sum += number.quantity;
          });
          e.sum = sum;
          objData.push(e);
        }
      });
    });
    let prnhtml = '';
    prnhtml += objData
      .map(text => {
        let detailHtml = '';
        detailHtml += text.detail
          .map(e => {
            const detailReturn = `<div style='border: 1px solid #f3f3f3;padding: 10px 20px;font-size: 12px;'> 
          <div style='display: flex;flex-direction:row;justify-content: space-between'>
          <span style='width: 20%;word-break: break-all;padding: 10px 0px;display: flex;align-items: center'>${e.name}</span>
          <span style='width: 20%;word-break: break-all;padding: 10px 0px;display: flex;align-items: center'>${e.quantity} </span>
          <span style='width: 20%;word-break: break-all;padding: 10px 0px;display: flex;align-items: center'>
          <img src='${e.image}' width='30px' />
          </span>
          </div>
      </div>`;
            return detailReturn;
          })
          .join('');
        return `<div style='page-break-before:always'>
        <div style='border: 1px solid #f3f3f3;padding: 10px 20px;font-size: 12px;background: #eee;'>
        <div style='display: flex;flex-direction:row;justify-content: space-between'>
        <span style='width: 20%;word-break: break-all;padding: 10px 0px;'>产品</span>
        <span style='width: 20%;word-break: break-all;padding: 10px 0px;'>数量</span>
        <span style='width: 20%;word-break: break-all;padding: 10px 0px;'>图片</span>
        </div>
        </div>${detailHtml}<br>
        <div style="line-height:2">
        <div style="font-size: 12px;margin-right: 20px">商品总数量: ${text.sum}</div>
        <div style="font-size: 12px;margin-right: 20px">订单ID: ${text.id}</div>
        <div style="font-size: 12px;">买家昵称: ${text.buyer.nickname}</div>
        <div style="font-size: 12px;">姓名: ${text.name}</div>
        <div style="font-size: 12px;">联系方式: ${text.phone}</div>
        <div style="font-size: 12px;">地址: ${text.address}</div>
        <div style="font-size: 12px;">备注: ${text.remark}</div>
        </div>
        </div>`;
      })
      .join('');
    const newWin = window.open(''); // 新打开一个空窗口
    newWin.document.body.innerHTML = prnhtml;
    newWin.document.close();
    newWin.focus();
    setTimeout(() => {
      newWin.print();
      newWin.close();
    }, 300);
  };

  // const syncErp = (e) => {
  //   console.log(e)
  // }

  return (
    <div>
      <div className={styles.formHead} id="div">
        <div style={{ width: '10%' }}>
          <Checkbox onChange={e => handleCheckAllChangeAll(e)} />
          <a disabled={!box} size="small" onClick={batchPrint}>
            {' '}
            批量打印
          </a>
        </div>
        <div className={styles.wide}>产品</div>
        <div className={styles.wide}>单价</div>
        <div className={styles.wide}>数量</div>
        <div className={styles.wide}>类型</div>
        <div className={styles.wide}>买家昵称</div>
        <div className={styles.wide}>姓名</div>
        <div className={styles.wide}>电话</div>
        <div style={{ width: '200px' }}>地址</div>
        <div className={styles.wide}>交易状态</div>
        <div style={{ float: 'right' }}>操作</div>
      </div>
      {list.map(text => {
        // const textId = text.id;
        const detailProps = (
          <div className={styles.listTitle}>
            <div className={styles.listTitleDetail}>
              <input
                className="checkItem"
                type="checkbox"
                value={text.id}
                onChange={() => addEntries(text.id)}
              />
              <span> 订单ID: {text.id} </span>
              <span> 创建时间:{moment(text.createAt * 1000).format('YYYY-MM-DD HH:mm:ss')} </span>
            </div>
            <div className={styles.listdetail}>
              <div style={{ display: 'flex', flexDirection: 'column', width: '35%' }}>
                {text.detail.map(detail => {
                  const detailText = (
                    <div
                      className={styles.detailProduct}
                      style={{ display: !detail.removed ? '' : 'none' }}
                    >
                      <div style={{ width: '25%' }}>
                        <img src={detail.image} width="50" alt="" style={{ marginBottom: '1px' }} />
                      </div>
                      <div className={styles.detailProductId} style={{ width: '25%' }}>
                        <span>{detail.name}</span>
                        <span>产品ID:{detail.product_id}</span>
                      </div>
                      <div style={{ width: '25%' }}>
                        <span>{detail.price / 100} 元</span>
                      </div>
                      <div style={{ width: '10%' }}>
                        <span>{detail.quantity}</span>
                      </div>
                    </div>
                  );
                  return detailText;
                })}
              </div>
              <div className={styles.wide}>{orderType(text.type)}</div>
              <div className={styles.wide}>
                <CustomerLink user={text.buyer} />
              </div>
              <div className={styles.wide}>{text.name}</div>
              <div className={styles.wide}>{text.phone}</div>
              <div style={{ width: '200px' }}>{text.address}</div>
              <div className={styles.wide}>{orderStatus(text.status)}</div>
              <div style={{ float: 'right', width: '100px' }}>
                <Link to={`/order/${text.id}/detail`}>详情</Link>
                <Divider type="vertical" />
                <Dropdown overlay={menu(text)}>
                  <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    <DownOutlined />
                  </a>
                </Dropdown>
              </div>
            </div>
          </div>
        );
        return detailProps;
      })}
    </div>
  );
};

export default ListForm;
