# 포트폴리오 웹 서비스  

소개 : 사용자의 정보를 입력한 후, 검색을 통해 다른 사용자의 포트폴리오 정보를 확인할 수 있는 포트폴리오 웹 서비스  

## 주요 사용 기술 

- Flask

- MySQL

- Javascript

- React.js (Functional Components + Hook)

- [x] **파일 내용과 사용 기술**

  ```python
  # 폴더 내용  
  hanbinsproject  
  / backend
  - api.py # flask 실행 메인 파일
  - login.py # 로그인 시 데이터 조회와 토큰 관리
  - join.py # 회원가입 시 mysql에 데이터 입력
    / migrations # 데이터 모델 버전을 담음
  
      
  / frontend  # 프론트엔드 서버 파일
    / auth
      - index.js # react-token-auth 이용한 로컬저장소 토큰관리
    / joinpage
      - joinpage.js # 회원가입 페이지
                       # Route 컴포넌트와 Content 컴포넌트로 구성
    / loginpage
      - loginpage.js # 로그인 페이지
                       # Route 컴포넌트
                       # Content 컴포넌트
              			- 로그인 여부에 따라 입력창 혹은 메인페이지로 렌더링
                  		- 아이디와 비밀번호를 입력하면 로그인 토큰을 받아옴
    / mainpage
      - mainpage.js # 메인 페이지
      				# Route 컴포넌트
          			# Content 컴포넌트  
                         - 로그아웃 클릭 시 토큰 제거   
                         - 버튼 클릭에 따라 메인컴포넌트, 네트워크컴포넌트 변환
                            (<ComponentChanger/> 컴포넌트 사용)
  - app.js # react-create-start 
  - index.js
  ```
  





# 현재 상황과 계획

![Imgur](https://imgur.com/vvdPx0i.jpg)

