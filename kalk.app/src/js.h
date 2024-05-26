/*
          000   0000000  
          000  000       
          000  0000000   
    000   000       000  
     0000000   0000000   
*/

#import <Cocoa/Cocoa.h>
#import <JavaScriptCore/JavaScriptCore.h>

@interface JS : NSObject

+ (id) js:(NSString*)req args:(NSArray*)args;
+ (int) run:(NSString*)scriptPath;

@end

