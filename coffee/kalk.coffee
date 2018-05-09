###
000   000   0000000   000      000   000  
000  000   000   000  000      000  000   
0000000    000000000  000      0000000    
000  000   000   000  000      000  000   
000   000  000   000  0000000  000   000  
###

{ keyinfo, scheme, prefs, slash, post, elem, popup, pos, str, log, $ } = require 'kxk'

pkg       = require '../package.json'
electron  = require 'electron'

# 000       0000000    0000000   0000000
# 000      000   000  000   000  000   000
# 000      000   000  000000000  000   000
# 000      000   000  000   000  000   000
# 0000000   0000000   000   000  0000000

post.on 'schemeChanged', -> log 'schemeChanged'

setTitleBar = ->
    
    if slash.win()
        $('titlebar').remove()
        $('.main').style.top = '0px'
        return
    html  = "<span class='titlebarName'>#{pkg.name}</span>"
    html += "<span class='titlebarDot'> ● </span>"
    html += "<span class='titlebarVersion'>#{pkg.version}</span>"
    $('titlebar').innerHTML = html
    $('titlebar').ondblclick = => post.toMain 'toggleMaximize'

$('main').addEventListener "contextmenu", (event) ->
    
    absPos = pos event
    if not absPos?
        absPos = pos $('main').getBoundingClientRect().left, $('main').getBoundingClientRect().top
        
    log 'contextmenu', absPos
    
    opt = items: [
        text:   'Show Menu'
        combo:  'alt'
        cb:     -> electron.remote.getCurrentWindow().setMenuBarVisibility true
    ,
        text:   'About'
        combo:  'ctrl+.'
        cb:      -> post.toMain 'showAbout'
    ,
        text:   'Quit'
        combo:  'ctrl+q' 
        cb:     -> post.toMain 'quitApp'
    ]
    
    opt.x = absPos.x
    opt.y = absPos.y

    popup.menu opt
    
window.onunload = -> document.onkeydown = null

# 000   000  00000000  000   000
# 000  000   000        000 000
# 0000000    0000000     00000
# 000  000   000          000
# 000   000  00000000     000

document.onkeydown = (event) ->

    { mod, key, combo } = keyinfo.forEvent event

    switch combo
        when 'i', 'command+i', 'ctrl+i', 'alt+i'    then return scheme.toggle()
        when 'esc'                                  then return post.toMain 'closeWin'
        when 'down', 'right'                        then return log 'down right'
        when 'up'  , 'left'                         then return log 'up left'
        when 'enter'                                then return log 'enter'
        when 'backspace', 'command+backspace', 'ctrl+backspace', 'delete' then log 'del'

prefs.init()
scheme.set prefs.get 'scheme', 'dark'
setTitleBar()
