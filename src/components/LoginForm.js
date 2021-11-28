import React, { useState } from 'react';
import { Form, Input, Button, Modal } from 'antd';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/';

const LoginForm = ({ loginCallBack }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onFinish = (body) => {
    console.log(body);

    axios
      .post('api/auth/login', body)
      .then(({ data: { isLogin } }) => {
        console.log(isLogin);
        loginCallBack(isLogin);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const findIDAndPassword = () => {
    setIsModalVisible(true);
  };

  return (
    <>
      <Form name="basic" onFinish={onFinish} autoComplete="off">
        <Form.Item
          name="id"
          rules={[
            {
              required: true,
              message: 'Please input your id!',
            },
          ]}
        >
          <Input placeholder="ID" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password placeholder="PASSWORD" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            login
          </Button>
        </Form.Item>
        <Button type="link" block onClick={findIDAndPassword}>
          비밀번호 찾기
        </Button>
      </Form>
      <Modal
        title="비밀번호 찾기"
        visible={isModalVisible}
        footer={null}
        onCancel={() => {
          setIsModalVisible(false);
        }}
      >
        <div>비밀번호 찾기 방법 구상 좀</div>
      </Modal>
    </>
  );
};

export default LoginForm;
