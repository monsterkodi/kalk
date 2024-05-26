/*
  000   000  000  000   000  
  000 0 000  000  0000  000  
  000000000  000  000 0 000  
  000   000  000  000  0000  
  00     00  000  000   000  
*/

#import <Cocoa/Cocoa.h>
#import "view.h"

typedef void (^Callback)(id, NSString*);

@interface Win : NSWindow <WKNavigationDelegate>

@property (assign) View*     view;
@property (retain) NSString* initScript;

+ (Win*) withURL:(NSURL*)url script:(NSString*)script;
- (Win*) initWithURL:(NSURL*)url script:(NSString*)script;
- (Win*) new:(NSString*)urlString script:(NSString*)script;
- (Win*) focusNext;
- (Win*) focusPrev;
- (void) reload;
- (void) framerateDrop:(long)ms;
- (void) center;
- (void) setFrame:(id)frame;
- (void) setFrame:(id)frame immediate:(id)immediate;
- (void) setTopLeft:(id)topLeft;
- (void) setWidth:(unsigned int)width height:(unsigned int)height;
- (NSString*) snapshot:(NSString*)pngFilePath;
- (NSDictionary*) frameInfo;

@end
