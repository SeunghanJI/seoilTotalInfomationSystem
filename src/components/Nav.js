import React from 'react';
import { Menu } from 'antd';

import { useNavigate } from 'react-router-dom';

const Nav = () => {
  const navigate = useNavigate();

  const openNewWindow = (type) => {
    const URL = (() => {
      switch (type) {
        case 'E-Campus': {
          return 'https://ecampus.seoil.ac.kr/local/intro/main.php';
        }
        case 'NCS': {
          return 'https://ncs.seoil.ac.kr/';
        }
        case '전자출결시스템': {
          return 'https://attend.seoil.ac.kr/';
        }
        case '수강신청': {
          return 'https://sugang.seoil.ac.kr/';
        }

        default:
          return null;
      }
    })();

    if (URL) {
      window.open(URL, '_blank');
    }
  };

  return (
    <>
      <div
        style={{
          float: 'left',
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          fontSize: '14px',
          fontWeight: 'bold',
        }}
        onClick={() => {
          navigate('/');
        }}
      >
        <img
          src={`${process.env.PUBLIC_URL}/logo.png`}
          style={{ height: '48px', width: '48px', marginRight: '16px' }}
          alt="logo"
        />
        서일대학교 종합정보 시스템
      </div>
      <Menu mode="horizontal">
        <Menu.SubMenu key="학사정보" title="학사정보">
          <Menu.ItemGroup title="학사 서비스">
            <Menu.Item key="입대휴학신청">입대휴학신청</Menu.Item>
            <Menu.Item key="복학신청">복학신청</Menu.Item>
            <Menu.Item key="수강신청서출력">수강신청서출력</Menu.Item>
            <Menu.Item key="강의평가">강의평가</Menu.Item>
            <Menu.Item key="개설강좌 조회">개설강좌 조회</Menu.Item>
            <Menu.Item key="성적조회">성적조회</Menu.Item>
          </Menu.ItemGroup>
          <Menu.ItemGroup title="학생 서비스">
            <Menu.Item key="장학증서 출력">장학증서 출력</Menu.Item>
            <Menu.Item key="도우미 활동">도우미 활동</Menu.Item>
            <Menu.Item key="해외봉사 활동">해외봉사 활동</Menu.Item>
            <Menu.Item key="취업이력사항">취업이력사항</Menu.Item>
          </Menu.ItemGroup>
        </Menu.SubMenu>
        <Menu.Item
          key="E-Campus"
          onClick={() => {
            openNewWindow('E-Campus');
          }}
        >
          E-Campus
        </Menu.Item>
        <Menu.Item
          key="NCS"
          onClick={() => {
            openNewWindow('NCS');
          }}
        >
          NCS
        </Menu.Item>
        <Menu.Item
          key="전자출결시스템"
          onClick={() => {
            openNewWindow('전자출결시스템');
          }}
        >
          전자출결시스템
        </Menu.Item>
        <Menu.Item
          key="수강신청"
          onClick={() => {
            openNewWindow('수강신청');
          }}
        >
          수강신청
        </Menu.Item>
        <Menu.Item
          key="내 정보 관리"
          onClick={() => {
            navigate('/profile');
          }}
        >
          내 정보 관리
        </Menu.Item>
      </Menu>
    </>
  );
};

export default Nav;
