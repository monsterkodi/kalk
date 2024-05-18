/*
   000   000   0000000   000000000   0000000  000   000  
   000 0 000  000   000     000     000       000   000  
   000000000  000000000     000     000       000000000  
   000   000  000   000     000     000       000   000  
   00     00  000   000     000      0000000  000   000  
*/

#import <Cocoa/Cocoa.h>

//  0000000  000   000   0000000   000   000   0000000   00000000  
// 000       000   000  000   000  0000  000  000        000       
// 000       000000000  000000000  000 0 000  000  0000  0000000   
// 000       000   000  000   000  000  0000  000   000  000       
//  0000000  000   000  000   000  000   000   0000000   00000000  

typedef enum 
{
    Deleted,
    Created,
    Changed,
    Renamed
    
} ChangeType;

@interface WatchChange : NSObject

@property(nonatomic, copy)  NSString*    path;
@property(nonatomic, copy)  NSString*    src;
@property(nonatomic, copy)  NSNumber*    inode;
@property(nonatomic)        ChangeType   type;
@property(nonatomic)        BOOL         isDir;

@end

@protocol WatchDelegate;

// 000   000   0000000   000000000   0000000  000   000  
// 000 0 000  000   000     000     000       000   000  
// 000000000  000000000     000     000       000000000  
// 000   000  000   000     000     000       000   000  
// 00     00  000   000     000      0000000  000   000  

@interface Watch : NSObject

+ (Watch*)path:(NSString*)path delegate:(id<WatchDelegate>)delegate;

@end

// 0000000    00000000  000      00000000   0000000    0000000   000000000  00000000  
// 000   000  000       000      000       000        000   000     000     000       
// 000   000  0000000   000      0000000   000  0000  000000000     000     0000000   
// 000   000  000       000      000       000   000  000   000     000     000       
// 0000000    00000000  0000000  00000000   0000000   000   000     000     00000000  

@protocol WatchDelegate <NSObject>

- (void)onChanges:(NSArray*)changes inFolder:(NSString*)folder;

@end
