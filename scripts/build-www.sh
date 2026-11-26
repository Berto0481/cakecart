#!/bin/sh
# Copies the web app (the same files GitHub Pages serves) into www/ for the Android build.
set -e
cd "$(dirname "$0")/.."
rm -rf www && mkdir www
cp index.html app.css app.js native.js defaults.js manifest.webmanifest www/
cp -r fonts icons www/
