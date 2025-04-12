"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/basic/card";
import { Button } from "@/components/ui/basic/button";
import { Input } from "@/components/ui/form/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/navigation/tabs";
import { Switch } from "@/components/ui/basic/switch";
import { Badge } from "@/components/ui/basic/badge";
import { Avatar, AvatarFallback } from "@/components/ui/basic/avatar";
import {
  Shield,
  UserCircle,
  Search,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  program: string;
  createdAt: string;
}

/**
 * Renders the admin settings page.
 *
 * This component provides an interface for managing appearance preferences and user access for administrators.
 * It loads user data from the database, supports filtering by username, and toggles admin status for users.
 *
 * @returns The JSX element representing the admin settings page in the dashboard layout.
 */
export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("userAccess");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  // Simplified settings state
  const [settings, setSettings] = useState({
    appearance: {
      colorMode: theme || "light", // light, dark
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        if (data.success) {
          setUsers(data.data);
        }
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSettingChange = (
    section: string,
    key: string,
    value: string | boolean | number,
  ) => {
    if (section === "appearance" && key === "colorMode") {
      setTheme(value as string);
    }

    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  const handleUpdateAdminStatus = async (user: User) => {
    setIsUpdating(user.id);
    try {
      const response = await fetch(`/api/users/${user.id}/admin`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isAdmin: !user.isAdmin,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const updatedUser = await response.json();
      setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)));
    } catch (err) {
      setError("Failed to update user");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(users.filter((u) => u.id !== user.id));
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName} ${user.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const [user, setUser] = useState<User | null>(null);

  // Check if the user is logged in and is an admin
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/users/current');
        if (!response.ok) {
          router.push('/login');
          return;
        }
        const data = await response.json();
        if (!data.success || !data.data.isAdmin) {
          router.push('/login');
          return;
        }
        setUser(data.data);
      } catch (err) {
        console.error('Auth check failed:', err);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  // Don't render anything until auth check completes
  if (!user) {
    return <div className="p-8">Loading...</div>;
  }

  const handleSave = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/users/${selectedUser.id}/admin`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: selectedUser.email,
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          isAdmin: selectedUser.isAdmin,
          program: selectedUser.program,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const data = await response.json();
      if (data.success) {
        setUsers(users.map((user) => 
          user.id === selectedUser.id ? { ...user, ...selectedUser } : user
        ));
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <DashboardLayout isAdmin>
      <div className="container py-6 px-4 mx-auto pb-24">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground/90">Settings</h1>
            <p className="text-muted-foreground/80 mt-1">
              Manage your admin preferences and user access
            </p>
          </div>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-lg text-foreground/90">
              Admin Settings
            </CardTitle>
            <CardDescription className="text-muted-foreground/80">
              Customize your admin experience and manage user access
            </CardDescription>
          </CardHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mx-6 mt-4 mb-0 border-b w-[400px] bg-muted/20">
              <TabsTrigger
                value="appearance"
                className="flex gap-2 items-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                <Sun className="h-4 w-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger
                value="userAccess"
                className="flex gap-2 items-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                <UserCircle className="h-4 w-4" />
                User Access
              </TabsTrigger>
            </TabsList>

            {/* Theme Switching */}
            <TabsContent value="appearance" className="p-6 pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3 text-foreground/90">
                    Theme Preference
                  </h3>
                  <div className="grid grid-cols-2 gap-4 max-w-xs">
                    <Button
                      variant={
                        settings.appearance.colorMode === "light"
                          ? "default"
                          : "outline"
                      }
                      className="justify-start w-full shadow-sm hover:shadow-md transition-shadow"
                      onClick={() =>
                        handleSettingChange("appearance", "colorMode", "light")
                      }
                    >
                      <Sun className="h-4 w-4 mr-2" />
                      Light
                    </Button>
                    <Button
                      variant={
                        settings.appearance.colorMode === "dark"
                          ? "default"
                          : "outline"
                      }
                      className="justify-start w-full shadow-sm hover:shadow-md transition-shadow"
                      onClick={() =>
                        handleSettingChange("appearance", "colorMode", "dark")
                      }
                    >
                      <Moon className="h-4 w-4 mr-2" />
                      Dark
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* User Access */}
            <TabsContent value="userAccess" className="px-6 pt-6 pb-0">
              <div className="space-y-4">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                  <Input
                    placeholder="Search users..."
                    className="pl-9 bg-muted/50 border-border/50 shadow-sm focus:shadow-md transition-shadow"
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSearchQuery(e.target.value)
                    }
                  />
                </div>

                <div className="overflow-hidden rounded-lg border border-border/50 shadow-sm">
                  <table className="w-full">
                    <thead className="text-xs uppercase text-muted-foreground/80 bg-muted/20">
                      <tr>
                        <th className="px-4 py-2 text-left w-1/3">User</th>
                        <th className="px-4 py-2 text-left w-1/3">Email</th>
                        <th className="px-4 py-2 text-left w-1/5">Role</th>
                        <th className="px-4 py-2 text-left w-1/6">Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <tr key={i} className="animate-pulse">
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-muted/50"></div>
                                <div className="ml-3 h-4 w-24 bg-muted/50 rounded"></div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="h-4 w-32 bg-muted/50 rounded"></div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="h-5 w-20 bg-muted/50 rounded"></div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="h-5 w-10 bg-muted/50 rounded"></div>
                            </td>
                          </tr>
                        ))
                      ) : filteredUsers.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-4 py-4 text-center text-muted-foreground/70"
                          >
                            No users found
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => {
                          // Generate initials for avatar
                          const initials = user.email
                            .split("@")[0]
                            .split(".")
                            .map((word: string) => word[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2);

                          return (
                            <tr
                              key={user.id}
                              className="hover:bg-muted/30 transition-colors"
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 bg-muted/50 text-foreground/90 shadow-sm">
                                    <AvatarFallback>{initials}</AvatarFallback>
                                  </Avatar>
                                  <span className="ml-3 font-medium text-foreground/90">
                                    {user.email}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-muted-foreground/80">
                                {user.email}
                              </td>
                              <td className="px-4 py-3">
                                <Badge
                                  variant={user.isAdmin ? "default" : "outline"}
                                  className="text-xs shadow-sm"
                                >
                                  {user.isAdmin ? (
                                    <>
                                      <Shield className="h-3 w-3 mr-1" />
                                      admin
                                    </>
                                  ) : (
                                    "user"
                                  )}
                                </Badge>
                              </td>
                              <td className="px-4 py-3">
                                <Switch
                                  checked={user.isAdmin}
                                  onCheckedChange={() =>
                                    handleUpdateAdminStatus(user)
                                  }
                                  className="shadow-sm"
                                  disabled={isUpdating === user.id}
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
        </Card>

        {selectedUser && (
          <div className="mt-4 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">User Details</h3>
            <p>Name: {selectedUser.firstName} {selectedUser.lastName}</p>
            <p>Email: {selectedUser.email}</p>
            <p>Program: {selectedUser.program}</p>
            <p>Admin Status: {selectedUser.isAdmin ? "Yes" : "No"}</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
