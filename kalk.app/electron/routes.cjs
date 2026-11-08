const fs = require('node:fs')
const fsp = require('node:fs/promises')
const os = require('node:os')
const path = require('node:path')
const { execFile } = require('node:child_process')

function expandTilde (p)
{
    if (typeof p !== 'string')
    {
        return p
    }
    if (p === '~')
    {
        return os.homedir()
    }
    if (p.startsWith('~/'))
    {
        return path.join(os.homedir(), p.slice(2))
    }
    return p
}

function parentDirs (start)
{
    const dirs = []
    let dir = start
    while (dir)
    {
        dirs.push(dir)
        const parent = path.dirname(dir)
        if (parent === dir)
        {
            break
        }
        dir = parent
    }
    return dirs
}

async function statOrNull (p)
{
    try
    {
        return await fsp.stat(p)
    }
    catch (err)
    {
        return null
    }
}

async function findParent (start, predicate)
{
    for (const dir of parentDirs(start))
    {
        if (await predicate(dir))
        {
            return dir
        }
    }
    return null
}

async function exists (p)
{
    return (await statOrNull(p)) !== null
}

async function isFile (p)
{
    const stat = await statOrNull(p)
    return stat !== null && stat.isFile()
}

async function isDir (p)
{
    const stat = await statOrNull(p)
    return stat !== null && stat.isDirectory()
}

async function move (src, dest)
{
    try
    {
        await fsp.rename(src, dest)
    }
    catch (err)
    {
        if (err.code !== 'EXDEV')
        {
            throw err
        }
        await fsp.cp(src, dest, { recursive: true, force: false, errorOnExist: true })
        await fsp.rm(src, { recursive: true })
    }
    return dest
}

async function duplicate (p)
{
    const parsed = path.parse(p)
    const dest = path.join(parsed.dir, `${parsed.name} copy${parsed.ext}`)
    await fsp.cp(p, dest, { recursive: true, force: false, errorOnExist: true })
    return dest
}

async function trash (p)
{
    return new Promise(function (resolve)
    {
        execFile('gio', ['trash', p], function (err)
        {
            if (err)
            {
                resolve(null)
            }
            else
            {
                resolve(p)
            }
        })
    })
}

async function fsRoute (req, args = [])
{
    const first = expandTilde(args[0])
    const target = (typeof first === 'string' && first.length) ? first : null

    switch (req)
    {
        case 'read':
        {
            if (!target) return null
            try
            {
                return await fsp.readFile(target, 'utf8')
            }
            catch (err)
            {
                return null
            }
        }

        case 'write':
        {
            const text = args[1]
            if (!target || typeof text !== 'string')
            {
                return null
            }
            const temp = `${target}.kalk-${process.pid}-${Date.now()}`
            try
            {
                await fsp.writeFile(temp, text)
                await fsp.rename(temp, target)
                return target
            }
            catch (err)
            {
                try
                {
                    await fsp.rm(temp, { force: true })
                }
                catch (cleanupErr)
                {
                    cleanupErr
                }
                return null
            }
        }

        case 'exists':
        {
            return target ? exists(target) : false
        }

        case 'fileExists':
        {
            return target ? isFile(target) : false
        }

        case 'dirExists':
        {
            return target ? isDir(target) : false
        }

        case 'isWritable':
        {
            if (!target) return false
            try
            {
                await fsp.access(target, fs.constants.W_OK)
                return true
            }
            catch (err)
            {
                return false
            }
        }

        case 'isReadable':
        {
            if (!target) return false
            try
            {
                await fsp.access(target, fs.constants.R_OK)
                return true
            }
            catch (err)
            {
                return false
            }
        }

        case 'remove':
        {
            if (!target) return null
            try
            {
                await fsp.rm(target, { recursive: true })
                return target
            }
            catch (err)
            {
                return null
            }
        }

        case 'trash':
        {
            return target ? trash(target) : null
        }

        case 'move':
        {
            const dest = expandTilde(args[1])
            if (!target || typeof dest !== 'string' || !dest.length)
            {
                return null
            }
            try
            {
                return await move(target, dest)
            }
            catch (err)
            {
                return null
            }
        }

        case 'copy':
        {
            const dest = expandTilde(args[1])
            if (!target || typeof dest !== 'string' || !dest.length)
            {
                return null
            }
            try
            {
                await fsp.cp(target, dest, { recursive: true, force: false, errorOnExist: true })
                return dest
            }
            catch (err)
            {
                return null
            }
        }

        case 'duplicate':
        {
            if (!target) return null
            try
            {
                return await duplicate(target)
            }
            catch (err)
            {
                return null
            }
        }

        case 'mkdir':
        {
            if (!target) return null
            try
            {
                await fsp.mkdir(target, { recursive: true })
                return target
            }
            catch (err)
            {
                return null
            }
        }

        case 'list':
        {
            if (!target) return []
            try
            {
                const entries = await fsp.readdir(target, { withFileTypes: true })
                return entries.map(function (entry)
                {
                    return {
                        type: entry.isDirectory() ? 'dir' : 'file',
                        file: entry.name,
                        path: path.join(target, entry.name)
                    }
                })
            }
            catch (err)
            {
                return []
            }
        }

        case 'info':
        {
            if (!target) return null
            try
            {
                const stat = await fsp.stat(target)
                return {
                    size: stat.size,
                    created: stat.birthtimeMs,
                    group: stat.gid,
                    owner: stat.uid,
                    modified: stat.mtimeMs,
                    permission: stat.mode,
                    inode: stat.ino,
                    type: stat.isDirectory() ? 'dir' : 'file'
                }
            }
            catch (err)
            {
                return null
            }
        }

        case 'pkg':
        {
            if (!target) return null
            return findParent(target, async function (dir)
            {
                return (await isFile(path.join(dir, 'package.json'))) ||
                       (await isDir(path.join(dir, '.git')))
            })
        }

        case 'git':
        {
            if (!target) return null
            return findParent(target, function (dir)
            {
                return isDir(path.join(dir, '.git'))
            })
        }
    }

    return null
}

module.exports = { fsRoute, expandTilde }
