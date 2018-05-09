
# 000   000  00000000  000   000   0000000
# 000  000   000        000 000   000     
# 0000000    0000000     00000    0000000 
# 000  000   000          000          000
# 000   000  00000000     000     0000000 

{ elem, log, $ } = require 'kxk'

class Keys

    @keys = null
    @init: -> 
        @keys = new Keys $ "#keys"
        
    constructor: (@view) ->
        
        row = (children) => @view.appendChild elem 'span', class:'button-row', children:children
        button = (text, clss='button') -> elem class:clss, text:text 
        
        row [
                button "C"
                button "="
                button "/"
                button "*"
            ]
        row [
                button "7"
                button "8"
                button "9"
                button "-"
            ]
        row [
                button "4"
                button "5"
                button "6"
                button "+"
            ]
        row [
                button "1"
                button "2"
                button "3"
                button "↩", 'button tall'
            ]
        row [
                button "0", 'button wide'
                button "."
            ]
            
module.exports = Keys
