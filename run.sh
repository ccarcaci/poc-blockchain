docker-compose -f deploy/docker-compose.yml down
docker-compose -f deploy/docker-compose.yml build
docker-compose -f deploy/docker-compose.yml up -d --scale operator=3
docker-compose -f deploy/docker-compose.yml logs -f
