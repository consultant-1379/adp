ver=$(python version_manager.py version.conf y)
cd ..
docker build --tag armdocker.rnd.ericsson.se/aia/adp/adp-backend:${ver} .
cd .ver
docker push armdocker.rnd.ericsson.se/aia/adp/adp-backend:${ver}
echo "VERSION=${ver}" > next.env
python version_manager.py version.conf i
next=$(python version_manager.py version.conf y)
git add version.conf
git commit -m "Finish release ${ver} - starting ${next}"
git tag -a $ver -m "Release version: $ver"
