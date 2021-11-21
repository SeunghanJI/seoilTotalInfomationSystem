import React from 'react';
import { Table } from 'antd';

const columns = [
  {
    title: '교수명',
    dataIndex: 'name',
  },
  {
    title: '학과',
    dataIndex: 'department',
  },
  {
    title: '강의명',
    dataIndex: 'lecturesName',
  },
  {
    title: '학점',
    dataIndex: 'credit',
  },
  {
    title: '인원수',
    dataIndex: 'max',
  },
];

const data = [
  {
    key: '1',
    name: '이광형',
    department: '소프트웨어공학과',
    lecturesName: 'C언어',
    credit: 3,
    max: 16,
  },
  {
    key: '2',
    name: '고윤태',
    department: '일본어',
    lecturesName: 'AV배우',
    credit: 2,
    max: 10,
  },
  {
    key: '3',
    name: '지승한',
    department: '전기공학과',
    lecturesName: '피카츄',
    credit: 3,
    max: 50,
  },
];

const LecturesList = () => {
  return (
    <>
      <p>현 학기 강의 목록</p>
      <Table
        columns={columns}
        pagination={false}
        dataSource={data}
        size="middle"
      />
    </>
  );
};

export default LecturesList;
