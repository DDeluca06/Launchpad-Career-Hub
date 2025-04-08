"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/basic/card"
import { Button } from "@/components/ui/basic/button"
import { Input } from "@/components/ui/form/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/navigation/tabs"
import { Switch } from "@/components/ui/basic/switch"
import { Badge } from "@/components/ui/basic/badge"
import { Avatar, AvatarFallback } from "@/components/ui/basic/avatar"
import { Check, Save, RefreshCw, Moon, Sun, Shield, UserCircle, Search } from "lucide-react"
import { extendedPalette } from "@/lib/colors"
import { userService, User } from "@/lib/local-storage"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("userAccess")
  const [savedIndicator, setSavedIndicator] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  
  // Simplified settings state
  const [settings, setSettings] = useState({
    appearance: {
      colorMode: "light", // light, dark
    },
  })

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true)
      const allUsers = userService.getAll()
      setUsers(allUsers)
      setIsLoading(false)
    }
    
    loadUsers()
  }, [])
  
  const handleSettingChange = (section: string, key: string, value: string | boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }))
  }
  
  const handleSave = () => {
    // In a real app, this would save to backend/localStorage
    
    // Show saved indicator
    setSavedIndicator(true)
    setTimeout(() => setSavedIndicator(false), 2000)
  }

  // Toggle admin status for a user
  const toggleAdminStatus = (userId: number) => {
    const updatedUsers = users.map(user => 
      user.user_id === userId 
        ? { ...user, isAdmin: !user.isAdmin }
        : user
    )
    
    setUsers(updatedUsers)
    
    // Update in localStorage
    const userToUpdate = updatedUsers.find(user => user.user_id === userId);
    if (userToUpdate) {
      userService.update(userToUpdate);
    }
  }

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  return (
    <DashboardLayout isAdmin>
      <div className="container py-6 px-4 mx-auto pb-24">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500 mt-1">Manage your admin preferences and user access</p>
          </div>
          
          <Button 
            onClick={handleSave}
            className="self-start"
            style={{ backgroundColor: savedIndicator ? "#4CAF50" : extendedPalette.primaryBlue }}
          >
            {savedIndicator ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Saved
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
        
        <Card className="border border-gray-200">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-lg">Admin Settings</CardTitle>
            <CardDescription>
              Customize your admin experience and manage user access
            </CardDescription>
          </CardHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mx-6 mt-4 mb-0 border-b w-[400px]">
              <TabsTrigger value="appearance" className="flex gap-2 items-center">
                <Sun className="h-4 w-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="userAccess" className="flex gap-2 items-center">
                <UserCircle className="h-4 w-4" />
                User Access
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="appearance" className="p-6 pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Theme Preference</h3>
                  <div className="grid grid-cols-2 gap-4 max-w-xs">
                    <Button 
                      variant={settings.appearance.colorMode === "light" ? "default" : "outline"} 
                      className="justify-start w-full"
                      onClick={() => handleSettingChange("appearance", "colorMode", "light")}
                    >
                      <Sun className="h-4 w-4 mr-2" />
                      Light
                    </Button>
                    <Button 
                      variant={settings.appearance.colorMode === "dark" ? "default" : "outline"} 
                      className="justify-start w-full"
                      onClick={() => handleSettingChange("appearance", "colorMode", "dark")}
                    >
                      <Moon className="h-4 w-4 mr-2" />
                      Dark
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="userAccess" className="px-6 pt-6 pb-0">
              <div className="space-y-4">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    className="pl-9 bg-gray-50 border-gray-300"
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="overflow-hidden">
                  <table className="w-full">
                    <thead className="text-xs uppercase text-gray-500 bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left w-1/3">User</th>
                        <th className="px-4 py-2 text-left w-1/3">Email</th>
                        <th className="px-4 py-2 text-left w-1/5">Role</th>
                        <th className="px-4 py-2 text-left w-1/6">Admin</th>
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
                            <td className="px-4 py-3">
                              <div className="h-5 w-20 bg-gray-200 rounded"></div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="h-5 w-10 bg-gray-200 rounded"></div>
                            </td>
                          </tr>
                        ))
                      ) : filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => {
                          // Generate initials for avatar
                          const initials = user.username
                            .split(' ')
                            .map(word => word[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2);
                            
                          // Generate email from username
                          const email = user.username.toLowerCase().replace(/\s+/g, '.') + '@example.com';
                          
                          return (
                            <tr key={user.user_id} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 bg-gray-200 text-gray-600">
                                    <AvatarFallback>{initials}</AvatarFallback>
                                  </Avatar>
                                  <span className="ml-3 font-medium">{user.username}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-gray-500">
                                {email}
                              </td>
                              <td className="px-4 py-3">
                                <Badge 
                                  variant={user.isAdmin ? "default" : "outline"} 
                                  className="text-xs"
                                >
                                  {user.isAdmin ? (
                                    <>
                                      <Shield className="h-3 w-3 mr-1" /> 
                                      admin
                                    </>
                                  ) : "user"}
                                </Badge>
                              </td>
                              <td className="px-4 py-3">
                                <Switch 
                                  checked={user.isAdmin}
                                  onCheckedChange={() => toggleAdminStatus(user.user_id)}
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
            </TabsContent>
          </Tabs>
          
          <CardFooter className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            
            <Button 
              onClick={handleSave}
              style={{ backgroundColor: savedIndicator ? "#4CAF50" : extendedPalette.primaryBlue }}
            >
              {savedIndicator ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
} 