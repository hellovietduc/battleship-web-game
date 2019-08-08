#!/usr/bin/env bash

echo "Step 1/4: Clean dist directory"
rm -rf dist/*

echo "Step 2/4: Build dist directory"
cp index.html dist/
cp -r css/ dist/
sed -i "s|/js/main.js|/battleship/js/main.js|g" dist/index.html
sed -i "s|/css/style.css|/battleship/css/style.css|g" dist/index.html
npx webpack --config webpack.config.js

echo "Step 3/4: Build Docker image"
PACKAGE_VERSION=$(date +"%y.%m%d.%H%M")
echo "version: $PACKAGE_VERSION"
docker build -t vietduc01100001/battleship:$PACKAGE_VERSION .
docker tag vietduc01100001/battleship:$PACKAGE_VERSION vietduc01100001/battleship:latest

echo "Step 4/4: Push to Docker Hub"
docker push vietduc01100001/battleship:$PACKAGE_VERSION
docker push vietduc01100001/battleship:latest

echo "Done!"
