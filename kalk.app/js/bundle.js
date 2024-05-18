class Bundle
{
    static path = window.bundlePath

    static app (p)
    {
        return Bundle.path + '/' + p
    }

    static js (p)
    {
        return Bundle.path + '/js/' + p
    }

    static mac (p)
    {
        return Bundle.path + '/Contents/MacOS/' + p
    }

    static res (p)
    {
        return Bundle.path + '/Contents/Resources/' + p
    }

    static img (p)
    {
        return Bundle.path + '/Contents/Resources/img/' + p
    }
}

export default Bundle;