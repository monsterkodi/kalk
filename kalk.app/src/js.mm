/*
          000   0000000
          000  000     
          000  0000000 
    000   000       000
     0000000   0000000 
*/

#import "js.h"
#import "bundle.h"

@implementation JS

+ (id) js:(NSString*)req args:(NSArray*)args
{
    // NSLog(@"js %@ %@", req, args);
    
    if ([req isEqualToString:@"execute"])
    {
        if ([args count] && [[args objectAtIndex:0] isKindOfClass:[NSString class]]) 
        {
            id script = [[args objectAtIndex:0] stringByExpandingTildeInPath];
            
            // NSLog(@"execute %@", script);
        }
    }
    
    return nil;
}

+ (int) run:(NSString*)scriptPath
{    
    if (![[NSFileManager defaultManager] fileExistsAtPath:scriptPath])
    {
        scriptPath = [Bundle appPath:scriptPath];

        if (![[NSFileManager defaultManager] fileExistsAtPath:scriptPath])
        {
            NSLog(@"file still does not exist! %@", scriptPath);
            return 1;
        }    
    }
 
    // NSLog(@"run %@", scriptPath);
    
    id scriptSrc = [NSString stringWithContentsOfFile:scriptPath encoding:NSUTF8StringEncoding error:nil];

    // NSLog(@"src %@", scriptSrc);
    
    JSContext* jsContext = [[JSContext alloc] init];
        
    JSValue* jsValue = [jsContext evaluateScript:scriptSrc withSourceURL:[NSURL fileURLWithPath:scriptPath]];
    
    NSLog(@"ret %@", jsValue);
        
    return 0;
}

@end