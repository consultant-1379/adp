reportdir=${1:-integration_reports}
outputdir=../sprintreports
service=$(printf '%q\n' "${PWD##*/}")

mkdir -p ${outputdir}

cp -rf ${reportdir}/report.html ${outputdir}/api_tests.html

echo "<a href='api_tests.html'>API Test Report</a><br>" >> ${outputdir}/index.html