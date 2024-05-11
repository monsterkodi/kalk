/*
    00000000   0000000
    000       000     
    000000    0000000 
    000            000
    000       0000000 
*/

#import "fs.h"
#import "route.h"
#import "bundle.h"

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

@implementation FS

+ (id) fs:(NSString*)req args:(NSArray*)args win:(Win*)win
{
    NSString* path = [Bundle path];
    
    if ([args count] && [[args objectAtIndex:0] isKindOfClass:[NSString class]]) 
    {
        path = [[args objectAtIndex:0] stringByExpandingTildeInPath];
    }
    else
    {
        if ([req isEqualToString:@"git"] || [req isEqualToString:@"pkg"])
        {
            return nil; // don't fallback to bundle path for fs.git and fs.pkg
        }
        NSLog(@"fallback to bundle path! req:%@ args:%@", req, args);
    }
    
    //  0000000   00000000   00000000  000   000  0000000    000   0000000   000       0000000    0000000   
    // 000   000  000   000  000       0000  000  000   000  000  000   000  000      000   000  000        
    // 000   000  00000000   0000000   000 0 000  000   000  000  000000000  000      000   000  000  0000  
    // 000   000  000        000       000  0000  000   000  000  000   000  000      000   000  000   000  
    //  0000000   000        00000000  000   000  0000000    000  000   000  0000000   0000000    0000000   
    
    if ([req isEqualToString:@"openDialog"])
    {
        NSOpenPanel* openPanel = [NSOpenPanel openPanel];

        openPanel.showsResizeIndicator      = YES;
        openPanel.showsHiddenFiles          = YES;
        openPanel.canChooseDirectories      = NO;
        openPanel.canCreateDirectories      = YES;
        openPanel.allowsMultipleSelection   = YES;

        // openPanel.allowedFileTypes = @[@"txt"];
        
        openPanel.directoryURL = [NSURL fileURLWithPath:path];

        [openPanel beginSheetModalForWindow:win completionHandler:^(NSInteger result) 
        {
            if (result == NSModalResponseOK) 
            {
                NSMutableArray* files = [NSMutableArray array];
                for (NSURL* url in openPanel.URLs)
                {
                    [files addObject:[url path]];
                }
                // NSLog(@"OpenDialog %@", files);
                
                id msg = [NSMutableDictionary dictionary];
                [msg setObject:@"openDialog" forKey:@"name"];
                [msg setObject:[NSArray arrayWithObject:files] forKey:@"args"];
                
                [Route send:msg win:win];
            }
        }];
    }

    //  0000000   0000000   000   000  00000000  0000000    000   0000000   000       0000000    0000000   
    // 000       000   000  000   000  000       000   000  000  000   000  000      000   000  000        
    // 0000000   000000000   000 000   0000000   000   000  000  000000000  000      000   000  000  0000  
    //      000  000   000     000     000       000   000  000  000   000  000      000   000  000   000  
    // 0000000   000   000      0      00000000  0000000    000  000   000  0000000   0000000    0000000   
    
    if ([req isEqualToString:@"saveDialog"])
    {
        NSSavePanel* panel = [NSSavePanel savePanel];

        panel.showsResizeIndicator      = YES;
        panel.showsHiddenFiles          = YES;
        panel.canCreateDirectories      = YES;

        panel.directoryURL = [NSURL fileURLWithPath:path];

        [panel beginSheetModalForWindow:win completionHandler:^(NSInteger result) 
        {
            if (result == NSModalResponseOK) 
            {                
                id msg = [NSMutableDictionary dictionary];
                [msg setObject:@"saveDialog" forKey:@"name"];
                [msg setObject:[panel.URL path] forKey:@"args"];
                
                [Route send:msg win:win];
            }
        }];
    }
    
    // 000  000   000  00000000   0000000   
    // 000  0000  000  000       000   000  
    // 000  000 0 000  000000    000   000  
    // 000  000  0000  000       000   000  
    // 000  000   000  000        0000000   
    
    if ([req isEqualToString:@"info"])
    {
        id attr = [[NSFileManager defaultManager] attributesOfItemAtPath:path error:nil];
        
        if (![attr objectForKey:@"NSFileSize"])
        {
            NSLog(@"no size? %@ %@", path, attr);
            return @"no size?";
        }
        
        NSMutableDictionary* info = [NSMutableDictionary dictionary];
        [info setObject:[attr objectForKey:@"NSFileSize"                  ] forKey:@"size"];
        [info setObject:[attr objectForKey:@"NSFileCreationDate"          ] forKey:@"created"];
        [info setObject:[attr objectForKey:@"NSFileGroupOwnerAccountName" ] forKey:@"group"];
        [info setObject:[attr objectForKey:@"NSFileOwnerAccountName"      ] forKey:@"owner"];
        [info setObject:[attr objectForKey:@"NSFileModificationDate"      ] forKey:@"modified"];
        [info setObject:[attr objectForKey:@"NSFilePosixPermissions"      ] forKey:@"permission"];
        [info setObject:[attr objectForKey:@"NSFileSystemFileNumber"      ] forKey:@"inode"];
        
        [info setObject:typeForNSFileType([attr objectForKey:@"NSFileType"]) forKey:@"type"];
        return info;
    }
    // 00000000  000   000  000   0000000  000000000   0000000  
    // 000        000 000   000  000          000     000       
    // 0000000     00000    000  0000000      000     0000000   
    // 000        000 000   000       000     000          000  
    // 00000000  000   000  000  0000000      000     0000000   
    
    if ([req isEqualToString:@"exists"])
    {
        return [NSNumber numberWithBool:[[NSFileManager defaultManager] fileExistsAtPath:path]];
    }
    // 00000000  000  000      00000000        00000000  000   000  000   0000000  000000000   0000000  
    // 000       000  000      000             000        000 000   000  000          000     000       
    // 000000    000  000      0000000         0000000     00000    000  0000000      000     0000000   
    // 000       000  000      000             000        000 000   000       000     000          000  
    // 000       000  0000000  00000000        00000000  000   000  000  0000000      000     0000000   
    
    if ([req isEqualToString:@"fileExists"])
    {
        BOOL isDir;
        BOOL exists = [[NSFileManager defaultManager] fileExistsAtPath:path isDirectory:&isDir];
        return [NSNumber numberWithBool:exists && !isDir];
    }
    // 0000000    000  00000000         00000000  000   000  000   0000000  000000000   0000000  
    // 000   000  000  000   000        000        000 000   000  000          000     000       
    // 000   000  000  0000000          0000000     00000    000  0000000      000     0000000   
    // 000   000  000  000   000        000        000 000   000       000     000          000  
    // 0000000    000  000   000        00000000  000   000  000  0000000      000     0000000   
    
    if ([req isEqualToString:@"dirExists"])
    {
        BOOL isDir;
        BOOL exists = [[NSFileManager defaultManager] fileExistsAtPath:path isDirectory:&isDir];
        return [NSNumber numberWithBool:exists && isDir];
    }
    // 000   0000000        000   000  00000000   000  000000000   0000000   0000000    000      00000000  
    // 000  000             000 0 000  000   000  000     000     000   000  000   000  000      000       
    // 000  0000000         000000000  0000000    000     000     000000000  0000000    000      0000000   
    // 000       000        000   000  000   000  000     000     000   000  000   000  000      000       
    // 000  0000000         00     00  000   000  000     000     000   000  0000000    0000000  00000000  
    
    if ([req isEqualToString:@"isWritable"])
    {
        return [NSNumber numberWithBool:[[NSFileManager defaultManager] isWritableFileAtPath:path]];
    }
    // 000   0000000        00000000   00000000   0000000   0000000     0000000   0000000    000      00000000  
    // 000  000             000   000  000       000   000  000   000  000   000  000   000  000      000       
    // 000  0000000         0000000    0000000   000000000  000   000  000000000  0000000    000      0000000   
    // 000       000        000   000  000       000   000  000   000  000   000  000   000  000      000       
    // 000  0000000         000   000  00000000  000   000  0000000    000   000  0000000    0000000  00000000  
    
    if ([req isEqualToString:@"isReadable"])
    {
        return [NSNumber numberWithBool:[[NSFileManager defaultManager] isReadableFileAtPath:path]];
    }
    // 00000000   00000000   0000000   0000000    
    // 000   000  000       000   000  000   000  
    // 0000000    0000000   000000000  000   000  
    // 000   000  000       000   000  000   000  
    // 000   000  00000000  000   000  0000000    
    
    if ([req isEqualToString:@"read"])
    {
        return [NSString stringWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
    }
    // 000   000  00000000   000  000000000  00000000  
    // 000 0 000  000   000  000     000     000       
    // 000000000  0000000    000     000     0000000   
    // 000   000  000   000  000     000     000       
    // 00     00  000   000  000     000     00000000  
    
    if ([req isEqualToString:@"write"])
    {
        NSString* text = [args objectAtIndex:1];
        NSData* data = [text dataUsingEncoding:NSUTF8StringEncoding];
        id error;
        if ([data writeToFile:path options:NSDataWritingAtomic error:&error])
        {
            return path;
        }
        else
        {
            NSLog(@"fs.write %@", error);
            return nil;
        }
    }
    // 00000000   00000000  00     00   0000000   000   000  00000000  
    // 000   000  000       000   000  000   000  000   000  000       
    // 0000000    0000000   000000000  000   000   000 000   0000000   
    // 000   000  000       000 0 000  000   000     000     000       
    // 000   000  00000000  000   000   0000000       0      00000000  

    if ([req isEqualToString:@"remove"])
    {
        id error;
        if ([[NSFileManager defaultManager] removeItemAtPath:path error:&error])
        {
            // NSLog(@"fs.removed %@", path);
            return path;
        }
        else
        {
            NSLog(@"fs.remove %@", error);
            return nil;
        }
    }
    
    // 000000000  00000000    0000000    0000000  000   000  
    //    000     000   000  000   000  000       000   000  
    //    000     0000000    000000000  0000000   000000000  
    //    000     000   000  000   000       000  000   000  
    //    000     000   000  000   000  0000000   000   000  
    
    if ([req isEqualToString:@"trash"])
    {
        NSURL* dest;
        id error;
        if ([[NSFileManager defaultManager] trashItemAtURL:[NSURL fileURLWithPath:path] resultingItemURL:&dest error:&error])
        {
            return [dest path];
        }
        else
        {
            NSLog(@"fs.trash %@", error);
            return nil;
        }
    }
    
    // 00     00   0000000   000   000  00000000  
    // 000   000  000   000  000   000  000       
    // 000000000  000   000   000 000   0000000   
    // 000 0 000  000   000     000     000       
    // 000   000   0000000       0      00000000  
    
    if ([req isEqualToString:@"move"])
    {
        // NSLog(@"move %@ %@", path, args);
        
        id dest;
        if ([args count] > 1 && [[args objectAtIndex:1] isKindOfClass:[NSString class]]) 
        {
            dest = [[args objectAtIndex:1] stringByExpandingTildeInPath];
        }
        else
        {
            NSLog(@"fs.move no target?");
            return nil;
        }
            
        NSLog(@"move %@ ▸ %@", path, dest);
        
        id error;
        if ([[NSFileManager defaultManager] moveItemAtPath:path toPath:dest error:&error])
        {
            return dest;
        }
        else
        {
            NSLog(@"fs.move %@", error);
            return nil;
        }
    }
    
    // 0000000    000   000  00000000   000      000   0000000   0000000   000000000  00000000  
    // 000   000  000   000  000   000  000      000  000       000   000     000     000       
    // 000   000  000   000  00000000   000      000  000       000000000     000     0000000   
    // 000   000  000   000  000        000      000  000       000   000     000     000       
    // 0000000     0000000   000        0000000  000   0000000  000   000     000     00000000  
    
    if ([req isEqualToString:@"duplicate"])
    {
        NSLog(@"duplicate %@ %@", path, args);
        
        id dest;
        id ext = [path pathExtension];
        if ([ext length]) ext = [NSString stringWithFormat:@".%@", ext];
        dest = [[[path stringByDeletingPathExtension] stringByAppendingString:@" copy"] stringByAppendingString:ext];
            
        NSLog(@"duplicate %@ ▸ %@", path, dest);
        
        id error;
        if ([[NSFileManager defaultManager] copyItemAtPath:path toPath:dest error:&error])
        {
            return dest;
        }
        else
        {
            NSLog(@"fs.duplicate %@", error);
            return nil;
        }
    }
    
    //  0000000   0000000   00000000   000   000  
    // 000       000   000  000   000   000 000   
    // 000       000   000  00000000     00000    
    // 000       000   000  000           000     
    //  0000000   0000000   000           000     
    
    if ([req isEqualToString:@"copy"])
    {
        NSLog(@"copy %@ %@", path, args);
        
        id dest;
        if ([args count] > 1 && [[args objectAtIndex:1] isKindOfClass:[NSString class]]) 
        {
            dest = [[args objectAtIndex:1] stringByExpandingTildeInPath];
        }
        else
        {
            NSLog(@"fs.copy no target?");
            return nil;
        }
            
        NSLog(@"copy %@ ▸ %@", path, dest);
        
        id error;
        if ([[NSFileManager defaultManager] copyItemAtPath:path toPath:dest error:&error])
        {
            return dest;
        }
        else
        {
            NSLog(@"fs.copy %@", error);
            return nil;
        }
    }
    
    // 00     00  000   000  0000000    000  00000000   
    // 000   000  000  000   000   000  000  000   000  
    // 000000000  0000000    000   000  000  0000000    
    // 000 0 000  000  000   000   000  000  000   000  
    // 000   000  000   000  0000000    000  000   000  
    
    if ([req isEqualToString:@"mkdir"])
    {
        id error;
        if ([[NSFileManager defaultManager] createDirectoryAtPath:path withIntermediateDirectories:YES attributes:nil error:&error])
        {
            return path;
        }
        else
        {
            NSLog(@"fs.mkdir %@", error);
            return nil;
        }
    }
    
    // 000      000   0000000  000000000  
    // 000      000  000          000     
    // 000      000  0000000      000     
    // 000      000       000     000     
    // 0000000  000  0000000      000     
    
    if ([req isEqualToString:@"list"])
    {
        // NSLog(@"list %@", path);
        
        NSDirectoryEnumerator<NSString*>* dirEnum = [[NSFileManager defaultManager] enumeratorAtPath:path];
        
        NSMutableArray* result = [NSMutableArray array];
        
        NSString *file;
        while ((file = [dirEnum nextObject])) 
        {
            [dirEnum skipDescendants];
            
            id type = typeForNSFileType([dirEnum.fileAttributes objectForKey:NSFileType]); 
            
            NSMutableDictionary* fileInfo = [NSMutableDictionary dictionary];
            [fileInfo setObject:type forKey:@"type"];
            [fileInfo setObject:file forKey:@"file"];
            [fileInfo setObject:[path stringByAppendingPathComponent:file] forKey:@"path"];
            [result addObject:fileInfo];
        }
        
        // NSLog(@"results %d", [result count]);
        // NSLog(@"results %@", result);
                
        return result;
    }
    
    // 00000000   000   000   0000000   
    // 000   000  000  000   000        
    // 00000000   0000000    000  0000  
    // 000        000  000   000   000  
    // 000        000   000   0000000   
    
    if ([req isEqualToString:@"pkg"])
    {
        NSString* pkg = [NSString stringWithString:path];
        
        while ([pkg length] && ![pkg isEqualToString:@"/"])
        {
            BOOL isDir, exists;
            
            NSString* pkgJson = [pkg stringByAppendingPathComponent:@"package.json"];
            
            exists = [[NSFileManager defaultManager] fileExistsAtPath:pkgJson isDirectory:&isDir];
            if (!isDir && exists)
            {
                return pkg;
            }

            NSString* gitDir = [pkg stringByAppendingPathComponent:@".git"];
            
            exists = [[NSFileManager defaultManager] fileExistsAtPath:gitDir isDirectory:&isDir];
            if (isDir && exists)
            {
                return pkg;
            }
            
            pkg = [pkg stringByDeletingLastPathComponent];
        }
        NSLog(@"NO pkg for %@!!!", path);
        return nil;
    }
    
    //  0000000   000  000000000  
    // 000        000     000     
    // 000  0000  000     000     
    // 000   000  000     000     
    //  0000000   000     000     
    
    if ([req isEqualToString:@"git"])
    {
        NSString* git = [NSString stringWithString:path];
        
        while ([git length] && ![git isEqualToString:@"/"])
        {
            BOOL isDir, exists;
            
            NSString* gitDir = [git stringByAppendingPathComponent:@".git"];
            
            exists = [[NSFileManager defaultManager] fileExistsAtPath:gitDir isDirectory:&isDir];
            if (isDir && exists)
            {
                return git;
            }
            
            git = [git stringByDeletingLastPathComponent];
        }
        // NSLog(@"NO git for %@!!!", path);
        return nil;
    }
    
    return nil;
}

+ (NSString*) userName
{
    return NSUserName();
}

+ (NSString*) homeDir
{
    return NSHomeDirectory();
}

+ (NSString*) tmpDir
{
    return NSTemporaryDirectory();
}

@end