class OS
{
    static loaded = false

    static platform = 'Darwin'

    static isMac = true

    static homedir = null
}

try
{
    ;(async function ()
    {
        import('os')
        .
        catch(function (e)
        {}).then(function (os)
        {
            if (os)
            {
                OS.homedir = os.homedir()
                OS.platform = os.platform()
                OS.isMac = OS.platform === 'Darwin'
                return OS.loaded = true
            }
            else
            {
                return OS.loaded = 'not available'
            }
        })
        return null
    })()
}
catch (err)
{
    console.error(err)
    OS.loaded = 'not available!'
    err
}
export default OS;