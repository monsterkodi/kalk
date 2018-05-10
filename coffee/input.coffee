###
000  000   000  00000000   000   000  000000000
000  0000  000  000   000  000   000     000   
000  000 0 000  00000000   000   000     000   
000  000  0000  000        000   000     000   
000  000   000  000         0000000      000   
###

{ post, elem, empty, log, $ } = require 'kxk'
CoffeeScript = require 'coffeescript'

class Input

    constructor: ->
        
        @view = $ "#input"
        post.on 'button', @onButton
        @text = elem class:'input-text'
        @view.appendChild @text
        
    calculate: (text) ->
        return '' if empty text
        coffee = text
        coffee = coffee.replace /3√/g, 'cbrt'
        coffee = coffee.replace /√/g, 'sqrt'
        coffee = coffee.replace /π/g, 'Math.PI'
        coffee = coffee.replace /ℇ/g, 'Math.E'
        
        coffee = """
            deg = (r) -> 180 * r / Math.PI
            rad = (d) -> Math.PI * d / 180
            for f in ['sin', 'asin', 'cos', 'acos', 'tan', 'atan', 'pow', 'exp', 'sqrt', 'cbrt']
                global[f] = Math[f]
            """ + '\n' + coffee
        # log 'coffee', coffee
        # log CoffeeScript.compile coffee, bare:true
        val = eval CoffeeScript.compile coffee, bare:true
        post.emit 'sheet', text:text, val:val
        return val
        
    onButton: (key) => 
        
        log "Input.onButton '#{key}'"
        
        switch key
            when 'ƒ' then post.emit 'keys', 'functions'
            when 'ℂ' then post.emit 'keys', 'symbols'
            when 'ℵ' then post.emit 'keys', 'numbers'
            when '⌫' then @text.innerText = @text.innerText.substr 0, @text.innerText.length-1
            when 'C' then @text.innerText = ''
            when '_' then @text.innerText += ' '
            when 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', '3√', '√', 'deg', 'rad'
                if not empty(@text.innerText) and @text.innerText[@text.innerText.length-1] not in ['+', '-', '/', '*']
                    @text.innerText = @calculate key + ' ' + @text.innerText
                else
                    @text.innerText += key + ' '
            when '=' 
                @text.innerText = @calculate @text.innerText
            else
                if @text.innerText != '0'
                    @text.innerText += key
                else
                    if key in ['.', 'x', '+', '-', '/', '*', ' ']
                        @text.innerText += key
                    else
                        @text.innerText = key

module.exports = Input
