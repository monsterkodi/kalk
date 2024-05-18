var toExport = {}
var lm

import kermit from "../kermit.js"

toExport["kermit"] = function ()
{
    section("pattern", function ()
    {
        compare(kermit.pattern(`header ●header
■level1
    sub ●sub`),[[['header','●header'],[]],[['sub','●sub'],['level1']]])
        compare(kermit.pattern(`header ●header
■level1
    sub ●sub
    ■level2
        ●prefix ●suffix`),[[['header','●header'],[]],[['sub','●sub'],['level1']],[['●prefix','●suffix'],['level1','level2']]])
    })
    section("lineMatch", function ()
    {
        lm = kermit.lineMatch
        compare(lm("","class ●class"),undefined)
        compare(lm("hello","class ●class"),undefined)
        compare(lm("class","class ●class"),{class:undefined})
        compare(lm("class MyClass","class ●class"),{class:'MyClass'})
        compare(lm("func (arg1, arg2)","●name ○args"),{name:'func',args:'(arg1, arg2)'})
        compare(lm("  func (arg1, arg2)","●name ○args"),{name:'func',args:'(arg1, arg2)'})
        compare(lm("  constructor ()","●name ○args"),{name:'constructor',args:'()'})
        compare(lm(`Git.prototype["onFileChanged"] = function (file)`,`Git.prototype["●name"] = function ○args`,['"']),{name:'onFileChanged',args:'(file)'})
        compare(lm("post.on('index',(function (file)",'●name ○args',['"','.',',',"'"]),{name:'post',args:". on( ' index '  , (function (file)"})
        compare(lm('        this["onKeyUp"] = this["onKeyUp"].bind(this)','this["●name"] = this["●bind"].bind(this)',['"','.',',',"'"]),{name:'onKeyUp',bind:'onKeyUp'})
    })
    section("simple", function ()
    {
        compare(kermit(`commit  ●commit
Author: ●author
●msg`,`commit  some commit
Author: some author

    some msg

commit      another     commit

Author: another         author
another msg`),[{commit:'some commit',author:'some author',msg:'some msg'},{commit:'another commit',author:'another author',msg:'another msg'}])
    })
    section("inline", function ()
    {
        compare(kermit("@@ ●lineinfo @@ ●context",`@@ -111 +222 @@ one two ...
@@ -333 +444 @@ three four`),[{lineinfo:'-111 +222',context:'one two ...'},{lineinfo:'-333 +444',context:'three four'}])
    })
    section("array1", function ()
    {
        compare(kermit(`commit  ●commit
■files
    ●type ●path`,`commit id

M   modified/file
C   changed/file

commit other

M   modified/other
C   changed/other
`),[{commit:'id',files:[{type:'M',path:'modified/file'},{type:'C',path:'changed/file'}]},{commit:'other',files:[{type:'M',path:'modified/other'},{type:'C',path:'changed/other'}]}])
    })
    section("array2", function ()
    {
        compare(kermit(`commit  ●commit
Author: ●author
Date:   ●date
●msg
■files
    ●type ●path`,`commit 5255e93531d91abee2583fded9c13559f2445489
Author: monsterkodi <monsterkodi@gmx.net>
Date:   Thu Apr 4 00:15:12 2024 +0200

    misc

M   kakao.app/kode/ko/tools/Git.kode

commit 85cfa741ce4e17f142c06d02a857b6646a26d34a
Author: monsterkodi <monsterkodi@gmx.net>
Date:   Wed Apr 3 01:10:28 2024 +0200

    git status

M   modified/file
C   changed/file
`),[{commit:'5255e93531d91abee2583fded9c13559f2445489',author:'monsterkodi <monsterkodi@gmx.net>',date:'Thu Apr 4 00:15:12 2024 +0200',msg:'misc',files:[{type:'M',path:'kakao.app/kode/ko/tools/Git.kode'}]},{commit:'85cfa741ce4e17f142c06d02a857b6646a26d34a',author:'monsterkodi <monsterkodi@gmx.net>',date:'Wed Apr 3 01:10:28 2024 +0200',msg:'git status',files:[{type:'M',path:'modified/file'},{type:'C',path:'changed/file'}]}])
    })
    section("nested", function ()
    {
        compare(kermit(`header ●header
■level1
    sub ●sub
    ■level2
        ●prefix ●suffix`,`header h1
    sub s1
        1p1 1s1`),[{header:'h1',level1:[{sub:'s1',level2:[{prefix:'1p1',suffix:'1s1'}]}]}])
    })
    section("nested array", function ()
    {
        compare(kermit(`header ●header
■level1
    sub ●sub
    ■level2
        ●prefix ●suffix`,`header h1
    sub s1
        1p1 1s1
        1p2 1s2
    sub s2
        2p1 2s1
        2p2 2s2
        2p3 2s3`),[{header:'h1',level1:[{sub:'s1',level2:[{prefix:'1p1',suffix:'1s1'},{prefix:'1p2',suffix:'1s2'}]},{sub:'s2',level2:[{prefix:'2p1',suffix:'2s1'},{prefix:'2p2',suffix:'2s2'},{prefix:'2p3',suffix:'2s3'}]}]}])
    })
    section("pre", function ()
    {
        compare(kermit(`○line`,"               GitInfo.diff()"),[{line:'               GitInfo.diff()'}])
        compare(kermit(`●type ○line`,"+               GitInfo.diff()\n-               more stuff"),[{type:'+',line:'               GitInfo.diff()'},{type:'-',line:'               more stuff'}])
    })
    section("patch", function ()
    {
        compare(kermit(`diff --git ●path
index ●refs
--- ●srcfile
+++ ●tgtfile
■changes
    @@ ●lineinfo @@ ●context
    ■changedlines
        ●type ○line`,`diff --git a/kakao.app/js/ko/commands/macro.js b/kakao.app/js/ko/commands/macro.js
index a6bb5d7..10b7d0a 100644
--- a/kakao.app/js/ko/commands/macro.js
+++ b/kakao.app/js/ko/commands/macro.js
@@ -122 +122 @@ Macro = (function ()
-                GitInfo.diff()
+                GitInfo.diff(cmds)`),[{path:'a/kakao.app/js/ko/commands/macro.js b/kakao.app/js/ko/commands/macro.js',refs:'a6bb5d7..10b7d0a 100644',srcfile:'a/kakao.app/js/ko/commands/macro.js',tgtfile:'b/kakao.app/js/ko/commands/macro.js',changes:[{lineinfo:'-122 +122',context:'Macro = (function ()',changedlines:[{type:'-',line:'                GitInfo.diff()'},{type:'+',line:'                GitInfo.diff(cmds)'}]}]}])
    })
    section("patch deleted", function ()
    {
        return
        compare(kermit(`diff --git ●path
deleted ●deleted
index ●refs
--- ●srcfile
+++ ●tgtfile
■changes
    @@ ●lineinfo @@ ●context
    ■changedlines
        ●type ○line`,`diff --git a/kakao.app/js/ko/commands/macro.js b/kakao.app/js/ko/commands/macro.js
index a6bb5d7..10b7d0a 100644
--- a/kakao.app/js/ko/commands/macro.js
+++ b/kakao.app/js/ko/commands/macro.js
@@ -122 +122 @@ Macro = (function ()
-                GitInfo.diff()
+                GitInfo.diff(cmds)
diff --git a/kakao.app/deleted.js b/kakao.app/deleted.js
deleted file mode 100644
index a6bb5d7..00000000`),[{path:'a/kakao.app/js/ko/commands/macro.js b/kakao.app/js/ko/commands/macro.js',refs:'a6bb5d7..10b7d0a 100644',srcfile:'a/kakao.app/js/ko/commands/macro.js',tgtfile:'b/kakao.app/js/ko/commands/macro.js',changes:[{lineinfo:'-122 +122',context:'Macro = (function ()',changedlines:[{type:'-',line:'                GitInfo.diff()'},{type:'+',line:'                GitInfo.diff(cmds)'}]}]},{path:'a/kakao.app/deleted.js b/kakao.app/deleted.js',deleted:'file mode 100644',refs:'a6bb5d7..00000000'}])
    })
}
toExport["kermit"]._section_ = true
toExport._test_ = true
export default toExport
