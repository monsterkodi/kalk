#!/usr/bin/env bash
cd `dirname $0`/..

rm -rf /Applications/kalk.app
cp -R kalk-darwin-x64/kalk.app /Applications

open /Applications/kalk.app 
