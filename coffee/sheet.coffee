
#  0000000  000   000  00000000  00000000  000000000
# 000       000   000  000       000          000   
# 0000000   000000000  0000000   0000000      000   
#      000  000   000  000       000          000   
# 0000000   000   000  00000000  00000000     000   

{ post, elem, log, str, $ } = require 'kxk'

color = require './color'

class Sheet

    constructor: ->
        
        @view   = $ "#sheet"
        @calc   = elem class:'sheet-calc'
        @result = elem class:'sheet-result'
        @view.appendChild @calc
        @view.appendChild @result
        post.on 'sheet', @onSheet
        
    onSheet: (action) =>
        
        switch action
            when 'clear' 
                @calc.innerHTML = ''
                @result.innerHTML = ''
            else
                if action.text != str action.val
                    @calc.appendChild elem class:'sheet-line calc', html:color action.text + ' ='
                    @result.appendChild elem class:'sheet-line result', html:color action.val
                else
                    @calc.appendChild elem class:'sheet-line calc', html:''
                    @result.appendChild elem class:'sheet-line result', html:color action.val
        
module.exports = Sheet
