
pipeline {
    agent any

    tools {
        nodejs 'NodeJS-26'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Tests') {
            steps {
                bat 'npm test -- --runInBand'
            }
        }
    }

    post {
        success {
            echo 'DanceStudio CI completed successfully!'
        }

        failure {
            echo 'DanceStudio CI failed!'
        }
    }
}
