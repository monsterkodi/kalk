###
000   000   0000000   000      000   000  
000  000   000   000  000      000  000   
0000000    000000000  000      0000000    
000  000   000   000  000      000  000   
000   000  000   000  0000000  000   000  
###

{ keyinfo, title, scheme, stopEvent, prefs, slash, post, elem, popup, pos, str, log, $, _ } = require 'kxk'

Keys      = require './keys'
Input     = require './input'
Sheet     = require './sheet'
Menu      = require './menu'
electron  = require 'electron'
pkg       = require '../package.json'

clipboard = electron.clipboard
remote    = electron.remote
win       = window.win = remote.getCurrentWindow()

post.on 'reload', -> win.webContents.reloadIgnoringCache()
post.on 'calc', (calc) -> 
    window.input.setText calc
    post.emit 'button', '='
        
#  0000000   0000000   00000000   000   000        00000000    0000000    0000000  000000000  00000000    
# 000       000   000  000   000   000 000         000   000  000   000  000          000     000         
# 000       000   000  00000000     00000          00000000   000000000  0000000      000     0000000     
# 000       000   000  000           000           000        000   000       000     000     000         
#  0000000   0000000   000           000           000        000   000  0000000      000     00000000    
    
copy = ->
    clipboard?.writeText window.input.text()

paste = ->
    window.input.setText clipboard?.readText()
    
cut = ->
    copy()
    window.input.clear()
    
prefs.init()

# 000000000  000  000000000  000      00000000  
#    000     000     000     000      000       
#    000     000     000     000      0000000   
#    000     000     000     000      000       
#    000     000     000     0000000  00000000  

window.titlebar = new title 
    pkg:    pkg 
    menu:   __dirname + '/../coffee/menu.noon' 
    icon:   __dirname + '/../img/menu@2x.png'

#  0000000   0000000   000   000  000000000  00000000  000   000  000000000  
# 000       000   000  0000  000     000     000        000 000      000     
# 000       000   000  000 0 000     000     0000000     00000       000     
# 000       000   000  000  0000     000     000        000 000      000     
#  0000000   0000000   000   000     000     00000000  000   000     000     

$("#main").addEventListener "contextmenu", (event) ->
    
    absPos = pos event
    if not absPos?
        absPos = pos $("#main").getBoundingClientRect().left, $("#main").getBoundingClientRect().top
       
    items = _.clone window.titlebar.menuTemplate()
    items.unshift text:'Clear', accel:'ctrl+k'
        
    popup.menu
        items:  items
        x:      absPos.x
        y:      absPos.y
    
# 000   000  00000000  000   000
# 000  000   000        000 000
# 0000000    0000000     00000
# 000  000   000          000
# 000   000  00000000     000

window.onunload = -> document.onkeydown = null
document.onkeydown = (event) ->

    return stopEvent(event) if 'unhandled' != window.titlebar.handleKey event, true
    
    { mod, key, combo, char } = keyinfo.forEvent event

    return if not combo

    return stopEvent(event) if 'unhandled' != window.keys.globalModKeyComboEvent mod, key, combo, event
    
    switch combo
        when 'i', 'command+i', 'ctrl+i' then return scheme.toggle()
        when 'ctrl+v'                   then return paste()
        when 'ctrl+c'                   then return copy()
        when 'ctrl+x'                   then return cut()
    
# 00     00  00000000  000   000  000   000   0000000    0000000  000000000  000   0000000   000   000  
# 000   000  000       0000  000  000   000  000   000  000          000     000  000   000  0000  000  
# 000000000  0000000   000 0 000  000   000  000000000  000          000     000  000   000  000 0 000  
# 000 0 000  000       000  0000  000   000  000   000  000          000     000  000   000  000  0000  
# 000   000  00000000  000   000   0000000   000   000   0000000     000     000   0000000   000   000  

post.on 'menuAction', (action, args) ->

    switch action
        when 'Clear'            then post.emit 'sheet', 'clear'
        when 'About'            then post.toMain 'showAbout'
        when 'Save'             then post.toMain 'saveBuffer'
        when 'Quit'             then post.toMain 'quitApp'

window.sheet    = new Sheet
window.input    = new Input
window.keys     = new Keys
window.menu     = new Menu

scheme.set prefs.get 'scheme', 'dark'
