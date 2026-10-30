pipeline {
  agent any
  environment {
    IMAGE = 'nomanamir/visio-spark-event'
    TAG   = "${env.BUILD_NUMBER}"
  }
  triggers { pollSCM('H/2 * * * *') }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Test') {
      steps {
        sh '''
          docker run --rm --user $(id -u):$(id -g) -e HOME=/tmp \
            -v "$PWD":/app -w /app node:20-alpine sh -c "npm install && npm test"
        '''
      }
    }
    stage('Build Image') {
      steps { sh 'docker build -t $IMAGE:$TAG -t $IMAGE:latest .' }
    }
    stage('Push Image') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds',
                         usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
          sh '''
            echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
            docker push $IMAGE:$TAG
            docker push $IMAGE:latest
          '''
        }
      }
    }
    stage('Deploy to Kubernetes') {
      steps {
        sh '''
          kubectl apply -f k8s/
          kubectl set image deployment/visio-spark visio-spark=$IMAGE:$TAG
          kubectl rollout status deployment/visio-spark --timeout=120s
        '''
      }
    }
  }
  post {
    success { echo 'Visio Spark Event deployed successfully 🎉' }
    failure { echo 'Pipeline failed, check the console output.' }
  }
}
