/*
  0000000    000   000  000   000  0000000    000      00000000    
  000   000  000   000  0000  000  000   000  000      000         
  0000000    000   000  000 0 000  000   000  000      0000000     
  000   000  000   000  000  0000  000   000  000      000         
  0000000     0000000   000   000  0000000    0000000  00000000    
*/

#import "bundle.h"

@implementation Bundle

+ (NSString*) path // no idea why the bundle methods don't work
{                  // but the information is in the description
    id path = [[NSBundle mainBundle] description];
    id cset = [NSCharacterSet characterSetWithCharactersInString:@"<>"];
    id comp = [path componentsSeparatedByCharactersInSet:cset];
    return [comp objectAtIndex:1];
}

+ (NSString*) appPath:      (NSString*)path { return [[NSString stringWithFormat:@"%@/%@",                    [Bundle path], path] stringByStandardizingPath]; }
+ (NSString*) jsPath:       (NSString*)path { return [[NSString stringWithFormat:@"%@/js/%@",                 [Bundle path], path] stringByStandardizingPath]; }
+ (NSString*) macOSPath:    (NSString*)path { return [[NSString stringWithFormat:@"%@/Contents/MacOS/%@",     [Bundle path], path] stringByStandardizingPath]; }
+ (NSString*) resourcePath: (NSString*)path { return [[NSString stringWithFormat:@"%@/Contents/Resources/%@", [Bundle path], path] stringByStandardizingPath]; }

+ (NSURL*) URL // absoulte file url of the .app folder
{
    return [Bundle fileURL:@""];
}

+ (NSURL*) fileURL:(NSString*)path // absoulte file url relative to .app folder
{
    id comp = [[NSArray arrayWithObject:[Bundle path]] arrayByAddingObject:path];
    id norm = [[NSString pathWithComponents:comp] stringByStandardizingPath];
    
    return [NSURL fileURLWithPath:norm];
}

+ (NSURL*) jsURL:(NSString*)path // absoulte file url relative to .app/Contents/MacOS/js folder
{
    return [NSURL fileURLWithPath:[Bundle jsPath:path]];
}

@end