"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/form/input";
import { Switch } from "@/components/ui/basic/switch";
import { Badge } from "@/components/ui/basic/badge";
import { Avatar, AvatarFallback } from "@/components/ui/basic/avatar";
import { Card, CardContent } from "@/components/ui/basic/card";
import { Shield, Search } from "lucide-react";
import { extendedPalette } from "@/lib/colors";
import { toast } from "@/components/ui/feedback/use-toast";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  program: string;
}

interface UserAccessManagerProps {
  users: User[];
  currentUserId: number;
  isLoading: boolean;
  onUserUpdate?: (updatedUser: User) => void;
}

export function UserAccessManager({ 
  users, 
  currentUserId, 
  isLoading,
  onUserUpdate 
}: UserAccessManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const [localUsers, setLocalUsers] = useState<User[]>(users);

  // Update local users when props change
  useEffect(() => {
    setLocalUsers(users);
  }, [users]);

  // Filter users by search query
  const filteredUsers = localUsers.filter((user) =>
    `${user.firstName} ${user.lastName} ${user.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Toggle admin status for a user
  const handleToggleAdmin = async (userId: number, currentAdminStatus: boolean) => {
    setIsUpdating(userId);
    
    try {
      const response = await fetch('/api/users/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          isAdmin: !currentAdminStatus
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update admin status');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Update local state
        const updatedUsers = localUsers.map(user => 
          user.id === userId 
            ? {...user, isAdmin: !currentAdminStatus} 
            : user
        );
        
        setLocalUsers(updatedUsers);
        
        // Notify parent component if callback exists
        if (onUserUpdate && data.user) {
          onUserUpdate(data.user);
        }
        
        toast({
          title: "Success",
          description: `Admin status updated successfully`,
          variant: "default",
        });
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error updating admin status:', error);
      toast({
        title: "Error",
        description: "Failed to update admin status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <Card className="border-none shadow-sm bg-white/80 dark:bg-gray-800/80">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" 
              style={{ color: extendedPalette.darkGray }}
            />
            <Input
              placeholder="Search users..."
              className="pl-9 border-gray-200 dark:border-gray-700 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                borderColor: extendedPalette.lightBlue,
                backgroundColor: extendedPalette.offWhite
              }}
            />
          </div>

          <div className="overflow-hidden rounded-lg border shadow-sm" style={{ borderColor: extendedPalette.lightBlue }}>
            <table className="w-full">
              <thead style={{ backgroundColor: extendedPalette.lightBlue }}>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">User</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Email</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">Role</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">Admin Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                          <div className="ml-3 h-4 w-24 bg-gray-200 rounded"></div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="h-5 w-20 mx-auto bg-gray-200 rounded"></div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="h-5 w-10 mx-auto bg-gray-200 rounded"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    // Generate initials for avatar
                    const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
                    const isCurrentUser = user.id === currentUserId;

                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 shadow-sm" style={{ backgroundColor: extendedPalette.lightBlue }}>
                              <AvatarFallback style={{ color: extendedPalette.primaryBlue }}>{initials}</AvatarFallback>
                            </Avatar>
                            <span className="ml-3 font-medium text-gray-700 dark:text-gray-200">
                              {user.firstName} {user.lastName}
                              {isCurrentUser && (
                                <span className="ml-2 text-xs text-gray-500">(You)</span>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                          {user.email}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge
                            variant={user.isAdmin ? "default" : "outline"}
                            className="text-xs shadow-sm"
                            style={{
                              backgroundColor: user.isAdmin ? extendedPalette.primaryBlue : 'transparent',
                              borderColor: user.isAdmin ? extendedPalette.primaryBlue : extendedPalette.darkGray,
                              color: user.isAdmin ? 'white' : extendedPalette.darkGray
                            }}
                          >
                            {user.isAdmin ? (
                              <>
                                <Shield className="h-3 w-3 mr-1" />
                                Admin
                              </>
                            ) : (
                              "User"
                            )}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Switch
                            checked={user.isAdmin}
                            onCheckedChange={() => handleToggleAdmin(user.id, user.isAdmin)}
                            disabled={isUpdating === user.id || isCurrentUser}
                            className="shadow-sm"
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 