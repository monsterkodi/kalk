/*
 0000000  000000000   0000000   000000000  000   000   0000000    
000          000     000   000     000     000   000  000         
0000000      000     000000000     000     000   000  0000000     
     000     000     000   000     000     000   000       000    
0000000      000     000   000     000      0000000   0000000     
*/

#import <Cocoa/Cocoa.h>

@interface Status : NSObject

@property (readwrite,retain) NSStatusItem* item;

- (NSStatusItem*) statusItem;
- (void) snapshot:(View*)view rect:(id)rect;

@end
