###
000  000   000  00000000   000   000  000000000
000  0000  000  000   000  000   000     000   
000  000 0 000  00000000   000   000     000   
000  000  0000  000        000   000     000   
000  000   000  000         0000000      000   
###

{ post, elem, empty, log, $ } = require 'kxk'

calc  = require './calc'
color = require './color'
text  = require './text'

class Input

    constructor: ->
        
        @view = $ "#input"
        @plain = ''
        
        post.on 'button', @onButton
        @input = elem class:'input-text', 'tab-index': 1
        @view.appendChild @input
                
    backspace:         -> @setText text.popChar @text()
    appendText: (text) -> @setText @text() + text
    textLength:        -> @text().length
    clear:             -> @setText(''); delete @forceBracket
    
    text:  -> @plain
    setText: (@plain) -> 
        if (text.balance(@plain) == 1) and not @forceBracket
            @input.innerHTML = color text.clean @plain
        else
            @input.innerHTML = color @plain
        fs = 80 / Math.ceil(@plain.length/9)
        @input.style.fontSize = "#{fs}px"
        
    onButton: (key) => 
        
        switch key
            when 'ƒ' then post.emit 'keys', 'functions'
            when 'ℵ' then post.emit 'keys', 'numbers'
            when '⌫' then @backspace()
            when 'C' then @clear()
            else
                switch key
                    when '(', ')' then @forceBracket = true
                @setText calc.textKey @text(), key

module.exports = Input
