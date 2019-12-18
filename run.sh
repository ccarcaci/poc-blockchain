(cd ledger; npm i)
(cd generator; npm i)

if [ ! -f "generator/reddit-repos/RC_2005-12.bz2" ]; then
  mkdir generator/reddit-repos
  wget -O generator/reddit-repos/RC_2005-12.bz2 https://files.pushshift.io/reddit/comments/RC_2005-12.bz2
fi

docker-compose -f deploy/docker-compose.yml down
docker-compose -f deploy/docker-compose.yml build
docker-compose -f deploy/docker-compose.yml up -d --scale operator=3
docker-compose -f deploy/docker-compose.yml logs -f
