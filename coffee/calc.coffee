###
 0000000   0000000   000       0000000
000       000   000  000      000     
000       000000000  000      000     
000       000   000  000      000     
 0000000  000   000  0000000   0000000
###

{ empty, post, str, log } = require 'kxk'

math = require 'mathjs'

class Calc

    @calc: (text) ->
        
        return '' if empty text
        
        expr = text
        
        expr = @closeParens expr
        
        expr = expr.replace /√/g, 'sqrt'
        expr = expr.replace /π/g, 'pi'
        expr = expr.replace /ℇ/g, 'E'
        expr = expr.replace /∞/g, 'Infinity'
        expr = expr.replace /°/g, ' deg'
        
<<<<<<< HEAD
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
=======
        math.config number: 'BigNumber', precision: 24
        
        evl  = math.eval expr
        if evl.value?
            val = str evl.value
        else if evl.toString?
            val = evl.toString()
        else
            val  = str evl
        log 'expr:', expr, 'val:', val
>>>>>>> ae0d531c8555eb554367460415780ceca15d4a14
        
        val  = val.replace  /Infinity/g, '∞'
        
        expr = expr.replace /sqrt/g, '√'
        expr = expr.replace /pi/g, 'π'
        expr = expr.replace /E/g, 'ℇ'
        expr = expr.replace /Infinity/g, '∞'
        expr = expr.replace /\ deg/g, '°'
        
        post.emit 'sheet', text:expr, val:val
        
        val  = val.replace  /NaN/g, ''
        
    @closeParens: (text) ->
        
        o = 0
        for c in text
            switch c
                when '(' then o += 1
                when ')' then o -= 1
        while o > 0
            o -= 1
            text += ')'
        text
        
    @textKey: (text, key) ->
        log 'textKey', text, 'key', key
        switch key
            when 'sin', 'cos', 'tan', '√', 'deg', 'rad', 'exp', 'log'
<<<<<<< HEAD
                if not empty(text) and text[text.length-1] in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'ℇ', 'π', '∞']
                    text = @calc key + ' ' + text
=======
                if not empty(text) and text[text.length-1] not in ['+', '-', '/', '*']
                    text = @calc key + '(' + text + ')'
>>>>>>> ae0d531c8555eb554367460415780ceca15d4a14
                else
                    text += key + '('
            when '°'
                text += key
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
