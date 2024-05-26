/*
    00000000   0000000  
    000       000       
    000000    0000000   
    000            000  
    000       0000000   
*/

#import <Cocoa/Cocoa.h>
#include "win.h"

@interface FS : NSObject

+ (id) fs:(NSString*)req args:(NSArray*)args win:(Win*)win;

+ (NSString*) userName;
+ (NSString*) homeDir;
+ (NSString*) tmpDir;

@end

