reportdir=${1:-unit-test-report}
outputdir=../sprintreports
service=$(printf '%q\n' "${PWD##*/}")

mkdir -p ${outputdir}/${service}_unit_test_coverage/
cp -rf ${reportdir}/lcov-report/* ${outputdir}/${service}_unit_test_coverage/
cp -rf ${reportdir}/unit/report.html ${outputdir}/${service}_unit_test.html


echo "<a href='${service}_unit_test_coverage/index.html'>${service} Coverage Report</a><br>" >> ${outputdir}/index.html
echo "<a href='${service}_unit_test.html'>${service} Unit Test Report</a><br>"  >> ${outputdir}/index.html