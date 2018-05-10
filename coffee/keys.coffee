###
000   000  00000000  000   000   0000000
000  000   000        000 000   000     
0000000    0000000     00000    0000000 
000  000   000          000          000
000   000  00000000     000     0000000 
###

{ stopEvent, post, elem, log, $ } = require 'kxk'

class Keys

    constructor: ->
        
        @view = $ '#keys'
        
        row = (children) => @view.appendChild elem 'span', class:'button-row', children:children
        button = (text, clss='button') => elem class:clss, text:text, click: @onButton
        
        row [
                button "C"
                button "⌫"
                button "/"
                button "*"
            ]
        row [
                button "7"
                button "8"
                button "9"
                button "-"
            ]
        row [
                button "4"
                button "5"
                button "6"
                button "+"
            ]
        row [
                button "1"
                button "2"
                button "3"
                button "=", 'button tall'
            ]
        row [
                button "0", 'button wide'
                button "."
            ]
        
    onButton: (event) => post.emit 'button', event.target.innerHTML.trim()
    
    # 000   000  00000000  000   000
    # 000  000   000        000 000 
    # 0000000    0000000     00000  
    # 000  000   000          000   
    # 000   000  00000000     000   
    
    globalModKeyComboEvent: (mod, key, combo, event) ->

        switch combo
            when '/', '*', '+', '-', '=', '.'   then return post.emit 'button', combo
            when 'enter'                        then return post.emit 'button', '='
            when 'backspace'                    then return post.emit 'button', '⌫'
            when 'delete'                       then return post.emit 'button', 'C'
            when 'shift+8'                      then return post.emit 'button', '*'
            when 'shift+='                      then return post.emit 'button', '+'
            when 'num lock'                     then post.emit 'button', 'C'; return stopEvent event
            
        if combo.startsWith 'numpad'
            return post.emit 'button', combo.split(' ')[1]
        else if combo in [0..9].map (i) -> "#{i}"
            return post.emit 'button', combo
            
        'unhandled'
            
module.exports = Keys
