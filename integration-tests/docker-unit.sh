baseUrlArg="https://localhost:28070/"
suitesArg=""
configArg="conf.json"
extraArg=""
env_number=0

usage="-t Test suites. -u Base url."
while getopts ":u:t:c:e:n:" opt; do
  case $opt in
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


echo "base(u)rl $baseUrlArg"
echo "(t)estSuites ${suitesArg}"
echo "(c)onfig file ${configArg}"
echo "e(n)v number ${env_number}"

docker build -t portalintegrationtest:local .
image=portalintegrationtest:local
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

drun="docker run --rm -e BASEURL=${baseUrlArg} -e MOCK_SERVER_HOST=${ms_host} -e MOCK_SERVER_PORT=${ms_port} ${extra_arg} -v ${PWD}/integration-tests:${mounted_dir}/integration-tests -v ${PWD}/${test_output_dir}:${mounted_dir}/${test_output_dir} ${image} /bin/bash -c"
echo $drun

$drun "node_modules/jasmine-xml-reporter/bin/jasmine.js --junitreport --output=${test_output_dir} --config=./${test_dir}/${config_file} ${suitesArg}"

$drun "chown -R $(id -u):$(id -g) ."
$drun "npm i -g jasmine && npm run lint"
if [[ -z $(tail -1 integration_reports/lint_checkstyle.xml) ]]
then
	echo "No lint errors found"
else
	cat integration_reports/lint_checkstyle.xml
	exit 1
fi
