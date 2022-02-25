import React from 'react';
import { Table, Button } from 'antd';

const defaultColumns = [
  {
    title: '학과',
    dataIndex: 'deptName',
  },
  {
    title: '교수명',
    dataIndex: 'professorName',
  },
  {
    title: '학점',
    dataIndex: 'credit',
  },
  {
    title: '강의 시간',
    dataIndex: 'lectureDate',
  },
  {
    title: '강의명',
    dataIndex: 'lectureName',
  },
  {
    title: '전공/필수',
    dataIndex: 'major',
  },
  {
    title: '인원',
    dataIndex: 'personnel',
  },
];

const ListTable = ({ dataSource, type, handleClick, style }) => {
  console.log('type : ' + type);

  const colums = [...defaultColumns];
  colums.push({
    render: (row) => {
      return (
        <Button
          type="primary"
          danger={type === 'list' ? false : true}
          onClick={() => {
            handleClick(row);
          }}
        >
          {type === 'list' ? '추가' : '삭제'}
        </Button>
      );
    },
  });

  return (
    <Table
      style={{ ...style }}
      columns={colums}
      pagination={false}
      dataSource={dataSource}
      size="middle"
      rowKey="lectureId"
    />
  );
};

export default React.memo(ListTable);
