var _k_ = {dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var build_linux, CMD, FLG, LIB, OUT, ZIG

ZIG = process.env.ZIG || 'zig'
CMD = `${ZIG} c++`
OUT = "../../Contents/MacOS/kakao"
LIB = "-framework WebKit -framework Cocoa -framework JavaScriptCore"
FLG = "-arch arm64 -Os -Wno-nullability-completeness -Wno-objc-method-access"
import child_process from "child_process"

import slash from "../kxk/slash.js"
import fs from "../kxk/fs.js"


build_linux = async function ()
{
    var cmd, cwd, opt, out, SRC, srcDir, srcFiles

    srcDir = slash.path(_k_.dir(),'../../src/linux')
    out = slash.path(_k_.dir(),'../../Contents/Linux/kakao')
    await fs.mkdir(slash.dir(out))
    srcFiles = await fs.list(srcDir)
    srcFiles = srcFiles.filter(function (f)
    {
        return slash.ext(f.path) === 'cpp' && slash.dir(f.path) === srcDir
    })
    SRC = srcFiles.map(function (f)
    {
        return 'src/linux/' + f.file
    }).join(' ')
    cmd = `${CMD} -std=c++17 -Os -I src/linux ${SRC} $(pkg-config --cflags --libs webkit2gtk-4.1 gtk+-3.0 json-glib-1.0) -Wl,-rpath,/usr/lib64 -o Contents/Linux/kakao`
    cwd = slash.path(_k_.dir(),'../..')
    opt = {shell:true,cwd:cwd}
    return new Promise(function (resolve, reject)
    {
        return child_process.exec(cmd,opt,function (err, stdout, stderr)
        {
            if (err)
            {
                console.error('ERROR',err)
                return reject(err)
            }
            if (!_k_.empty(stdout))
            {
                console.log(stdout)
            }
            if (!_k_.empty(stderr))
            {
                console.log(stderr)
            }
            return resolve()
        })
    })
}
export default async function ()
{
    var cmd, cwd, opt, SRC, srcDir, srcFiles

    if (process.platform !== 'darwin')
    {
        return await build_linux()
    }
    srcDir = slash.path(_k_.dir(),'../../src')
    await fs.mkdir(slash.dir(slash.path(_k_.dir(),OUT)))
    srcFiles = await fs.list(srcDir)
    srcFiles = srcFiles.filter(function (f)
    {
        return _k_.in(slash.ext(f.path),['cpp','mm'])
    })
    SRC = srcFiles.map(function (f)
    {
        return f.file
    }).join(' ')
    cmd = `${CMD} -I . ${SRC} ${LIB} ${FLG} -o ${OUT.slice(3)}`
    cwd = srcDir
    opt = {shell:true,cwd:cwd}
    return new Promise(function (resolve, reject)
    {
        return child_process.exec(cmd,opt,function (err, stdout, stderr)
        {
            if (err)
            {
                console.error('ERROR',err)
                return reject(err)
            }
            if (!_k_.empty(stdout))
            {
                console.log(stdout)
            }
            if (!_k_.empty(stderr))
            {
                console.log(stderr)
            }
            return resolve()
        })
    })
};