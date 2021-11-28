import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const Profile = () => {
  return (
    <div>
      <Avatar size={48} icon={<UserOutlined />} />
      <div>
        <p>
          이름 : <span>지승한</span>
        </p>
        <p>
          학번 : <span>201800001</span>
        </p>
      </div>
    </div>
  );
};

export default Profile;
