import React, { useState } from 'react';
import { DatePicker, Select, Button } from 'antd';

import ListLectures from '../../components/ListLectures';

import { objectToQueryString } from '../../common';

import dayjs from 'dayjs';

import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/';

const { Option } = Select;

const LecturLookup = () => {
  const [year, setYear] = useState(dayjs().format('YYYY'));
  const [term, setTerm] = useState('1');
  const [listLectures, setListLectures] = useState([]);

  const dateChange = (date, dateString) => {
    setYear(dateString);
  };

  const selectChange = (value) => {
    setTerm(value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const query = objectToQueryString({
      year,
      term,
    });

    axios
      .get(`api/lecture?${query}`)
      .then(({ data }) => {
        console.log(data);
        setListLectures(data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <DatePicker
          onChange={dateChange}
          picker="year"
          inputReadOnly={true}
          defaultValue={dayjs()}
        />
        <Select
          defaultValue={term}
          onChange={selectChange}
          style={{ margin: '0 8px' }}
        >
          <Option value="1">1</Option>
          <Option value="2">2</Option>
        </Select>
        <Button type="primary" htmlType="submit">
          검색
        </Button>
      </form>
      <div style={{ marginTop: '32px' }}>
        {listLectures.length ? (
          <ListLectures data={listLectures}></ListLectures>
        ) : (
          <div>검색된 항목이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default LecturLookup;
