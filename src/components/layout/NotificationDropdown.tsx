 import { useState } from 'react';
 import { Bell, CheckCircle2, XCircle, AlertTriangle, Clock } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
 } from '@/components/ui/dropdown-menu';
 import { cn } from '@/lib/utils';
 
 interface Notification {
   id: string;
   type: 'success' | 'error' | 'warning' | 'info';
   title: string;
   message: string;
   time: string;
   read: boolean;
 }
 
 // Mock notifications - will be replaced with real data later
 const mockNotifications: Notification[] = [
   {
     id: '1',
     type: 'success',
     title: 'Test Passed',
     message: 'Login Flow Test completed successfully',
     time: '5 min ago',
     read: false,
   },
   {
     id: '2',
     type: 'error',
     title: 'Test Failed',
     message: 'Checkout validation encountered an error',
     time: '15 min ago',
     read: false,
   },
   {
     id: '3',
     type: 'warning',
     title: 'Device Disconnected',
     message: 'Android device lost connection',
     time: '1 hour ago',
     read: true,
   },
 ];
 
 const iconMap = {
   success: CheckCircle2,
   error: XCircle,
   warning: AlertTriangle,
   info: Clock,
 };
 
 const colorMap = {
   success: 'text-success',
   error: 'text-destructive',
   warning: 'text-warning',
   info: 'text-primary',
 };
 
 export function NotificationDropdown() {
   const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
   
   const unreadCount = notifications.filter(n => !n.read).length;
   
   const markAllAsRead = () => {
     setNotifications(notifications.map(n => ({ ...n, read: true })));
   };
   
   const markAsRead = (id: string) => {
     setNotifications(notifications.map(n => 
       n.id === id ? { ...n, read: true } : n
     ));
   };
 
   return (
     <DropdownMenu>
       <DropdownMenuTrigger asChild>
         <Button variant="ghost" size="icon" className="relative">
           <Bell className="w-5 h-5 text-muted-foreground" />
           {unreadCount > 0 && (
             <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-medium rounded-full flex items-center justify-center">
               {unreadCount}
             </span>
           )}
         </Button>
       </DropdownMenuTrigger>
       <DropdownMenuContent align="end" className="w-80 bg-background border-border">
         <DropdownMenuLabel className="flex items-center justify-between">
           <span>Notifications</span>
           {unreadCount > 0 && (
             <Button
               variant="ghost"
               size="sm"
               className="h-auto p-0 text-xs text-primary hover:text-primary/80"
               onClick={markAllAsRead}
             >
               Mark all read
             </Button>
           )}
         </DropdownMenuLabel>
         <DropdownMenuSeparator />
         
         {notifications.length === 0 ? (
           <div className="py-6 text-center text-muted-foreground text-sm">
             No notifications
           </div>
         ) : (
           notifications.map((notification) => {
             const Icon = iconMap[notification.type];
             return (
               <DropdownMenuItem
                 key={notification.id}
                 className={cn(
                   "flex items-start gap-3 p-3 cursor-pointer",
                   !notification.read && "bg-primary/5"
                 )}
                 onClick={() => markAsRead(notification.id)}
               >
                 <Icon className={cn("w-5 h-5 mt-0.5 shrink-0", colorMap[notification.type])} />
                 <div className="flex-1 min-w-0">
                   <p className={cn(
                     "text-sm",
                     !notification.read && "font-medium"
                   )}>
                     {notification.title}
                   </p>
                   <p className="text-xs text-muted-foreground truncate">
                     {notification.message}
                   </p>
                   <p className="text-xs text-muted-foreground mt-1">
                     {notification.time}
                   </p>
                 </div>
               </DropdownMenuItem>
             );
           })
         )}
       </DropdownMenuContent>
     </DropdownMenu>
   );
 }