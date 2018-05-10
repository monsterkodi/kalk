###
000  000   000  00000000   000   000  000000000
000  0000  000  000   000  000   000     000   
000  000 0 000  00000000   000   000     000   
000  000  0000  000        000   000     000   
000  000   000  000         0000000      000   
###

{ post, elem, empty, log, $ } = require 'kxk'

class Input

    constructor: ->
        
        @view = $ "#input"
        post.on 'button', @onButton
        @text = elem class:'input-text'
        @view.appendChild @text
        
    calculate: (text) ->
        return '' if empty text
        val = eval text
        post.emit 'sheet', text:text, val:val
        return val
        
    onButton: (key) => 
        
        # log "Input.onButton '#{key}'"
        
        switch key
            when '⌫' then @text.innerHTML = @text.innerHTML.substr 0, @text.innerHTML.length-1
            when 'C' then @text.innerHTML = ''
            when '=' 
                @text.innerHTML = @calculate @text.innerHTML
            else
                if @text.innerHTML != '0'
                    @text.innerHTML += key
                else
                    if key in ['.', 'x', '+', '-', '/', '*']
                        @text.innerHTML += key
                    else
                        @text.innerHTML = key

module.exports = Input
