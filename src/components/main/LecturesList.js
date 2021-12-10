import React, { useEffect, useState } from 'react';
import { Table } from 'antd';

import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3000/';

const columns = [
  {
    title: '교수명',
    dataIndex: 'professorName',
  },
  {
    title: '학과',
    dataIndex: 'deptName',
  },
  {
    title: '강의명',
    dataIndex: 'lectureName',
  },
  {
    title: '학점',
    dataIndex: 'credit',
  },
  {
    title: '인원수',
    dataIndex: 'maxPersonnel',
  },
];

const LecturesList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get('api/lecture/user')
      .then(({ data }) => {
        console.log(data);
        setData(data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  return (
    <>
      <p>현 학기 강의 목록</p>
      {data.length ? (
        <Table
          columns={columns}
          pagination={false}
          dataSource={data}
          size="middle"
          rowKey="lectureId"
        />
      ) : null}
    </>
  );
};

export default LecturesList;
