#!/usr/bin/env bash

DIR=`dirname $0`
BIN=$DIR/../node_modules/.bin
cd $DIR/..

if rm -rf kalk-darwin-x64; then
    
    if $BIN/konrad; then

        IGNORE="/(.*\.dmg$|Icon$|watch$|icons$|.*md$|pug$|styl$|.*\.lock$|img/banner\.png)"
    
        if $BIN/electron-packager . --overwrite --icon=img/app.icns --darwinDarkModeSupport --ignore=$IGNORE; then
            
            rm -rf /Applications/kalk.app
            cp -R kalk-darwin-x64/kalk.app /Applications
            
            open /Applications/kalk.app 
        fi
    fi
fi