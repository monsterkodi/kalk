var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

import os from "./os.js"

class Slash
{
    static sep = '/'

    static logErrors = true

    static path (p)
    {
        var arr, tilde

        if (arguments.length > 1)
        {
            arr = Array.from(arguments)
            arr = arr.filter(function (c)
            {
                return !_k_.empty(c)
            })
            p = arr.join('/')
        }
        if (_k_.empty(p))
        {
            return ''
        }
        if (p.startsWith('~/'))
        {
            p = Slash.untilde(p)
            tilde = true
        }
        p = Slash.unenv(p)
        p = Slash.normalize(p)
        if (!p)
        {
            console.log('no pee?',p)
            return p
        }
        if (p.endsWith(':.') && p.length === 3)
        {
            p = p.slice(0, 2)
        }
        if (p.endsWith(':') && p.length === 2)
        {
            p = p + '/'
        }
        if (tilde)
        {
            p = Slash.tilde(p)
        }
        return p
    }

    static normalize (path)
    {
        var c, comp, i, prun

        if (!(_k_.isStr(path)))
        {
            return ''
        }
        if (_k_.empty(path))
        {
            return ''
        }
        path = path.replaceAll('\\','/')
        comp = path.split('/')
        prun = []
        for (i in comp)
        {
            c = comp[i]
            if (!_k_.empty(prun) && c === '.')
            {
                continue
            }
            if (_k_.empty(c) && (0 < i && i < comp.length - 1))
            {
                continue
            }
            if (c === '..')
            {
                if (!_k_.empty(prun))
                {
                    if (prun.slice(-1)[0] === '.')
                    {
                        prun.pop()
                    }
                    else if (prun.slice(-1)[0] !== '..')
                    {
                        prun.pop()
                        continue
                    }
                }
            }
            prun.push(c)
        }
        return prun.join('/')
    }

    static unslash (p)
    {
        var reg

        p = Slash.path(p)
        if (Slash.win())
        {
            if (p.length >= 3 && (p[0] === '/' && '/' === p[2]))
            {
                p = p[1] + ':' + p.slice(2)
            }
            reg = new RegExp("/",'g')
            p = p.replace(reg,'\\')
            if (p[1] === ':')
            {
                p = p[0].toUpperCase() + p.slice(1)
            }
        }
        return p
    }

    static relative (rel, to)
    {
        var dd, r, rc, tc

        to = Slash.path(to)
        if (_k_.empty(rel))
        {
            return to
        }
        rel = Slash.path(rel)
        if (to === rel)
        {
            return '.'
        }
        if (rel.startsWith(to))
        {
            r = rel.slice(to.length)
            if (r[0] === Slash.sep)
            {
                r = r.slice(1)
            }
            return r
        }
        rc = Slash.split(rel)
        tc = Slash.split(to)
        dd = ''
        while (rc[0] === tc[0])
        {
            rc.shift()
            tc.shift()
        }
        if (!_k_.empty(dd))
        {
            return dd + rc.join('/')
        }
        while (!_k_.empty(tc))
        {
            tc.shift()
            dd += '../'
        }
        if (!_k_.empty(dd))
        {
            return dd + rc.join('/')
        }
        return rel
    }

    static split (p)
    {
        return Slash.path(p).split('/').filter(function (e)
        {
            return e.length
        })
    }

    static contains (p, d)
    {
        return _k_.in(d,Slash.split(p))
    }

    static splitDrive (p)
    {
        var parsed

        p = Slash.path(p)
        parsed = Slash.parse(p)
        if (parsed.dir.length > 1)
        {
            if (parsed.dir[1] === ':')
            {
                return [p.slice(2),parsed.dir[0]]
            }
        }
        else if (parsed.file.length === 2)
        {
            if (parsed.file[1] === ':')
            {
                return ['/',parsed.file[0]]
            }
        }
        return [Slash.path(p),'']
    }

    static removeDrive (p)
    {
        return Slash.splitDrive(p)[0]
    }

    static isRoot (p)
    {
        return Slash.removeDrive(p) === '/'
    }

    static splitFileLine (p)
    {
        var c, clmn, d, f, l, line, split

        var _a_ = Slash.splitDrive(p); f = _a_[0]; d = _a_[1]

        split = String(f).split(':')
        if (split.length > 1)
        {
            line = parseInt(split[1])
        }
        if (split.length > 2)
        {
            clmn = parseInt(split[2])
        }
        l = c = 0
        if (Number.isInteger(line))
        {
            l = line
        }
        if (Number.isInteger(clmn))
        {
            c = clmn
        }
        if (d !== '')
        {
            d = d + ':'
        }
        return [d + split[0],Math.max(l,1),Math.max(c,0)]
    }

    static hasFilePos (p)
    {
        var ps

        ps = Slash.splitFilePos(p)
        return ps[1][0] !== 0 || ps[1][1] !== 0
    }

    static sameFilePos (a, b)
    {
        var as, bs

        as = Slash.splitFilePos(a)
        bs = Slash.splitFilePos(b)
        return as[0] === bs[0] && as[1][1] === bs[1][1] && as[1][0] === bs[1][0]
    }

    static sameFileLine (a, b)
    {
        var as, bs

        as = Slash.splitFilePos(a)
        bs = Slash.splitFilePos(b)
        return as[0] === bs[0] && as[1][1] === bs[1][1]
    }

    static removeFilePos (p)
    {
        return Slash.splitFilePos(p)[0]
    }

    static splitFilePos (p)
    {
        var c, f, l

        var _a_ = Slash.splitFileLine(p); f = _a_[0]; l = _a_[1]; c = _a_[2]

        return [f,[c,l - 1]]
    }

    static removeLinePos (p)
    {
        return Slash.splitFileLine(p)[0]
    }

    static removeColumn (p)
    {
        var f, l

        var _a_ = Slash.splitFileLine(p); f = _a_[0]; l = _a_[1]

        if (l > 1)
        {
            return f + ':' + l
        }
        else
        {
            return f
        }
    }

    static ext (p)
    {
        return Slash.parse(p).ext
    }

    static removeExt (p)
    {
        var d

        d = Slash.parse(p)
        return Slash.path(d.dir,d.name)
    }

    static splitExt (p)
    {
        return [Slash.removeExt(p),Slash.ext(p)]
    }

    static swapExt (p, ext)
    {
        return Slash.removeExt(p) + (ext.startsWith('.') && ext || `.${ext}`)
    }

    static joinFilePos (file, pos)
    {
        file = Slash.removeLinePos(file)
        if (!(pos != null) || !(pos[0] != null) || (pos[0] === pos[1] && pos[1] === 0))
        {
            return file
        }
        else if (pos[0])
        {
            return file + `:${pos[1] + 1}:${pos[0]}`
        }
        else
        {
            return file + `:${pos[1] + 1}`
        }
    }

    static joinFileLine (file, line, col)
    {
        file = Slash.removeLinePos(file)
        if (!line)
        {
            return file
        }
        if (!col)
        {
            return `${file}:${line}`
        }
        return `${file}:${line}:${col}`
    }

    static pathlist (p)
    {
        var comp, list

        if (!(p != null ? p.length : undefined))
        {
            Slash.error("Slash.pathlist -- no path?")
            return []
        }
        p = Slash.path(p)
        if (p.length > 1 && p[p.length - 1] === '/' && p[p.length - 2] !== ':')
        {
            p = p.slice(0, p.length - 1)
        }
        else if (p === '/')
        {
            return ['/']
        }
        list = [p]
        comp = p.split(Slash.sep)
        while (comp.length > 1)
        {
            comp.pop()
            if (comp.length === 1 && comp[0] === '')
            {
                list.unshift(Slash.sep)
            }
            else
            {
                list.unshift(comp.join(Slash.sep))
            }
        }
        return list
    }

    static dir (p)
    {
        return Slash.parse(p).dir
    }

    static file (p)
    {
        return Slash.parse(p).file
    }

    static name (p)
    {
        return Slash.parse(p).name
    }

    static isAbsolute (p)
    {
        return (p != null ? p[0] : undefined) === Slash.sep
    }

    static isRelative (p)
    {
        return !Slash.isAbsolute(p)
    }

    static parse (p)
    {
        var components, dir, dots, ext, file, name

        p = Slash.path(p)
        if (p.endsWith(Slash.sep))
        {
            p = p.slice(0, -1)
        }
        if (p === '~')
        {
            components = Slash.untilde(p).split(Slash.sep)
        }
        else
        {
            components = p.split(Slash.sep)
        }
        file = components.slice(-1)[0]
        dots = file.split('.')
        ext = ((dots.length > 1 && dots.slice(-1)[0].length) ? dots.pop() : '')
        name = dots.join('.')
        dir = components.slice(0, -1).join('/')
        if (Slash.isAbsolute(p) && _k_.empty(dir))
        {
            dir = Slash.sep
        }
        return {path:p,dir:dir,file:file,name:name,ext:ext}
    }

    static home ()
    {
        var _314_35_

        return ((_314_35_=globalThis.homeDir) != null ? _314_35_ : process.env.HOME)
    }

    static user ()
    {
        var _315_35_

        return ((_315_35_=globalThis.useName) != null ? _315_35_ : process.env.USER)
    }

    static tmpdir ()
    {
        var _316_35_

        return ((_316_35_=globalThis.tmpDir) != null ? _316_35_ : '/tmp')
    }

    static tmpfile (ext)
    {
        return Slash.path(Slash.tmpdir(),`${Date.now()}${Math.random()}` + (ext && `.${ext}` || ''))
    }

    static tilde (p)
    {
        return (p != null ? p.replace(Slash.home(),'~') : undefined)
    }

    static untilde (p)
    {
        return (p != null ? p.replace(/^\~/,Slash.home()) : undefined)
    }

    static unenv (p)
    {
        var i, k, v

        i = p.indexOf('$',0)
        while (i >= 0)
        {
            for (k in process.env)
            {
                v = process.env[k]
                if (k === p.slice(i + 1,i + 1 + k.length))
                {
                    p = p.slice(0,i) + v + p.slice(i + k.length + 1)
                    break
                }
            }
            i = p.indexOf('$',i + 1)
        }
        return p
    }

    static fileUrl (p)
    {
        return `file:///${Slash.encode(p)}`
    }

    static samePath (a, b)
    {
        return Slash.path(a) === Slash.path(b)
    }

    static escape (p)
    {
        return p.replace(/([\`\"])/g,'\\$1')
    }

    static encode (p)
    {
        p = encodeURI(p)
        p = p.replace(/\#/g,"%23")
        p = p.replace(/\&/g,"%26")
        return p = p.replace(/\'/g,"%27")
    }

    static sanitize (p)
    {
        while (_k_.in(p[0],'\n\r\t'))
        {
            p = p.slice(1)
        }
        while (_k_.in(p.slice(-1)[0],'\n\r\t'))
        {
            p = p.slice(0, -1)
        }
        return p
    }

    static textext = null

    static textbase = {profile:1,license:1,'.gitignore':1,'.npmignore':1}

    static reg = new RegExp("\\\\",'g')

    static win ()
    {
        return Slash.sep === '\\'
    }

    static error (msg)
    {
        if (this.logErrors)
        {
            console.error(msg)
        }
        return ''
    }
}

export default Slash;