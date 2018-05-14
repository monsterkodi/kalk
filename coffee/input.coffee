###
000  000   000  00000000   000   000  000000000
000  0000  000  000   000  000   000     000   
000  000 0 000  00000000   000   000     000   
000  000  0000  000        000   000     000   
000  000   000  000         0000000      000   
###

{ post, elem, empty, log, str, $ } = require 'kxk'
CoffeeScript = require 'coffeescript'

class Input

    constructor: ->
        
        @view = $ "#input"
        post.on 'button', @onButton
        @input = elem class:'input-text'
        @view.appendChild @input
        
    calculate: (text) ->
        return '' if empty text
        coffee = text
        coffee = coffee.replace /3√/g, 'cbrt'
        coffee = coffee.replace /√/g, 'sqrt'
        coffee = coffee.replace /π/g, 'Math.PI'
        coffee = coffee.replace /ℇ/g, 'Math.E'
        coffee = coffee.replace /∞/g, 'Infinity'
        coffee = coffee.replace /log/g, 'Math.log'
        
        if coffee.split('^').length == 2
            coffee = 'pow ' + coffee.split('^')[0] + ', ' + coffee.split('^')[1]
        
        coffee = """
            deg = (r) -> 180 * r / Math.PI
            rad = (d) -> Math.PI * d / 180
            for f in ['sin', 'asin', 'cos', 'acos', 'tan', 'atan', 'exp', 'sqrt', 'cbrt', 'pow']
                global[f] = Math[f]
            """ + '\n' + coffee
        # log 'coffee', coffee
        # log 'script', CoffeeScript.compile coffee, bare:true
        val = str eval CoffeeScript.compile coffee, bare:true
        
        text = text.replace /2\.718281828459045/g, 'ℇ'
        text = text.replace /3\.141592653589793/g, 'π'
        text = text.replace /Infinity/g, '∞'
        val  = val.replace  /Infinity/g, '∞'
        
        post.emit 'sheet', text:text, val:val
        
        val  = val.replace  /NaN/g, ''
        return val
        
    backspace:          -> @setText @text().substr 0, @textLength()-1
    appendText:  (text) -> @setText @text() + text
    textLength:         -> @text().length
    clear:              -> @setText ''
    
    text:               -> @input.innerText
    setText:     (text) -> @input.innerText = text
        
    onButton: (key) => 
        
        # log "Input.onButton '#{key}'"
        
        switch key
            when 'ƒ' then post.emit 'keys', 'functions'
            when 'ℵ' then post.emit 'keys', 'numbers'
            when '⌫' then @backspace()
            when 'C' then @clear()
            when 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', '3√', '√', 'deg', 'rad', 'exp', 'log'
                if not empty(@text()) and @text()[@textLength()-1] not in ['+', '-', '/', '*']
                    @setText @calculate key + ' ' + @text()
                else
                    @appendText key + ' '
            when '=' 
                @setText @calculate @text()
            when '1/x'
                @setText @calculate '1/(' + @text() + ')'
            else
                if @text() != '0'
                    @appendText key
                else
                    if key in ['.', 'x', '+', '-', '/', '*', ' ']
                        @appendText key
                    else
                        @setText key

module.exports = Input
