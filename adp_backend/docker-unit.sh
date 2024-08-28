version=test
baseUrlArg="https://localhost:28070/"
suitesArg=""
configArg="conf.json"
extraArg=""
env_number=0

usage="-v image version. -t Test suites. -u Base url."
while getopts ":v:u:t:c:e:n:" opt; do
  case $opt in
    v) supplied_version="$OPTARG"
    ;;
    u) supplied_baseurl="$OPTARG"
    ;;
    t) supplied_suites="$OPTARG"
    ;;
    c) supplied_config="$OPTARG"
    ;;
    e) extra_arg="$OPTARG"
    ;;
    n) env_number="$OPTARG"
    ;;
    \?) echo "Invalid option -$OPTARG" >&2
        echo -e $usage
        exit 1
    ;;
  esac
done

if [[ ${supplied_version} ]];
then
        version=$supplied_version
fi

if [[ ${supplied_baseurl} ]];
then
        baseUrlArg=$supplied_baseurl
fi

if [[ ${supplied_suites} ]];
then
        suitesArg="--filter=${supplied_suites}"
fi
if [[ ${supplied_config} ]];
then
        configArg="${supplied_config}"
fi


echo "(v)ersion $version"
echo "base(u)rl $baseUrlArg"
echo "(t)estSuites ${suitesArg}"
echo "(c)onfig file ${configArg}"
echo "e(n)v number ${env_number}"

defImage=armdocker.rnd.ericsson.se/aia/adp/adp-backend
image=$defImage
test_output_dir=integration_reports
test_dir=integration-tests
mounted_dir=/usr/src/app
config_file=${configArg}

b=${baseUrlArg/https:\/\//}
c=${b/\/api\//}
ms_host=${c%:*}
nginx_port=${c#*:}
ms_port=5606${env_number}

echo "Mockserver host: $ms_host"
echo "Mockserver port: $ms_port"
echo "Mockserver url: http://${ms_host}:${ms_port}/"

drun="docker run --rm -e BASEURL=${baseUrlArg} -e ENV_TAG=env${env_number} -e MOCK_SERVER_HOST=${ms_host} -e MOCK_SERVER_PORT=${ms_port} ${extra_arg} -v ${PWD}/integration-tests:${mounted_dir}/integration-tests -v ${PWD}/${test_output_dir}:${mounted_dir}/${test_output_dir} ${image}:${version} /bin/bash -c"
echo $drun
$drun "npm install && node_modules/jasmine-xml-reporter/bin/jasmine.js --junitreport --output=${test_output_dir} --config=./${test_dir}/${config_file} ${suitesArg}"

$drun "chown -R $(id -u):$(id -g) ."
