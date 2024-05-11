/*
  000   000  000  00000000  000   000  
  000   000  000  000       000 0 000  
   000 000   000  0000000   000000000  
     000     000  000       000   000  
      0      000  00000000  00     00  
*/

#import "view.h"
#import "route.h"

@interface WebInspector : NSObject  { WKWebView *_webView; }
- (id)initWithWebView:(WKWebView *)webView;
- (void)detach:     (id)sender;
- (void)show:       (id)sender;
- (void)showConsole:(id)sender;
@end

@implementation View

-(id) init
{
    WKWebViewConfiguration *config = [[WKWebViewConfiguration alloc] init];
    
    [[config preferences] setValue:@YES forKey:@"developerExtrasEnabled"];
    [[config preferences] setValue:@YES forKey:@"fullScreenEnabled"];
    [[config preferences] setValue:@YES forKey:@"javaScriptCanAccessClipboard"];
    [[config preferences] setValue:@YES forKey:@"DOMPasteAllowed"];
    [config setValue:@YES forKey:@"allowUniversalAccessFromFileURLs"];
    
    [[config preferences] setValue:[NSNumber numberWithInt:WKInactiveSchedulingPolicyNone] forKey:@"inactiveSchedulingPolicy"];

    if (self = [super initWithFrame:CGRectMake(0,0,0,0) configuration:config])
    {
        [self setValue:@NO forKey:@"drawsBackground"];
    }
    
    [self initScripting];
    
    return self;
}

-(void) mouseDown:(NSEvent *)event 
{
    NSPoint   viewLoc = [self convertPoint:event.locationInWindow fromView:nil];
    NSString *docElem = [NSString stringWithFormat:@"document.elementFromPoint(%f, %f)", viewLoc.x, viewLoc.y];
    NSString *jsCode  = [NSString stringWithFormat:@"%@.classList.contains(\"app-drag-region\")", docElem];
    
    [self evaluateJavaScript:jsCode completionHandler:
        ^(id result, NSError * error) {
            if (error) NSLog(@"%@", error);
            else 
            {
                if ([[NSNumber numberWithInt:1] compare:result] == NSOrderedSame)
                {
                    //NSLog(@"mouseDown performDragWithEvent %@", event);    
                    [self.window performWindowDragWithEvent:event];
                }
            }
    }];
    
    [super mouseDown:event];
}

-(void) toggleInspector
{
    if ([[self _inspector] isVisible])
    {
        [[self _inspector] hide];
    }
    else
    {
        [[self _inspector] showConsole];
        [[self _inspector] show];
    }
}

-(void) initScripting
{
    WKUserContentController* ucc = [[self configuration] userContentController];
    
    [ucc addScriptMessageHandler:self name:@"kakao"];
    [ucc addScriptMessageHandlerWithReply:self contentWorld:[WKContentWorld pageWorld] name:@"kakao_request"];    
}

- (void) userContentController:(WKUserContentController *)ucc didReceiveScriptMessage:(WKScriptMessage*)msg
{
    [Route message:msg win:(Win*)[self window]];
}

- (void) userContentController:(WKUserContentController *)ucc didReceiveScriptMessage:(WKScriptMessage*)msg replyHandler:(Callback)callback
{
    [Route request:msg callback:callback win:(Win*)[self window]];
}

@end