const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

const API = require('./api/api');
app.use('/api', API);

const apiRequestTest = () => {
    const request = require("request");

    //GET도 따로 쿼리스트링 만들 필요 x body에 객체 형태로 key : value 형태면 알아서 밑에서 생성
    const options = {
        uri: 'http://localhost:3001/api/',
        method: 'POST', //GET, POST, PATCH, DELETE
        body: {

        },
        json: true //json으로 보낼경우 true로 해주어야 header값이 json으로 설정됩니다.
        //res.header값 설정
        //,headers: {
        //  Cookie:'session=4WvweajugPOeiC8L27yRBvVMtdJ2Btpm',
        //}
    };


    //method가 GET일 때 body를 uri에 쿼리스트링으로 만들어주기 위한 함수
    if (options.method === 'GET') {
        const queries = Object.entries(options.body || {}).reduce((queries, [k, v]) => {
            queries.push(`${k}=${v}`);
            return queries;
        }, []);

        delete options.body;

        if (queries.length) {
            options.uri += `?${queries.join('&')}`;
        }
    }

    console.log('options : %j', options);

    request(options, (err, response, body) => {
        //결과 상태 코드 보기 response.statusCode
        //결과 값 보기 body
        //console.log(body);
    });

};

//apiRequestTest();

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
});