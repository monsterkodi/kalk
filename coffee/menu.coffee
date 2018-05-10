###
00     00  00000000  000   000  000   000
000   000  000       0000  000  000   000
000000000  0000000   000 0 000  000   000
000 0 000  000       000  0000  000   000
000   000  00000000  000   000   0000000 
###

{ post, elem, sds, log, $, _ } = require 'kxk'

class Menu

    @template: ->

        [
            # 000   000   0000000   000      000   000  
            # 000  000   000   000  000      000  000   
            # 0000000    000000000  000      0000000    
            # 000  000   000   000  000      000  000   
            # 000   000  000   000  0000000  000   000  
    
            text: 'kalk'
            menu: [
                text:   "About kalk",                   accel:  'ctrl+shift+/'
            ,
                text:   ''
            ,
                text:   'Quit',                         accel:  'ctrl+q'
            ]
        ,
            # 00000000  0000000    000  000000000  
            # 000       000   000  000     000     
            # 0000000   000   000  000     000     
            # 000       000   000  000     000     
            # 00000000  0000000    000     000     
            
            # text: 'Edit'
            # menu: [
                # text: 'Undo',   accel: 'ctrl+z'
            # ,
                # text: 'Redo',   accel: 'ctrl+shift+z'
            # ,
                # text: ''
            # ,
                # text: 'Cut',    accel: 'ctrl+x'
            # ,
                # text: 'Copy',   accel: 'ctrl+c'
            # ,
                # text: 'Paste',  accel: 'ctrl+v'
            # ,
                # text: ''
            # ]
        # ,
            # 000   000  000  000   000  0000000     0000000   000   000
            # 000 0 000  000  0000  000  000   000  000   000  000 0 000
            # 000000000  000  000 0 000  000   000  000   000  000000000
            # 000   000  000  000  0000  000   000  000   000  000   000
            # 00     00  000  000   000  0000000     0000000   00     00
    
            text:   'Window'
            menu: [
                text:   'Maximize',                     accel:  'alt+ctrl+shift+m'
            ,
                text:   ''
            ,
                text:   'Hide Menu',                    accel:  'alt+shift+m'
            ,
                text:   'Show Menu',                    accel:  'alt+m'
            ,
                text:   ''
            ,
                text:   'Toggle Scheme',                accel:  'alt+i'
            ,
                text:   ''
            ,
                text:   'Reload Window',                accel:  'alt+ctrl+l'
            ,
                text:   'Open DevTools',                accel:  'alt+ctrl+i'
            ]
        ]
    
    constructor: ->
        
        @loadMenu()
        
    loadMenu: =>
        
        @elem?.remove()
        {menu} = require 'kxk'
        @menu = new menu items:Menu.template()
        @elem = @menu.elem
        window.titlebar.elem.insertBefore @elem, window.titlebar.elem.firstChild.nextSibling
        @show()
        
    visible: => @elem.style.display != 'none'
    toggle:  => @elem.style.display = @visible() and 'none' or 'inline-block'
    show:    => @elem.style.display = 'inline-block'; @menu?.focus?()
    hide:    => @menu?.close(); @elem.style.display = 'none'
    toggle:  => if @visible() then @hide() else @show()

    # 000   000  00000000  000   000
    # 000  000   000        000 000 
    # 0000000    0000000     00000  
    # 000  000   000          000   
    # 000   000  00000000     000   
    
    globalModKeyComboEvent: (mod, key, combo, event) ->

        if not @mainMenu
            @mainMenu = Menu.template()

        for keypath in sds.find.key @mainMenu, 'accel'
            if combo == sds.get @mainMenu, keypath
                keypath.pop()
                item = sds.get @mainMenu, keypath
                post.emit 'menuAction', item.action ? item.text, item.actarg
                return item
                
        'unhandled'
    
module.exports = Menu
