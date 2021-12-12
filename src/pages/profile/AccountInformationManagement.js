import React, { useState } from 'react';

import { Input, Button } from 'antd';

import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3000/';

const AccountInformationManagement = () => {
  const [passwordInformation, setPasswordInformation] = useState({
    password: '',
    newPassword: '',
  });

  const onChange = (e) => {
    const cloneData = { ...passwordInformation };

    const { name, value } = e.target;
    setPasswordInformation({ ...cloneData, [name]: value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const body = { ...passwordInformation };
    const isFullFill = ['password', 'newPassword'].every((v) => !!body[v]);

    if (!isFullFill) {
      return;
    }

    axios
      .patch('api/user/password', body)
      .then(({ data: isChaged }) => {
        if (isChaged) {
          alert('비밀번호가 변경되었습니다.');
          setPasswordInformation({
            password: '',
            newPassword: '',
          });
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <form onSubmit={onSubmit}>
      <h3>비밀번호 재설정</h3>
      <Input.Password
        placeholder="현재 비밀번호"
        name="password"
        onChange={onChange}
        value={passwordInformation.password}
        style={{ marginBottom: '16px' }}
      />
      <Input.Password
        placeholder="변경할 비밀번호"
        name="newPassword"
        onChange={onChange}
        value={passwordInformation.newPassword}
        style={{ marginBottom: '16px' }}
      />
      <Button type="primary" htmlType="submit" block size="large">
        비밀번호 변경
      </Button>
    </form>
  );
};

export default AccountInformationManagement;
