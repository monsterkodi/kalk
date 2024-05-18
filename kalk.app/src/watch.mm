/*
   000   000   0000000   000000000   0000000  000   000  
   000 0 000  000   000     000     000       000   000  
   000000000  000000000     000     000       000000000  
   000   000  000   000     000     000       000   000  
   00     00  000   000     000      0000000  000   000  
*/

#import "watch.h"
#import <Foundation/Foundation.h>

#define INTERVAL 0.1 // time in seconds between change dispatches

BOOL shouldIgnoreChangedPath(NSString* path)
{
    if ([path hasSuffix:@".git/index.lock"])
    {
        return YES;
    }
    if ([path hasPrefix:NSHomeDirectory()])
    {
        NSString* homePath = [path substringFromIndex:[NSHomeDirectory() length]+1];        
        if ([homePath hasPrefix:@"Library/"])
        {
            return YES;
        }
    }
    return NO;
} 

//  0000000  000   000   0000000   000   000   0000000   00000000  
// 000       000   000  000   000  0000  000  000        000       
// 000       000000000  000000000  000 0 000  000  0000  0000000   
// 000       000   000  000   000  000  0000  000   000  000       
//  0000000  000   000  000   000  000   000   0000000   00000000  

@implementation WatchChange

+ (WatchChange*) withPath:(NSString*)path type:(ChangeType)type isDir:(BOOL)isDir inode:(NSNumber*)inode
{
    WatchChange* change = [[WatchChange alloc] init];
    change.path  = path;
    change.type  = type;
    change.isDir = isDir;
    change.inode = inode;
    return change;
}

@end

// 000   000   0000000   000000000   0000000  000   000  
// 000 0 000  000   000     000     000       000   000  
// 000000000  000000000     000     000       000000000  
// 000   000  000   000     000     000       000   000  
// 00     00  000   000     000      0000000  000   000  

static void FSMonitorEventStreamCallback(ConstFSEventStreamRef streamRef, Watch* monitor, size_t numEvents, NSArray *eventPaths, const FSEventStreamEventFlags eventFlags[], const FSEventStreamEventId eventIds[]);

@interface Watch ()
{
    FSEventStreamRef streamRef;
}

- (Watch*)initPath:(NSString*)path;
- (void) start;
- (void) stop;

@property(nonatomic, assign) id<WatchDelegate>  delegate;
@property(nonatomic, retain) NSString*          path;

@end

@implementation Watch

+ (Watch*) path:(NSString*)path delegate:(id<WatchDelegate>)delegate
{
    Watch* watch = [[Watch alloc] initPath:path];
    watch.delegate = delegate;
    return watch;
}

- (Watch*) initPath:(NSString*)path 
{
    if ((self = [super init])) 
    {
        self.path = [path copy];
        [self start];
    }
    return self;
}

- (void) dealloc
{
    [self.delegate release];
    [self stop];
    [super dealloc];
}

- (void) start 
{
    NSArray *paths = [NSArray arrayWithObject:self.path];

    FSEventStreamContext context;
    context.version = 0;
    context.info = (__bridge void *)(self);
    context.retain = NULL;
    context.release = NULL;
    context.copyDescription = NULL;

    streamRef = FSEventStreamCreate(nil,
                                     (FSEventStreamCallback)FSMonitorEventStreamCallback,
                                     &context,
                                     (__bridge CFArrayRef)paths,
                                     kFSEventStreamEventIdSinceNow,
                                     INTERVAL,
                                     kFSEventStreamCreateFlagUseCFTypes|kFSEventStreamCreateFlagNoDefer|kFSEventStreamCreateFlagFileEvents);
    if (!streamRef) 
    {
        NSLog(@"Failed to start monitoring of %@ (FSEventStreamCreate error)", self.path);
    }
    else
    {
        NSLog(@"👁  %@", self.path);
    }
    
    FSEventStreamSetDispatchQueue(streamRef, dispatch_get_main_queue());
    
    if (!FSEventStreamStart(streamRef)) 
    {
        NSLog(@"Error: can't watch %@ (FSEventStreamStart error)", self.path);
    }
}

- (void) stop
{
    FSEventStreamStop(streamRef);
    FSEventStreamInvalidate(streamRef);
    FSEventStreamRelease(streamRef);
    streamRef = nil;
}

@end

// 00     00   0000000   000   000  000  000000000   0000000   00000000   00000000  000   000  00000000  000   000  000000000
// 000   000  000   000  0000  000  000     000     000   000  000   000  000       000   000  000       0000  000     000   
// 000000000  000   000  000 0 000  000     000     000   000  0000000    0000000    000 000   0000000   000 0 000     000   
// 000 0 000  000   000  000  0000  000     000     000   000  000   000  000          000     000       000  0000     000   
// 000   000   0000000   000   000  000     000      0000000   000   000  00000000      0      00000000  000   000     000   

static void FSMonitorEventStreamCallback( ConstFSEventStreamRef streamRef, 
                                          Watch* monitor, 
                                          size_t numEvents, 
                                          NSArray *eventPaths, 
                                          const FSEventStreamEventFlags eventFlags[], 
                                          const FSEventStreamEventId eventIds[]) 
{
    NSString* deletedPath = nil;
    NSMutableArray* changes = [NSMutableArray array];
    
    // NSLog(@"▸▸     numEvents     %zu", numEvents);
            
    for (size_t i = 0; i < numEvents; i++) 
    {
        // NSLog(@"▸▸          %@ %x event %llu", [eventPaths objectAtIndex:i], eventFlags[i], eventIds[i]);
        if (shouldIgnoreChangedPath([eventPaths objectAtIndex:i]))
        {
            continue;
        }       
        
        BOOL isDir; ChangeType changeType;
        
        if (eventFlags[i] & kFSEventStreamEventFlagItemIsFile)
        {
            isDir = false;
        }
        else
        {
            isDir = true;
        }

        if (eventFlags[i] & kFSEventStreamEventFlagItemRemoved)
        {
            changeType = ChangeType::Deleted;
        }
        else if (eventFlags[i] & kFSEventStreamEventFlagItemCreated)
        {
            changeType = ChangeType::Created;
        }
        else if (eventFlags[i] & kFSEventStreamEventFlagItemRenamed)
        {       
            changeType = ChangeType::Renamed;
        }
        else
        {
            changeType = ChangeType::Changed;
        }
        
        id attr = [[NSFileManager defaultManager] attributesOfItemAtPath:[eventPaths objectAtIndex:i] error:nil];
        id inode = [attr objectForKey:NSFileSystemFileNumber];
        if (!inode) 
        { 
            if (changeType != ChangeType::Created)
            {
                // NSLog(@"no inode change event type to deleted %d %@", changeType, [eventPaths objectAtIndex:i]);
                changeType = ChangeType::Deleted;
                deletedPath = [eventPaths objectAtIndex:i];
            }
            inode = [NSNumber numberWithInt:0];
        }
        
        [changes addObject:[WatchChange withPath:[eventPaths objectAtIndex:i] type:changeType isDir:isDir inode:inode]];
    }
    
    // NSLog(@"changes num %lu", [changes count]);
    
    int ci = 0;
    while (ci < ((int)[changes count])-1)
    {
        // NSLog(@"check %d", ci);
        
        WatchChange* first  = (WatchChange*)[changes objectAtIndex:ci];
        WatchChange* second = (WatchChange*)[changes objectAtIndex:ci+1];
     
        if (first.type == ChangeType::Created && [first.inode intValue] == 0 && second.type == ChangeType::Renamed)
        {
            second.type = ChangeType::Created;
            [changes removeObjectAtIndex:ci];
            // NSLog(@"changed add+mv to add %@ %@", second.path, changes);
        }
        else if (first.type == ChangeType::Deleted && second.type == ChangeType::Renamed)
        {
            second.src = deletedPath;
            [changes removeObjectAtIndex:ci];
            // NSLog(@"changed del+mv to renamed with src %@", changes);
        }
        
        ci++;
    }    
    
    if ([changes count])
    {
        [monitor.delegate onChanges:changes inFolder:monitor.path];
    }
}
