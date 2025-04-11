import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export function ProfileSettings() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  
  // Form states
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  
  const handleSaveChanges = () => {
    toast({
      title: 'Profile updated',
      description: 'Your profile information has been updated'
    });
  };
  
  const handleLogout = () => {
    setIsConfirmDialogOpen(false);
    logout();
  };
  
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="p-2 rounded-full hover:bg-gray-700">
            <i className="fas fa-cog text-white"></i>
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-gray-800 text-white border-gray-700">
          <SheetHeader>
            <SheetTitle className="text-white">Profile Settings</SheetTitle>
          </SheetHeader>
          
          <div className="py-6 space-y-6">
            {/* Avatar & Display Name */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 bg-gradient-to-tr from-purple-700 to-pink-500">
                <AvatarFallback>{getInitials(user?.displayName || user?.username || '')}</AvatarFallback>
                {user?.avatarUrl && <AvatarImage src={user.avatarUrl} />}
              </Avatar>
              <div className="flex-1">
                <h4 className="text-md font-medium">{user?.displayName || user?.username}</h4>
                <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 px-0 h-7">
                  Change Profile Picture
                </Button>
              </div>
            </div>
            
            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            
            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="bg-gray-700 border-gray-600 min-h-[100px]"
                placeholder="Tell us about yourself"
              />
            </div>
            
            {/* Preferences */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium border-b border-gray-700 pb-1">Preferences</h4>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="darkMode" className="text-sm">Dark Mode</Label>
                  <p className="text-xs text-gray-400">Use dark theme</p>
                </div>
                <Switch 
                  id="darkMode" 
                  checked={darkMode} 
                  onCheckedChange={setDarkMode} 
                  className="data-[state=checked]:bg-purple-600"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications" className="text-sm">Notifications</Label>
                  <p className="text-xs text-gray-400">Receive email notifications</p>
                </div>
                <Switch 
                  id="notifications" 
                  checked={notifications} 
                  onCheckedChange={setNotifications} 
                  className="data-[state=checked]:bg-purple-600"
                />
              </div>
            </div>
            
            {/* Account Actions */}
            <div className="space-y-4 pt-4">
              <h4 className="text-sm font-medium border-b border-gray-700 pb-1">Account</h4>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start text-amber-400 hover:text-amber-300 hover:bg-amber-950"
              >
                <i className="fas fa-key mr-2"></i>
                Change Password
              </Button>
              
              <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    Log Out
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 text-white border-gray-700">
                  <DialogHeader>
                    <DialogTitle>Log Out Confirmation</DialogTitle>
                  </DialogHeader>
                  <p className="py-4">Are you sure you want to log out of your account?</p>
                  <DialogFooter className="flex space-x-2 justify-end">
                    <Button 
                      variant="outline" 
                      className="border-gray-600 text-white hover:bg-gray-700"
                      onClick={() => setIsConfirmDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleLogout}
                    >
                      Log Out
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <SheetFooter>
            <SheetClose asChild>
              <Button className="w-full bg-purple-700 hover:bg-purple-600" onClick={handleSaveChanges}>
                Save Changes
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default ProfileSettings;
