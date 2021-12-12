import React, { useEffect, useState, useMemo } from 'react';
import { Form, Input, Button, Modal } from 'antd';
import EvaluationCard from '../../components/EvaluationCard';

import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3000/';

const Evaluation = () => {
  const [evaluationList, setEvaluationList] = useState([]);
  const [selectedLectureId, setSelectedLectureId] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswer] = useState({});

  const onSubmit = (e) => {
    e.preventDefault();

    let body = { ...answers };
    const requiredQuestions = questions.map(({ evaluationId }) => evaluationId);
    const isFullFill = requiredQuestions.every((v) => {
      return !!body[v];
    });

    if (!isFullFill) {
      return;
    }

    body = Object.entries(body).reduce((acc, [k, v]) => {
      const obj = {
        evaluationId: k,
        text: v,
      };

      acc.push(obj);
      return acc;
    }, []);

    axios
      .post(`api/evaluation/answer`, { answers: body })
      .then(({ data }) => {
        alert('제출되었습니다.');
        setEvaluationList(data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    axios
      .get(`api/evaluation/list`)
      .then(({ data }) => {
        setEvaluationList(data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  useEffect(() => {
    if (!!selectedLectureId) {
      axios
        .get(`api/evaluation?lectureId=${selectedLectureId}`)
        .then(({ data }) => {
          setQuestions(data);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }, [selectedLectureId]);

  const init = () => {
    setSelectedLectureId(null);
    setQuestions(null);
    setAnswer({});
  };

  const onChange = (e) => {
    const { name, value } = e.target;

    setAnswer({
      ...answers,
      [name]: value,
    });
  };

  const evaluations = useMemo(() => {
    return evaluationList.map((item) => {
      const props = { ...item, handleClick: setSelectedLectureId };
      return <EvaluationCard key={item.lectureId} {...props}></EvaluationCard>;
    });
  }, [evaluationList, selectedLectureId, questions, answers]);

  return (
    <div>
      <h3>강의평가 목록</h3>
      {evaluationList.length ? evaluations : null}
      <Modal
        title="강의 평가"
        visible={!!selectedLectureId}
        footer={null}
        onCancel={() => {
          init();
        }}
      >
        <div>
          <form onSubmit={onSubmit}>
            {questions &&
              questions.map((q) => {
                const { evaluationId, question } = q;
                return (
                  <div style={{ marginBottom: '16px' }}>
                    <h5>{question}</h5>
                    <Input
                      name={evaluationId}
                      value={answers[evaluationId]}
                      onChange={onChange}
                    ></Input>
                  </div>
                );
              })}
            <Button type="primary" htmlType="submit" block>
              강의 평가 제출
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Evaluation;
