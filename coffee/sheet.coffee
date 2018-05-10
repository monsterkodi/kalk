
#  0000000  000   000  00000000  00000000  000000000
# 000       000   000  000       000          000   
# 0000000   000000000  0000000   0000000      000   
#      000  000   000  000       000          000   
# 0000000   000   000  00000000  00000000     000   

{ post, elem, log, str, $ } = require 'kxk'

class Sheet

    constructor: ->
        
        @view = $ "#sheet"
        
        post.on 'sheet', @onSheet
        
    onSheet: (action) =>
        
        switch action
            when 'clear' then @view.innerHTML = ''
            else
                if action.text != str action.val
                    log action.text, action.val
                    @view.appendChild elem class:'sheet-line', text:"#{action.text} = #{action.val}"
                else
                    @view.appendChild elem class:'sheet-line', text:"#{action.text}"
        
module.exports = Sheet
