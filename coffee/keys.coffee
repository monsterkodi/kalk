###
000   000  00000000  000   000   0000000
000  000   000        000 000   000     
0000000    0000000     00000    0000000 
000  000   000          000          000
000   000  00000000     000     0000000 
###

{ stopEvent, post, elem, $ } = require 'kxk'

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
    key: (text, clss='') => 
        if text == '_' 
            elem 'td', class:'key hidden'
        else
            cfg = class:'key '+ clss, text:text, click: @onButton
            if clss.indexOf('wide') >= 0
                cfg.colSpan = 2
            if clss.indexOf('tall') >= 0
                cfg.rowSpan = 2
            elem 'td', cfg
        
    numberKeys: ->
                
        @setKeys 'numbers', [
            @row [
                    @key "C", 'tall'
                    @key "√", 'op0'
                    @key "^", 'op0'
                    @key "/", 'op1'
                    @key "*", 'op1'
                ]
            @row [
                    @key "7", 'digit'
                    @key "8", 'digit'
                    @key "9", 'digit'
                    @key "-", 'dot'
                ]
            @row [
                    @key "⌫"
                    @key "4", 'digit'
                    @key "5", 'digit'
                    @key "6", 'digit'
                    @key "+", 'dot'
                ]
            @row [
                    @key "ƒ", 'tall bottom function'
                    @key "1", 'digit'
                    @key "2", 'digit'
                    @key "3", 'digit'
                    @key "=", 'tall bottom'
                ]
            @row [
                    @key "0", 'wide digit right'
                    @key ".", 'dot'
                ]
            ]
    
    functionKeys: ->
        
        @setKeys 'functions', [
            @row [
                    @key "C", 'tall'
                    @key "√", 'op0'
                    @key "^", 'op0'
                    @key "/", 'op1'
                    @key "*", 'op1'
                ]
            @row [
                    @key "sin", 'function'
                    @key "cos", 'function'
                    @key "π",   'constant'    
                    @key "-",   'dot'
                ]
            @row [
                    @key "⌫"
                    @key "tan", 'function'
                    @key "log", 'function'
                    @key "ℇ",   'constant'
                    @key "+",   'dot'
                ]
            @row [
                    @key "ℵ",   'tall bottom digit'
                    @key "1/x", 'op1'
                    @key '∡',   'op1'
                    @key 'ϕ',   'constant'
                    @key "=",   'tall bottom equals'
                ]
            @row [
                    @key "(",   'bracket'
                    @key "°",   'digit'
                    @key ")",   'bracket'
                ]
            ]

    onButton: (event) => post.emit 'button', event.target.innerHTML.trim()
    
    toggleKeys: ->
        
        switch @keys
            when 'numbers' then @functionKeys()
            else @numberKeys()
    
    # 000   000  00000000  000   000
    # 000  000   000        000 000 
    # 0000000    0000000     00000  
    # 000  000   000          000   
    # 000   000  00000000     000   
    
    globalModKeyComboEvent: (mod, key, combo, event) ->

        switch combo
            when 'tab'                          then return stopEvent event, @toggleKeys()
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
            when 'd'                            then return post.emit 'button', '°'
            when 'r'                            then return post.emit 'button', '√'
            when 'l'                            then return post.emit 'button', 'log'
            when 'x'                            then return post.emit 'button', 'exp'
            when 'i'                            then return post.emit 'button', '1/x'
            when 'num lock'                     then return stopEvent event, post.emit 'button', 'C'
            
        if combo.startsWith 'numpad'
            return post.emit 'button', combo.split(' ')[1]
        else if combo in [0..9].map((i) -> "#{i}")
            return post.emit 'button', combo
            
        'unhandled'
            
module.exports = Keys
