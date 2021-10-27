###
000   000   0000000   000      000   000  
000  000   000   000  000      000  000   
0000000    000000000  000      0000000    
000  000   000   000  000      000  000   
000   000  000   000  0000000  000   000  
###

{ post, stopEvent, win } = require 'kxk'

# 000   000  000  000   000  
# 000 0 000  000  0000  000  
# 000000000  000  000 0 000  
# 000   000  000  000  0000  
# 00     00  000  000   000  

w = new win
    dir:    __dirname
    pkg:    require '../package.json'
    menu:   '../coffee/menu.noon'
    icon:   '../img/menu@2x.png'

Keys      = require './keys'
Input     = require './input'
Sheet     = require './sheet'
electron  = require 'electron'

post.on 'calc' (calc) -> window.input.setText(calc); post.emit 'button' '='
        
#  0000000   0000000   00000000   000   000        00000000    0000000    0000000  000000000  00000000    
# 000       000   000  000   000   000 000         000   000  000   000  000          000     000         
# 000       000   000  00000000     00000          00000000   000000000  0000000      000     0000000     
# 000       000   000  000           000           000        000   000       000     000     000         
#  0000000   0000000   000           000           000        000   000  0000000      000     00000000    
    
currentSelection = ->
    
    selection = document.getSelection().toString()
    if selection.length
        return selection
    ''
    
copy = ->
    if selection = currentSelection()
        electron.clipboard?.writeText selection
    else
        electron.clipboard?.writeText window.input.text()

cut = -> 
    copy() 
    if selection = currentSelection()
        document.getSelection().deleteFromDocument()
    else
        window.input.clear()
        
paste = ->
    
    window.input.setText window.input.text()+electron.clipboard?.readText()

#  0000000   0000000   00     00  0000000     0000000   
# 000       000   000  000   000  000   000  000   000  
# 000       000   000  000000000  0000000    000   000  
# 000       000   000  000 0 000  000   000  000   000  
#  0000000   0000000   000   000  0000000     0000000   

onCombo = (combo, info) ->

    return stopEvent(info.event) if 'unhandled' != window.keys.globalModKeyComboEvent info.mod, info.key, info.combo, info.event
    
    switch combo
        when 'ctrl+v'   then return paste()
        when 'ctrl+c'   then return copy()
        when 'ctrl+x'   then return cut()
        
post.on 'combo' onCombo
        
# 00     00  00000000  000   000  000   000   0000000    0000000  000000000  000   0000000   000   000  
# 000   000  000       0000  000  000   000  000   000  000          000     000  000   000  0000  000  
# 000000000  0000000   000 0 000  000   000  000000000  000          000     000  000   000  000 0 000  
# 000 0 000  000       000  0000  000   000  000   000  000          000     000  000   000  000  0000  
# 000   000  00000000  000   000   0000000   000   000   0000000     000     000   0000000   000   000  

onMenuAction = (action, args) ->

    switch action
        when 'Cut'      then return cut()
        when 'Copy'     then return copy()
        when 'Paste'    then return paste()
        when 'Clear'    then post.emit 'sheet' 'clear'
        when 'Save'     then post.toMain 'saveBuffer'
        
post.on 'menuAction' onMenuAction
        
window.sheet = new Sheet
window.input = new Input
window.keys  = new Keys

window.onresize = -> post.emit 'resize'
