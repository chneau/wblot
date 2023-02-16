#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# place .nojekyll to bypass Jekyll processing
echo >.nojekyll

git init
git checkout -B master
git add -A
git commit -m 'deploy'

# if you are deploying to https://chneau.github.io
# git push -f git@github.com:chneau/chneau.github.io.git master

# if you are deploying to https://chneau.github.io/wblot
git push -f git@github.com:chneau/wblot.git master:gh-pages

cd -

rm -rf dist
