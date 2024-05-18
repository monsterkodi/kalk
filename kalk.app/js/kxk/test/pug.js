var toExport = {}
import pug from "../pug.js"

toExport["pug"] = function ()
{
    compare(pug('doctype html'),'<!DOCTYPE html>\n')
    compare(pug(`doctype html
html
    head
    body`),`<!DOCTYPE html>
<html>
    <head></head>
    <body></body>
</html>
`)
    compare(pug(`doctype html
html lang="en"
    head
        meta charset="utf-8"
        title kakao
        link rel="stylesheet" href="./css/style.css" type="text/css"
        link rel="stylesheet" href="./css/dark.css"  type="text/css"
    body
        #titlebar
        #main tabindex=0
    
    script type="module" src="./main.js"
        `),`<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>kakao</title>
        <link rel="stylesheet" href="./css/style.css" type="text/css">
        <link rel="stylesheet" href="./css/dark.css"  type="text/css">
    </head>
    <body>
        <div id="titlebar"></div>
        <div id="main" tabindex=0></div>
    </body>
    <script type="module" src="./main.js"></script>
</html>
`)
    compare(pug(`doctype html
html lang="en"
    head
        meta charset="utf-8"
        meta http-equiv="Cross-Origin-Opener-Policy"   content="same-origin"
        meta http-equiv="Cross-Origin-Embedder-Policy" content="require-corp"
        link rel="stylesheet" href="./css/style.css"          type="text/css"
        link rel="stylesheet" href="./css/dark.css"           type="text/css"      
        link rel="stylesheet" href="./css/ko/style.css"       type="text/css"
        link rel="stylesheet" href="./css/ko/dark/colors.css" type="text/css" class="scheme-link"
        link rel="stylesheet" href="./css/ko/dark/syntax.css" type="text/css" class="scheme-link"
        link rel="stylesheet" href="./css/ko/dark/files.css"  type="text/css" class="scheme-link"
        link rel="stylesheet" href="./css/ko/icons.css"       type="text/css"
    body#ko
        #titlebar
        #main
            #split
                #browser  tabindex="3"
                #terminal tabindex="2"
                #commandline
                    span#commandline-button
                    span#commandline-span
                        #commandline-editor tabindex="1"
                        #info
                #editor tabindex="0"
    script type="module" src="./ko/win/window.js"
        `),`<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="Cross-Origin-Opener-Policy"   content="same-origin">
        <meta http-equiv="Cross-Origin-Embedder-Policy" content="require-corp">
        <link rel="stylesheet" href="./css/style.css"          type="text/css">
        <link rel="stylesheet" href="./css/dark.css"           type="text/css">
        <link rel="stylesheet" href="./css/ko/style.css"       type="text/css">
        <link rel="stylesheet" href="./css/ko/dark/colors.css" type="text/css" class="scheme-link">
        <link rel="stylesheet" href="./css/ko/dark/syntax.css" type="text/css" class="scheme-link">
        <link rel="stylesheet" href="./css/ko/dark/files.css"  type="text/css" class="scheme-link">
        <link rel="stylesheet" href="./css/ko/icons.css"       type="text/css">
    </head>
    <body id="ko">
        <div id="titlebar"></div>
        <div id="main">
            <div id="split">
                <div id="browser" tabindex="3"></div>
                <div id="terminal" tabindex="2"></div>
                <div id="commandline">
                    <span id="commandline-button"></span>
                    <span id="commandline-span">
                        <div id="commandline-editor" tabindex="1"></div>
                        <div id="info"></div>
                    </span>
                </div>
                <div id="editor" tabindex="0"></div>
            </div>
        </div>
    </body>
    <script type="module" src="./ko/win/window.js"></script>
</html>
`)
}
toExport["pug"]._section_ = true
toExport._test_ = true
export default toExport
