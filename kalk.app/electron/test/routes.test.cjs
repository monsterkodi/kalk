const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const fsp = require('node:fs/promises')
const os = require('node:os')
const path = require('node:path')

const { fsRoute } = require('../routes.cjs')

async function tempDir (t)
{
    const dir = await fsp.mkdtemp(path.join(os.tmpdir(), 'kalk-routes-'))
    t.after(() => fsp.rm(dir, { recursive: true, force: true }))
    return dir
}

test('fs.write writes a string and returns the path', async (t) =>
{
    const dir = await tempDir(t)
    const file = path.join(dir, 'a.txt')
    assert.equal(await fsRoute('write', [file, 'hello']), file)
    assert.equal(await fsp.readFile(file, 'utf8'), 'hello')
})

test('fs.write rejects non-string content', async (t) =>
{
    const dir = await tempDir(t)
    const file = path.join(dir, 'a.txt')
    assert.equal(await fsRoute('write', [file, 42]), null)
    assert.equal(fs.existsSync(file), false)
})

test('fs.read returns file text and null when missing', async (t) =>
{
    const dir = await tempDir(t)
    const file = path.join(dir, 'a.txt')
    await fsp.writeFile(file, 'hello')
    assert.equal(await fsRoute('read', [file]), 'hello')
    assert.equal(await fsRoute('read', [path.join(dir, 'nope.txt')]), null)
})

test('fs.exists, fileExists and dirExists distinguish files and directories', async (t) =>
{
    const dir = await tempDir(t)
    const file = path.join(dir, 'a.txt')
    await fsp.writeFile(file, 'x')

    assert.equal(await fsRoute('exists', [file]), true)
    assert.equal(await fsRoute('exists', [dir]), true)
    assert.equal(await fsRoute('exists', [path.join(dir, 'nope')]), false)
    assert.equal(await fsRoute('fileExists', [file]), true)
    assert.equal(await fsRoute('fileExists', [dir]), false)
    assert.equal(await fsRoute('dirExists', [dir]), true)
    assert.equal(await fsRoute('dirExists', [file]), false)
})

test('fs.list returns direct children with type, file and path', async (t) =>
{
    const dir = await tempDir(t)
    await fsp.writeFile(path.join(dir, 'a.txt'), 'x')
    await fsp.mkdir(path.join(dir, 'sub'))
    await fsp.writeFile(path.join(dir, 'sub', 'deep.txt'), 'x')

    const list = await fsRoute('list', [dir])
    const byName = Object.fromEntries(list.map(i => [i.file, i]))

    assert.deepEqual(Object.keys(byName).sort(), ['a.txt', 'sub'])
    assert.equal(byName['a.txt'].type, 'file')
    assert.equal(byName['a.txt'].path, path.join(dir, 'a.txt'))
    assert.equal(byName['sub'].type, 'dir')
    assert.equal(byName['sub'].path, path.join(dir, 'sub'))
})

test('fs.mkdir creates nested directories', async (t) =>
{
    const dir = await tempDir(t)
    const nested = path.join(dir, 'a', 'b', 'c')
    assert.equal(await fsRoute('mkdir', [nested]), nested)
    assert.equal(fs.statSync(nested).isDirectory(), true)
})

test('fs.copy and fs.move copy and move files', async (t) =>
{
    const dir = await tempDir(t)
    const src = path.join(dir, 'a.txt')
    const cpy = path.join(dir, 'copy.txt')
    const moved = path.join(dir, 'moved.txt')
    await fsp.writeFile(src, 'hello')

    assert.equal(await fsRoute('copy', [src, cpy]), cpy)
    assert.equal(await fsp.readFile(cpy, 'utf8'), 'hello')

    assert.equal(await fsRoute('move', [cpy, moved]), moved)
    assert.equal(fs.existsSync(cpy), false)
    assert.equal(await fsp.readFile(moved, 'utf8'), 'hello')
})

test('fs.duplicate appends " copy" before the extension', async (t) =>
{
    const dir = await tempDir(t)
    const src = path.join(dir, 'a.txt')
    await fsp.writeFile(src, 'hello')

    const dest = await fsRoute('duplicate', [src])
    assert.equal(dest, path.join(dir, 'a copy.txt'))
    assert.equal(await fsp.readFile(dest, 'utf8'), 'hello')
})

test('fs.duplicate handles files without an extension', async (t) =>
{
    const dir = await tempDir(t)
    const src = path.join(dir, 'plain')
    await fsp.writeFile(src, 'hello')

    assert.equal(await fsRoute('duplicate', [src]), path.join(dir, 'plain copy'))
})

test('fs.remove removes files and directories', async (t) =>
{
    const dir = await tempDir(t)
    const file = path.join(dir, 'a.txt')
    const sub = path.join(dir, 'sub')
    await fsp.writeFile(file, 'x')
    await fsp.mkdir(sub)
    await fsp.writeFile(path.join(sub, 'b.txt'), 'x')

    assert.equal(await fsRoute('remove', [file]), file)
    assert.equal(fs.existsSync(file), false)
    assert.equal(await fsRoute('remove', [sub]), sub)
    assert.equal(fs.existsSync(sub), false)
})

test('fs.info reports type and size', async (t) =>
{
    const dir = await tempDir(t)
    const file = path.join(dir, 'a.txt')
    await fsp.writeFile(file, 'hello')

    const fileInfo = await fsRoute('info', [file])
    assert.equal(fileInfo.type, 'file')
    assert.equal(fileInfo.size, 5)
    assert.equal(typeof fileInfo.inode, 'number')

    const dirInfo = await fsRoute('info', [dir])
    assert.equal(dirInfo.type, 'dir')
})

test('fs.pkg finds a package.json parent and null otherwise', async (t) =>
{
    const dir = await tempDir(t)
    const pkg = path.join(dir, 'project')
    const nested = path.join(pkg, 'a', 'b')
    await fsp.mkdir(nested, { recursive: true })
    await fsp.writeFile(path.join(pkg, 'package.json'), '{}')

    assert.equal(await fsRoute('pkg', [nested]), pkg)
    assert.equal(await fsRoute('pkg', [dir]), null)
})

test('fs.pkg finds a .git parent', async (t) =>
{
    const dir = await tempDir(t)
    const repo = path.join(dir, 'repo')
    const nested = path.join(repo, 'a')
    await fsp.mkdir(path.join(repo, '.git'), { recursive: true })
    await fsp.mkdir(nested, { recursive: true })

    assert.equal(await fsRoute('pkg', [nested]), repo)
})

test('fs.git finds a .git parent and null otherwise', async (t) =>
{
    const dir = await tempDir(t)
    const repo = path.join(dir, 'repo')
    const nested = path.join(repo, 'a')
    await fsp.mkdir(path.join(repo, '.git'), { recursive: true })
    await fsp.mkdir(nested, { recursive: true })

    assert.equal(await fsRoute('git', [nested]), repo)
    assert.equal(await fsRoute('git', [dir]), null)
})

test('fs routes expand a leading tilde', async (t) =>
{
    const dir = await tempDir(t)
    const file = path.join(dir, 'a.txt')
    await fsp.writeFile(file, 'hello')

    const rel = path.relative(os.homedir(), file)
    if (rel.startsWith('..'))
    {
        t.skip('temp directory is outside the home directory')
        return
    }
    assert.equal(await fsRoute('read', ['~/' + rel]), 'hello')
})
