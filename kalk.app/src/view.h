/*
  000   000  000  00000000  000   000  
  000   000  000  000       000 0 000  
   000 000   000  0000000   000000000  
     000     000  000       000   000  
      0      000  00000000  00     00  
*/

#import <Cocoa/Cocoa.h>
#import <WebKit/WebKit.h>

@interface View : WKWebView <WKScriptMessageHandler, WKScriptMessageHandlerWithReply>
{
}

@property (assign) id inspector;

-(id)   init;
-(void) initScripting;
-(void) toggleInspector;
-(void) userContentController:(WKUserContentController *)ucc didReceiveScriptMessage:(WKScriptMessage *)msg;
-(void) userContentController:(WKUserContentController *)ucc didReceiveScriptMessage:(WKScriptMessage *)msg replyHandler:(void (^)(id reply, NSString *errorMessage))replyHandler;

@end