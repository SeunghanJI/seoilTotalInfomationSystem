import React, { useState, useEffect } from 'react';
import { Input, Button, Card } from 'antd';
import { Select } from 'antd';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3000/';

const { Option } = Select;

const BANK_MAP = {
  하나은행: '081',
  수협: '007',
  국민은행: '004',
  SC제일은행: '023',
  산업은행: '002',
  HSBC: '054',
  기업은행: '003',
  부산은행: '032',
  우리은행: '020',
  새마을금고: '045',
  농협은행: '011',
  시티은행: '027',
  우체국: '071',
  신용협동조합: '048',
  신한은행: '088',
  상호저축은행: '050',
  외환은행: '005 ',
  도이치은행: '055',
  대구은행: '031',
  광주은행: '034',
  경남은행: '039',
  전북은행: '037',
  제주은행: '035',
  '농,축협': '012',
};

const BankAccountManagement = () => {
  const [newBankAccount, setNewBankAccount] = useState({});
  const [accountList, setAccountList] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const onClick = (accountInfo) => {
    setSelectedAccount(accountInfo);
  };

  const onChange = (name, value) => {
    setNewBankAccount({
      ...newBankAccount,
      [name]: value,
    });
  };

  useEffect(() => {
    axios
      .get('api/bank-account/list')
      .then(({ data }) => {
        setAccountList(data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const body = { ...newBankAccount };

    const isFullFill = ['bankCode', 'accountNumber', 'onwerName'].every(
      (k) => !!body[k]
    );

    if (!isFullFill) {
      return;
    }

    axios
      .post('api/bank-account', body)
      .then(({ data }) => {
        setAccountList(data);
        setNewBankAccount({});
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const onSelect = (bankAccountId) => {
    axios
      .patch('api/bank-account/main', { bankAccountId })
      .then(({ data }) => {
        setAccountList(data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const onDelete = (bankAccountId) => {
    axios
      .delete(`api/bank-account/${bankAccountId}`)
      .then(({ data }) => {
        setAccountList(data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <div>
        <h4>계좌 추가</h4>
        <form onSubmit={onSubmit}>
          <div>
            <div style={{ width: '100%', marginBottom: '16px' }}>
              <Select
                onChange={onChange.bind(this, 'bankCode')}
                style={{ width: '100%' }}
                placeholder="은행"
                value={newBankAccount.bankCode}
              >
                {Object.entries(BANK_MAP).map(([name, code]) => (
                  <Option key={code} value={code}>
                    {name}
                  </Option>
                ))}
              </Select>
            </div>
            <Input
              onChange={(e) => {
                onChange('accountNumber', e.target.value);
              }}
              style={{ width: '100%', marginBottom: '16px' }}
              placeholder="계좌 번호"
              value={newBankAccount.accountNumber}
            ></Input>
            <Input
              onChange={(e) => {
                onChange('onwerName', e.target.value);
              }}
              style={{ width: '100%', marginBottom: '16px' }}
              placeholder="예금주"
              value={newBankAccount.onwerName}
            ></Input>
          </div>
          <Button type="primary" htmlType="submit" block>
            추가
          </Button>
        </form>
      </div>
      <div>
        <h4>등록된 계좌 목록</h4>
        <div>
          {accountList.length ? (
            accountList.map((account) => (
              <div
                key={account.bankAccountId}
                onClick={() => {
                  onClick(account);
                }}
                style={{ marginBottom: '8px' }}
              >
                <Card key={account.bankAccountId} title={account.onwerName}>
                  <div
                    style={{ marginBottom: '4px' }}
                  >{`${account.bankCode} ${account.accountNumber}`}</div>
                  <div>
                    <Button
                      danger
                      onClick={onDelete.bind(this, account.bankAccountId)}
                    >
                      계좌 삭제
                    </Button>
                    {!account.isMain && (
                      <Button
                        onClick={onSelect.bind(this, account.bankAccountId)}
                        style={{ marginLeft: '8px' }}
                      >
                        주 계좌 선택
                      </Button>
                    )}
                  </div>
                </Card>
              </div>
            ))
          ) : (
            <div>계좌를 추가하세요</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankAccountManagement;
