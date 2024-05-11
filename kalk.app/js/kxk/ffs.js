var _k_

class FFS
{
    static async pkg (p)
    {
        return await kakao('fs.pkg',p)
    }

    static async git (p)
    {
        return await kakao('fs.git',p)
    }

    static async list (p)
    {
        return await kakao('fs.list',p)
    }

    static async read (p)
    {
        return await kakao('fs.read',p)
    }

    static async write (p, t)
    {
        return await kakao('fs.write',p,t)
    }

    static async exists (p)
    {
        return await kakao('fs.exists',p)
    }

    static async fileExists (p)
    {
        return await kakao('fs.fileExists',p)
    }

    static async dirExists (p)
    {
        return await kakao('fs.dirExists',p)
    }

    static async isWritable (p)
    {
        return await kakao('fs.isWritable',p)
    }

    static async isReadable (p)
    {
        return await kakao('fs.isReadable',p)
    }

    static async duplicate (p)
    {
        return await kakao('fs.duplicate',p)
    }

    static async remove (p)
    {
        return await kakao('fs.remove',p)
    }

    static async trash (p)
    {
        return await kakao('fs.trash',p)
    }

    static async move (p, d)
    {
        return await kakao('fs.move',p,d)
    }

    static async copy (p, d)
    {
        return await kakao('fs.copy',p,d)
    }

    static async mkdir (p)
    {
        return await kakao('fs.mkdir',p)
    }

    static async info (p)
    {
        return await kakao('fs.info',p)
    }

    static async type (p)
    {
        var i

        i = await kakao('fs.info',p)
        return i.type
    }

    static async isFile (p)
    {
        return await FFS.fileExists(p)
    }

    static async isDir (p)
    {
        return await FFS.dirExists(p)
    }
}

export default FFS;