var toExport = {}
var dss, rgs

import util from "./util.js"
let inc = util.inc
let ranges = util.ranges
let dissect = util.dissect
let lang = util.lang

lang('md')
toExport["md"] = function ()
{
    rgs = ranges("**bold**")
    compare(inc(rgs,0,'*'),'punct bold')
    compare(inc(rgs,1,'*'),'punct bold')
    compare(inc(rgs,2,'bold'),'text bold')
    compare(inc(rgs,6,'*'),'punct bold')
    compare(inc(rgs,7,'*'),'punct bold')
    rgs = ranges(",**b**,")
    compare(inc(rgs,1,'*'),'punct bold')
    compare(inc(rgs,3,'b'),'text bold')
    compare(inc(rgs,4,'*'),'punct bold')
    rgs = ranges("*it lic*")
    compare(inc(rgs,0,'*'),'punct italic')
    compare(inc(rgs,1,'it'),'text italic')
    compare(inc(rgs,4,'lic'),'text italic')
    compare(inc(rgs,7,'*'),'punct italic')
    rgs = ranges("*italic*")
    compare(inc(rgs,0,'*'),'punct italic')
    compare(inc(rgs,1,'italic'),'text italic')
    compare(inc(rgs,7,'*'),'punct italic')
    rgs = ranges("*`italic code`*")
    compare(inc(rgs,0,'*'),'punct italic')
    compare(inc(rgs,1,'`'),'punct italic code')
    compare(inc(rgs,2,'italic'),'text italic code')
    compare(inc(rgs,9,'code'),'text italic code')
    compare(inc(rgs,14,'*'),'punct italic')
    rgs = ranges("it's good")
    compare(inc(rgs,0,'it'),'text')
    compare(inc(rgs,2,"'"),'punct')
    compare(inc(rgs,3,'s'),'text')
    rgs = ranges("if is empty in then")
    compare(inc(rgs,0,'if'),'text')
    compare(inc(rgs,3,'is'),'text')
    compare(inc(rgs,6,'empty'),'text')
    compare(inc(rgs,12,'in'),'text')
    compare(inc(rgs,15,'then'),'text')
    rgs = ranges('text files. bla')
    compare(inc(rgs,0,'text'),'text')
    compare(inc(rgs,10,'.'),'punct')
    rgs = ranges('..bla')
    compare(inc(rgs,0,'.'),'punct')
    compare(inc(rgs,1,'.'),'punct')
    rgs = ranges('```coffeescript')
    compare(inc(rgs,0,'`'),'punct code triple')
    compare(inc(rgs,3,'coffeescript'),'comment')
    rgs = ranges("- li")
    compare(inc(rgs,0,'-'),'punct li1 marker')
    compare(inc(rgs,2,'li'),'text li1')
    rgs = ranges("    - **bold**")
    compare(inc(rgs,4,'-'),'punct li2 marker')
    compare(inc(rgs,8,'bold'),'text li2 bold')
    rgs = ranges("        - **bold**")
    compare(inc(rgs,8,'-'),'punct li3 marker')
    compare(inc(rgs,12,'bold'),'text li3 bold')
    rgs = ranges("        * **bold**")
    compare(inc(rgs,8,'*'),'punct li3 marker')
    compare(inc(rgs,12,'bold'),'text li3 bold')
    dss = dissect(`- li1
text`)
    compare(inc(dss[0],0,'-'),'punct li1 marker')
    compare(inc(dss[1],0,'text'),'text')
    dss = dissect(`# h1
## h2
### h3
#### h4
##### h5`)
    compare(inc(dss[0],0,"#"),'punct h1')
    compare(inc(dss[0],2,"h1"),'text h1')
    compare(inc(dss[1],0,"#"),'punct h2')
    compare(inc(dss[1],3,"h2"),'text h2')
    compare(inc(dss[2],0,"#"),'punct h3')
    compare(inc(dss[2],4,"h3"),'text h3')
    compare(inc(dss[3],0,"#"),'punct h4')
    compare(inc(dss[3],5,"h4"),'text h4')
    compare(inc(dss[4],0,"#"),'punct h5')
    compare(inc(dss[4],6,"h5"),'text h5')
    dss = dissect(`\`\`\`js
\`\`\``)
    compare(inc(dss[1],0,'`'),'punct code triple')
    dss = dissect(`\`\`\`js
\`\`\``)
    compare(inc(dss[1],0,'`'),'punct code triple')
}
toExport["md"]._section_ = true
toExport._test_ = true
export default toExport
