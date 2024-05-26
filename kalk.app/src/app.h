/*
    0000000   00000000   00000000   
   000   000  000   000  000   000  
   000000000  00000000   00000000   
   000   000  000        000        
   000   000  000        000        
*/

#import <Cocoa/Cocoa.h>
#import "status.h"
#import "watch.h"
#import "win.h"

@interface App : NSResponder <NSApplicationDelegate, WatchDelegate>

@property (readwrite,assign) NSString* snapshotFolder;
@property (readwrite,assign) NSString* snapshotFile;
@property (readwrite,retain) Status*   status;

+ (id)   new:(NSString*)indexFile;
+ (App*) get;
- (void) run; 
- (void) quit;
- (void) setIcon:(NSString*) pngFilePath;
- (int)  executeNodeScript:(NSString*)scriptPath args:(NSArray*)args;
- (BOOL) shouldWindowSaveStash:(Win*)win;
- (NSString*) executeShellScript:(NSArray*)args callback:(Callback)callback;
+ (NSArray*) wins;
- (NSArray*) wins;

@end
