# 1단계: 빌드 환경 설정
FROM node:18 AS build

WORKDIR /app

# 앱 소스 코드 복사
COPY package*.json ./
COPY . .

# 종속성 설치 및 빌드
RUN npm install
RUN npm run build

# 2단계: 실행 환경 설정
FROM nginx:alpine

# 빌드된 파일 복사
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]

# 포트 노출
EXPOSE 80
EXPOSE 443
