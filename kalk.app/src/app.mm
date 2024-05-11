/*
   0000000   00000000   00000000
  000   000  000   000  000   000
  000000000  00000000   00000000
  000   000  000        000
  000   000  000        000
*/

#import "fs.h"
#import "app.h"
#import "bundle.h"
#import "watch.h"
#import "route.h"

#define OK 0

@interface App ()

@property (readwrite,retain) Watch* watchHome;
@property (readwrite,retain) Watch* watch;
@property (readwrite,assign) BOOL isBuildingApp;

+ (void) moveStashWins;

@end

@implementation App

// 000  000   000  0000000    00000000  000   000
// 000  0000  000  000   000  000        000 000
// 000  000 0 000  000   000  0000000     00000
// 000  000  0000  000   000  000        000 000
// 000  000   000  0000000    00000000  000   000

+ (id) new:(NSString*)indexFile
{
    //freopen([[Bundle appPath:@"log.txt"] cStringUsingEncoding:NSASCIIStringEncoding],"a+",stderr);

    [App moveStashWins];

    App* app = [[App alloc] init];
    [app setIcon:[Bundle resourcePath:@"img/app.icns"]];

    app.snapshotFolder = @"~/Desktop";
    app.snapshotFile   = @"kakao";
    app.watch = [Watch path:[Bundle path] delegate:app];
    app.watchHome = [Watch path:[FS homeDir] delegate:app];

    id nsApp = [NSApplication sharedApplication];
    [nsApp setDelegate:app];
    [nsApp setActivationPolicy:NSApplicationActivationPolicyRegular];
    [nsApp activateIgnoringOtherApps:YES];

    NSMutableString* indexHTML = [NSMutableString stringWithString:indexFile];
    if (![indexHTML length])
    {
        indexHTML = [NSMutableString stringWithString:@"index.html"];
    }
    if (![indexHTML hasSuffix:@".html"])
    {
        [indexHTML appendString:@".html"];
    }

    id indexURL = [Bundle jsURL:indexHTML];
    id win = [Win withURL:indexURL script:nil];

    return app;
}

+ (App*) get
{
    return (App*)[[NSApplication sharedApplication] delegate];
}

- (void) dealloc
{
    [self.watch release];
    [super dealloc];
}

- (void) run
{
    [[NSApplication sharedApplication] run]; // does not return
}

// 000   000  000  000   000   0000000
// 000 0 000  000  0000  000  000
// 000000000  000  000 0 000  0000000
// 000   000  000  000  0000       000
// 00     00  000  000   000  0000000

+ (NSArray*) wins { return [[App get] wins]; }
- (NSArray*) wins
{
    NSMutableArray* wins = [NSMutableArray array];
    id app = [NSApplication sharedApplication];
    for (id win in [app windows])
    {
        if ([win isKindOfClass:[Win class]])
        {
            [wins addObject:win];
        }
    }
    return wins;
}

+ (void) moveStashWins
{
    id error;
    id path = [Bundle appPath:@".stash/win"];
    id dest = [Bundle appPath:@".stash/old"];

    id FM = [NSFileManager defaultManager];
    [FM removeItemAtPath:dest error:&error];
    if (![FM fileExistsAtPath:path])
    {
        [FM createDirectoryAtPath:path withIntermediateDirectories:YES attributes:nil error:&error];
        return;
    }
    if ([FM moveItemAtPath:path toPath:dest error:&error])
    {
        [FM createDirectoryAtPath:path withIntermediateDirectories:YES attributes:nil error:&error];
    }
}

// 00000000   00000000  000       0000000    0000000   0000000
// 000   000  000       000      000   000  000   000  000   000
// 0000000    0000000   000      000   000  000000000  000   000
// 000   000  000       000      000   000  000   000  000   000
// 000   000  00000000  0000000   0000000   000   000  0000000

- (void) reload
{
    for (Win* win in [self wins])
    {
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1.0 * NSEC_PER_SEC)), 
            dispatch_get_main_queue(), ^{
            [win reload];            
        });
    }
}

//  0000000   000   000      0000000  000   000   0000000   000   000   0000000   00000000   0000000
// 000   000  0000  000     000       000   000  000   000  0000  000  000        000       000
// 000   000  000 0 000     000       000000000  000000000  000 0 000  000  0000  0000000   0000000
// 000   000  000  0000     000       000   000  000   000  000  0000  000   000  000            000
//  0000000   000   000      0000000  000   000  000   000  000   000   0000000   00000000  0000000

- (void) onChanges:(NSArray*)changes inFolder:(NSString*)folder
{
    if ([folder isEqualToString:[FS homeDir]])
    {
        // NSLog(@"● change ▸▸▸ %@", folder);
        for (WatchChange* change in changes)
        {
            id type;
            switch (change.type)
            {
                case 0: type = @"deleted"; break;
                case 1: type = @"created"; break;
                case 2: type = @"changed"; break;
                case 3: type = @"renamed"; break;
                default: type = @"?"; break;
            }
            // NSLog(@"%@ %@ %@ ", change.isDir ? @"▸" : @"▪", type, change.path);

            id msg = [NSMutableDictionary dictionary];
            id args = [NSMutableArray array];
            [args addObject:type];
            [args addObject:change.path];
            
            NSMutableDictionary* info = [NSMutableDictionary dictionary];
            
                              [info addObject:change.inode forKey:@"inode"];
            if (change.isDir) [info addObject:@"dir"       forKey:@"type"];
            else              [info addObject:@"file"      forKey:@"type"];
            if (change.src)   [info addObject:change.src   forKey:@"src"];
            
            [args addObject:info];
            
            // NSLog(@"%@ %@", type, change.path);
            
            [msg setObject:@"fs.change" forKey:@"name"];
            [msg setObject:args forKey:@"args"];

            [Route emit:msg];
        }

        return;
    }

    BOOL reloadPage = NO;
    BOOL rebuildApp = NO;

    NSMutableArray* filesToTranspile = [NSMutableArray array];

    for (WatchChange* change in changes)
    {
        id type;
        switch (change.type)
        {
            case 0: type = @"deleted"; break;
            case 1: type = @"created"; break;
            case 2: type = @"changed"; break;
            case 3: type = @"renamed"; break;
            default: type = @"?"; break;
        }

        NSString* relPath = [change.path substringFromIndex:[folder length]+1];

        // NSLog(@"%@ %@ %@ %@", change.isDir ? @"▸" : @"▪", type, change.path, relPath);

        if ([relPath hasPrefix:@"Contents/Resources/"]) { reloadPage = YES; }

        if ([relPath hasPrefix:@"src/"])
        {
            rebuildApp = YES;
        }

        if ([relPath hasPrefix:@"pyg/"] || ([relPath hasPrefix:@"kode/"] && ![relPath hasPrefix:@"kode/kode/"]))
        {
            NSString* ext = [change.path pathExtension];
            
            if ([ext isEqualToString:@"kode"] ||
                [ext isEqualToString:@"styl"] ||
                [ext isEqualToString:@"noon"] ||
                [ext isEqualToString:@"pug"])
            {
                [filesToTranspile addObject:change.path];
            }
        }
    }

    if (rebuildApp)
    {
        [self compileApp];
    }
    else if ([filesToTranspile count])
    {
        [self transpile:filesToTranspile];
    }
    else if (reloadPage)
    {
        [self reload];
    }
}

//  0000000   0000000   00     00  00000000   000  000      00000000
// 000       000   000  000   000  000   000  000  000      000     
// 000       000   000  000000000  00000000   000  000      0000000 
// 000       000   000  000 0 000  000        000  000      000     
//  0000000   0000000   000   000  000        000  0000000  00000000

- (NSString*) outputOfPipe:(NSPipe*)pipe
{
    NSData * data = [[pipe fileHandleForReading] readDataToEndOfFile];
    return [[[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding] autorelease];
}

- (void) launchTask:(NSTask*)task output:(void (^)(NSString*))output
{
    NSPipe* pipe = [NSPipe pipe];
    [task setStandardOutput:pipe];

    [task setTerminationHandler:^(NSTask* task)
    {
        if ([task terminationStatus] == OK)
        {
            output([self outputOfPipe:pipe]);
        }
        [task autorelease];
    }];

    [task launch];
}

- (void) compileApp
{
    if (self.isBuildingApp) return;

    self.isBuildingApp = YES;

    NSTask* md5task = [self taskForCommand:@"/sbin/md5" args:[NSArray arrayWithObject:[Bundle macOSPath:@"kakao"]]];

    [self launchTask:md5task output:^(NSString* md5out)
    {
        NSTask* kkbtask = [self taskForNodeScript:[Bundle appPath:@"kk"] args:[NSArray arrayWithObject:@"-b"]];

        [kkbtask setTerminationHandler:^(NSTask* task)
        {
            self.isBuildingApp = NO;

            if ([task terminationStatus] == OK)
            {
                NSTask* md6task = [self taskForCommand:@"/sbin/md5" args:[NSArray arrayWithObject:[Bundle macOSPath:@"kakao"]]];
                [self launchTask:md6task output:^(NSString* md6out)
                {
                    if (![md5out isEqualToString:md6out])
                    {
                        NSLog(@"RELAUNCH!");
                        NSTask *relaunchtask = [[NSTask alloc] init];

                        [relaunchtask setLaunchPath:[Bundle appPath:@"Contents/MacOS/kakao"]];

                        [relaunchtask launch];
                        [[NSApplication sharedApplication] terminate:0];
                    }
                }];
            }
            else
            {
                [Route emit:@"buildFailed"];
            }
        }];

        [kkbtask launch];
    }];
}

// 000000000  00000000    0000000   000   000   0000000  00000000   000  000      00000000  
//    000     000   000  000   000  0000  000  000       000   000  000  000      000       
//    000     0000000    000000000  000 0 000  0000000   00000000   000  000      0000000   
//    000     000   000  000   000  000  0000       000  000        000  000      000       
//    000     000   000  000   000  000   000  0000000   000        000  0000000  00000000  

- (void) transpile:(NSArray*)filesToTranspile
{
    static BOOL isTranspiling = NO;

    if (isTranspiling) return;

    isTranspiling = YES;    
 
    NSArray* files = [[NSSet setWithArray:filesToTranspile] allObjects];
    
    NSMutableDictionary* md5dct = [NSMutableDictionary dictionary];
    NSMutableDictionary* md6dct = [NSMutableDictionary dictionary];
    
    // NSLog(@"transpile %@", files);
    
    __block int transpiled = 0;
    __block BOOL reload = NO;
    
    for (NSString* file in files)
    {
        NSTask* task = [self taskForNodeScript:[Bundle appPath:@"kk"] args:[NSArray arrayWithObjects:@"-qk", file, nil]];
        [self launchTask:task output:^(NSString* kkkout)
        {
            transpiled++;
            if ([kkkout containsString:@"✔"]) reload = YES;
            if (transpiled == [files count])
            {
                isTranspiling = NO;
                if (reload) 
                {
                    NSLog(@"reload");
                    [self reload];
                }
            }
        }];
    }
}

// 00000000  000   000  00000000   0000000  000   000  000000000  00000000
// 000        000 000   000       000       000   000     000     000
// 0000000     00000    0000000   000       000   000     000     0000000
// 000        000 000   000       000       000   000     000     000
// 00000000  000   000  00000000   0000000   0000000      000     00000000

- (int) kk:(NSString*)command { return [self kk:command args:nil]; }
- (int) kk:(NSString*)command args:(NSArray*)args
{
    NSMutableArray* arr = [NSMutableArray array];
    [arr addObject:command];
    if (args) [arr addObjectsFromArray:args];

    return [self executeNodeScript:[Bundle appPath:@"kk"] args:arr];
}

// 000   000   0000000   0000000    00000000
// 0000  000  000   000  000   000  000
// 000 0 000  000   000  000   000  0000000
// 000  0000  000   000  000   000  000
// 000   000   0000000   0000000    00000000

- (NSTask*) taskForNodeScript:(NSString*)scriptPath args:(NSArray*)args
{
    NSTask *task = [[NSTask alloc] init];

    [task setLaunchPath:@"/usr/bin/env"];

    NSMutableArray* arguments = [NSMutableArray array];
    [arguments addObject:@"node"];
    [arguments addObject:@"--experimental-detect-module"];
    [arguments addObject:scriptPath];
    [arguments addObjectsFromArray:args];

    [task setArguments:arguments];
    return task;
}

- (NSTask*) launchNodeScript:(NSString*)scriptPath args:(NSArray*)args
{
    NSTask *task = [self taskForNodeScript:scriptPath args:args];

    [task launch];

    return task;
}

- (int) executeNodeScript:(NSString*)scriptPath args:(NSArray*)args
{
    NSTask* task = [self launchNodeScript:scriptPath args:args];

    [task waitUntilExit];

    int exitCode = [task terminationStatus];

    [task autorelease];

    return exitCode;
}

//  0000000  000   000  00000000  000      000
// 000       000   000  000       000      000
// 0000000   000000000  0000000   000      000
//      000  000   000  000       000      000
// 0000000   000   000  00000000  0000000  0000000

- (NSTask*) taskForCommand:(NSString*)command args:(NSArray*)args
{
    // NSLog(@"taskForCommand %@ %@", command, args);

    NSTask *task = [[NSTask alloc] init];

    [task setLaunchPath:command];

    // NSLog(@"taskForCommand %@", [args componentsJoinedByString:@" "]);

    if ([[args objectAtIndex:0] isKindOfClass:[NSDictionary class]])
    {
        NSDictionary* dict = (NSDictionary*)[args objectAtIndex:0];

        if ([dict objectForKey:@"args"])
        {
            [task setArguments:[dict objectForKey:@"args"]];
        }
        else if ([dict objectForKey:@"arg"])
        {
            if ([[dict objectForKey:@"arg"] isKindOfClass:[NSArray class]])
            {
                [task setArguments:[dict objectForKey:@"arg"]];
            }
            else
            {
                [task setArguments:[[dict objectForKey:@"arg"] componentsSeparatedByString:@" "]];
            }
        }

        if ([dict objectForKey:@"cwd"])
        {
            task.currentDirectoryURL = [NSURL fileURLWithPath:[dict objectForKey:@"cwd"]];
        }
    }
    else
    {
        [task setArguments:args];
    }

    return task;
}

- (NSString*) executeShellScript:(NSArray*)args callback:(Callback)callback
{
    NSRange range; range.location = 1; range.length = [args count]-1;
    NSTask* task = [self taskForCommand:[args objectAtIndex:0] args:[args subarrayWithRange:range]];

    NSPipe *pipe = [NSPipe pipe];
    __block NSFileHandle* fileHandle = [pipe fileHandleForReading];
    [fileHandle readToEndOfFileInBackgroundAndNotify];
    [task setStandardOutput:pipe];
    
    __block id observer = [[NSNotificationCenter defaultCenter] 
        addObserverForName:NSFileHandleReadToEndOfFileCompletionNotification 
        object:fileHandle 
        queue:nil
        usingBlock:^(NSNotification *notification) 
        {
            NSData* readData = [[notification userInfo] objectForKey:NSFileHandleNotificationDataItem];
            NSString* outString = [[[NSString alloc] initWithData:readData encoding:NSUTF8StringEncoding] autorelease];
            callback(outString, nil);
            [[NSNotificationCenter defaultCenter] removeObserver:observer];
        }
    ];
    
    [task setTerminationHandler:^(NSTask* task)
    {
        if ([task terminationStatus] != OK)
        {
            NSLog(@"task FAIL!");
        }        
        [task autorelease];
    }];
    
    [task launch];
    return @"launched";
}

// 000000000  00000000  00000000   00     00  000  000   000   0000000   000000000  00000000
//    000     000       000   000  000   000  000  0000  000  000   000     000     000
//    000     0000000   0000000    000000000  000  000 0 000  000000000     000     0000000
//    000     000       000   000  000 0 000  000  000  0000  000   000     000     000
//    000     00000000  000   000  000   000  000  000   000  000   000     000     00000000

-(NSApplicationTerminateReply) applicationShouldTerminate:(NSApplication*)sender
{
    // NSLog(@"terminate %@", sender);
    return NSTerminateNow;
}

-(BOOL) applicationShouldTerminateAfterLastWindowClosed:(NSApplication*)sender
{
    return YES;
}

-(void) setIcon:(NSString*) pngFilePath
{
    id icon = [[NSImage alloc] initWithContentsOfFile:pngFilePath];
    [[NSApplication sharedApplication] setApplicationIconImage:icon];
}

@end