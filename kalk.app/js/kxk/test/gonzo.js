var toExport = {}
import gonzo from "../gonzo.js"

toExport["gonzo"] = function ()
{
    section("single", function ()
    {
        compare(gonzo(`A
    B`),[{line:'A',indent:0,blck:[{line:'B',indent:4}]}])
    })
    section("outdent", function ()
    {
        compare(gonzo(`A
    B
C`),[{line:'A',indent:0,blck:[{line:'B',indent:4}]},{line:'C',indent:0}])
    })
    section("double", function ()
    {
        compare(gonzo(`A
   B
     C`),[{line:'A',indent:0,blck:[{line:'B',indent:3,blck:[{line:'C',indent:5}]}]}])
    })
    section("ioio", function ()
    {
        compare(gonzo(`I
  O
i
  o`),[{line:'I',indent:0,blck:[{line:'O',indent:2}]},{line:'i',indent:0,blck:[{line:'o',indent:2}]}])
    })
    section("sublevel", function ()
    {
        compare(gonzo(`header
level1
    sub
    level2
        subsub`),[{line:'header',indent:0},{line:'level1',indent:0,blck:[{line:'sub',indent:4},{line:'level2',indent:4,blck:[{line:'subsub',indent:8}]}]}])
    })
}
toExport["gonzo"]._section_ = true
toExport._test_ = true
export default toExport
