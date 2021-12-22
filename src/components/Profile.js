import React, { useEffect, useState } from 'react';
import { Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/';

const Profile = ({ loginCallBack }) => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    axios
      .get('api/user/simple')
      .then(({ data }) => {
        setProfileData(data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  const onClick = () => {
    axios
      .delete('api/auth/logout')
      .then(({ data: { isLogOut } }) => {
        loginCallBack(!isLogOut);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Avatar size={48} icon={<UserOutlined />} />
      {profileData && (
        <div style={{ marginTop: '16px' }}>
          <p>
            이름 : <span>{profileData.name}</span>
          </p>
          <p>
            학번 : <span>{profileData.id}</span>
          </p>
          <p>
            학과 : <span>{profileData.deptName}</span>
          </p>
        </div>
      )}
      <Button type="primary" htmlType="button" block onClick={onClick}>
        logout
      </Button>
    </div>
  );
};

export default Profile;
