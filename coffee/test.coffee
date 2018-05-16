###
000000000  00000000   0000000  000000000  
   000     000       000          000     
   000     0000000   0000000      000     
   000     000            000     000     
   000     00000000  0000000      000     
###

{ expect } = require 'chai'

assert = require 'assert'
calc   = require './calc'

describe 'calc', ->

    it 'parse', ->
        
        expect calc.parse 'sin 2'
        .to.eql calc.parse 'sin(2)'
    
    it 'calc', ->
        expect calc.calc '2^2^2'
        .to.eql '16'
        expect calc.calc '2^(3^4)'
        .to.eql '2.4178516392292583e+24'
    
    it 'equals', ->
        expect calc.textKey '2^2', '='
        .to.eql '4'
        expect calc.textKey '2^4', '='
        .to.eql '16'
        expect calc.textKey '2^2^2', '='
        .to.eql '16'
    