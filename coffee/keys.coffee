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
        @table = elem 'table', class:'key-table', cellSpacing: '7px'
        @view.appendChild @table
        @numberKeys()
        post.on 'keys', @onKeys
        
    onKeys: (action) =>
        switch action
            when 'functions' then @functionKeys()
            when 'numbers'   then @numberKeys()
        
    setKeys: (@keys, keys) =>
        
        @table.innerHTML = ''
        for row in keys
            @table.appendChild row
        
    row: (children) => elem 'tr', class:'key-row', children:children
    key: (text, clss='key') => 
        if text == '_' 
            elem 'td', class:'key hidden'
        else
            cfg = class:clss, text:text, click: @onButton
            if clss.indexOf('wide') >= 0
                cfg.colSpan = 2
            if clss.indexOf('tall') >= 0
                cfg.rowSpan = 2
            elem 'td', cfg
        
    numberKeys: ->
                
        @setKeys 'numbers', [
            @row [
                    @key "C", 'key tall'
                    @key "√", 'key op0'
                    @key "^", 'key op0'
                    @key "/", 'key op1'
                    @key "*", 'key op1'
                ]
            @row [
                    @key "7", 'key digit'
                    @key "8", 'key digit'
                    @key "9", 'key digit'
                    @key "-", 'key dot'
                ]
            @row [
                    @key "⌫"
                    @key "4", 'key digit'
                    @key "5", 'key digit'
                    @key "6", 'key digit'
                    @key "+", 'key dot'
                ]
            @row [
                    @key "ƒ", 'key tall bottom function'
                    @key "1", 'key digit'
                    @key "2", 'key digit'
                    @key "3", 'key digit'
                    @key "=", 'key tall bottom'
                ]
            @row [
                    @key "0", 'key wide digit right'
                    @key ".", 'key dot'
                ]
            ]
    
    functionKeys: ->
        
        @setKeys 'functions', [
            @row [
                    @key "C", 'key tall'
                    @key "sin", 'key function'
                    @key "cos", 'key function'
                    @key "tan", 'key function'
                    @key "π", 'key constant'    
                ]
            @row [
                    @key "hex", 'key'
                    @key "log", 'key function'
                    @key "exp", 'key function'
                    @key "ℇ", 'key constant'
                ]
            @row [
                    @key "⌫"
                ]
            @row [
                    @key "ℵ", 'key tall bottom digit'
                    @key "1/x", 'key op1'
                    @key "°", 'key digit'
                    @key "=", 'key tall bottom wide equals'
                ]
            @row [
                    @key "(", 'key bracket'
                    @key ")", 'key bracket'
                ]
            ]

    onButton: (event) => post.emit 'button', event.target.innerHTML.trim()
    
    toggleKeys: ->
        # log @keys
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
            when 'tab'                          then @toggleKeys(); return stopEvent event
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
