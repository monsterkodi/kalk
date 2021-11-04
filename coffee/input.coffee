###
000  000   000  00000000   000   000  000000000
000  0000  000  000   000  000   000     000   
000  000 0 000  00000000   000   000     000   
000  000  0000  000        000   000     000   
000  000   000  000         0000000      000   
###

{ $, elem, fs, post } = require 'kxk'

calc  = require './calc'
color = require './color'
text  = require './text'

class Input

    @: ->
        
        @view = $ "#input"
        @plain = ''
        
        post.on 'resize' @onResize
        post.on 'button' @onButton
        post.on 'menuAction' (action) => if action == 'Clear' then @clear()
        @input = elem class:'input-text' 'tab-index': 1
        @view.appendChild @input
                
    backspace:         -> @setText text.popChar @text()
    appendText: (text) -> @setText @text() + text
    textLength:        -> @text().length
    clear:             => @setText(''); delete @forceBracket
    onResize:          => @setText @plain
    
    text:  -> @plain
    setText: (@plain) -> 
        if (text.balance(@plain) == 1) and not @forceBracket
            @input.innerHTML = color text.clean @plain
        else
            @input.innerHTML = color @plain
            
        # width: 452+ max font size: 90
        br = @input.getBoundingClientRect()
        cw = 55
        if @plain.length > br.width/cw
            fs = 90*br.width / (cw*@plain.length)
        else
            fs = 90
        @input.style.fontSize = "#{fs}px"
        
    onButton: (key) =>
        
        switch key
            when 'ƒ' then post.emit 'keys' 'functions'
            when 'ℵ' then post.emit 'keys' 'numbers'
            when '⌫' then @backspace()
            when 'c' then @clear()
            else
                switch key
                    when '(' ')' then @forceBracket = true
                @setText calc.textKey @text(), key

module.exports = Input
