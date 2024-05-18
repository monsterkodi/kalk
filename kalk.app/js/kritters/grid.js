var grid

import kxk from "../kxk.js"
let $ = kxk.$
let randInt = kxk.randInt
let elem = kxk.elem


grid = (function ()
{
    function grid ()
    {
        var main

        this.width = 100
        this.height = 100
        main = $('main')
        this.canvas = elem('canvas',{parent:main,class:'gridCanvas'})
    }

    return grid
})()

export default grid;