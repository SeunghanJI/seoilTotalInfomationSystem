import React, { useState, useEffect } from 'react';

import { Switch, DatePicker, Select, Button, Table } from 'antd';
import dayjs from 'dayjs';

import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/';

const { Option } = Select;

const columns = [
  {
    title: '담당교수명',
    dataIndex: 'supervisorName',
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

const LeaveAbsence = () => {
  const [requestData, setRequestData] = useState({ isMilitaryService: true });
  const [breakInfoList, setBreakInfoList] = useState([]);

  useEffect(() => {
    axios
      .get('api/academic/break')
      .then(({ data: { breakInfoList } }) => {
        setBreakInfoList(breakInfoList);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const onChange = (name, value) => {
    const clone = { ...requestData };

    switch (name) {
      case 'isMilitaryService':
        value ? (clone[name] = value) : delete clone[name];
        break;
      default:
        clone[name] = value;
        break;
    }

    setRequestData(clone);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const data = { ...requestData };
    const isFullFill = [
      'startYear',
      'endYear',
      'startTerm',
      'endTerm',
      'startMilitaryAt',
    ].every((v) => !!data[v]);

    if (!isFullFill) {
      alert('필수 입력 칸을 다 채워주세요.');
      return;
    }

    const {
      startYear,
      startTerm,
      endYear,
      endTerm,
      startMilitaryAt,
      isMilitaryService = false,
    } = data;

    const body = {
      startMilitaryAt: dayjs(startMilitaryAt).format('YYYY/MM/DD'),
      startAt: `${startYear}-${startTerm}`,
      endAt: `${endYear}-${endTerm}`,
      ...(isMilitaryService && { isMilitaryService }),
    };

    axios
      .post('api/academic/break', body)
      .then(({ data: { breakInfoList = [] } }) => {
        setBreakInfoList(breakInfoList);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <form style={{ flex: '1', marginRight: '32px' }} onSubmit={onSubmit}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <span>일반</span>
          <Switch
            style={{ marginLeft: '8px', marginRight: '8px' }}
            defaultChecked
            onChange={(checked) => {
              onChange('isMilitaryService', checked);
            }}
          />
          <span>입대</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <DatePicker
            onChange={(_, date) => {
              onChange('startYear', date);
            }}
            picker="year"
            inputReadOnly={true}
            placeholder="신청 휴학 년도"
            style={{ marginBottom: '16px' }}
          />
          <Select
            onChange={(value) => {
              onChange('startTerm', value);
            }}
            style={{ marginBottom: '16px' }}
          >
            <Option value="1">1</Option>
            <Option value="2">2</Option>
          </Select>
          <DatePicker
            onChange={(_, date) => {
              onChange('endYear', date);
            }}
            picker="year"
            inputReadOnly={true}
            placeholder="복학 예정 년도"
            style={{ marginBottom: '16px' }}
          />
          <Select
            onChange={(value) => {
              onChange('endTerm', value);
            }}
            style={{ marginBottom: '16px' }}
          >
            <Option value="1">1</Option>
            <Option value="2">2</Option>
          </Select>
          <DatePicker
            onChange={(_, date) => {
              onChange('startMilitaryAt', date);
            }}
            inputReadOnly={true}
            placeholder="입대일"
            style={{ marginBottom: '16px' }}
          />
        </div>
        <Button type="primary" htmlType="submit" block>
          신청
        </Button>
      </form>
      <div>
        <h4>진행단계</h4>
        {breakInfoList.length ? (
          <Table
            columns={columns}
            pagination={false}
            dataSource={breakInfoList}
            size="middle"
            rowKey="breakId"
          />
        ) : (
          <div>진행 상황이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default LeaveAbsence;
