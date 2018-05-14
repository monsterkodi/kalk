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
        @numberKeys()
        post.on 'keys', @onKeys
        
    onKeys: (action) =>
        switch action
            when 'functions' then @functionKeys()
            when 'numbers'   then @numberKeys()
        
    setKeys: (@keys, keys) =>
        
        @view.innerHTML = ''
        for row in keys
            @view.appendChild row
        
    row: (children) => elem 'span', class:'button-row', children:children
    button: (text, clss='button') => elem class:clss, text:text, click: @onButton
        
    numberKeys: ->
                
        @setKeys 'numbers', [
            @row [
                    @button "C"
                    @button "⌫"
                    @button "/"
                    @button "*"
                ]
            @row [
                    @button "7"
                    @button "8"
                    @button "9"
                    @button "-"
                ]
            @row [
                    @button "4"
                    @button "5"
                    @button "6"
                    @button "+"
                ]
            @row [
                    @button "1"
                    @button "2"
                    @button "3"
                    @button "=", 'button tall'
                ]
            @row [
                    @button "ƒ"
                    @button "0"
                    @button "."
                ]
            ]
    
    functionKeys: ->
        
        @setKeys 'functions', [
            @row [
                    @button "C"
                    @button "√"
                    @button "log"
                    @button "deg"
                ]
            @row [
                    @button "^"
                    @button "^2"
                    @button "exp"
                    @button "rad"
                ]
            @row [
                    @button "sin"
                    @button "cos"
                    @button "tan"
                    @button "hex"
                ]
            @row [
                    @button "1/x"
                    @button "π"
                    @button "ℇ"
                    @button "=", 'button tall'
                ]
            @row [
                    @button "ℵ" # ℂ
                    @button "("
                    @button ")"
                ]
            ]

    onButton: (event) => post.emit 'button', event.target.innerHTML.trim()
    
    toggleKeys: ->
        log @keys
        switch @keys
            when 'numbers' then @functionKeys()
            else @numberKeys()
    
    # 000   000  00000000  000   000
    # 000  000   000        000 000 
    # 0000000    0000000     00000  
    # 000  000   000          000   
    # 000   000  00000000     000   
    
    globalModKeyComboEvent: (mod, key, combo, event) ->

        log 'mod', mod, combo
        
        switch combo
            when 'ctrl'                         then @toggleKeys(); return stopEvent event
            when '/', '*', '+', '-', '=', '.'   then return post.emit 'button', combo
            when 'enter'                        then return post.emit 'button', '='
            when 'backspace'                    then return post.emit 'button', '⌫'
            when 'delete', 'esc'                then return post.emit 'button', 'C'
            when 'shift+8'                      then return post.emit 'button', '*'
            when 'shift+6'                      then return post.emit 'button', '^'
            when 'shift+='                      then return post.emit 'button', '+'
            when 'shift+9'                      then return post.emit 'button', '('
            when 'shift+0'                      then return post.emit 'button', ')'
            when 'e'                            then return post.emit 'button', 'ℇ'
            when 'p'                            then return post.emit 'button', 'π'
            when 's'                            then return post.emit 'button', 'sin'
            when 'c'                            then return post.emit 'button', 'cos'
            when 't'                            then return post.emit 'button', 'tan'
            when 'd'                            then return post.emit 'button', 'deg'
            when 'r'                            then return post.emit 'button', 'rad'
            when 'l'                            then return post.emit 'button', 'log'
            when 'x'                            then return post.emit 'button', 'exp'
            when 'h'                            then return post.emit 'button', 'hex'
            when 'i'                            then return post.emit 'button', '1/x'
            when 'num lock'                     then post.emit 'button', 'C'; return stopEvent event
            
        if combo.startsWith 'numpad'
            return post.emit 'button', combo.split(' ')[1]
        else if combo in [0..9].map (i) -> "#{i}"
            return post.emit 'button', combo
            
        'unhandled'
            
module.exports = Keys
