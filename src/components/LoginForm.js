import React, { useState } from 'react';
import { Form, Input, Button, Modal } from 'antd';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/';

const LoginForm = ({ loginCallBack }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [findPassword, setFindPassword] = useState({
    id: '',
    birthday: '',
    email: '',
  });

  const onChange = (e) => {
    const cloneData = { ...findPassword };

    const { name, value } = e.target;
    setFindPassword({ ...cloneData, [name]: value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const body = { ...findPassword };

    const isFullFill = ['id', 'birthday', 'email'].every((v) => !!body[v]);

    if (!isFullFill) {
      return;
    }

    axios
      .post('api/user/temp-password', body)
      .then(({ data: { isSend } }) => {
        setIsModalVisible(!isSend);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

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
        <div>
          <form onSubmit={onSubmit}>
            <Input
              placeholder="학번"
              name="id"
              onChange={onChange}
              style={{ marginBottom: '8px' }}
            />
            <Input
              placeholder="생년월일 8자리"
              name="birthday"
              onChange={onChange}
              style={{ marginBottom: '8px' }}
            />
            <Input
              placeholder="email"
              name="email"
              onChange={onChange}
              style={{ marginBottom: '8px' }}
            />
            <Button type="primary" htmlType="submit" block>
              임시 비밀번호 발송
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default LoginForm;
