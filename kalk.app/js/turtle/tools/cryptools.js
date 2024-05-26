var bytes2hex, bytes2str, cryptAlgo, cryptName, cryptVect, decoder, decrypt, decryptFile, encoder, encrypt, encryptFile, genHash, genKey, hex2bytes, str2bytes

import kxk from "../../kxk.js"
let ffs = kxk.ffs
let slash = kxk.slash

encoder = new TextEncoder()
decoder = new TextDecoder()

str2bytes = function (str)
{
    return encoder.encode(str)
}

bytes2str = function (data)
{
    return decoder.decode(data)
}
cryptName = 'AES-GCM'
cryptVect = str2bytes('password-turtle!')
cryptAlgo = {name:cryptName,iv:cryptVect}

bytes2hex = function (array)
{
    var buff, hexs, i

    buff = new Uint8Array(array)
    hexs = new Array(buff.length)
    for (var _a_ = i = 0, _b_ = buff.length; (_a_ <= _b_ ? i < buff.length : i > buff.length); (_a_ <= _b_ ? ++i : --i))
    {
        hexs[i] = buff[i].toString(16).padStart(2,'0')
    }
    return hexs.join('')
}

hex2bytes = function (str)
{
    var buff, i

    buff = new Uint8Array(str.length / 2)
    for (var _c_ = i = 0, _d_ = str.length / 2; (_c_ <= _d_ ? i < str.length / 2 : i > str.length / 2); (_c_ <= _d_ ? ++i : --i))
    {
        buff[i] = parseInt(str.slice(i * 2, typeof (i * 2 + 1) === 'number' ? (i * 2 + 1)+1 : Infinity),16)
    }
    return buff
}

genHash = async function (str)
{
    var hash

    hash = await crypto.subtle.digest("SHA-512",str2bytes(str))
    return bytes2hex(hash)
}

genKey = async function (str)
{
    var algo, derive, key

    algo = {name:'PBKDF2',salt:cryptVect,iterations:100000,hash:'SHA-256'}
    derive = {name:cryptName,length:256}
    key = await crypto.subtle.importKey('raw',str2bytes(str),'PBKDF2',false,['deriveBits','deriveKey'])
    return await crypto.subtle.deriveKey(algo,key,derive,true,['encrypt','decrypt'])
}

encrypt = async function (str, key)
{
    var cipher, cryptKey

    cryptKey = await genKey(key)
    cipher = await crypto.subtle.encrypt(cryptAlgo,cryptKey,str2bytes(str))
    return bytes2hex(cipher)
}

decrypt = async function (str, key)
{
    var cipher, cryptKey

    cryptKey = await genKey(key)
    cipher = await crypto.subtle.decrypt(cryptAlgo,cryptKey,hex2bytes(str))
    return bytes2str(cipher)
}

encryptFile = async function (file, str, key)
{
    var decrypted, encrypted

    encrypted = await encrypt(str,key)
    decrypted = await decrypt(encrypted,key)
    if (decrypted === str)
    {
        file = slash.untilde(slash.path(file))
        return await ffs.write(file,encrypted)
    }
    else
    {
        console.log("can't decrypt encrypted?",decrypted,encrypted)
    }
}

decryptFile = async function (file, key)
{
    var encrypted

    file = slash.untilde(slash.path(file))
    if (await ffs.fileExists(file))
    {
        try
        {
            encrypted = await ffs.read(file)
        }
        catch (err)
        {
            console.error("can't read file",file,err)
            return
        }
        try
        {
            return await decrypt(encrypted,key)
        }
        catch (err)
        {
            console.error("can't decrypt file",file,err)
        }
    }
    else
    {
        console.error("no such file:",file)
    }
}
export default {encrypt:encrypt,decrypt:decrypt,encryptFile:encryptFile,decryptFile:decryptFile,genHash:genHash}