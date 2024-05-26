/*
0000000    00000000  000      00000000   0000000    0000000   000000000  00000000  
000   000  000       000      000       000        000   000     000     000       
000   000  0000000   000      0000000   000  0000  000000000     000     0000000   
000   000  000       000      000       000   000  000   000     000     000       
0000000    00000000  0000000  00000000   0000000   000   000     000     00000000  
*/

#import "fs.h"
#import "win.h"
#import "app.h"
#import "util.h"
#import "route.h"
#import "bundle.h"

@interface WinDelegate : NSObject <NSWindowDelegate> {}
@end

@implementation WinDelegate

- (void) sendFrame:(Win*)win
{ 
    id msg = [NSMutableDictionary dictionary];
    [msg setObject:@"window.frame" forKey:@"name"];
    [msg setObject:[NSArray arrayWithObject:[win frameInfo]] forKey:@"args"];
    [Route send:msg win:win];
}

- (void) sendWillResize:(Win*)win newSize:(NSSize)newSize
{
    id msg = [NSMutableDictionary dictionary];
    [msg setObject:@"window.willResize" forKey:@"name"];        
    [msg setObject:[NSArray arrayWithObjects:[win frameInfo], dictForSize(newSize), nil] forKey:@"args"];
    [Route send:msg win:win];
}

- (NSSize) windowWillResize:(NSWindow *)sender toSize:(NSSize)frameSize { [self sendWillResize:(Win*)sender newSize:frameSize]; return frameSize; }
- (void)  windowDidResize:    (NSNotification *)notification { [self sendFrame:(Win*)notification.object]; }
- (void)  windowDidMove:      (NSNotification *)notification { [self sendFrame:(Win*)notification.object]; }
- (void)  windowDidBecomeKey: (NSNotification *)notification { [Route send:@"window.focus" win:(Win*)notification.object]; }
- (void)  windowDidResignKey: (NSNotification *)notification { [Route send:@"window.blur"  win:(Win*)notification.object]; }
- (void)  windowDidBecomeMain:(NSNotification *)notification { /*NSLog(@"window.main"); */ }
- (void)  windowDidResignMain:(NSNotification *)notification { /*NSLog(@"window.resign main"); */ }
- (void)  windowWillClose:    (NSNotification *)notification 
{ 
    BOOL shouldStash = [[App get] shouldWindowSaveStash:notification.object];
    id msg = [NSMutableDictionary dictionary];
    [msg setObject:@"window.close" forKey:@"name"];
    [msg setObject:[NSArray arrayWithObject:[NSNumber numberWithBool:shouldStash]] forKey:@"args"];
    
    [Route send:msg win:(Win*)notification.object];
}

- (BOOL) windowShouldClose:(NSWindow*)window 
{ 
    if ([[App wins] count] <= 1) // make sure the application closes if the last kakao window closes.
        [[NSApplication sharedApplication] terminate:self]; // don't want to keep it alive with just debugger windows.
    return YES; 
}
- (BOOL) windowShouldZoom:(NSWindow*)window toFrame:(NSRect)frame
{
    NSDictionary* resize = [NSDictionary dictionaryWithObjectsAndKeys: 
        window, NSViewAnimationTargetKey, 
        [NSValue valueWithRect: frame], NSViewAnimationEndFrameKey, 
        nil];
        
    NSArray* animations = [NSArray arrayWithObject:resize];
    NSViewAnimation* animation = [[NSViewAnimation alloc] initWithViewAnimations: animations];
    
    if ([window isZoomed])
    {
        [Route emit:@"window.demaximizes"];
        [animation setAnimationCurve: NSAnimationEaseOut];
    }
    else
    {
        [Route emit:@"window.maximizes"];
        [animation setAnimationCurve: NSAnimationEaseIn];
    }
        
    [animation setAnimationBlockingMode: NSAnimationNonblocking];
    // [animation setDuration: [window animationResizeTime:frame]];     
    [animation setDuration: 0.3];     
    [animation setFrameRate: 60];
    [animation startAnimation]; 
    
    return NO;
}

@end

/*
000   000  000  000   000  
000 0 000  000  0000  000  
000000000  000  000 0 000  
000   000  000  000  0000  
00     00  000  000   000  
*/

@implementation Win

+ (Win*) withURL:(NSURL*)url script:(NSString*)script
{
    return [[Win alloc] initWithURL:url script:script];
}

- (Win*) new:(NSString*)urlString script:(NSString*)script
{
    NSURL* url;
    
    // NSLog(@"Win new > %@", urlString);
    
    if (!urlString) urlString = @"index.html";
    
    if ([urlString hasPrefix:@"http://"] || 
        [urlString hasPrefix:@"https://"] || 
        [urlString hasPrefix:@"file://"])
    {
        url = [NSURL URLWithString:urlString];
    }
    else if ([urlString hasPrefix:@"/"])
    {
        url = [Bundle fileURL:urlString];
    }
    else
    {
        if (![urlString hasSuffix:@".html"])
        {
            urlString = [urlString stringByAppendingString:@".html"];
        }
        url = [Bundle jsURL:urlString];
    }
    
    // NSLog(@"Win new < %@", url);
    return [Win withURL:url script:script];
}

// 000  000   000  000  000000000  
// 000  0000  000  000     000     
// 000  000 0 000  000     000     
// 000  000  0000  000     000     
// 000  000   000  000     000     

- (Win*) initWithURL:(NSURL*)url script:(NSString*)script
{
    BOOL nativeTitleBar = NO;

    NSWindowStyleMask styleMask =     
        NSWindowStyleMaskTitled | 
        NSWindowStyleMaskMiniaturizable | 
        NSWindowStyleMaskClosable | 
        NSWindowStyleMaskResizable;
        
    if (!nativeTitleBar)
    {
        styleMask |= NSWindowStyleMaskFullSizeContentView;
    }

    self = [self initWithContentRect: CGRectMake(0, 0, 0, 0)
                 styleMask: styleMask
                 backing:   NSBackingStoreBuffered
                 defer:     YES];
                
    if (!self) { return nil; }
    
    [self setDelegate:[[WinDelegate alloc] init]];

    self.view = [[View alloc] init];
    
    self.view.navigationDelegate = self;
    self.initScript = script;
    
    if (!nativeTitleBar)
    {
        [self setOpaque:NO];
        [self setBackgroundColor:[NSColor clearColor]];
        
        self.titleVisibility = NSWindowTitleHidden;
        self.titlebarAppearsTransparent = YES;
        self.hasShadow = YES;
        
        [self standardWindowButton:NSWindowCloseButton      ].hidden = YES;
        [self standardWindowButton:NSWindowMiniaturizeButton].hidden = YES;
        [self standardWindowButton:NSWindowZoomButton       ].hidden = YES;
    }
    
    [self setFrame:CGRectMake(0, 0, 400, 400) display:YES animate:NO];
    [self center];
    
    [self setContentView:self.view];
    [self makeKeyAndOrderFront:nil];
    
    [self navigateToURL:url];
    
    id winscript = [NSString stringWithFormat:@"window.winID = %ld;window.userName = \"%@\";window.homeDir = \"%@\";window.tmpDir = \"%@\";window.bundlePath = \"%@\";\n", 
        (long)self.windowNumber, [FS userName], [FS homeDir], [FS tmpDir], [Bundle path]
    ]; 
    [self.view evaluateJavaScript:winscript completionHandler:nil];
    
	return self;
}

-(void) webView:(WKWebView*)webView didFinishNavigation:(WKNavigation*)navigation
{
    id script = [NSString stringWithFormat:@"window.winID = %ld;window.userName = \"%@\";window.homeDir = \"%@\";window.tmpDir = \"%@\";window.bundlePath = \"%@\";\n", 
        (long)self.windowNumber, [FS userName], [FS homeDir], [FS tmpDir], [Bundle path]
    ]; 
    if (self.initScript)
    {
        script = [script stringByAppendingString:self.initScript];
    }
    // NSLog(@"init script: %@", script);
    [webView evaluateJavaScript:script completionHandler:nil];
}

// 000   000   0000000   000   000  000   0000000    0000000   000000000  00000000  
// 0000  000  000   000  000   000  000  000        000   000     000     000       
// 000 0 000  000000000   000 000   000  000  0000  000000000     000     0000000   
// 000  0000  000   000     000     000  000   000  000   000     000     000       
// 000   000  000   000      0      000   0000000   000   000     000     00000000  

- (void) navigateToURL:(NSURL*)url
{
    if ([url isFileURL])
    {
        [self.view loadFileRequest:[NSURLRequest requestWithURL:url] allowingReadAccessToURL:[NSURL fileURLWithPath:@"/"]]; // ▸ WKNavigation*
    }
    else
    {
        [self.view loadRequest:[NSURLRequest requestWithURL:url]];
    }
}

// 00000000   0000000    0000000  000   000   0000000  
// 000       000   000  000       000   000  000       
// 000000    000   000  000       000   000  0000000   
// 000       000   000  000       000   000       000  
// 000        0000000    0000000   0000000   0000000   

- (Win*) focusNext { return [self focusSibling:+1]; }
- (Win*) focusPrev { return [self focusSibling:-1]; }
- (Win*) focusSibling:(int)offset
{
    NSArray* windows = [App wins];
    NSUInteger index = [windows indexOfObject:self];
    
    if (index != NSNotFound && [windows count] > 1)
    {    
        int sibIndex = index + offset;
        if (sibIndex < 0) sibIndex = [windows count]-1;
        if (sibIndex >= [windows count]) sibIndex = 0;
        if (sibIndex != index)
        {
            Win* sibling = (Win*)[windows objectAtIndex:sibIndex];
            //NSLog(@"%d focus sibling %d/%d %d", self.windowNumber, sibIndex, [windows count], sibling.windowNumber);
            [sibling makeKeyAndOrderFront:self];
            return sibling;
        }
    }
    NSLog(@"no sibling window!");
    return nil;
}

- (void) setFrame:(id)frame
{                                
    [[self delegate] windowShouldZoom:self toFrame:rectForDict(frame)];
}

- (void) setFrame:(id)frame immediate:(id)immediate
{
    BOOL instant = NO;
    
    if (immediate) instant = [immediate boolValue];
    
    if (instant)
    {
        [self setFrame:rectForDict(frame) display:NO animate:NO];
    }
    else
    {
        [self setFrame:frame];
    }
}

- (void) setTopLeft:(id)topLeft
{
    float x = [[topLeft objectForKey:@"x"] floatValue];
    float y = [[topLeft objectForKey:@"y"] floatValue];
    
    [self setFrameTopLeftPoint:CGPointMake(x, y)];
}

- (void) setWidth:(unsigned int)width height:(unsigned int)height
{
    [self setFrame:CGRectMake(0, 0, width, height) display:YES];
}

- (NSDictionary*) frameInfo
{
    NSMutableDictionary* info = [NSMutableDictionary dictionary];
    
    [info setObject:[NSNumber numberWithLong:self.windowNumber] forKey:@"id"];
    [info setObject:dictForRect([self frame]) forKey:@"frame"];
    if ([self screen])
    {
        [info setObject:dictForRect([[self screen] frame]) forKey:@"screen"];
    }
    
    return info;
}

- (void) center
{
    CGFloat x = (self.screen.frame.size.width  - self.frame.size.width)  / 2;
    CGFloat y = (self.screen.frame.size.height - self.frame.size.height) / 2;
    
    [self setFrameOrigin:CGPointMake(x, y)];
}

//  0000000  000   000   0000000   00000000    0000000  000   000   0000000   000000000  
// 000       0000  000  000   000  000   000  000       000   000  000   000     000     
// 0000000   000 0 000  000000000  00000000   0000000   000000000  000   000     000     
//      000  000  0000  000   000  000             000  000   000  000   000     000     
// 0000000   000   000  000   000  000        0000000   000   000   0000000      000     

-(NSString*) snapshot:(NSString*)pngFilePath
{
    NSString *filePath = @"~/Desktop/kakao.png"; // todo: make path configurable somehow
    
    if (!pngFilePath)
    {
        int number = 0;
        while ([[NSFileManager defaultManager] fileExistsAtPath:[filePath stringByExpandingTildeInPath]])
        {
            number++;
            filePath = [NSString stringWithFormat:@"~/Desktop/kakao_%d.png", number];
        }
    }
    else
    {
        filePath = [NSString stringWithString:pngFilePath];
    }
                
    WKSnapshotConfiguration * snapshotConfiguration = [[WKSnapshotConfiguration alloc] init];
    [self.view takeSnapshotWithConfiguration:snapshotConfiguration completionHandler:
        ^(NSImage * image, NSError * error) 
        {
            if (error) { NSLog(@"%@", error); return; }
                                    
            NSData *imageData = [image TIFFRepresentation];
            NSBitmapImageRep *imageRep = [NSBitmapImageRep imageRepWithData:imageData];
            imageData = [imageRep representationUsingType:NSBitmapImageFileTypePNG properties:[NSDictionary dictionary]];
            [imageData writeToFile:[filePath stringByExpandingTildeInPath] atomically:NO];        
            
        }];
    [snapshotConfiguration release];
    
    return filePath;
}

// 00     00  000   0000000   0000000    
// 000   000  000  000       000         
// 000000000  000  0000000   000         
// 000 0 000  000       000  000         
// 000   000  000  0000000    0000000    


- (void) framerateDrop:(long)ms
{
}

- (BOOL) canBecomeKeyWindow
{
	return YES;
}

- (BOOL) canBecomeMainWindow
{
	return YES;
}

- (void) reload
{
    [Route send:@"window.willReload" win:self];
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), 
        dispatch_get_main_queue(), ^{
        
            [[WKWebsiteDataStore defaultDataStore] // nuke the cache and then reload 
                removeDataOfTypes:[WKWebsiteDataStore allWebsiteDataTypes] 
                modifiedSince:[NSDate dateWithTimeIntervalSince1970:0] 
                completionHandler:^() { [self.view reloadFromOrigin]; [Route send:@"window.didReload" win:self]; } // reloadFromOrigin?
            ];
    });
}

@end
