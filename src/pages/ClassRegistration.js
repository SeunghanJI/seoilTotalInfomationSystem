import React, { useEffect, useState, useMemo } from 'react';
import { Select, Button, Input } from 'antd';
import ListTable from '../components/class/ListTable';
import LoginForm from '../components/LoginForm';

import { objectToQueryString } from '../common';

import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/';

const { Option } = Select;

const ClassRegistration = ({ isLogin, loginCallBack }) => {
  const [dropdownData, setDropdownData] = useState(null);
  const [queries, setQueries] = useState({});

  const [availableApplication, setAvailableApplication] = useState([]);
  const [containList, setContainList] = useState([]);
  const [currentCreditTotal, setCurrentCreditTotal] = useState(0);

  useEffect(() => {
    Promise.all([
      axios.get('api/class/list'),
      axios.get('api/class/registration/list'),
    ]).then(
      ([
        { data: deptList },
        {
          data: { classRegistrationList, totalCredit },
        },
      ]) => {
        setDropdownData(deptList);
        setContainList(classRegistrationList);
        setCurrentCreditTotal(totalCredit);
      }
    );
  }, []);

  const onChange = (name, value) => {
    setQueries({
      ...queries,
      [name]: value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const clone = Object.entries({ ...queries }).reduce((acc, [k, v]) => {
      if (!!v) {
        acc[k] = v;
      }
      return acc;
    }, {});

    const queryString = objectToQueryString(clone);
    let url = 'api/class/registration';

    if (!!queryString) {
      url += `?${queryString}`;
    }

    axios.get(url).then(({ data: { classList } }) => {
      setAvailableApplication(classList);
    });
  };

  const addClass = ({ lectureId }) => {
    axios
      .post('api/class/registration', { lectureId, queries })
      .then(({ data: { classList, classRegistrationList, totalCredit } }) => {
        setAvailableApplication(classList);
        setContainList(classRegistrationList);
        setCurrentCreditTotal(totalCredit);
      })
      .catch((error) => {
        if (error.response) {
          alert(error.response.data);
        }
      });
  };

  const deleteClass = ({ lectureId }) => {
    axios
      .delete(`api/class/registration/${lectureId}`, { data: { queries } })
      .then(({ data: { classList, classRegistrationList, totalCredit } }) => {
        setContainList(classRegistrationList);
        setCurrentCreditTotal(totalCredit);
        setAvailableApplication(classList);
      });
  };

  const availableApplicationTable = useMemo(
    () =>
      availableApplication.length ? (
        <ListTable
          style={{ marginBottom: '32px' }}
          dataSource={availableApplication}
          type="list"
          handleClick={addClass}
        ></ListTable>
      ) : (
        <p>검색된 강의가 없습니다.</p>
      ),
    [availableApplication]
  );

  const containListTable = useMemo(
    () =>
      containList.length ? (
        <ListTable
          dataSource={containList}
          handleClick={deleteClass}
        ></ListTable>
      ) : (
        <p>신청한 강의가 없습니다.</p>
      ),
    [containList]
  );

  const drawLoginForm = () => {
    return (
      <div style={{ width: '60%', margin: 'auto' }}>
        <h2 style={{ textAlign: 'center' }}>로그인을 해주세요</h2>
        <LoginForm loginCallBack={loginCallBack}></LoginForm>
      </div>
    );
  };

  return (
    <>
      {isLogin ? (
        <section>
          <article>
            <form
              onSubmit={onSubmit}
              style={{ display: 'flex', marginBottom: '32px' }}
            >
              {dropdownData && (
                <Select
                  placeholder="학과"
                  value={queries.deptId}
                  name="deptId"
                  style={{ width: '100%' }}
                  onChange={(value) => {
                    onChange('deptId', value);
                  }}
                >
                  {dropdownData.map(({ deptId, deptName }) => (
                    <Option key={deptId} value={deptId}>
                      {deptName}
                    </Option>
                  ))}
                </Select>
              )}
              <Input
                placeholder="교수명"
                value={queries.professorName}
                name="professorName"
                style={{ margin: '0px 8px' }}
                onChange={(e) => {
                  const { name, value } = e.target;
                  onChange(name, value);
                }}
              />
              <Input
                placeholder="강의명"
                value={queries.lectureName}
                name="lectureName"
                style={{ margin: '0px 8px' }}
                onChange={(e) => {
                  const { name, value } = e.target;
                  onChange(name, value);
                }}
              />
              <Button type="primary" htmlType="submit">
                검색
              </Button>
            </form>
            {availableApplicationTable}
          </article>
          <article>
            <p style={{ marginBottom: '16px' }}>
              현재 담긴 학점 : {currentCreditTotal} / 21
            </p>
            {containListTable}
          </article>
        </section>
      ) : (
        drawLoginForm()
      )}
    </>
  );
};

export default ClassRegistration;
