###
 0000000   0000000   000       0000000
000       000   000  000      000     
000       000000000  000      000     
000       000   000  000      000     
 0000000  000   000  0000000   0000000
###

{ empty, post, kstr, klog } = require 'kxk'

math = require 'mathjs'
text = require './text'

class Calc

    @calc: (expr) ->
        
        return '' if empty expr
        
        expr = text.close expr
        
        expr = expr.replace /∡/,  '(180/pi)*'
        expr = expr.replace /√/g, 'sqrt'
        expr = expr.replace /π/g, 'pi'
        expr = expr.replace /ϕ/g, 'phi'
        expr = expr.replace /ℇ/g, 'E'
        expr = expr.replace /∞/g, 'Infinity'
        expr = expr.replace /°/g, ' deg'
        
        evl  = math.evaluate expr
        if evl.value?
            val = kstr evl.value
        else if evl.toString?
            val = evl.toString()
        else
            val = kstr evl
            
        val  = val.replace  /Infinity/g, '∞'
        
        expr = expr.replace /\(180\/pi\)\*/, '∡'
        expr = expr.replace /sqrt/g, '√'
        expr = expr.replace /pi/g, 'π'
        expr = expr.replace /E/g, 'ℇ'
        expr = expr.replace /phi/g, 'ϕ'
        expr = expr.replace /Infinity/g, '∞'
        expr = expr.replace /\ deg/g, '°'
        
        val += '°' if expr.startsWith '∡'
        
        post.emit 'sheet', text:expr, val:val
        
        val  = val.replace  /NaN/g, ''
                
    @textKey: (txt, key) ->
        
        switch key
            when 'sin', 'cos', 'tan', '√', 'deg', 'rad', 'exp', 'log'

                if not empty(txt) and text.endsWithValue(txt) 
                    txt = @calc key + '(' + txt
                else if not text.endsWith(txt, ['.'])
                    txt += key + '('
            when '°'
                if text.endsWithNumber(txt)
                    txt += key
            when '=' 
                txt = @calc txt
            when '1/x'
                txt = @calc '1/(' + txt + ')'
            when '∡'
                txt = @calc '∡(' + txt + ')'
            when '+', '-'
                if not text.endsWith txt, ['+', '-', '.']
                    txt += key
            when '.'
                if text.endsWithNumber(txt) and not text.endsWithFloat(txt)
                    txt += key
            when 'π', 'ℇ'
                if not text.endsWithConstant(txt)
                    txt += key
            when '('
                if not text.endsWithUnfinished(txt) and not text.endsWithConstant(txt)
                    txt += key
            when ')'
                if not text.endsWithUnfinished(txt) and text.balance(txt) > 0
                    txt += key
            else
                if key in text.unfinished
                    if not empty txt
                        if not text.endsWithUnfinished(txt)
                            txt += key
                else if not text.endsWithConstant(txt)
                    txt = text.removeZeroInfinity(txt) + key
        txt

module.exports = Calc
