pipeline {
    agent any

    stages {
        stage('Clonar repositorio') {
            steps {
                git branch: 'main', url: 'https://github.com/JosimariFabri/teste-api-ebac.git'
            }
        }
        stage('Instalar dependencias') {
            steps {
                bat 'npm install'
            }
        }
        stage('Subir servidor') {
            steps {
                bat 'npm start'
            }
        }
        stage('Executar testes') {
            steps {
               bat '''set NO_COLOR=1
npm run cy:run'''
            }
        }
    }
}
