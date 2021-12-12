import React from 'react';

import { List } from 'antd';

const ListLectures = ({ data }) => {
  return (
    <List
      size="large"
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item key={item.lectureId}>
          <List.Item.Meta
            title={item.lectureName}
            description={
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <p style={{ marginBottom: '0px' }}>{item.deptName}</p>
                <p style={{ marginBottom: '0px' }}>{item.professorName}</p>
                <p style={{ marginBottom: '0px' }}>{item.maxPersonnel}</p>
              </div>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default ListLectures;
