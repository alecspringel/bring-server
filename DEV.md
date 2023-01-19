Build the Docker image
```
docker build --no-cache -t 01-17-23_9:47am .
```

Tag the image
```
docker tag 01-17-23_9:47am 367133889670.dkr.ecr.us-east-1.amazonaws.com/bring
```

Provide docker with AWS Token so it can upload the image to ECR
```
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 367133889670.dkr.ecr.us-east-1.amazonaws.com
```

Push the image to the ECR repo
```
docker push 367133889670.dkr.ecr.us-east-1.amazonaws.com/bring
```