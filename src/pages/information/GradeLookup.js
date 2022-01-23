import React, { useState, useEffect } from 'react';

import { Tabs, InputNumber, Table } from 'antd';

import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/';

const { TabPane } = Tabs;

const currentDataColumns = [
  {
    title: '과목명',
    dataIndex: 'lectureName',
  },
  {
    title: '학점',
    dataIndex: 'credit',
  },
  {
    title: '구분',
    dataIndex: 'major',
  },
  {
    title: '실점',
    dataIndex: 'grade',
  },
  {
    title: '등급',
    dataIndex: 'rank',
  },
];

const listDataColumns = [
  {
    title: '연도',
    dataIndex: 'term',
  },
  {
    title: '평점',
    dataIndex: 'gradeAvg',
  },
  {
    title: '백분율',
    dataIndex: 'percentage',
  },
];

const listDataChildColumns = [
  {
    title: '과목명',
    dataIndex: 'lectureName',
  },
  {
    title: '학점',
    dataIndex: 'credit',
  },
  {
    title: '구분',
    dataIndex: 'major',
  },
  {
    title: '실점',
    dataIndex: 'grade',
  },
  {
    title: '등급',
    dataIndex: 'rank',
  },
  {
    title: '석차',
    dataIndex: 'precedence',
  },
];

const GradeLookup = () => {
  const [currentData, setCurrentData] = useState(null);
  const [listData, setlistData] = useState(null);
  const [selectedRow, setSelectedRow] = useState({});

  useEffect(() => {
    Promise.all([
      axios.get('api/grade/current'),
      axios.get('api/grade/list'),
    ]).then(([{ data: current }, { data: list }]) => {
      setCurrentData(current);
      setlistData(list);
    });
  }, []);

  return (
    <Tabs defaultActiveKey="list">
      <TabPane tab="전 학기 성적" key="list">
        <h3>전체 성적</h3>
        <div>
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '150px 1fr',
                rowGap: '16px',
                marginBottom: '24px',
              }}
            >
              <span>이수학점</span>
              <InputNumber
                readOnly={true}
                value={listData?.cumulative?.credit}
              ></InputNumber>
              <span>평점 평균</span>
              <InputNumber
                readOnly={true}
                value={listData?.cumulative?.gradeAvg}
              ></InputNumber>
              <span>백분위</span>
              <InputNumber
                readOnly={true}
                value={listData?.cumulative?.percentage}
              ></InputNumber>
            </div>
            {listData?.semester.length ? (
              <Table
                columns={listDataColumns}
                pagination={false}
                dataSource={listData.semester}
                size="middle"
                rowKey="lectureId"
                onRow={(record, index) => {
                  return {
                    onClick: (event) => {
                      const { rowIndex = null } = selectedRow;
                      if (index === rowIndex) {
                        setSelectedRow({});
                      } else {
                        const { lectureList = [] } = record;
                        setSelectedRow({ lectureList, rowIndex: index });
                      }
                    },
                    style: {
                      ...(index === selectedRow?.rowIndex && {
                        background: '#1890ff',
                      }),
                    },
                  };
                }}
              />
            ) : null}
          </div>
          <div>
            {(selectedRow?.lectureList || []).length ? (
              <Table
                columns={listDataChildColumns}
                pagination={false}
                dataSource={selectedRow.lectureList}
                size="middle"
                rowKey="lectureId"
                style={{ marginTop: '16px' }}
              />
            ) : null}
          </div>
        </div>
      </TabPane>
      <TabPane tab="현 학기 성적" key="current">
        <h3>과목 성적</h3>
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '150px 1fr',
              rowGap: '16px',
              marginBottom: '24px',
            }}
          >
            <span>이수학점</span>
            <InputNumber
              readOnly={true}
              value={currentData?.cumulative?.credit}
            ></InputNumber>
            <span>평점 평균</span>
            <InputNumber
              readOnly={true}
              value={currentData?.cumulative?.gradeAvg}
            ></InputNumber>
            <span>백분위</span>
            <InputNumber
              readOnly={true}
              value={currentData?.cumulative?.percentage}
            ></InputNumber>
          </div>
          {currentData?.lectureList.length ? (
            <Table
              columns={currentDataColumns}
              pagination={false}
              dataSource={currentData.lectureList}
              size="middle"
              rowKey="lectureId"
            />
          ) : null}
        </div>
      </TabPane>
    </Tabs>
  );
};

export default GradeLookup;
