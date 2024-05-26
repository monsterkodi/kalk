
//  0000000  000000000   0000000   000000000  000   000   0000000  
// 000          000     000   000     000     000   000  000       
// 0000000      000     000000000     000     000   000  0000000   
//      000     000     000   000     000     000   000       000  
// 0000000      000     000   000     000      0000000   0000000   

#import "util.h"
#import "view.h"
#import "route.h"
#import "status.h"
#import <WebKit/WebKit.h>

@implementation Status

- (NSStatusItem*) statusItem
{
    if (!self.item) 
    {
        self.item = [[NSStatusBar systemStatusBar] statusItemWithLength:NSVariableStatusItemLength];
        
        [self.item.button setTarget:self];  
        [self.item.button sendActionOn:NSEventMaskLeftMouseDown|NSEventMaskLeftMouseUp|NSEventMaskRightMouseDown|NSEventMaskRightMouseUp];
        [self.item.button setAction:@selector(click:)];
    }
    return self.item;
}

- (void) click:(NSStatusBarButton*)sender
{
    NSEvent* event = [NSApp currentEvent];
    
    NSString* name;
    
    switch (event.type)
    {
        case NSEventTypeLeftMouseDown:  name = @"status.down";        break;
        case NSEventTypeRightMouseDown: name = @"status.right_down";  break;
        case NSEventTypeRightMouseUp:   name = @"status.right_click"; break;
        default:
        case NSEventTypeLeftMouseUp:    name = @"status.click";       break;
    }

    NSRect buttonRect = [[sender window] convertRectToScreen:[sender bounds]];
    NSLog(@"%@ %f %f %f %f", name, buttonRect.origin.x, buttonRect.origin.y, buttonRect.size.width, buttonRect.size.height);
    [Route emit:name arg:dictForRect(buttonRect)];
}

- (void) snapshot:(View*)view rect:(id)rect
{
    WKSnapshotConfiguration * snapshotConfiguration = [[WKSnapshotConfiguration alloc] init];
    
    float x = [[rect objectForKey:@"x"] floatValue];
    float y = [[rect objectForKey:@"y"] floatValue];
    float w = [[rect objectForKey:@"w"] floatValue];
    float h = [[rect objectForKey:@"h"] floatValue];
    
    // NSLog(@"%f %f %f %f", x, y, w, h);
    
    snapshotConfiguration.rect = CGRectMake(x, y, w, h);
    
    [view takeSnapshotWithConfiguration:snapshotConfiguration completionHandler:
        
        ^(NSImage * image, NSError * error) 
        {
            if (error) { NSLog(@"%@", error); return; }
            
            NSStatusItem* item = [self statusItem];
            
            // NSLog(@"image %@", image);
            
            item.button.cell.image = image;
        }];
        
    [snapshotConfiguration release];
}

@end