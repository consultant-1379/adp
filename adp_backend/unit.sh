new_version=${1:-test}
echo "{\"current\": \"${new_version}\", \"next\": \"1.0.104\"}" > .ver/version.conf
docker build --tag armdocker.rnd.ericsson.se/aia/adp/adp-backend:${new_version} .

docker run -v ${PWD}:/usr/src/app/ armdocker.rnd.ericsson.se/aia/adp/adp-backend:${new_version} /bin/sh -c "chown -R $(id -u):$(id -g) .; rm -rf ./unit-test-report"
mkdir ./unit-test-report
docker run -v ${PWD}/unit-test-report:/usr/src/app/reports armdocker.rnd.ericsson.se/aia/adp/adp-backend:${new_version} /bin/sh -c "npm i -g jasmine && npm test"
docker run -v ${PWD}/unit-test-report:/usr/src/app/reports armdocker.rnd.ericsson.se/aia/adp/adp-backend:${new_version} /bin/sh -c "npm run lint"
docker run -v ${PWD}/unit-test-report:/usr/src/app/reports armdocker.rnd.ericsson.se/aia/adp/adp-backend:${new_version} /bin/sh -c "chown -R $(id -u):$(id -g) ."
if [[ -z $(tail -1 unit-test-report/lint_checkstyle.txt) ]]
then
	echo "No lint errors found"
else
	cat unit-test-report/lint_checkstyle.txt
	exit 1
fi