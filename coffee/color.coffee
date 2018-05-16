###
 0000000   0000000   000       0000000   00000000 
000       000   000  000      000   000  000   000
000       000   000  000      000   000  0000000  
000       000   000  000      000   000  000   000
 0000000   0000000   0000000   0000000   000   000
###

{ matchr, log } = require 'kxk'

class Color

    constructor: () ->
        
        @config = matchr.config 
            '=': 'equals'
            'e[-+]': 'exponent'
            '[\\.]': 'dot'
            '[\\(\\)]': 'bracket'
            '\\d+': 'digit' 
            '°': 'digit' 
            '(?:\d)(i)': 'complex'
            '(sin|cos|tan|exp|log|deg|rad|hex)': 'function'
            'NaN': 'nan'
            '[πℇ∞]': 'constant'
            '[√^]': 'op0'
            '[*/]': 'op1'
            '(?:[^e])([+-])': 'dot'
    
    colorize: (text) => 
    
        rngs = matchr.ranges @config, text
        colorized = ''
        index = 0
        for rng in rngs
            while index < rng.start
                index += 1
                colorized += "&nbsp;"
            colorized += "<span class=\"#{rng.value}\">#{rng.match}</span>"
            index = rng.start + rng.match.length
        return colorized


module.exports = (new Color()).colorize
