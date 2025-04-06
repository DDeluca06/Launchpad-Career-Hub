"use client"

import { useState, useEffect, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Check, 
  Save, 
  RefreshCw, 
  Moon, 
  Sun,
  Shield,
  UserCircle,
  Search,
  Upload,
  X,
  AlertCircle,
  FileUp
} from "lucide-react"
import { extendedPalette } from "@/lib/colors"
import { userService, User } from "@/lib/local-storage"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("userAccess")
  const [savedIndicator, setSavedIndicator] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvPreview, setCsvPreview] = useState<Array<any>>([])
  const [uploadError, setUploadError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  
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
  
  const handleSettingChange = (section: string, key: string, value: any) => {
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
    console.log("Saved settings:", settings)
    
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

  // Handle CSV file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError("");
    
    if (!file) {
      setCsvFile(null);
      setCsvPreview([]);
      return;
    }
    
    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      setUploadError("Please upload a valid CSV file");
      setCsvFile(null);
      setCsvPreview([]);
      return;
    }
    
    setCsvFile(file);
    
    // Preview the CSV
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const headers = lines[0].split(',').map(header => header.trim());
        
        // Check required columns
        const requiredColumns = ['username', 'program'];
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));
        
        if (missingColumns.length > 0) {
          setUploadError(`Missing required columns: ${missingColumns.join(', ')}`);
          setCsvPreview([]);
          return;
        }
        
        // Parse the CSV data
        const data = lines.slice(1, 6).map(line => {
          const values = line.split(',').map(value => value.trim());
          const record: Record<string, string> = {};
          
          headers.forEach((header, index) => {
            record[header] = values[index] || '';
          });
          
          return record;
        });
        
        setCsvPreview(data);
      } catch (error) {
        setUploadError("Error parsing CSV file");
        setCsvPreview([]);
      }
    };
    
    reader.readAsText(file);
  };
  
  const handleUpload = () => {
    if (!csvFile) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const headers = lines[0].split(',').map(header => header.trim());
        
        // Parse all the CSV data
        const data = lines.slice(1).map(line => {
          const values = line.split(',').map(value => value.trim());
          const record: Record<string, string> = {};
          
          headers.forEach((header, index) => {
            record[header] = values[index] || '';
          });
          
          return record;
        });
        
        // Convert to User objects and add to localStorage
        const newUsers = data.map((item, index) => {
          // Create a new user ID by finding the max ID and incrementing
          const maxId = users.reduce((max, user) => Math.max(max, user.user_id), 0);
          
          return {
            user_id: maxId + index + 1,
            username: item.username || 'New User',
            program: item.program || '',
            isAdmin: item.isAdmin === 'true',
            // Add other required fields
          } as User;
        });
        
        // Add new users to localStorage
        newUsers.forEach(user => {
          userService.create(user);
        });
        
        // Reload users
        const allUsers = userService.getAll();
        setUsers(allUsers);
        
        // Close the modal
        setShowUploadModal(false);
        setCsvFile(null);
        setCsvPreview([]);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        setUploadError("Error processing CSV file");
      }
    };
    
    reader.readAsText(csvFile);
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      // Set the file in the input
      if (fileInputRef.current) {
        // Create a new FileList-like object
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
        
        // Trigger change event manually
        const event = new Event('change', { bubbles: true });
        fileInputRef.current.dispatchEvent(event);
      }
    }
  };
  
  return (
    <DashboardLayout isAdmin>
      <div className="container py-6 px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500 mt-1">Manage your admin preferences and user access</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSave}
              className="flex items-center gap-1"
            >
              {savedIndicator ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-4">
            <CardHeader className="pb-3">
              <CardTitle>Admin Settings</CardTitle>
              <CardDescription>
                Customize your admin experience and manage user access
              </CardDescription>
            </CardHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="px-6">
                <TabsList className="w-full max-w-md">
                  <TabsTrigger value="appearance" className="flex-1">
                    <Sun className="h-4 w-4 mr-2" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger value="userAccess" className="flex-1">
                    <UserCircle className="h-4 w-4 mr-2" />
                    User Access
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="appearance" className="p-6 pt-3">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Theme Preference</h3>
                    <div className="grid grid-cols-2 gap-2 max-w-xs">
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
              
              <TabsContent value="userAccess" className="p-6 pt-3">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div className="relative max-w-md">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Search users by name..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <Button 
                      onClick={() => setShowUploadModal(true)}
                      className="self-start sm:self-auto"
                      style={{ backgroundColor: extendedPalette.primaryGreen }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Import Users
                    </Button>
                  </div>

                  <div className="overflow-hidden border rounded-lg">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                            Role
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                            Admin Access
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                          Array.from({ length: 3 }).map((_, i) => (
                            <tr key={i}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                                  <div className="ml-3">
                                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className="h-6 w-12 bg-gray-200 rounded animate-pulse ml-auto"></div>
                              </td>
                            </tr>
                          ))
                        ) : filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
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
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback>{initials}</AvatarFallback>
                                      <AvatarImage src="/placeholder-user.jpg" alt={user.username} />
                                    </Avatar>
                                    <div className="ml-3">
                                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">{email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap min-w-[140px]">
                                  <Badge 
                                    variant={user.isAdmin ? "default" : "outline"} 
                                    className="flex items-center w-fit min-w-[120px] justify-center"
                                  >
                                    {user.isAdmin ? (
                                      <>
                                        <Shield className="h-3 w-3 mr-1" /> 
                                        Administrator
                                      </>
                                    ) : "Standard User"}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                  <div className="flex justify-end items-center">
                                    <Switch 
                                      checked={user.isAdmin}
                                      onCheckedChange={() => toggleAdminStatus(user.user_id)}
                                    />
                                  </div>
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
            
            <CardFooter className="border-t flex justify-between items-center p-6">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
              
              <Button 
                size="sm"
                onClick={handleSave}
                style={{ backgroundColor: extendedPalette.primaryBlue }}
                className={savedIndicator ? "bg-green-500" : ""}
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
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* CSV Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Import Users</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => {
                  setShowUploadModal(false);
                  setCsvFile(null);
                  setCsvPreview([]);
                  setUploadError("");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 flex flex-col items-center justify-center cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept=".csv" 
                onChange={handleFileChange}
              />
              
              <FileUp className="h-12 w-12 text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 mb-1">Drag and drop your CSV file here, or click to browse</p>
              <p className="text-xs text-gray-500">CSV file must include username and program columns</p>
            </div>
            
            {uploadError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-800">{uploadError}</p>
              </div>
            )}
            
            {csvFile && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Selected file: {csvFile.name}</p>
              </div>
            )}
            
            {csvPreview.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Preview (first 5 rows):</h3>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(csvPreview[0]).map((header) => (
                          <th 
                            key={header}
                            className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {csvPreview.map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value, i) => (
                            <td key={i} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                              {value as string}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowUploadModal(false);
                  setCsvFile(null);
                  setCsvPreview([]);
                  setUploadError("");
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpload}
                disabled={!csvFile || csvPreview.length === 0 || uploadError !== ""}
                style={{ backgroundColor: extendedPalette.primaryGreen }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Users
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
} 