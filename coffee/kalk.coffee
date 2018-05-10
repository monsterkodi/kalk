###
000   000   0000000   000      000   000  
000  000   000   000  000      000  000   
0000000    000000000  000      0000000    
000  000   000   000  000      000  000   
000   000  000   000  0000000  000   000  
###

{ keyinfo, scheme, stopEvent, prefs, slash, post, elem, popup, pos, str, log, $ } = require 'kxk'

Keys      = require './keys'
Input     = require './input'
Sheet     = require './sheet'
Menu      = require './menu'
Titlebar  = require './titlebar'
electron  = require 'electron'
pkg       = require '../package.json'

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
        text:   'Clear Sheet'
        combo:  'ctrl+k'
        cb:     -> post.emit 'menuAction', 'Clear Sheet'
    ,
        text:   'Toggle Menu'
        combo:  'alt+m'
        cb:     -> post.emit 'menuAction', 'Toggle Menu'
    ,
        text:   'About'
        combo:  'ctrl+.'
        cb:      -> post.emit 'menuAction', 'About kalk'
    ,
        text:   'Quit'
        combo:  'ctrl+q' 
        cb:     -> post.emit 'menuAction', 'Quit'
    ]
    
    opt.x = absPos.x
    opt.y = absPos.y

    popup.menu opt
    
window.onunload = -> document.onkeydown = null

# window.eval = global.eval = -> throw new Error "no eval"

# 00     00  00000000  000   000  000   000      0000000    0000000  000000000  000   0000000   000   000
# 000   000  000       0000  000  000   000     000   000  000          000     000  000   000  0000  000
# 000000000  0000000   000 0 000  000   000     000000000  000          000     000  000   000  000 0 000
# 000 0 000  000       000  0000  000   000     000   000  000          000     000  000   000  000  0000
# 000   000  00000000  000   000   0000000      000   000   0000000     000     000   0000000   000   000

menuAction = (name, args) ->

    switch name

        when 'Toggle Scheme'    then return scheme.toggle()
        when 'Toggle Menu'      then return window.mainmenu.toggle()
        when 'Show Menu'        then return window.mainmenu.show()
        when 'Hide Menu'        then return window.mainmenu.hide()
        when 'Open DevTools'    then return win.webContents.openDevTools()
        when 'Reload Window'    then return win.webContents.reloadIgnoringCache()
        when 'Close Window'     then return win.close()
        when 'Clear Sheet'      then return post.emit 'sheet', 'clear'
        when 'Minimize'         then return win.minimize()
        
    log "unhandled menu action! ------------ posting to main '#{name}' args: #{args}"
    
    post.toMain 'menuAction', name, args
    
# 000   000  00000000  000   000
# 000  000   000        000 000
# 0000000    0000000     00000
# 000  000   000          000
# 000   000  00000000     000

document.onkeydown = (event) ->

    { mod, key, combo, char } = keyinfo.forEvent event

    return if not combo

    return stopEvent(event) if 'unhandled' != window.mainmenu.globalModKeyComboEvent mod, key, combo, event
    return stopEvent(event) if 'unhandled' != window.keys.globalModKeyComboEvent mod, key, combo, event
    
    # log mod, key, combo
    
    switch combo
        when 'i', 'command+i', 'ctrl+i', 'alt+i'    then return scheme.toggle()
        when 'esc'                                  then return post.toMain 'closeWin'

prefs.init()
scheme.set prefs.get 'scheme', 'dark'
window.titlebar = new Titlebar 
window.sheet    = new Sheet
window.input    = new Input
window.keys     = new Keys
window.mainmenu = new Menu 'menu'
