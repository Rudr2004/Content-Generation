import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { User, Plus, Edit, Trash2, Shield, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getAuthHeaders, canCreateSuperAdmin } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface UserData {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  createdAt: string;
}

interface CreateUserFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

export function UserManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [createFormData, setCreateFormData] = useState<CreateUserFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: user?.role === 'user_admin' ? 'content_admin' : 'user'
  });

  const { data: allUsers = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/users'],
    queryFn: async () => {
      const response = await fetch('/api/users', {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      let filteredUsers = data.users;
      
      // Filter users based on current user's role
      if (user?.role === 'user_admin') {
        // User admin can only see content_admin users
        filteredUsers = data.users.filter((u: UserData) => u.role === 'content_admin');
      }
      // Super admin can see all users (no filtering needed)
      
      return filteredUsers;
    },
  });

  // Get available roles for filtering based on current user
  const getAvailableRoles = () => {
    if (user?.role === 'super_admin') {
      return [
        { value: 'all', label: 'All Roles' },
        { value: 'super_admin', label: 'Super Admin' },
        { value: 'user_admin', label: 'User Admin' },
        { value: 'content_admin', label: 'Content Admin' },
        { value: 'user', label: 'User' },
      ];
    } else if (user?.role === 'user_admin') {
      return [
        { value: 'all', label: 'All Roles' },
        { value: 'user_admin', label: 'User Admin' },
        { value: 'content_admin', label: 'Content Admin' },
      ];
    }
    return [{ value: 'all', label: 'All Roles' }];
  };

  // Filter users based on selected role filter
  const users = roleFilter === 'all' 
    ? allUsers 
    : allUsers.filter((user: UserData) => user.role === roleFilter);

  const createUserMutation = useMutation({
    mutationFn: async (userData: CreateUserFormData) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'User created successfully',
      });
      setIsCreateDialogOpen(false);
      setCreateFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'user'
      });
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<UserData> }) => {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'User updated successfully',
      });
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleCreateUser = () => {
    createUserMutation.mutate(createFormData);
  };

  const handleUpdateUser = (updates: Partial<UserData>) => {
    if (selectedUser) {
      updateUserMutation.mutate({
        id: selectedUser.id,
        updates,
      });
    }
  };

  const handleDeleteUser = (id: string) => {
    deleteUserMutation.mutate(id);
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'user_admin':
        return 'User Admin';
      case 'content_admin':
        return 'Content Admin';
      default:
        return 'User';
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'default';
      case 'user_admin':
        return 'secondary';
      case 'content_admin':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const canEditUser = (targetUser: UserData) => {
    if (user?.role === 'super_admin') return true;
    if (user?.role === 'user_admin' && targetUser.role !== 'super_admin') return true;
    return false;
  };

  const canDeleteUser = (targetUser: UserData) => {
    if (targetUser.id === user?.id) return false; // Can't delete yourself
    return canEditUser(targetUser);
  };

  const availableRoles = () => {
    if (user?.role === 'super_admin') {
      return ['user', 'content_admin', 'user_admin', 'super_admin'];
    }
    if (user?.role === 'user_admin') {
      // User admin can only create content_admin users
      return ['content_admin'];
    }
    return ['user'];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-6 w-6 text-gray-600" />
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={createFormData.email}
                  onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                  placeholder="user@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={createFormData.password}
                  onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                  placeholder="Enter password"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={createFormData.firstName}
                    onChange={(e) => setCreateFormData({ ...createFormData, firstName: e.target.value })}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={createFormData.lastName}
                    onChange={(e) => setCreateFormData({ ...createFormData, lastName: e.target.value })}
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={createFormData.role} 
                  onValueChange={(value) => setCreateFormData({ ...createFormData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles().map((role) => (
                      <SelectItem key={role} value={role}>
                        {getRoleDisplayName(role)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleCreateUser} 
                disabled={createUserMutation.isPending}
                className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white"
              >
                {createUserMutation.isPending ? 'Creating...' : 'Create User'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Role Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Label htmlFor="role-filter">Filter by Role:</Label>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableRoles().map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-gray-500">
          Showing {users.length} of {allUsers.length} users
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((userData: UserData) => (
                <TableRow key={userData.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {userData.firstName && userData.lastName
                            ? `${userData.firstName} ${userData.lastName}`
                            : userData.email}
                        </div>
                        <div className="text-sm text-gray-500">{userData.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(userData.role)}>
                      {getRoleDisplayName(userData.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {new Date(userData.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {canEditUser(userData) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(userData);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {canDeleteUser(userData) && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete User</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this user? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteUser(userData.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editEmail">Email</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="editFirstName">First Name</Label>
                  <Input
                    id="editFirstName"
                    value={selectedUser.firstName || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editLastName">Last Name</Label>
                  <Input
                    id="editLastName"
                    value={selectedUser.lastName || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editRole">Role</Label>
                <Select 
                  value={selectedUser.role} 
                  onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles().map((role) => (
                      <SelectItem key={role} value={role}>
                        {getRoleDisplayName(role)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={() => handleUpdateUser(selectedUser)} 
                disabled={updateUserMutation.isPending}
                className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white"
              >
                {updateUserMutation.isPending ? 'Updating...' : 'Update User'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}