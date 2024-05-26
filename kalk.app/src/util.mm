// 000   000  000000000  000  000        
// 000   000     000     000  000        
// 000   000     000     000  000        
// 000   000     000     000  000        
//  0000000      000     000  0000000    

#import "util.h"

NSDictionary* dictForRect(NSRect rect)
{
    id dict = [NSMutableDictionary dictionary];
    [dict setObject:[NSNumber numberWithFloat:rect.origin.x]    forKey:@"x"];
    [dict setObject:[NSNumber numberWithFloat:rect.origin.y]    forKey:@"y"];
    [dict setObject:[NSNumber numberWithFloat:rect.size.width]  forKey:@"w"];
    [dict setObject:[NSNumber numberWithFloat:rect.size.height] forKey:@"h"];
    return dict;
}

NSRect rectForDict(NSDictionary* dict)
{
    return CGRectMake( [[dict objectForKey:@"x"] floatValue], 
                       [[dict objectForKey:@"y"] floatValue], 
                       [[dict objectForKey:@"w"] floatValue], 
                       [[dict objectForKey:@"h"] floatValue]);
}

NSDictionary* dictForSize(NSSize size)
{
    id dict = [NSMutableDictionary dictionary];
    [dict setObject:[NSNumber numberWithFloat:size.width]  forKey:@"w"];
    [dict setObject:[NSNumber numberWithFloat:size.height] forKey:@"h"];
    return dict;
}

NSString* typeForNSFileType(NSString* fileType)
{
    if ([fileType isEqualToString:NSFileTypeDirectory])
    {
        return @"dir";
    }
    else
    {
        return @"file";
    }
}