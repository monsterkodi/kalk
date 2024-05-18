var toExport = {}
var k

import krzl from "../krzl.js"
import slash from "../slash.js"

toExport["krzl"] = function ()
{
    section("strings", function ()
    {
        k = new krzl(['hello','world'])
        compare(k.filter(),[])
        compare(k.filter(''),[])
        compare(k.filter('✘'),[])
        compare(k.filter('h'),['hello'])
        compare(k.filter('w'),['world'])
        compare(k.filter('l'),['hello','world'])
        compare(k.filter('ll'),['hello'])
        compare(k.filter('o'),['world','hello'])
    })
    section("extract", function ()
    {
        k = new krzl([{key:'hello'},{key:'world',evil:666}])
        k.extract = function (i)
        {
            return i.key
        }
        compare(k.filter('✘'),[])
        compare(k.filter('h'),[{key:'hello'}])
        compare(k.filter('w'),[{key:'world',evil:666}])
        compare(k.filter('l'),[{key:'hello'},{key:'world',evil:666}])
        compare(k.filter('ll'),[{key:'hello'}])
        compare(k.filter('o'),[{key:'world',evil:666},{key:'hello'}])
    })
    section("weight", function ()
    {
        k = new krzl(['bba','aa','a','aba','acccca','aaa','akkaakka'])
        compare(k.filter('a'),['a','aa','aba','aaa','acccca','akkaakka','bba'])
        compare(k.filter('b'),['bba','aba'])
        compare(k.filter('aa'),['aa','aba','aaa','acccca','akkaakka'])
    })
    section("custom", function ()
    {
        k = new krzl(['a.txt','a.a','a','a.noon','a.kode'])
        compare(k.filter('a'),['a','a.a','a.txt','a.noon','a.kode'])
        k.weight = function (i)
        {
            switch (slash.ext(i))
            {
                case 'kode':
                    return 1

                case 'noon':
                    return 0.5

                default:
                    return 0
            }

        }
        compare(k.filter('a'),['a','a.kode','a.noon','a.a','a.txt'])
        k.weight = function (i)
        {
            switch (slash.ext(i))
            {
                case 'kode':
                    return 100

                case 'noon':
                    return 50

                default:
                    return 1
            }

        }
        compare(k.filter('a'),['a','a.kode','a.noon','a.a','a.txt'])
        k.weight = function (i)
        {
            switch (slash.ext(i))
            {
                case 'kode':
                    return 10

                case 'noon':
                    return 0.5

                default:
                    return 0.1
            }

        }
        compare(k.filter('a'),['a','a.kode','a.noon','a.a','a.txt'])
    })
    section("negative", function ()
    {
        k = new krzl(['a.txt','a.aaa','a.blork','a.noon','a.kode'])
        k.weight = function (i)
        {
            switch (slash.ext(i))
            {
                case 'noon':
                    return -1

                case 'txt':
                    return -100000

                case 'blork':
                    return -666

                default:
                    return 'dafuk'
            }

        }
        compare(k.filter('a'),['a.txt','a.aaa','a.noon','a.kode','a.blork'])
    })
    section("case insensitive", function ()
    {
        k = new krzl(['a','aA','Aa','A','BaBa','bABA'])
        compare(k.filter('a'),['a','A','aA','Aa','BaBa','bABA'])
        compare(k.filter('A'),['a','A','aA','Aa','BaBa','bABA'])
        compare(k.filter('b'),['BaBa','bABA'])
        compare(k.filter('B'),['BaBa','bABA'])
    })
    section("length insensitive", function ()
    {
        k = new krzl({values:['a','aA','Aa','A','BaBa','bABA'],sortByLength:false})
        compare(k.filter('a'),['a','aA','Aa','A','BaBa','bABA'])
    })
}
toExport["krzl"]._section_ = true
toExport._test_ = true
export default toExport
