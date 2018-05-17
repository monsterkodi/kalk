###
 0000000   0000000   000       0000000
000       000   000  000      000     
000       000000000  000      000     
000       000   000  000      000     
 0000000  000   000  0000000   0000000
###

{ empty, post, str, log } = require 'kxk'

math = require 'mathjs'
text = require './text'

class Calc

    @calc: (expr) ->
        
        return '' if empty expr
        
        expr = text.close expr
        
        expr = expr.replace /√/g, 'sqrt'
        expr = expr.replace /π/g, 'pi'
        expr = expr.replace /ℇ/g, 'E'
        expr = expr.replace /∞/g, 'Infinity'
        expr = expr.replace /°/g, ' deg'
        
        # math.config number: 'BigNumberp', precision: 19
        
        # log 'expr:', expr
        
        evl  = math.eval expr
        if evl.value?
            val = str evl.value
        else if evl.toString?
            val = evl.toString()
        else
            val  = str evl
            
        # log 'expr:', expr, 'val:', val
        
        val  = val.replace  /Infinity/g, '∞'
        
        expr = expr.replace /sqrt/g, '√'
        expr = expr.replace /pi/g, 'π'
        expr = expr.replace /E/g, 'ℇ'
        expr = expr.replace /Infinity/g, '∞'
        expr = expr.replace /\ deg/g, '°'
        
        post.emit 'sheet', text:expr, val:val
        
        val  = val.replace  /NaN/g, ''
                
    @textKey: (txt, key) ->
        
        # log 'textKey', txt, 'key', key
        
        switch key
            when 'sin', 'cos', 'tan', '√', 'deg', 'rad', 'exp', 'log'

                if not empty(txt) and text.endsWithValue txt 
                    txt = @calc key + '(' + txt
                else 
                    txt += key + '('
            when '°'
                txt += key
            when '=' 
                txt = @calc txt
            when '1/x'
                txt =  @calc '1/(' + txt + ')'
            when '+', '-'
                if not text.endsWith txt, ['+', '-', '.']
                    txt += key
            when '.'
                if text.endsWithNumber(txt) and not text.endsWithFloat(txt)
                    txt += key
            else
                if key in text.unfinished
                    if not empty txt
                        if not text.endsWithUnfinished txt
                            txt += key
                else if txt != '0'
                    txt += key
                else
                    txt = key
        txt

module.exports = Calc
