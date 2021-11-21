import React from 'react';

import { Card } from 'antd';

import LecturesList from '../components/main/LecturesList';

const Main = () => {
  return (
    <div>
      <img src={`${process.env.PUBLIC_URL}/banner.png`} alt="banner" />
      <div style={{ display: 'flex', width: '100%' }}>
        <Card>
          <LecturesList></LecturesList>
        </Card>
        <Card>
          <p>학사일정 달력</p>
        </Card>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Card>로그인 폼</Card>
          <Card>강의평가</Card>
          <Card>휴학신청</Card>
        </div>
      </div>
    </div>
  );
};

export default Main;
