
pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        APP_DIR = 'D:\\DevOps\\deploy\\DanceStudio'
        APP_PORT = '3000'
        APP_TASK = 'DanceStudio'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

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

        stage('Stop Old Application') {
            when {
                branch 'main'
            }
            steps {
                powershell '''
                    Stop-ScheduledTask -TaskName $env:APP_TASK -ErrorAction SilentlyContinue

                    Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue |
                        ForEach-Object {
                            Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
                        }

                    exit 0
                '''
            }
        }

        stage('Deploy Application') {
            when {
                branch 'main'
            }
            steps {
                powershell '''
                    New-Item -ItemType Directory -Force -Path $env:APP_DIR | Out-Null
                '''

                bat '''
                    robocopy . "%APP_DIR%" /E /XD .git node_modules coverage /NFL /NDL /NJH /NJS /NP
                    if %ERRORLEVEL% LSS 8 exit /b 0
                    exit /b 1
                '''

                dir('') {
                    bat 'npm ci --prefix "%APP_DIR%"'
                }
            }
        }

        stage('Start Application') {
            when {
                branch 'main'
            }
            steps {
                powershell '''
                    $Node = (Get-Command node.exe).Source
                    $Npm = (Get-Command npm.cmd).Source

                    $Action = New-ScheduledTaskAction `
                        -Execute 'cmd.exe' `
                        -Argument "/c `"`"$Npm`" start > `"$env:APP_DIR\\app.log`" 2>&1`"" `
                        -WorkingDirectory $env:APP_DIR

                    $Principal = New-ScheduledTaskPrincipal `
                        -UserId $env:USERNAME `
                        -LogonType Interactive `
                        -RunLevel Highest

                    $Settings = New-ScheduledTaskSettingsSet `
                        -ExecutionTimeLimit ([TimeSpan]::Zero) `
                        -AllowStartIfOnBatteries `
                        -DontStopIfGoingOnBatteries

                    Register-ScheduledTask `
                        -TaskName $env:APP_TASK `
                        -Action $Action `
                        -Principal $Principal `
                        -Settings $Settings `
                        -Force | Out-Null

                    Start-ScheduledTask -TaskName $env:APP_TASK
                '''
            }
        }

        stage('Health Check') {
            when {
                branch 'main'
            }
            steps {
                powershell '''
                    $Success = $false

                    for ($i = 0; $i -lt 15; $i++) {
                        try {
                            $Response = Invoke-RestMethod 'http://127.0.0.1:3000/'
                            if ($Response.message -eq 'DanceStudio API работает!') {
                                $Success = $true
                                break
                            }
                        }
                        catch {}

                        Start-Sleep -Seconds 2
                    }

                    if (-not $Success) {
                        Get-Content "$env:APP_DIR\\app.log" -ErrorAction SilentlyContinue
                        throw 'DanceStudio health check failed'
                    }
                '''
            }
        }
    }

    post {
        success {
            echo 'DanceStudio CI/CD completed successfully!'
        }

        failure {
            echo 'DanceStudio CI/CD failed!'
        }
    }
}
