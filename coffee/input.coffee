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

class Input

    constructor: ->
        
        @view = $ "#input"
        @plain = ''
        
        post.on 'button', @onButton
        @input = elem class:'input-text'
        @view.appendChild @input
                
    backspace:          -> @setText @text().substr 0, @textLength()-1
    appendText:  (text) -> @setText @text() + text
    textLength:         -> @text().length
    clear:              -> @setText ''
    
    text:               -> @plain
    setText:     (text) -> @plain = text; @input.innerHTML = color @plain
        
    onButton: (key) => 
        
        # log "Input.onButton '#{key}'"
        
        switch key
            when 'ƒ' then post.emit 'keys', 'functions'
            when 'ℵ' then post.emit 'keys', 'numbers'
            when '⌫' then @backspace()
            when 'C' then @clear()
            when 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', '3√', '√', 'deg', 'rad', 'exp', 'log'
                if not empty(@text()) and @text()[@textLength()-1] not in ['+', '-', '/', '*']
                    @setText calc key + ' ' + @text()
                else
                    @appendText key + ' '
            when '=' 
                @setText calc @text()
            when '1/x'
                @setText calc '1/(' + @text() + ')'
            else
                if @text() != '0'
                    @appendText key
                else
                    if key in ['.', 'x', '+', '-', '/', '*', ' ']
                        @appendText key
                    else
                        @setText key

module.exports = Input
