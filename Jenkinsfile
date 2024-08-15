pipeline {
    agent any

    environment {
        SSH_KEY_ID = 'ssh-key'
        DOCKER_HUB_REPO = 'sangmin0806'
    }

    stages {
        stage('Build Backend') {
            steps {
                script {
                    dir('backend') {
                        sh 'chmod +x ./gradlew'
                        sh './gradlew clean build -x test'

                        withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_HUB_PASS', usernameVariable: 'DOCKER_HUB_USER')]) {
                            sh "docker build -t ${DOCKER_HUB_REPO}/backend ."
                            sh "echo \$DOCKER_HUB_PASS | docker login -u \$DOCKER_HUB_USER --password-stdin"
                            sh "docker push ${DOCKER_HUB_REPO}/backend"
                        }
                         sh "docker image prune -f"
                         sh "docker builder prune -f"
                    }
                }
            }
        }
        stage('Build Frontend') {
            steps {
                script {
                    dir('frontend') {

                        withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_HUB_PASS', usernameVariable: 'DOCKER_HUB_USER')]) {
                            sh "docker build -t ${DOCKER_HUB_REPO}/frontend ."
                            sh "echo \$DOCKER_HUB_PASS | docker login -u \$DOCKER_HUB_USER --password-stdin"
                            sh "docker push ${DOCKER_HUB_REPO}/frontend"
                        }
                         sh "docker image prune -f"
                         sh "docker builder prune -f"
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'EC2_IP_SECRET', variable: 'EC2_IP')]) {
                        sshagent([SSH_KEY_ID]) {
                            sh 'export EC2_IP=$EC2_IP && ssh -o StrictHostKeyChecking=no minsun@$EC2_IP "cd /home/minsun && docker-compose pull && docker-compose up -d"'
                        }
                    }
                }
            }
        }
    }
}
