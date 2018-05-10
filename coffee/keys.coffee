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
            when 'symbols'   then @symbolKeys()
        
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
                    @button "√"
                    @button "3√"
                    @button "^2"
                    @button "^3"
                ]
            @row [
                    @button "sin"
                    @button "cos"
                    @button "tan"
                    @button "deg"
                ]
            @row [
                    @button "asin"
                    @button "acos"
                    @button "atan"
                    @button "rad"
                ]
            @row [
                    @button "≪"
                    @button "≫"
                    @button "1/x"
                    @button "=", 'button tall'
                ]
            @row [
                    @button "ℂ"
                    @button "("
                    @button ")"
                ]
            ]

    symbolKeys: ->
        
        @setKeys 'symbols', [
            @row [
                    @button "√"
                    @button "3√"
                    @button "^2"
                    @button "^3"
                ]
            @row [
                    @button "sin"
                    @button "cos"
                    @button "tan"
                    @button "atan"
                ]
            @row [
                    @button "("
                    @button ")"
                    @button "e"
                    @button "x"
                ]
            @row [
                    @button "≪"
                    @button "≫"
                    @button "1/x"
                    @button "=", 'button tall'
                ]
            @row [
                    @button "ℵ"
                    @button "π"
                    @button "ℇ"
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

        # log 'mod', mod, combo
        
        switch combo
            when 'ctrl'                         then @toggleKeys(); return stopEvent event
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
