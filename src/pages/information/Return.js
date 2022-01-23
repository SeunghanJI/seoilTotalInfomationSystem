import React, { useState, useEffect } from 'react';

import { Switch, DatePicker, Select, Button, Table } from 'antd';
import dayjs from 'dayjs';

import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/';

const columns = [
  {
    title: '학과',
    dataIndex: 'deptName',
  },
  {
    title: '상태',
    dataIndex: 'status',
  },
  {
    title: '변경날짜',
    dataIndex: 'submitAt',
  },
];

const { Option } = Select;

const Return = () => {
  const [requestData, setRequestData] = useState({});
  const [reinstatementInfoList, setReinstatementInfoList] = useState([]);

  useEffect(() => {
    axios
      .get('api/academic/reinstatement')
      .then(({ data: { reinstatementInfoList } }) => {
        console.log(reinstatementInfoList);
        setReinstatementInfoList(reinstatementInfoList);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const onChange = (name, value) => {
    setRequestData({
      ...requestData,
      [name]: value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const data = { ...requestData };

    console.log(data);

    const isFullFill = ['returnYear', 'returnTerm'].every((v) => !!data[v]);

    if (!isFullFill) {
      alert('필수 입력 칸을 다 채워주세요.');
      return;
    }

    const { returnYear, returnTerm } = data;

    const body = {
      returnAt: `${returnYear}-${returnTerm}`,
    };

    axios
      .post('api/academic/reinstatement', body)
      .then(({ data: { reinstatementInfoList } }) => {
        setReinstatementInfoList(reinstatementInfoList);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <form style={{ flex: '1', marginRight: '32px' }} onSubmit={onSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <DatePicker
            onChange={(_, date) => {
              onChange('returnYear', date);
            }}
            picker="year"
            inputReadOnly={true}
            placeholder="복학 예정 년도"
            style={{ marginBottom: '16px' }}
          />
          <Select
            onChange={(value) => {
              onChange('returnTerm', value);
            }}
            style={{ marginBottom: '16px' }}
          >
            <Option value="1">1</Option>
            <Option value="2">2</Option>
          </Select>
        </div>
        <Button type="primary" htmlType="submit" block>
          신청
        </Button>
      </form>
      <div>
        <h4>진행단계</h4>
        {reinstatementInfoList.length ? (
          <Table
            columns={columns}
            pagination={false}
            dataSource={reinstatementInfoList}
            size="middle"
            rowKey="reinstatementId"
          />
        ) : (
          <div>진행 상황이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default Return;
