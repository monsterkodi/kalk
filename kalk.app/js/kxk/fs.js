var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isFunc: function (o) {return typeof o === 'function'}}

import slash from "./slash.js"

import fs from "fs"

import fsp from 'fs/promises'
class FS
{
    static logErrors = true

    static async listdir (dir, found)
    {
        var absPath, dirent, dirents, file, isDir

        dirents = await fsp.readdir(dir,{withFileTypes:true})
        var list = _k_.list(dirents)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            dirent = list[_a_]
            file = dirent.name
            isDir = !dirent.isFile()
            if (isDir && _k_.in(file,['node_modules','.git']))
            {
                continue
            }
            absPath = slash.path(dir,file)
            found.push({type:(isDir ? 'dir' : 'file'),file:file,path:absPath})
            if (isDir)
            {
                await FS.listdir(absPath,found)
            }
        }
        return found
    }

    static async list (p)
    {
        return await FS.listdir(p,[])
    }

    static async dirlist (p)
    {
        return await FS.listdir(p,[])
    }

    static async read (p)
    {
        try
        {
            return await fsp.readFile(p,'utf8')
        }
        catch (err)
        {
            return ''
        }
    }

    static async write (p, text)
    {
        var mode, stat, tmpfile

        try
        {
            tmpfile = slash.tmpfile()
            try
            {
                stat = await fsp.stat(p)
                mode = stat.mode
                await fsp.access(p,(fs.R_OK | fs.F_OK))
            }
            catch (err)
            {
                mode = 0o666
                await fsp.mkdir(slash.dir(p),{recursive:true})
            }
            await fsp.writeFile(tmpfile,text,{mode:mode})
            await fsp.rename(tmpfile,p)
            return p
        }
        catch (err)
        {
            FS.error("fs.write -- " + String(err))
            return ''
        }
    }

    static async info (p)
    {
        var stat

        try
        {
            stat = await fsp.stat(p)
            return stat
        }
        catch (err)
        {
            return FS.error("fs.info -- " + String(err))
        }
    }

    static async mkdir (p)
    {
        try
        {
            await fsp.mkdir(p,{recursive:true})
        }
        catch (err)
        {
            if (err.code !== 'EEXIST')
            {
                FS.error("fs.mkdir -- " + String(err))
            }
        }
        return p
    }

    static pkg (p)
    {
        var _129_20_

        if (((p != null ? p.length : undefined) != null))
        {
            while (p.length && !(_k_.in(slash.removeDrive(p),['.','/',''])))
            {
                if (FS.dirExists(slash.path(p,'.git' || FS.fileExists(slash.path(p,'package.noon' || FS.fileExists(slash.path(p,'package.json')))))))
                {
                    return slash.path(p)
                }
                p = slash.dir(p)
            }
        }
        return null
    }

    static git (p, cb)
    {
        var _141_20_

        if (((p != null ? p.length : undefined) != null))
        {
            if (typeof(cb) === 'function')
            {
                FS.dirExists(slash.path(p,'.git'),function (stat)
                {
                    if (stat)
                    {
                        return cb(slash.path(p))
                    }
                    else if (!(_k_.in(FS.removeDrive(p),['.','/',''])))
                    {
                        return FS.git(slash.dir(p),cb)
                    }
                })
            }
            else
            {
                while (p.length && !(_k_.in(FS.removeDrive(p),['.','/',''])))
                {
                    if (FS.dirExists(slash.path(p,'.git')))
                    {
                        return slash.path(p)
                    }
                    p = slash.dir(p)
                }
            }
        }
        return null
    }

    static exists (p, cb)
    {
        var stat

        if (_k_.isFunc(cb))
        {
            try
            {
                if (!(p != null))
                {
                    cb()
                    return
                }
                p = slash.path(slash.removeLinePos(p))
                fs.access(p,(fs.R_OK | fs.F_OK),function (err)
                {
                    if ((err != null))
                    {
                        return cb()
                    }
                    else
                    {
                        return fs.stat(p,function (err, stat)
                        {
                            if ((err != null))
                            {
                                return cb()
                            }
                            else
                            {
                                return cb(stat)
                            }
                        })
                    }
                })
            }
            catch (err)
            {
                FS.error("fs.exists -- " + String(err))
            }
        }
        else
        {
            if ((p != null))
            {
                try
                {
                    p = slash.path(slash.removeLinePos(p))
                    if (stat = fs.statSync(p))
                    {
                        fs.accessSync(p,fs.R_OK)
                        return stat
                    }
                }
                catch (err)
                {
                    if (_k_.in(err.code,['ENOENT','ENOTDIR']))
                    {
                        return null
                    }
                    FS.error("fs.exists -- " + String(err))
                }
            }
        }
        return null
    }

    static fileExists (p, cb)
    {
        var stat

        if (_k_.isFunc(cb))
        {
            return FS.exists(p,function (stat)
            {
                if ((stat != null ? stat.isFile() : undefined))
                {
                    return cb(stat)
                }
                else
                {
                    return cb()
                }
            })
        }
        else
        {
            if (stat = FS.exists(p))
            {
                if (stat.isFile())
                {
                    return stat
                }
            }
        }
    }

    static dirExists (p, cb)
    {
        var stat

        if (_k_.isFunc(cb))
        {
            return FS.exists(p,function (stat)
            {
                if ((stat != null ? stat.isDirectory() : undefined))
                {
                    return cb(stat)
                }
                else
                {
                    return cb()
                }
            })
        }
        else
        {
            if (stat = FS.exists(p))
            {
                if (stat.isDirectory())
                {
                    return stat
                }
            }
        }
    }

    static remove (p, cb)
    {
        if (_k_.isFunc(cb))
        {
            return fs.remove(p,cb)
        }
        else
        {
            return fs.rmSync(p,{force:true,recursive:true})
        }
    }

    static touch (p)
    {
        var date, dir

        try
        {
            dir = slash.dir(p)
            if (!FS.isDir(dir))
            {
                fs.mkdirSync(dir,{recursive:true})
            }
            if (!FS.fileExists(p))
            {
                fs.writeFileSync(p,'')
            }
            else
            {
                date = new Date
                fsp.utimes(p,date,date)
            }
            return p
        }
        catch (err)
        {
            FS.error("fs.touch -- " + String(err))
            return false
        }
    }

    static isDir (p, cb)
    {
        return FS.dirExists(p,cb)
    }

    static isFile (p, cb)
    {
        return FS.fileExists(p,cb)
    }

    static isWritable (p, cb)
    {
        if (typeof(cb) === 'function')
        {
            try
            {
                return fs.access(slash.path(p),(fs.constants.R_OK | fs.constants.W_OK),function (err)
                {
                    return cb(!err)
                })
            }
            catch (err)
            {
                FS.error("fs.isWritable -- " + String(err))
                return cb(false)
            }
        }
        else
        {
            try
            {
                fs.accessSync(slash.path(p),(fs.constants.R_OK | fs.constants.W_OK))
                return true
            }
            catch (err)
            {
                return false
            }
        }
    }

    static error (msg)
    {
        if (this.logErrors)
        {
            console.error(msg)
        }
        return ''
    }

    static watch = fs.watch
}

export default FS;