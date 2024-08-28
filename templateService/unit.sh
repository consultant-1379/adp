new_version=${1:-test}

docker build --tag unittest:test .

docker run -v ${PWD}:/usr/src/app/ unittest:test /bin/sh -c "chown -R $(id -u):$(id -g) .; rm -rf ./unit-test-report"
mkdir ./unit-test-report
docker run -v ${PWD}/unit-test-report:/app/reports unittest:test /bin/sh -c "npm i -g jasmine && npm test"
docker run -v ${PWD}/unit-test-report:/app/reports unittest:test /bin/sh -c "npm run lint"
docker run -v ${PWD}/unit-test-report:/app/reports unittest:test /bin/sh -c "chown -R $(id -u):$(id -g) ."

if [[ -z $(tail -1 unit-test-report/lint_checkstyle.txt) ]]
then
	echo "No lint errors found"
else
	cat unit-test-report/lint_checkstyle.txt
	exit 1
fi