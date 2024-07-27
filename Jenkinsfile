pipeline {
    agent any

    environment {
        EC2_IP = '52.78.118.241'  // Jenkins 시스템 설정에서 가져오지 않을 경우 직접 정의
        SSH_KEY_ID = 'ssh-key'
        DOCKER_HUB_REPO = 'sangmin0806'
    }

    stages {
        stage('Build Backend') {
            steps {
                script {
                    dir('backend') {
                        // Gradle을 사용하여 JAR 파일을 빌드합니다.
                        sh './gradlew clean build -x test'

                        // Docker 이미지를 빌드하고 푸시합니다.
                        withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_HUB_PASS', usernameVariable: 'DOCKER_HUB_USER')]) {
                            sh "docker build -t ${DOCKER_HUB_REPO}/backend ."
                            sh "echo \$DOCKER_HUB_PASS | docker login -u \$DOCKER_HUB_USER --password-stdin"
                            sh "docker push ${DOCKER_HUB_REPO}/backend"
                        }
                    }
                }
            }
        }
        stage('Build Frontend') {
            steps {
                script {
                    dir('frontend') {
                        // Docker 이미지를 빌드하고 푸시합니다.
                        withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_HUB_PASS', usernameVariable: 'DOCKER_HUB_USER')]) {
                            sh "docker build -t ${DOCKER_HUB_REPO}/frontend ."
                            sh "echo \$DOCKER_HUB_PASS | docker login -u \$DOCKER_HUB_USER --password-stdin"
                            sh "docker push ${DOCKER_HUB_REPO}/frontend"
                        }
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    sshagent([SSH_KEY_ID]) {
                        sh """
                        ssh ec2-user@${EC2_IP} 'cd /home/minsun && docker-compose pull && docker-compose up -d'
                        """
                    }
                }
            }
        }
    }
}
