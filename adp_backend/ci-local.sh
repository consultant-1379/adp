export BASEURL=${1:-https://$(hostname)/api/}
export MOCK_SERVER_URL=https://$(hostname)/notify/
export MOCK_SERVER_HOST=$(hostname)
export MOCK_SERVER_PORT=1080

docker exec adp_backend npm run testDataGenerator
printf "\033[93mTest Data generator complete. Restarting backend services...\n\n\033[0m"
docker restart adp_backend adp_worker nginx
sleep 3
printf "\033[93mRunning Collection Setup...\n\n\033[0m"
cd ../integration-tests
npm run collectionSetup
sleep 3
printf "\033[93mCollection Setup Complete. Running Contributors Scraper...\n\n\033[0m"
docker exec -d adp_backend npm run gerritContributorsStatistics
sleep 3
printf "\033[93mRunning integration tests...\n\n\033[0m"
unbuffer npm run integrationTest 2>&1 | tee results.txt
sed -i '0,/^Failures\:$/d' results.txt 
sed -i '/^Pending\:$/,$d' results.txt 
