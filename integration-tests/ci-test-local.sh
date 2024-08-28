export BASEURL=${1:-https://$(hostname)/api/}
export MOCK_SERVER_URL=https://$(hostname)/notify/
export MOCK_SERVER_HOST=$(hostname)
export MOCK_SERVER_PORT=1080

printf "\033[93mRunning integration tests...\n\n\033[0m"
npm run integrationTest 2>&1 | tee results.txt
sed -i '0,/^Failures\:$/d' results.txt 
sed -i '/^Pending\:$/,$d' results.txt 
