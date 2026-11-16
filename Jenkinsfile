pipeline {
    agent any

    tools {
        nodejs 'NodeJS-26'
    }

    stages {
        stage('Install dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Run tests') {
            steps {
                bat 'npm test'
            }
        }
    }
}