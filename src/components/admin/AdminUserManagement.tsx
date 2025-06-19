
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from "lucide-react";

interface AdminUser {
  id: number;
  username: string;
  password: string;
}

interface AdminUserManagementProps {
  adminUsers: AdminUser[];
  setAdminUsers: (users: AdminUser[]) => void;
  onSave: (companies: any[], adminConfig: any, adminUsers: AdminUser[]) => void;
  companies: any[];
  adminConfig: any;
}

const AdminUserManagement = ({ 
  adminUsers, 
  setAdminUsers, 
  onSave, 
  companies, 
  adminConfig 
}: AdminUserManagementProps) => {
  const [newAdminUser, setNewAdminUser] = useState({ username: "", password: "" });
  const { toast } = useToast();

  const handleAddAdminUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUser.username || !newAdminUser.password) {
      toast({
        title: "Error",
        description: "Debe completar usuario y contraseña",
        variant: "destructive",
      });
      return;
    }
    
    const userExists = adminUsers.some(user => user.username === newAdminUser.username);
    if (userExists) {
      toast({
        title: "Error",
        description: "El usuario administrador ya existe",
        variant: "destructive",
      });
      return;
    }

    const newUser = {
      id: Date.now(),
      ...newAdminUser
    };
    const updatedAdminUsers = [...adminUsers, newUser];
    setAdminUsers(updatedAdminUsers);
    onSave(companies, adminConfig, updatedAdminUsers);
    setNewAdminUser({ username: "", password: "" });
    
    toast({
      title: "Administrador agregado",
      description: "Nuevo usuario administrador creado exitosamente",
    });
  };

  const handleDeleteAdminUser = (userId: number) => {
    if (adminUsers.length <= 1) {
      toast({
        title: "Error",
        description: "Debe mantener al menos un usuario administrador",
        variant: "destructive",
      });
      return;
    }

    const updatedUsers = adminUsers.filter(u => u.id !== userId);
    setAdminUsers(updatedUsers);
    onSave(companies, adminConfig, updatedUsers);
    toast({ 
      title: "Usuario eliminado", 
      description: "Usuario administrador eliminado exitosamente" 
    });
  };

  return (
    <div className="grid lg:grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Usuarios Administradores</CardTitle>
          <CardDescription>
            Gestiona los usuarios con acceso de administrador
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Usuarios Administradores Existentes</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {adminUsers.map((user) => (
                <div key={user.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <span className="font-medium">{user.username}</span>
                    <span className="text-sm text-gray-500 ml-2">••••••••</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDeleteAdminUser(user.id)}
                    disabled={adminUsers.length <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <form onSubmit={handleAddAdminUser} className="space-y-4 border-t pt-4">
            <div className="space-y-2">
              <Label htmlFor="new-admin-username">Nuevo Usuario Administrador</Label>
              <Input
                id="new-admin-username"
                value={newAdminUser.username}
                onChange={(e) => setNewAdminUser({...newAdminUser, username: e.target.value})}
                placeholder="Usuario administrador"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-admin-password">Contraseña</Label>
              <Input
                id="new-admin-password"
                type="password"
                value={newAdminUser.password}
                onChange={(e) => setNewAdminUser({...newAdminUser, password: e.target.value})}
                placeholder="Contraseña"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Administrador
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserManagement;
