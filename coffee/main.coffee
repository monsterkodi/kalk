###
00     00   0000000   000  000   000
000   000  000   000  000  0000  000
000000000  000000000  000  000 0 000
000 0 000  000   000  000  000  0000
000   000  000   000  000  000   000
###

{ app, args, post, log } = require 'kxk'

new app
    dir:        __dirname
    pkg:        require '../package.json'
    shortcut:   'CmdOrCtrl+Alt+C'
    index:      'index.html'
    icon:       '../img/app.ico'
    tray:       '../img/menu.png'
    about:      '../img/about.png'
    aboutDebug: false
    width:      474
    height:     900
    minWidth:   474
    minHeight:  600
    args: """
        calculations    to perform  **
        """
    
post.on 'winDidShow', ->
    
    for calc in args.calculations
        post.toWins 'calc', calc
        