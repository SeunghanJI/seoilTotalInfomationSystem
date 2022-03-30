### 1. 프로젝트 목적
> - 학교의 종합 정보시스템을 개선해서 만들어보기

### 2. 프로젝트를 시작하는 방법
> - npm install을 이용하여 모듈 설치
> - npm run start를 사용하여 Web, Server 동시 실행

### 3. 사용한 모듈, 외부 리소스
> - Front-end
>   - antd
>   - axios
>   - react-router-dom

> - Back-end
>   - dotenv
>   - express
>   - knex
>   - nodemailer
>   - sqlite3
 
> - 공통
>   - dayjs

### 4. 폴더 구조

#### Web
---
```
📦src
 ┣ 📂components
 ┃ ┣ 📂class
 ┃ ┃ ┗ 📜ListTable.js
 ┃ ┣ 📂main
 ┃ ┃ ┣ 📜LechuresCalendar.js
 ┃ ┃ ┗ 📜LecturesList.js
 ┃ ┣ 📜EvaluationCard.js
 ┃ ┣ 📜ListLectures.js
 ┃ ┣ 📜LoginForm.js
 ┃ ┣ 📜Nav.js
 ┃ ┗ 📜Profile.js
 ┣ 📂pages
 ┃ ┣ 📂information
 ┃ ┃ ┣ 📜Evaluation.js
 ┃ ┃ ┣ 📜GradeLookup.js
 ┃ ┃ ┣ 📜Information.js
 ┃ ┃ ┣ 📜LeaveAbsence.js
 ┃ ┃ ┣ 📜LecturLookup.js
 ┃ ┃ ┗ 📜Return.js
 ┃ ┣ 📂profile
 ┃ ┃ ┣ 📜AccountInformationManagement.js
 ┃ ┃ ┣ 📜BankAccountManagement.js
 ┃ ┃ ┣ 📜Privacy.js
 ┃ ┃ ┗ 📜Profile.js
 ┃ ┣ 📜ClassRegistration.js
 ┃ ┣ 📜Main.js
 ┃ ┗ 📜NotFound.js
 ┣ 📜App.css
 ┣ 📜App.js
 ┣ 📜common.js
 ┣ 📜config.js
 ┣ 📜index.js
 ┣ 📜routes.js
 ┗ 📜setupProxy.js
 ```
 
#### Server
---
```
📦server
 ┣ 📂api
 ┃ ┣ 📂academic
 ┃ ┃ ┗ 📜index.js
 ┃ ┣ 📂auth
 ┃ ┃ ┗ 📜index.js
 ┃ ┣ 📂bankAccount
 ┃ ┃ ┗ 📜index.js
 ┃ ┣ 📂class
 ┃ ┃ ┗ 📜index.js
 ┃ ┣ 📂evaluation
 ┃ ┃ ┗ 📜index.js
 ┃ ┣ 📂grade
 ┃ ┃ ┗ 📜index.js
 ┃ ┣ 📂lecture
 ┃ ┃ ┗ 📜index.js
 ┃ ┣ 📂schedule
 ┃ ┃ ┗ 📜index.js
 ┃ ┣ 📂user
 ┃ ┃ ┗ 📜index.js
 ┃ ┗ 📜api.js
 ┣ 📂db
 ┣ 📜common.js
 ┣ 📜errors.js
 ┣ 📜index.js
 ┗ 📜utils.js
 ```


### 5. 프로젝트 사진

#### 메인
---
![메인](https://user-images.githubusercontent.com/94745651/159723525-7a42ae9b-2134-476b-99c8-b84ec1d0559d.png)
#### 로그인 시 메인
---
![로그인 시 메인](https://user-images.githubusercontent.com/94745651/159723635-9f6865b5-dfdb-4932-8a74-d36ed8177f7c.png)
#### 수강 신청
---
![수강신청](https://user-images.githubusercontent.com/94745651/159723721-4e7e18e2-7a46-4523-af1d-157b289a410d.png)
#### 내 정보 관리>개인 정보 관리
---
![내 정보 관리_개인정보 관리](https://user-images.githubusercontent.com/94745651/159723804-b87049e1-4e3c-4583-b0a4-c90bb50d0eaa.png)
#### 내 정보 관리>계정 정보 관리
---
![내 정보 관리_계정 정보 관리](https://user-images.githubusercontent.com/94745651/159723903-ac993315-8d44-41ec-9ebf-80c5b4dfd447.png)
#### 내 정보 관리>장학금 계좌 관리
---
![내 정보 관리_장학금 계좌 관리](https://user-images.githubusercontent.com/94745651/159724003-8d5fff25-97a3-4569-aa5a-a56b1e73a828.png)
#### 내 정보 관리>장학금 계좌 관리
---
![내 정보 관리_장학금 계좌 관리](https://user-images.githubusercontent.com/94745651/159724003-8d5fff25-97a3-4569-aa5a-a56b1e73a828.png)
#### 학사 서비스>개설 강좌 조회
---
![학사서비스_개설 강좌 조회](https://user-images.githubusercontent.com/94745651/159725998-eb9a0c98-a32d-4607-93e3-450470730f46.png)
#### 학사 서비스>복학 신청
---
![학사서비스_복학신청](https://user-images.githubusercontent.com/94745651/159726084-c112eece-4e3f-448f-baaf-0f9012b274a6.png)
#### 학사 서비스>입대 휴학 신청
---
![학사서비스_학생 입대 휴학 신청](https://user-images.githubusercontent.com/94745651/159726127-71047fda-c73a-420a-b125-b61beb29ca8c.png)
#### 학사 서비스>전 학기 성적 조회
---
![학사서비스_전 학기 성적](https://user-images.githubusercontent.com/94745651/159724593-bdf9eadf-88e3-4254-bab6-f7303c66426a.png)
#### 학사 서비스>현 학기 성적 조회
---
![학사서비스_현 학기 성적](https://user-images.githubusercontent.com/94745651/159724657-9bfc3e85-a009-4fc0-a3f8-bd85cc83f4ca.png)
#### 학사 서비스>강의 평가
---
![학사서비스_강의평가](https://user-images.githubusercontent.com/94745651/159724729-2e5ad319-ccea-4319-af3b-c1956e6f3af5.png)
#### 학사 서비스>강의 평가 제출
---
![학사서비스_강의평가제출](https://user-images.githubusercontent.com/94745651/159724779-43141e8b-89ad-48eb-847a-1d71cfa70c9f.png)

### 6. 기능
> - 로그인
> - 비밀번호 찾기
> - 비밀번호 재설정
> - 내 정보 수정
> - 장학금 계좌 관리
> - 수강 신청
> - 강의 평가
> - 개설 강좌 조회
> - 복학 신청
> - 입대 휴학 신청
> - 현, 전 학기 성적 조회













