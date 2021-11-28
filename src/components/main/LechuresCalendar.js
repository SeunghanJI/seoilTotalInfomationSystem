import React, { useState } from 'react';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

dayjs.extend(weekOfYear);

const LechuresCalendar = () => {
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

  const [getMoment, setMoment] = useState(dayjs());
  const today = getMoment;

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

            const styleMap = {
              color,
              ...(dayjs().format('YYYYMMDD') === days.format('YYYYMMDD') && {
                backgroundColor: '#1890ff',
              }),
            };

            return (
              <td key={index} style={styleMap}>
                <span>{days.format('D')}</span>
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
      <table style={{ width: '100%' }}>
        <tbody>{calendarArr()}</tbody>
      </table>
    </>
  );
};

export default LechuresCalendar;
