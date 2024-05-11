// 00     00   0000000   000  000   000  
// 000   000  000   000  000  0000  000  
// 000000000  000000000  000  000 0 000  
// 000 0 000  000   000  000  000  0000  
// 000   000  000   000  000  000   000  

#include <iostream>
#include <objc/objc-runtime.h>

id  operator"" _cls(const char *s, std::size_t) { return (id)objc_getClass(s); }
SEL operator"" _sel(const char *s, std::size_t) { return sel_registerName(s); }

int main(int argc, char ** argv)
{
    if (argc >= 3 && argv[1][0] == '-' && argv[1][1] == 'j')    
    {
        // [[JS run:file]
        
        id file = ((id(*)(id, SEL, const char *))objc_msgSend)("NSString"_cls, "stringWithUTF8String:"_sel, argv[2]);
        return ((int(*)(id, SEL, id))objc_msgSend)("JS"_cls, "run:"_sel, file);
    }

    // [[App new:html] run]
    
    id index = ((id(*)(id, SEL, const char *))objc_msgSend)("NSString"_cls, "stringWithUTF8String:"_sel, argv[1] ? argv[1] : "index.html");
    id app = ((id(*)(id, SEL, id))objc_msgSend)("App"_cls, "new:"_sel, index);
    ((void(*)(id, SEL))objc_msgSend)(app, "run"_sel);

    return 0;
}