###
000000000  00000000  000   000  000000000  
   000     000        000 000      000     
   000     0000000     00000       000     
   000     000        000 000      000     
   000     00000000  000   000     000     
###

class Text

    @balance: (txt) ->
        
        o = 0
        for c in txt
            switch c
                when '(' then o += 1
                when ')' then o -= 1
        o        
    
    @close: (txt) ->
        
        o = @balance txt
        while o > 0
            o -= 1
            txt += ')'
        txt
        
    @clean: (txt) ->
        
        o = @balance txt
        while o > 0
            o -= 1
            txt = txt.replace '(', ' '
        txt
      
    @numbers    = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    @constants  = ['ℇ', 'π', '∞', '°']
    @unfinished = ['.', 'x', '+', '-', '/', '*', '^']
    
    @endsWith: (txt, chars) -> txt.length and txt[txt.length-1] in chars
    @endsWithFloat:      (txt) -> /\.\d+$/.test txt
    @endsWithValue:      (txt) -> @endsWithNumber(txt) or @endsWithConstant(txt)
    @endsWithNumber:     (txt) -> @endsWith txt, @numbers
    @endsWithConstant:   (txt) -> @endsWith txt, @constants
    @endsWithUnfinished: (txt) -> @endsWith txt, @unfinished
    @removeTrailingZero: (txt) -> 
        shortened = txt.substr 0,txt.length-1 
        if @endsWith(txt, ['0']) and not (@endsWith(shortened, ['.']) or @endsWithNumber(shortened))
            shortened 
        else
            txt
            

module.exports = Text
