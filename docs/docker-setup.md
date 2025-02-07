# Setup docker containers

### Start mongo db

docker run -d -p 27017:27017 --name timerdb mongo

### Start redis

docker run -d -p 6379:6379 --name redis redis
