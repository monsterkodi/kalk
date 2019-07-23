#!/usr/bin/env bash
DIR=`dirname $0`
BIN=$DIR/../node_modules/.bin
cd $DIR/..

if rm -rf kalk-win32-x64; then

    if $BIN/konrad; then

        $BIN/electron-rebuild

        IGNORE="/(.*\.dmg$|Icon$|watch$|icons$|.*md$|pug$|styl$|.*\.lock$|img/banner\.png)"

        $BIN/electron-packager . --overwrite --icon=img/app.ico --ignore=$IGNORE
        
        start kalk-win32-x64/kalk.exe
    fi
fi