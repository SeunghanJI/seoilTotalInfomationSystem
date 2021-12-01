import React, { useEffect, useState } from 'react';

import LoginForm from '../../components/LoginForm';

import { useParams } from 'react-router';

import { Tabs } from 'antd';
const { TabPane } = Tabs;

const checkParentKey = (key) => {
  if (
    [
      'leave',
      'return',
      'classes',
      'evaluation',
      'lecturLookup',
      'gradeLookup',
    ].includes(key)
  ) {
    return '1';
  } else if (
    ['certificateLookup', 'helper', 'volunteer', 'record'].includes(key)
  ) {
    return '2';
  }
};

const Information = ({ isLogin, loginCallBack }) => {
  const [parentKey, setParentKey] = useState(1);
  const [childKey, setChildKey] = useState(1);

  const { target } = useParams();

  const onChangeParent = (value) => {
    setParentKey(value);
  };

  const onChangeChild = (value) => {
    setChildKey(value);
  };

  useEffect(() => {
    setParentKey(checkParentKey(target));
    setChildKey(target);
  }, [target]);

  const drawInformation = () => {
    return (
      <Tabs
        activeKey={parentKey}
        tabPosition="left"
        onChange={onChangeParent}
        defaultActiveKey="1"
      >
        <TabPane tab="학사 서비스" key="1">
          <Tabs activeKey={childKey} onChange={onChangeChild} tabPosition="top">
            <TabPane tab="입대휴학신청" key="leave">
              입대휴학신청
            </TabPane>
            <TabPane tab="복학신청" key="return">
              복학신청
            </TabPane>
            <TabPane tab="수강신청서출력" key="classes">
              수강신청서출력
            </TabPane>
            <TabPane tab="강의평가" key="evaluation">
              강의평가
            </TabPane>
            <TabPane tab="개설강좌 조회" key="lecturLookup">
              개설강좌 조회
            </TabPane>
            <TabPane tab="성적조회" key="gradeLookup">
              성적조회
            </TabPane>
          </Tabs>
        </TabPane>
        <TabPane tab="학생 서비스" key="2">
          <Tabs activeKey={childKey} tabPosition="top" onChange={onChangeChild}>
            <TabPane tab="장학증서 출력" key="certificateLookup">
              장학증서 출력
            </TabPane>
            <TabPane tab="도우미 활동" key="helper">
              도우미 활동
            </TabPane>
            <TabPane tab="해외봉사 활동" key="volunteer">
              해외봉사 활동
            </TabPane>
            <TabPane tab="취업이력사항" key="record">
              취업이력사항
            </TabPane>
          </Tabs>
        </TabPane>
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

  return <>{isLogin ? drawInformation() : drawLoginForm()}</>;
};

export default Information;
