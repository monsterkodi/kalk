###
 0000000   0000000   000       0000000
000       000   000  000      000     
000       000000000  000      000     
000       000   000  000      000     
 0000000  000   000  0000000   0000000
###

{ empty, post, str, log } = require 'kxk'

math   = require 'mathjs'
parens = require './parens'

class Calc

    @calc: (text) ->
        
        return '' if empty text
        
        expr = text
        
        expr = parens.close expr
        
        expr = expr.replace /√/g, 'sqrt'
        expr = expr.replace /π/g, 'pi'
        expr = expr.replace /ℇ/g, 'E'
        expr = expr.replace /∞/g, 'Infinity'
        expr = expr.replace /°/g, ' deg'
        
        math.config number: 'BigNumber', precision: 19
        
        evl  = math.eval expr
        if evl.value?
            val = str evl.value
        else if evl.toString?
            val = evl.toString()
        else
            val  = str evl
        log 'expr:', expr, 'val:', val
        
        val  = val.replace  /Infinity/g, '∞'
        
        expr = expr.replace /sqrt/g, '√'
        expr = expr.replace /pi/g, 'π'
        expr = expr.replace /E/g, 'ℇ'
        expr = expr.replace /Infinity/g, '∞'
        expr = expr.replace /\ deg/g, '°'
        
        post.emit 'sheet', text:expr, val:val
        
        val  = val.replace  /NaN/g, ''
                
    @textKey: (text, key) ->
        log 'textKey', text, 'key', key
        switch key
            when 'sin', 'cos', 'tan', '√', 'deg', 'rad', 'exp', 'log'

                if not empty(text) and text[text.length-1] in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'ℇ', 'π', '∞']
                    text = @calc key + ' ' + text

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
                else if key in ['+', '-']
                    text = key
            else
                if text != '0'
                    text += key
                else
                    text = key
        text

module.exports = Calc
