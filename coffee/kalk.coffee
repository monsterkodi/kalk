###
000   000   0000000   000      000   000  
000  000   000   000  000      000  000   
0000000    000000000  000      0000000    
000  000   000   000  000      000  000   
000   000  000   000  0000000  000   000  
###

{ keyinfo, scheme, stopEvent, prefs, slash, post, elem, popup, pos, str, log, $ } = require 'kxk'

keys      = require './keys'
input     = require './input'
Menu      = require './menu'
Titlebar  = require './titlebar'
pkg       = require '../package.json'
electron  = require 'electron'

remote    = electron.remote
win       = window.win = remote.getCurrentWindow()

# 000       0000000    0000000   0000000
# 000      000   000  000   000  000   000
# 000      000   000  000000000  000   000
# 000      000   000  000   000  000   000
# 0000000   0000000   000   000  0000000

post.on 'schemeChanged', -> 
post.on 'menuAction', (action, args) -> menuAction action, args

$("#main").addEventListener "contextmenu", (event) ->
    
    absPos = pos event
    if not absPos?
        absPos = pos $("#main").getBoundingClientRect().left, $("#main").getBoundingClientRect().top
        
    opt = items: [
        text:   'Toggle Menu'
        combo:  'alt+m'
        cb:     -> post.emit 'menuAction', 'Toggle Menu'
    ,
        text:   'About'
        combo:  'ctrl+.'
        cb:      -> post.toMain 'showAbout'
    ,
        text:   'Quit'
        combo:  'ctrl+q' 
        cb:     -> post.toMain 'quitApp'
    ]
    
    opt.x = absPos.x
    opt.y = absPos.y

    popup.menu opt
    
window.onunload = -> document.onkeydown = null

window.eval = global.eval = -> throw new Error "no eval"

# 00     00  00000000  000   000  000   000      0000000    0000000  000000000  000   0000000   000   000
# 000   000  000       0000  000  000   000     000   000  000          000     000  000   000  0000  000
# 000000000  0000000   000 0 000  000   000     000000000  000          000     000  000   000  000 0 000
# 000 0 000  000       000  0000  000   000     000   000  000          000     000  000   000  000  0000
# 000   000  00000000  000   000   0000000      000   000   0000000     000     000   0000000   000   000

menuAction = (name, args) ->

    switch name

        when 'Toggle Scheme'         then return scheme.toggle()
        when 'Toggle Menu'           then return window.mainmenu.toggle()
        when 'Show Menu'             then return window.mainmenu.show()
        when 'Hide Menu'             then return window.mainmenu.hide()
        when 'Open DevTools'         then return win.webContents.openDevTools()
        when 'Reload Window'         then return win.webContents.reloadIgnoringCache()
        when 'Close Window'          then return win.close()
        when 'Minimize'              then return win.minimize()
        
    log "unhandled menu action! ------------ posting to main '#{name}' args: #{args}"
    
    post.toMain 'menuAction', name, args
    
# 000   000  00000000  000   000
# 000  000   000        000 000
# 0000000    0000000     00000
# 000  000   000          000
# 000   000  00000000     000

document.onkeydown = (event) ->

    { mod, key, combo, char } = keyinfo.forEvent event

    log mod, key, combo
    
    return if not combo

    return stopEvent(event) if 'unhandled' != window.mainmenu.globalModKeyComboEvent mod, key, combo, event
    
    switch combo
        when 'i', 'command+i', 'ctrl+i', 'alt+i'    then return scheme.toggle()
        when 'esc'                                  then return post.toMain 'closeWin'
        when 'down', 'right'                        then return log 'down right'
        when 'up'  , 'left'                         then return log 'up left'
        when 'enter'                                then return log 'enter'
        when 'backspace', 'command+backspace', 'ctrl+backspace', 'delete' then log 'del'

prefs.init()
scheme.set prefs.get 'scheme', 'dark'
window.titlebar = new Titlebar 
window.mainmenu = new Menu 'menu'
keys.init()
input.init()
