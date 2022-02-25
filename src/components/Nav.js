import React from 'react';
import { Menu } from 'antd';

import { Link, useNavigate, useLocation } from 'react-router-dom';

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { pathname } = location;

  const selectKey = (() => {
    if (pathname.includes('information')) {
      return '학사정보';
    } else if (pathname.includes('profile')) {
      return '내 정보 관리';
    } else if (pathname.includes('class')) {
      return '수강신청';
    } else {
      return '';
    }
  })();

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
      <Menu mode="horizontal" selectedKeys={[selectKey]}>
        <Menu.SubMenu key="학사정보" title="학사정보">
          <Menu.ItemGroup title="학사 서비스">
            <Menu.Item key="입대휴학신청">
              <Link to="/information/leave">입대휴학신청</Link>
            </Menu.Item>
            <Menu.Item key="복학신청">
              <Link to="/information/return">복학신청</Link>
            </Menu.Item>
            <Menu.Item key="수강신청서출력">
              <Link to="/information/classes">수강신청서출력</Link>
            </Menu.Item>
            <Menu.Item key="강의평가">
              <Link to="/information/evaluation">강의평가</Link>
            </Menu.Item>
            <Menu.Item key="개설강좌 조회">
              <Link to="/information/lecturLookup">개설강좌 조회</Link>
            </Menu.Item>
            <Menu.Item key="성적조회">
              <Link to="/information/gradeLookup">성적조회</Link>
            </Menu.Item>
          </Menu.ItemGroup>
          <Menu.ItemGroup title="학생 서비스">
            <Menu.Item key="장학증서 출력">
              <Link to="/information/certificateLookup">장학증서 출력</Link>
            </Menu.Item>
            <Menu.Item key="도우미 활동">
              <Link to="/information/helper">도우미 활동</Link>
            </Menu.Item>
            <Menu.Item key="해외봉사 활동">
              <Link to="/information/volunteer">해외봉사 활동</Link>
            </Menu.Item>
            <Menu.Item key="취업이력사항">
              <Link to="/information/record">취업이력사항</Link>
            </Menu.Item>
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
        <Menu.Item key="수강신청">
          <Link to="/class">수강신청</Link>
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
