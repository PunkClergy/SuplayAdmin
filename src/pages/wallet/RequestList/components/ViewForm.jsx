import React, { useEffect } from 'react';
import { Form, Input, Modal } from 'antd';

const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const ViewForm = props => {
  const [form] = Form.useForm();
  const { product, modalVisible, onSubmit: handleAddStock, onCancel } = props;

  useEffect(() => {
    if (modalVisible) {
      form.resetFields();
    }
  }, [modalVisible]);

  const okHandle = async () => {
    handleAddStock();
    // form.resetFields();
  };

  return (
    <Modal
      destroyOnClose
      maskClosable={false}
      title={product.status === 2 ? '拒绝' : '通过'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form
        name="name"
        form={form}
        {...formLayout}
        initialValues={{ id: product.id, status: product.status }}
      >
        <Form.Item label="ID" name="id">
          <Input disabled />
        </Form.Item>
        {product.status === 1 ? (
          <Form.Item label="付款凭证">
            {product.images
              ? product.images.map((e, index) => {
                  const img = (
                    <div>
                      <a href={e} target="_blank" rel="noopener noreferrer">
                        付款凭证 {index + 1}
                      </a>
                    </div>
                  );
                  return img;
                })
              : ''}
          </Form.Item>
        ) : (
          ''
        )}
        <Form.Item label="备注">
          <span>{product.reason ? product.reason : '空'}</span>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ViewForm;
