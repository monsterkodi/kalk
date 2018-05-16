
# 00000000    0000000   00000000   00000000  000   000   0000000
# 000   000  000   000  000   000  000       0000  000  000     
# 00000000   000000000  0000000    0000000   000 0 000  0000000 
# 000        000   000  000   000  000       000  0000       000
# 000        000   000  000   000  00000000  000   000  0000000 

 class Parens

    @balance: (text) ->
        
        o = 0
        for c in text
            switch c
                when '(' then o += 1
                when ')' then o -= 1
        o        
    
    @close: (text) ->
        
        o = @balance text
        while o > 0
            o -= 1
            text += ')'
        text
        
    @clean: (text) ->
        
        o = @balance text
        while o > 0
            o -= 1
            text = text.replace '(', ' '
        text

module.exports = Parens
