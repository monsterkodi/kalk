/*
  00000000    0000000   000   000  000000000  00000000
  000   000  000   000  000   000     000     000     
  0000000    000   000  000   000     000     0000000 
  000   000  000   000  000   000     000     000     
  000   000   0000000    0000000      000     00000000
*/

#import <Cocoa/Cocoa.h>
#import <WebKit/WebKit.h>
#import "view.h"
#import "win.h"

@interface Route : NSObject
{
}

+ (void) emit:(id)msg;               // send string or object to js in web views of all windows
+ (void) send:(id)msg win:(Win*)win; // send string or object to js in web view of win
+ (void) message:(WKScriptMessage*)msg win:(Win*)win; // message received from js in web view of win
// message recieved from js in web view of win that expects a callback
+ (void) request:(WKScriptMessage*)msg callback:(Callback)callback win:(Win*)win; 

@end
