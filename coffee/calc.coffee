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

    @calculate: (text) ->
        
        return '' if empty text
        
        coffee = text
        coffee = coffee.replace /√/g, 'sqrt'
        coffee = coffee.replace /π/g, 'Math.PI'
        coffee = coffee.replace /ℇ/g, 'Math.E'
        coffee = coffee.replace /∞/g, 'Infinity'
        coffee = coffee.replace /log/g, 'Math.log'
        
        if coffee.split('^').length == 2
            coffee = 'pow ' + coffee.split('^')[0] + ', ' + coffee.split('^')[1]
        
        coffee = """
            deg = (r) -> 180 * r / Math.PI
            rad = (d) -> Math.PI * d / 180
            for f in ['sin', 'asin', 'cos', 'acos', 'tan', 'atan', 'exp', 'sqrt', 'cbrt', 'pow']
                global[f] = Math[f]
            """ + '\n' + coffee
            
        log 'coffee', coffee
        log 'script', CoffeeScript.compile coffee, bare:true
        
        val  = str eval CoffeeScript.compile coffee, bare:true
        
        text = text.replace /2\.718281828459045/g, 'ℇ'
        text = text.replace /3\.141592653589793/g, 'π'
        text = text.replace /Infinity/g, '∞'
        val  = val.replace  /Infinity/g, '∞'
        
        post.emit 'sheet', text:text, val:val
        
        val  = val.replace  /NaN/g, ''

module.exports = Calc.calculate
