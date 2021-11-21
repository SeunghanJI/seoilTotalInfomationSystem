import React from 'react';
import { Layout, Menu } from 'antd';

const { Header } = Layout;
const { SubMenu } = Menu;

const nav = () => {
  return (
    <Header
      theme="light"
      style={{
        padding: '0px 20px',
        width: '100%',
        display: 'flex',
        background: '#fff',
      }}
    >
      <div
        style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}
      >
        <img
          src={`${process.env.PUBLIC_URL}/logo.png`}
          style={{ height: '48px', width: '48px', marginRight: '16px' }}
          alt="logo"
        />
        서일대학교 종합정보 시스템
      </div>
      <Menu theme="light" mode="horizontal" defaultSelectedKeys={['2']}>
        <SubMenu key="SubMenu1" title="학사정보">
          <Menu.ItemGroup title="학사 서비스">
            <Menu.Item key="setting1:1">입대휴학신청</Menu.Item>
            <Menu.Item key="setting1:2">복학신청</Menu.Item>
            <Menu.Item key="setting1:3">
              계절학기(환불)신청/고지서 출력
            </Menu.Item>
            <Menu.Item key="setting1:4">교차수강신청</Menu.Item>
            <Menu.Item key="setting1:5">수강신청서출력</Menu.Item>
            <Menu.Item key="setting1:6">강의평가</Menu.Item>
          </Menu.ItemGroup>
          <Menu.ItemGroup title="학생 서비스">
            <Menu.Item key="setting2:1">장학증서 출력</Menu.Item>
            <Menu.Item key="setting2:2">도우미 활동</Menu.Item>
            <Menu.Item key="setting2:3">해외봉사 활동</Menu.Item>
            <Menu.Item key="setting2:4">취업이력사항</Menu.Item>
          </Menu.ItemGroup>
        </SubMenu>
        <SubMenu key="SubMenu2" title="E-Campus"></SubMenu>
        <SubMenu key="SubMenu3" title="NCS"></SubMenu>
        <SubMenu key="SubMenu4" title="전자출결시스템"></SubMenu>
        <SubMenu key="SubMenu5" title="수강신철"></SubMenu>
        <SubMenu key="SubMenu6" title="내 정보 관리"></SubMenu>
      </Menu>
    </Header>
  );
};

export default nav;
