const test = require('node:test')
const assert = require('node:assert/strict')
const path = require('node:path')
const { pathToFileURL } = require('node:url')

async function keyinfo ()
{
    const url = pathToFileURL(path.join(__dirname, '..', '..', 'js', 'kxk', 'keyinfo.js')).toString()
    return (await import(url)).default
}

test('convertCmdCtrl keeps the mac command key by default', async function ()
{
    delete globalThis.kalkCommandKey
    const K = await keyinfo()
    assert.equal(K.convertCmdCtrl('cmdctrl+c'), 'command+c')
    assert.equal(K.convertCmdCtrl('alt+cmdctrl+i'), 'command+alt+i')
    assert.equal(K.convertCmdCtrl('cmdctrl+shift+`'), 'command+shift+`')
    assert.equal(K.convertCmdCtrl('cmdctrl+alt+/'), 'command+alt+/')
    assert.equal(K.convertCmdCtrl('esc'), 'esc')
})

test('convertCmdCtrl maps cmdctrl and command to ctrl on linux', async function ()
{
    globalThis.kalkCommandKey = 'ctrl'
    try
    {
        const K = await keyinfo()
        assert.equal(K.convertCmdCtrl('cmdctrl+c'), 'ctrl+c')
        assert.equal(K.convertCmdCtrl('alt+cmdctrl+i'), 'alt+ctrl+i')
        assert.equal(K.convertCmdCtrl('cmdctrl+shift+`'), 'ctrl+shift+`')
        assert.equal(K.convertCmdCtrl('cmdctrl+alt+/'), 'alt+ctrl+/')
        assert.equal(K.convertCmdCtrl('command+h'), 'ctrl+h')
        assert.equal(K.convertCmdCtrl('alt+m'), 'alt+m')
    }
    finally
    {
        delete globalThis.kalkCommandKey
    }
})
