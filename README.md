# 🌱 키즈링크
![썸네일](./docs/assets/images/thumbnail.PNG)

## 💛 프로젝트 소개

<b>부모님</b>, 등하원 버스 위치를 실시간으로 확인할 수 있다면 얼마나 안심이 될까요? <br/> 상담 때문에 유치원에 방문하는 것이 부담되지 않나요?

<b>선생님</b>, 학부모의 갑질로 인한 스트레스, 어떻게 해결할 수 있을까요? <br/>  매일 수백 장의 사진을 일일이 분류하느라 힘드시지 않나요?

이제 키즈링크로 모든 걱정을 덜어보세요! 키즈링크와 함께라면 유치원 생활이 더 안전하고 편리해집니다😄

[배포 링크 🔗](https://www.kidslink.xyz/)

## 💛 프로젝트 기간
2024.07.01 ~ 2024.08.16 (7주)


## 💛 주요 기능

- **사진분류**
  - **Deepface AI**로 아이별 사진분류
  - 잘못 분류된 사진은 드래그앤드롭으로 수동 수정 가능
  - 분류한 사진은 학부모에게 전송하여 앨범에 저장
  - 아이별 누적 사진 개수를 계산하여 학부모 불만을 사전에 예방

- **화상상담 예약**
  - 선생님이 상담 가능 시간을 open하면, 학부모가 해당 시간에 상담 신청
  - **백트래킹 알고리즘**으로 최대한 많은 학부모와 상담할 수 있도록 자동 일정 조율

- **화상상담**
  - **openVidu**로 실시간 화상상담
  - 상담 중 발생하는 폭언, 욕설을 감지하여 자동으로 녹화 시작
  - 상담 종료 후 녹화 파일 다운로드

- **등하원관리**
  - **웹소켓**으로 등하원 버스 실시간 위치 확인
  - 정류장별 체크리스트로 등하원 여부 관리

- **알림장**
  - 온라인으로 작성하는 알림장

- **성장일지**
  - 학부모들에게 아이의 하루 기록을 전달

- **서류관리**
  - 투약 신청서 및 결석 사유서 등 서류 내역을 제출하고 관리

- **일정관리**
  - 학사일정 및 화상상담 일정, 개인 일정 관리

## 💛 기술 스택

### **Backend - Spring**

<img src="https://img.shields.io/badge/IntelliJ IDEA-000000?style=for-the-badge&logo=IntelliJ IDEA&logoColor=white"> 
<img src="https://img.shields.io/badge/SpringBoot_3.3.1-6DB33F?style=for-the-badge&logo=Spring Boot&logoColor=white">
<img src="https://img.shields.io/badge/Spring Data JPA-6DB33F?style=for-the-badge&logo=&logoColor=white">
<img src="https://img.shields.io/badge/Spring Security-6DB33F?style=for-the-badge&logo=Spring Security&logoColor=white">
<img src="https://img.shields.io/badge/Spring Web-6DB33F?style=for-the-badge&logo=&logoColor=white">
<img src="https://img.shields.io/badge/WebSocket-000000?style=for-the-badge&logo=&logoColor=white">
<img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=Redis&logoColor=white">
<img src="https://img.shields.io/badge/Thumbnailator-000000?style=for-the-badge&logo=&logoColor=white">
<img src="https://img.shields.io/badge/Swagger_annotation_2.2.22-85EA2D?style=for-the-badge&logo=Swagger&logoColor=white">
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white">
<img src="https://img.shields.io/badge/AWS S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white">
<img src="https://img.shields.io/badge/Openvidu_2.30.0-232F3E?style=for-the-badge&logo=&logoColor=white">

### **Backend - Flask**

<img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=Flask&logoColor=white">
<img src="https://img.shields.io/badge/face_recognition-000000?style=for-the-badge&logo=&logoColor=white">
<img src="https://img.shields.io/badge/numpy-013243?style=for-the-badge&logo=numpy&logoColor=white">
<img src="https://img.shields.io/badge/dlib-000000?style=for-the-badge&logo=&logoColor=white">
<img src="https://img.shields.io/badge/sklearn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white">

### **Frontend**

<img src="https://img.shields.io/badge/Visual Studio Code-007ACC?style=for-the-badge&logo=Visual Studio Code&logoColor=white">
<img src="https://img.shields.io/badge/Node.js_20.15.0-339933?style=for-the-badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/Vite_5.3.1-646CFF?style=for-the-badge&logo=Vite&logoColor=white">
<img src="https://img.shields.io/badge/React_18.3.1-61DAFB?style=for-the-badge&logo=React&logoColor=white">
<img src="https://img.shields.io/badge/Typescript_5.2.2-3178C6?style=for-the-badge&logo=Typescript&logoColor=white">
<img src="https://img.shields.io/badge/Tailwind CSS_3.4.4-06B6D4?style=for-the-badge&logo=Tailwind CSS&logoColor=white">
<img src="https://img.shields.io/badge/zustand-000000?style=for-the-badge&logo=&logoColor=white">
<img src="https://img.shields.io/badge/Openvidu_2.30.0-232F3E?style=for-the-badge&logo=&logoColor=white">
<img src="https://img.shields.io/badge/Kakao Map API-FFCD00?style=for-the-badge&logo=&logoColor=black">
<img src="https://img.shields.io/badge/WebSocket-000000?style=for-the-badge&logo=&logoColor=white">
<img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=Three.js&logoColor=white">

### **CI/CD**

<img src="https://img.shields.io/badge/AWS EC2-232F3E?style=for-the-badge&logo=Amazon AWS&logoColor=white">
<img src="https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=Jenkins&logoColor=white">
<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=white">
<img src="https://img.shields.io/badge/Docker Compose-2496ED?style=for-the-badge&logo=Docker&logoColor=white">
<img src="https://img.shields.io/badge/NGINX-009639?style=for-the-badge&logo=NGINX&logoColor=white">
<img src="https://img.shields.io/badge/SSL-000000?style=for-the-badge&logo=&logoColor=white">

### **Communication**

<img src="https://img.shields.io/badge/Git(Gitlab)-FCA121?style=for-the-badge&logo=Gitlab&logoColor=white">
<img src="https://img.shields.io/badge/Jira-0052CC?style=for-the-badge&logo=Jira&logoColor=white">
<img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white">
<img src="https://img.shields.io/badge/Mattermost-0058CC?style=for-the-badge&logo=Mattermost&logoColor=white">
<img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=Figma&logoColor=white">



## 💛 프로젝트 폴더 구조
### Back-end
<details>
  <summary>펼쳐보기</summary>
  
  ```plantext
  KidsLink.
  ├───java
  │   └───com
  │   └───ssafy
  │   └───kidslink
  │   ├───application
  │   │   ├───album
  │   │   │    ├───controller
  │   │   │    ├───domain
  │   │   │    ├───dto
  │   │   │    ├───mapper
  │   │   │    ├───repository
  │   │   │    └───service
  │   │   ├───bus
  │   │   │    ├───controller
  │   │   │    ├───domain
  │   │   │    ├───dto
  │   │   │    ├───repository
  │   │   │    └───service
  │   │   ├───child
  │   │   │    ├───controller
  │   │   │    ├───domain
  │   │   │    ├───dto
  │   │   │    ├───mapper
  │   │   │    ├───repository
  │   │   │    └───service
  │   │   ├───diary
  │   │   │    ├───controller
  │   │   │    ├───domain
  │   │   │    ├───dto
  │   │   │    ├───mapper
  │   │   │    ├───repository
  │   │   │    └───service
  │   │   ├───document
  │   │   │    ├───controller
  │   │   │    ├───domain
  │   │   │    ├───dto
  │   │   │    ├───mapper
  │   │   │    ├───repository
  │   │   │    └───service
  │   │   ├───image
  │   │   │    ├───controller
  │   │   │    ├───domain
  │   │   │    ├───dto
  │   │   │    ├───mapper
  │   │   │    ├───repository
  │   │   │    └───service
  │   │   ├───imagealbum
  │   │   │    ├───domain
  │   │   │    └───repository
  │   │   ├───kindergarten
  │   │   │    ├───controller
  │   │   │    ├───domain
  │   │   │    ├───dto
  │   │   │    ├───mapper
  │   │   │    ├───repository
  │   │   │    └───service
  │   │   ├───meeting
  │   │   │    ├───controller
  │   │   │    ├───domain
  │   │   │    ├───dto
  │   │   │    ├───mapper
  │   │   │    ├───repository
  │   │   │    └───service
  │   │   ├───noticeboard
  │   │   │    ├───controller
  │   │   │    ├───domain
  │   │   │    ├───dto
  │   │   │    ├───mapper
  │   │   │    ├───repository
  │   │   │    └───service
  │   │   ├───notification
  │   │   │    ├───controller
  │   │   │    ├───domain
  │   │   │    ├───dto
  │   │   │    ├───mapper
  │   │   │    ├───repository
  │   │   │    └───service
  │   │   ├───parent
  │   │   │    ├───controller
  │   │   │    ├───domain
  │   │   │    ├───dto
  │   │   │    ├───mapper
  │   │   │    ├───repository
  │   │   │    └───service
  │   │   ├───schedule
  │   │   │    ├───controller
  │   │   │    ├───domain
  │   │   │    ├───dto
  │   │   │    ├───mapper
  │   │   │    ├───repository
  │   │   │    └───service
  │   │   └───teacher
  │   │        ├───controller
  │   │        ├───domain
  │   │        ├───dto
  │   │        ├───mapper
  │   │        ├───repository
  │   │        └───service
  │   ├───common
  │   │   ├───controller
  │   │   ├───dto
  │   │   ├───enums
  │   │   ├───exception
  │   │   ├───jwt
  │   │   ├───oauth2
  │   │   ├───redis
  │   │   ├───repository
  │   │   ├───security
  │   │   ├───service
  │   │   ├───storage
  │   │   ├───util
  │   │   └───websocket
  │   └───config
  └───resources
      └───static
          └───profiles
  ```
</details>

### Front-end
<details>
<summary>펼쳐보기</summary>

```plantext
KidsLink.
  ├───node_modules
  ├───public
  ├───api
  │   └───token
  ├───assets
  │   ├───common
  │   ├───join
  │   ├───parent
  │   │   ├───emoji
  │   │   └───meeting
  │   └───teacher
  ├───components
  │   ├───common
  │   ├───join
  │   │   └───form
  │   ├───login
  │   ├───meeting
  │   ├───openvidu
  │   ├───parent
  │   │   ├───album
  │   │   ├───bus
  │   │   ├───common
  │   │   ├───document
  │   │   ├───growth
  │   │   ├───main
  │   │   ├───meeting
  │   │   └───notice
  │   └───teacher
  │       ├───album
  │       ├───bus
  │       ├───common
  │       ├───consulting
  │       ├───document
  │       ├───growth
  │       ├───main
  │       ├───notice
  │       ├───ourclass
  │       ├───schedule
  │       └───support
  ├───hooks
  │   └───teacher
  ├───layouts
  ├───pages
  │   ├───common
  │   ├───parent
  │   └───teacher
  ├───stores
  ├───types
  └───utils
      ├───parent
      └───teacher
```
</details>

## 💛 팀원 소개
| ![김범수](https://avatars.githubusercontent.com/u/121588874?&v=4) | ![이상민](https://avatars.githubusercontent.com/u/134148399?v=4) | ![김지원](https://avatars.githubusercontent.com/u/102503653?v=4) | ![김민선](https://avatars.githubusercontent.com/u/76653033?v=4) | ![김여준](https://avatars.githubusercontent.com/u/151982401?v=4) | ![정현수](https://avatars.githubusercontent.com/u/109744927?v=4) |
|---------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| 김범수([@Kimbumsoo99](https://github.com/Kimbumsoo99)) | 이상민([@sangmin0806](https://github.com/sangmin0806)) | 김지원([@wonxxikim](https://github.com/wonxxikim)) | 김민선([@minseonkkim](https://github.com/minseonkkim)) | 김여준([@junjunclub](https://github.com/junjunclub)) | 정현수([@surina125](https://github.com/surina125)) |
| Leader / Back End | Back End | Back End | Front End | Front End | Front End |

## 💛 협업 방식

- Git
  - [브랜치 전략 🔗](https://topaz-planet-38b.notion.site/Commit-branch-conventions-0218d4baf6c14dd992c6e39b914df28f)
  - MR시, 팀원이 코드리뷰를 진행하고 피드백 게시

- JIRA
  - 작업 단위에 따라 `Epic-Story-Task` 분류
  - 매주 목표량을 설정하여 Sprint 진행
  - 업무의 할당량을 정하여 Story Point를 설정하고, In-Progress -> Done 순으로 작업

- 회의
  - 데일리 스크럼 10시 전날 목표 달성량과 당일 업무 브리핑
  - 문제 상황 1시간 이상 지속 시 MatterMost 메신저를 활용한 공유 및 도움 요청

- Notion
  - 회의록 기록하여 보관
  - 컨벤션, 트러블 슈팅, 개발 산출물 관리
  - GANTT CHART 관리

## 💛 프로젝트 산출물

- [요구사항명세서](./docs/요구사항명세서.md)
- [기능명세서](./docs/기능명세서.md)
- [와이어프레임](./docs/와이어프레임.md)
- [API명세서](./docs/API명세서.md)
- [ERD](./docs/ERD.md)
- [목업](./docs/목업.md)
- [아키텍처](./docs/아키텍처.md)

## 💛 프로젝트 결과물

- [포팅메뉴얼](./exec/포팅_메뉴얼.pdf)
- [중간발표자료](./docs/키즈링크_중간발표_PPT.pptx)
- [최종발표자료](./docs/키즈링크_최종발표_PPT.pdf)

## 💛 키즈링크 서비스

![로그인](./docs/assets/gifs/로그인.gif)

### 회원 가입
- 학부모, 선생님, 원장 선생님등 회원에 맞게 가입이 가능
- 소셜 로그인 시 필수 정보를 위한 회원 가입 진행
- 등록된 유치원 정보 및 자녀 정보 기입

![회원가입1](./docs/assets/gifs/회원가입_소셜_T.gif)

![회원가입2](./docs/assets/gifs/회원가입_서비스_P.gif)

---
### 선생님 - 우리반보기
- 우리반 원생 정보
- 원생 투약/결석 등 필요 정보 조회

![우리반정보](./docs/assets/images/t_우리반.PNG)

### 선생님 - 일정 관리
- 선생님 개인 일정 및 학사 일정 관리

![일정](./docs/assets/images/t_일정.PNG)

### 선생님 - 알림장
- 유치원 알림장 작성 및 관리

![알림장](./docs/assets/images/t_알림장.PNG)

### 선생님 - 성장일지
- 원생별 성장일지 작성 및 관리

![성장일지](./docs/assets/images/t_성장일지.PNG)

### 선생님 - 서류관리
- 학부모님이 작성해주신 서류 조회 및 관리
- 서류 처리

![서류](./docs/assets/images/t_서류.PNG)

### 선생님 - 사진분류
- 유치원 활동으로 찍은 원생별 사진 업로드
- AI 기술을 도입하여 자동 분류 및 수정 작업

![사진분류1](./docs/assets/gifs/사진분류_업로드.gif)

![사진분류2](./docs/assets/gifs/사진분류_완료.gif)

![앨범](./docs/assets/images/t_앨범.PNG)

### 선생님 - 화상상담
- 유치원 정기 상담
- 상담 예약 오픈 기능 및 자동 조율 기능
- 온라인 상담중 폭언 감지 시 자동 녹화 기능

![상담예약1](./docs/assets/gifs/예약_오픈.gif)

![상담예약2](./docs/assets/gifs/상담_조율_알고리즘.gif)

![화상상담1](./docs/assets/gifs/상담_실시간.gif)

### 선생님 - 등하원관리
- 등/하원 버스 관리 및 원생 탑승 여부 확인

![버스](./docs/assets/images/t_버스.PNG)

---

![학부모메인](./docs/assets/images/p_학부모메인.PNG)

### 학부모 - 일정관리
- 유치원 일정 및 투약 기간 조회

![일정관리](./docs/assets/images/p_일정관리.PNG)

### 학부모 - 우리 아이 알림장
- 유치원 알림장 확인

![알림장](./docs/assets/images/p_알림장1.PNG)

![알림장](./docs/assets/images/p_알림장.PNG)

### 학부모 - 우리 아이 성장일지
- 우리 아이 성장일지

![성장일지](./docs/assets/images/p_성장일지.PNG)

![성장일지](./docs/assets/images/p_성장일지1.PNG)

### 학부모 - 우리 아이 서류

![서류관리](./docs/assets/images/p_서류관리.PNG)

![서류관리](./docs/assets/images/p_서류상세.PNG)

### 학부모 - 우리 아이 앨범

![앨범](./docs/assets/images/p_앨범.PNG)

### 학부모 - 유치원 정기 상담

![상담화면](./docs/assets/images/p_상담화면.PNG)

### 학부모 - 우리 아이 등하원

![버스](./docs/assets/images/p_버스.PNG)

![등하원](./docs/assets/gifs/하원.gif)
