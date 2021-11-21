/*
    해당 Object에 필수로 하는 key값이 존재하는지 검사
    @param {Array} key => array형태로 검사하고 싶은 key 값
    @param {Object} data => key 값 존재 여부를 검사 할 오브젝트
    @returns boolean => 조건 만족 시 true 아니면 fasle
*/
module.exports.checkRequiredProperties = (keys, data = {}) => {
    if (!Array.isArray(keys) || !keys.length || !Object.keys(data).length) {
        return false;
    }

    const isSatisfied = keys.every(key => data.hasOwnProperty(key));
    return isSatisfied;
};

/*
    해당 String이 values에 존재하는지 검사
    @param {Array} values => array형태로 검사하고 싶은 value 값
    @param {String} data => values에 값 존재 여부를 검사할 문자열
    @returns boolean => 조건 만족 시 true 아니면 fasle
*/
module.exports.checkIncludeString = (values, data = '') => {
    if (!Array.isArray(values) || !values.length || !(typeof data == 'string') || !data.length) {
        return false;
    }

    const isSatisfied = values.includes(data);
    return isSatisfied;
};

/*
    해당 data의 value중 비어있는 값이 존재하는지 검사
    @param {Object} data => 버어있는 vlaue가 존재하는지 검사 할 오브젝트
    @returns boolean => 비어있는 값이 없으면 true 아니면 fasle
*/
module.exports.checkObjectValueEmpty = (data = {}) => {
    if (!Object.keys(data).length) {
        return false;
    }

    let isSatisfied = Object.values(data).every(value => !!value);
    return isSatisfied;
};

/*
    해당 요청이 들어온 웹 페이지에서 Cookie로 세션 추가
    @param {Object} res => 요청이 들어온 response 객체
    @param {String} session => 세션 값
*/
module.exports.setSessionCookie = (res = {}, session = '') => {
    if (!Object.keys(res).length || !session) {
        return;
    }

    res.cookie('session', session, { maxAge: 60 * 60 * 1000, httpOnly: true });
};

/*
    해당 요청이 들어온 웹 페이지에서 Cookie로 세션 삭제
    @param {Object} res => 요청이 들어온 response 객체
*/
module.exports.removeSessionCookie = (res = {}) => {
    if (!Object.keys(res).length) {
        return;
    }

    res.clearCookie('session');
};

/*
    해당 요청이 들어온 웹 페이지에서 Cookie에서 session 분리
    @returns string => cookie에서 session분리후 리턴
*/
module.exports.getSession = cookie => {
    const sessionToken = (cookie || '').split(';').reduce((sessionToken, cookie) => {
        const [key, value] = cookie.split('=');
        if (key === 'session') {
            sessionToken = value.trim();
        };

        return sessionToken;
    }, '');

    return sessionToken;
};