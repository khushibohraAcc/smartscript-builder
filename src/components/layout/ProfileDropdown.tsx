 import { useState } from 'react';
 import { User, Settings, Moon, Sun, LogOut } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
 } from '@/components/ui/dropdown-menu';
 import { useTheme } from 'next-themes';
 import { useToast } from '@/hooks/use-toast';
 
 // Mock user info - will be replaced with real auth data later
 const mockUser = {
   name: 'Test User',
   email: 'test@example.com',
 };
 
 export function ProfileDropdown() {
   const { theme, setTheme } = useTheme();
   const { toast } = useToast();
   const [user] = useState(mockUser);
 
   const handleLogout = () => {
     toast({
       title: "Logged out",
       description: "You have been logged out successfully.",
     });
     // TODO: Implement actual logout when auth is added
   };
 
   const toggleTheme = () => {
     setTheme(theme === 'dark' ? 'light' : 'dark');
   };
 
   return (
     <DropdownMenu>
       <DropdownMenuTrigger asChild>
         <Button variant="ghost" size="icon" className="rounded-full bg-secondary">
           <User className="w-5 h-5 text-muted-foreground" />
         </Button>
       </DropdownMenuTrigger>
       <DropdownMenuContent align="end" className="w-56 bg-background border-border">
         <DropdownMenuLabel className="font-normal">
           <div className="flex flex-col space-y-1">
             <p className="text-sm font-medium">{user.name}</p>
             <p className="text-xs text-muted-foreground">{user.email}</p>
           </div>
         </DropdownMenuLabel>
         <DropdownMenuSeparator />
         
         <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
           {theme === 'dark' ? (
             <>
               <Sun className="mr-2 h-4 w-4" />
               <span>Light Mode</span>
             </>
           ) : (
             <>
               <Moon className="mr-2 h-4 w-4" />
               <span>Dark Mode</span>
             </>
           )}
         </DropdownMenuItem>
         
         <DropdownMenuItem className="cursor-pointer">
           <Settings className="mr-2 h-4 w-4" />
           <span>Settings</span>
         </DropdownMenuItem>
         
         <DropdownMenuSeparator />
         
         <DropdownMenuItem 
           onClick={handleLogout}
           className="cursor-pointer text-destructive focus:text-destructive"
         >
           <LogOut className="mr-2 h-4 w-4" />
           <span>Log out</span>
         </DropdownMenuItem>
       </DropdownMenuContent>
     </DropdownMenu>
   );
 }