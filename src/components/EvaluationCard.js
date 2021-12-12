import React from 'react';
import { Card } from 'antd';

const EvaluationCard = (props) => {
  const {
    lectureId,
    lectureName,
    handleClick,
    professorName,
    week,
    day,
    time,
    isSubmit = false,
  } = props;

  return (
    <div
      onClick={() => !!handleClick && !isSubmit && handleClick(lectureId)}
      style={{ ...(isSubmit && { opacity: '0.3' }) }}
    >
      <Card key={lectureId} title={lectureName}>
        <div style={{ display: 'flex' }}>
          <p style={{ marginRight: 'auto' }}>{professorName}</p>
          <p>{week}</p>
          <p>({day})</p>
          <p>{time}</p>
        </div>
      </Card>
    </div>
  );
};

export default EvaluationCard;
