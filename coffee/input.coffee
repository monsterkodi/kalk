###
000  000   000  00000000   000   000  000000000
000  0000  000  000   000  000   000     000   
000  000 0 000  00000000   000   000     000   
000  000  0000  000        000   000     000   
000  000   000  000         0000000      000   
###

{ post, elem, log, $ } = require 'kxk'

class Input

    @input = null
    @init: -> new Input $ "#input"
    
    constructor: (@view) ->
        
        post.on 'button', @onButton
        @view.appendChild elem class:'input'
        
    onButton: (key) => log 'button', key

module.exports = Input
