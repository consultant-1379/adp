image_name=armdocker.rnd.ericsson.se/aia/adp/adp-backend
image_version=test
compose_location=/local/test-env-setup
backend_service="adp_backend adp_backend_worker nginx"

echo "Building ${image_name}:${image_version}"
docker build -t ${image_name}:${image_version} .
cd ${compose_location}
docker-compose stop ${backend_service}
docker-compose rm -f ${backend_service}
docker-compose up -d

