new_version=${1:-test}
echo "{\"current\": \"${new_version}\", \"next\": \"1.0.104\"}" > .ver/version.conf
docker build --tag armdocker.rnd.ericsson.se/aia/adp/adp-backend:${new_version} .