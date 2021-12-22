import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3000/';

dayjs.extend(weekOfYear);

const LechuresCalendar = () => {
  const [getMoment, setMoment] = useState(dayjs());
  const [schedules, setSchedules] = useState({});
  const today = getMoment;

  useEffect(() => {
    axios
      .get(
        `api/schedule/calendar?yearMonth=${dayjs(getMoment).format('YYYYMM')}`
      )
      .then(({ data }) => {
        console.log(data);
        setSchedules(data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [getMoment]);

  const drawButton = (type) => {
    return (
      <span
        style={{ display: 'flex', alignItems: 'center' }}
        onClick={() => {
          changeMonth(type);
        }}
      >
        {type === 'prev' ? <FaArrowLeft /> : <FaArrowRight />}
      </span>
    );
  };

  const changeMonth = (type) => {
    switch (type) {
      case 'prev':
        setMoment(getMoment.clone().subtract(1, 'month'));
        break;

      case 'next':
        setMoment(getMoment.clone().add(1, 'month'));
        break;
    }
  };

  const firstWeek = today.clone().startOf('month').week();
  const lastWeek =
    today.clone().endOf('month').week() === 1
      ? 53
      : today.clone().endOf('month').week();

  const calendarArr = () => {
    let result = [];
    let week = firstWeek;
    for (week; week <= lastWeek; week++) {
      result = result.concat(
        <tr key={week}>
          {[...new Array(7)].map((_, index) => {
            const days = today
              .clone()
              .startOf('year')
              .week(week)
              .startOf('week')
              .add(index, 'day');

            const color =
              days.format('MM') !== today.format('MM') ? 'lightgray' : 'black';

            const currentDay = days.format('YYYYMMDD');
            const styleMap = {
              color,
              ...(dayjs().format('YYYYMMDD') === currentDay && {
                color: '#1890ff',
                fontWeight: 'bold',
              }),
              position: 'relative',
            };

            return (
              <td key={index} style={styleMap}>
                <span style={{ position: 'absolute', top: '10%', left: '10%' }}>
                  {days.format('D')}
                </span>
                {!!schedules[currentDay] ? (
                  <span
                    style={{
                      position: 'absolute',
                      fontSize: '0.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      bottom: '1%',
                      right: '1%',
                      color: 'black',
                      fontWeight: 'normal',
                    }}
                  >
                    <div
                      style={{
                        width: '0.4rem',
                        height: '0.4rem',
                        borderRadius: '50%',
                        background: '#1890ff',
                        marginRight: '2px',
                      }}
                    ></div>
                    {schedules[currentDay]}
                  </span>
                ) : null}
              </td>
            );
          })}
        </tr>
      );
    }
    return result;
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '32px',
        }}
      >
        {drawButton('prev')}
        <span style={{ margin: '0 10%' }}>{today.format('YYYY 년 MM 월')}</span>
        {drawButton('next')}
      </div>
      <table style={{ flex: '1', textAlign: 'center' }}>
        <thead>
          <tr>
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
              <td>{day}</td>
            ))}
          </tr>
        </thead>
        <tbody>{calendarArr()}</tbody>
      </table>
    </>
  );
};

export default LechuresCalendar;
