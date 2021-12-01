import React from 'react';

import { Card, Button } from 'antd';

import LecturesList from '../components/main/LecturesList';
import LoginForm from '../components/LoginForm';
import Profile from '../components/Profile';
import LechuresCalendar from '../components/main/LechuresCalendar';

const Main = ({ isLogin, loginCallBack }) => {
  return (
    <div>
      <img
        src={`${process.env.PUBLIC_URL}/banner.png`}
        alt="banner"
        style={{ width: '100%', marginTop: '32px' }}
      />
      <div
        style={{
          display: 'flex',
          width: '100%',
          marginTop: '32px',
          gap: '2vw',
        }}
      >
        {isLogin && (
          <Card>
            <LecturesList></LecturesList>
          </Card>
        )}
        <Card style={{ flex: '1' }}>
          <LechuresCalendar></LechuresCalendar>
        </Card>
        <div
          style={{ display: 'flex', flexDirection: 'column', rowGap: '2vh' }}
        >
          <Card>
            {isLogin ? (
              <Profile></Profile>
            ) : (
              <LoginForm loginCallBack={loginCallBack}></LoginForm>
            )}
          </Card>
          <Card>
            <Button type="link" block>
              강의평가
            </Button>
          </Card>
          <Card>
            <Button type="link" block>
              휴학신청
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Main;
