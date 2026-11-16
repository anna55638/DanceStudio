
pipeline {
    agent any

    tools {
        nodejs 'NodeJS-26'
    }

    stages {
        stage('Install dependencies') {
            steps {
                bat '''
                    call "D:\\Programs\\VS\\Common7\\Tools\\VsDevCmd.bat" -arch=x64 -host_arch=x64
                    npm ci
                '''
            }
        }

        stage('Run tests') {
            steps {
                bat 'npm test'
            }
        }
    }
}
