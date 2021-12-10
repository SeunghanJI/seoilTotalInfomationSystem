import React, { useState, useEffect } from 'react';

import { Input, Avatar, Checkbox, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3000/';

const Privacy = () => {
  const [info, setInfo] = useState(null);

  const onChange = (e) => {
    const cloneData = { ...info };
    const { name } = e.target;
    const parent = (e.target.dataset || {}).parent || 'base'; //checkbox 컴포넌트에서 선택한 경우 datset을 찾을 수 없어서

    if (!cloneData[parent]) {
      cloneData[parent] = {};
    }

    switch (name) {
      case 'isAgreeCollectionData':
        {
          const { checked } = e.target;
          cloneData[parent][name] = checked;
        }
        break;
      default:
        {
          const { value } = e.target;
          cloneData[parent][name] = value;
        }
        break;
    }
    setInfo(cloneData);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const body = Object.entries({ ...info }).reduce(
      (body, [parent, childObj]) => {
        const child = Object.entries(childObj).reduce((child, [key, value]) => {
          if (!!value) {
            child[key] = value;
          }
          return child;
        }, {});

        if (JSON.stringify(child) !== '{}') {
          body[parent] = child;
        }
        return body;
      },
      {}
    );

    axios
      .patch('api/user', body)
      .then(({ data }) => {
        setInfo(data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    axios
      .get('api/user')
      .then(({ data }) => {
        setInfo(data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  return (
    <>
      {info && (
        <form onSubmit={onSubmit}>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div>
              <div>
                <h4>기본정보</h4>
                <div>
                  <div style={{ display: 'flex', marginBottom: '16px' }}>
                    <Input
                      placeholder="학번"
                      name="id"
                      value={info.base.id}
                      onChange={onChange}
                      readOnly={true}
                      data-parent="base"
                    />
                    <Input
                      placeholder="이름"
                      name="name"
                      value={info.base.name}
                      onChange={onChange}
                      style={{ margin: '0px 8px' }}
                      data-parent="base"
                    />
                    <Input
                      placeholder="학과"
                      name="depName"
                      value={info.base.deptName}
                      onChange={onChange}
                      readOnly={true}
                      data-parent="base"
                    />
                  </div>
                  <Input
                    placeholder="이메일"
                    name="email"
                    value={info.base.email}
                    onChange={onChange}
                    style={{ marginBottom: '16px' }}
                    data-parent="base"
                  />
                  <Input
                    placeholder="전화번호"
                    name="phoneNum"
                    value={info.base.phoneNum}
                    onChange={onChange}
                    style={{ marginBottom: '16px' }}
                    data-parent="base"
                  />
                </div>
              </div>
              <div>
                <h4>주민등록상 주소</h4>
                <div>
                  <Input
                    placeholder="우편번호"
                    name="zipCode"
                    onChange={onChange}
                    value={info.address.zipCode}
                    style={{ marginBottom: '16px' }}
                    data-parent="address"
                  />
                  <Input
                    placeholder="주소"
                    name="region"
                    value={info.address.region}
                    onChange={onChange}
                    style={{ marginBottom: '16px' }}
                    data-parent="address"
                  />
                  <Input
                    placeholder="상세주소"
                    name="detail"
                    onChange={onChange}
                    value={info.address.detail}
                    style={{ marginBottom: '16px' }}
                    data-parent="address"
                  />
                </div>
              </div>
              <div>
                <h4>현거주지</h4>
                <div>
                  <Input
                    placeholder="우편번호"
                    name="zipCode"
                    onChange={onChange}
                    value={info.currentAddress.zipCode}
                    style={{ marginBottom: '16px' }}
                    data-parent="currentAddress"
                  />
                  <Input
                    placeholder="주소"
                    name="region"
                    value={info.currentAddress.region}
                    onChange={onChange}
                    style={{ marginBottom: '16px' }}
                    data-parent="currentAddress"
                  />
                  <Input
                    placeholder="상세주소"
                    name="detail"
                    onChange={onChange}
                    value={info.currentAddress.detail}
                    style={{ marginBottom: '16px' }}
                    data-parent="currentAddress"
                  />
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar size={64} icon={<UserOutlined />} />
              <Checkbox
                style={{ marginTop: '16px' }}
                name="isAgreeCollectionData"
                checked={info.base.isAgreeCollectionData}
                onChange={onChange}
                data-parent="base"
              >
                개인정보 수집 및 이용에대한동의
              </Checkbox>
            </div>
          </div>
          <Button type="primary" htmlType="submit" block size="large">
            저장
          </Button>
        </form>
      )}
    </>
  );
};

export default Privacy;
