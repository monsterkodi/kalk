###
 0000000   0000000   000       0000000
000       000   000  000      000     
000       000000000  000      000     
000       000   000  000      000     
 0000000  000   000  0000000   0000000
###

{ empty, post, str, log } = require 'kxk'

CoffeeScript = require 'coffeescript'

class Calc

    @pow: (text) ->
        while 0 < text.lastIndexOf '^'
            i = text.lastIndexOf '^'
            text = 'pow(' + @pow(text.slice(0,i)) + ', ' + text.slice(i+1) + ')'
        text
    
    @calc: (text) ->
        
        return '' if empty text
        
        coffee = text
        coffee = coffee.replace /√/g, 'sqrt'
        coffee = coffee.replace /π/g, 'Math.PI'
        coffee = coffee.replace /ℇ/g, 'Math.E'
        coffee = coffee.replace /∞/g, 'Infinity'
        coffee = coffee.replace /log/g, 'Math.log'
        
        if coffee.split('^').length > 1
            coffee = @pow coffee
            
        log 'coffee', coffee
        
        coffee = """
            deg = (r) -> 180 * r / Math.PI
            rad = (d) -> Math.PI * d / 180
            for f in ['sin', 'cos', 'tan', 'exp', 'sqrt', 'pow']
                global[f] = Math[f]
            """ + '\n' + coffee
            
        # log 'script', CoffeeScript.compile coffee, bare:true
        evl  = eval CoffeeScript.compile coffee, bare:true
        val  = str evl
        log 'evl', evl, 'val', val
        
        text = text.replace /2\.718281828459045/g, 'ℇ'
        text = text.replace /3\.141592653589793/g, 'π'
        text = text.replace /Infinity/g, '∞'
        val  = val.replace  /Infinity/g, '∞'
        
        post.emit 'sheet', text:text, val:val
        
        val  = val.replace  /NaN/g, ''
        
    @textKey: (text, key) ->
        # log 'textKey', text, 'key', key
        switch key
            when 'sin', 'cos', 'tan', '√', 'deg', 'rad', 'exp', 'log'
                if not empty(text) and text[text.length-1] in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'ℇ', 'π', '∞']
                    text = @calc key + ' ' + text
                else
                    text += key + ' '
            when '=' 
                text = @calc text
            when '1/x'
                text =  @calc '1/(' + text + ')'
            when '.', 'x', '+', '-', '/', '*', '^'
                if not empty(text) 
                    if text[text.length-1] not in ['.', 'x', '+', '-', '/', '*', '^']
                        text += key
            else
                if text != '0'
                    text += key
                else
                    text = key
        text

module.exports = Calc
