/*
  0000000    000   000  000   000  0000000    000      00000000    
  000   000  000   000  0000  000  000   000  000      000         
  0000000    000   000  000 0 000  000   000  000      0000000     
  000   000  000   000  000  0000  000   000  000      000         
  0000000     0000000   000   000  0000000    0000000  00000000    
*/

#import <Cocoa/Cocoa.h>

@interface Bundle : NSObject
{
}

+ (NSString*) path;                            // .app folder
+ (NSString*) appPath:(NSString*)path;         // path relative to .app folder
+ (NSString*) macOSPath:(NSString*)path;       // path relative to .app/Contents/MacOS folder
+ (NSString*) jsPath:(NSString*)path;          // path relative to .app/Contents/MacOS/js folder
+ (NSString*) resourcePath:(NSString*)path;    // path relative to .app/Contents/Resources folder

+ (NSURL*)    URL;                             // file url for the .app folder
+ (NSURL*)    fileURL:(NSString*)path;         // file url relative to .app folder
+ (NSURL*)    jsURL:(NSString*)path;           // file url relative to .app/Contents/MacOS/js folder

@end
