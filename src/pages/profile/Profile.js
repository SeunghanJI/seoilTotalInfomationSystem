import React from 'react';

import LoginForm from '../../components/LoginForm';
import Privacy from './Privacy';

import { Tabs } from 'antd';
const { TabPane } = Tabs;

const Profile = ({ isLogin, loginCallBack }) => {
  const drawProfile = () => {
    return (
      <Tabs defaultActiveKey="1" tabPosition="left">
        <TabPane tab="개인정보 관리 (현)개인신상카드" key="1">
          <Privacy></Privacy>
        </TabPane>
        <TabPane tab="장학금 계좌 관리" key="2"></TabPane>
        <TabPane tab="계정 정보관리" key="3"></TabPane>
      </Tabs>
    );
  };

  const drawLoginForm = () => {
    return (
      <div style={{ width: '60%', margin: 'auto' }}>
        <h2 style={{ textAlign: 'center' }}>로그인을 해주세요</h2>
        <LoginForm loginCallBack={loginCallBack}></LoginForm>
      </div>
    );
  };

  return <>{isLogin ? drawProfile() : drawLoginForm()}</>;
};

export default Profile;
