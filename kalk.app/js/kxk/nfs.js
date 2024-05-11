var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

import slash from "./slash.js"

import fs from "fs"

import fsp from 'fs/promises'
class NFS
{
    static async listdir (dir, found)
    {
        var absPath, dirent, dirents, file, isDir

        dirents = await fsp.readdir(dir,{withFileTypes:true})
        var list = _k_.list(dirents)
        for (var _25_19_ = 0; _25_19_ < list.length; _25_19_++)
        {
            dirent = list[_25_19_]
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
                await NFS.listdir(absPath,found)
            }
        }
        return found
    }

    static async list (p)
    {
        return await NFS.listdir(p,[])
    }

    static async dirlist (p)
    {
        return await NFS.listdir(p,[])
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
            console.error("nfs.write -- " + String(err))
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
            console.error("nfs.info -- " + String(err))
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
                console.error("nfs.mkdir -- " + String(err))
            }
        }
        return p
    }

    static async exists (p)
    {
        var r, s

        try
        {
            if (!(p != null))
            {
                return
            }
            p = slash.path(slash.removeLinePos(p))
            r = await fsp.access(p,fs.R_OK | fs.F_OK)
            return s = await fsp.stat(p)
        }
        catch (err)
        {
            return null
        }
    }

    static async type (p)
    {
        var stat

        if (stat = await NFS.exists(p))
        {
            return (stat.isFile() ? 'file' : 'dir')
        }
    }

    static async fileExists (p)
    {
        var stat

        stat = await NFS.exists(p)
        if ((stat != null ? stat.isFile() : undefined))
        {
            return stat
        }
    }

    static async isFile (p)
    {
        return NFS.fileExists(p)
    }

    static async dirExists (p)
    {
        var stat

        stat = await NFS.exists(p)
        if ((stat != null ? stat.isDirectory() : undefined))
        {
            return stat
        }
    }

    static async isDir (p)
    {
        return NFS.dirExists(p)
    }

    static async remove (p)
    {
        return await fsp.rm(p,{force:true,recursive:true})
    }

    static async copy (from, to)
    {
        if (await NFS.isDir(to))
        {
            to = slash.path(to,slash.file(from))
        }
        return await fsp.cp(from,to,{recursive:true})
    }

    static async pkg (p)
    {
        console.error('todo')
    }

    static async git (p)
    {
        console.error('todo')
    }

    static async isWritable (p)
    {
        console.error('todo')
    }

    static async isReadable (p)
    {
        console.error('todo')
    }

    static async duplicate (p)
    {
        console.error('todo')
    }

    static async trash (p)
    {
        console.error('todo')
    }

    static async move (p, d)
    {
        console.error('todo')
    }
}

export default NFS;