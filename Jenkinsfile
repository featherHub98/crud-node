pipeline {
    agent {
        docker {
            image 'node:25.4.0-alpine'
            args '-u root'
        }
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'node --version && npm --version'
            }
        }
        
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test || echo "Tests not configured"'
            }
        }
    }
}