
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, Settings, Trash2, Edit, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminDashboard = () => {
  const [companies, setCompanies] = useState([
    { id: 1, name: "TechCorp SA", rut: "12.345.678-9", username: "techcorp_user", status: "active" },
    { id: 2, name: "InnovaShop", rut: "98.765.432-1", username: "innovashop_user", status: "active" },
    { id: 3, name: "MegaSupplies", rut: "11.223.344-5", username: "megasupplies_user", status: "pending" },
  ]);

  const [newCompany, setNewCompany] = useState({
    name: "",
    rut: "",
    username: "",
    password: ""
  });

  const [editingCompany, setEditingCompany] = useState(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userExists = companies.some(company => company.username === newCompany.username);
    if (userExists) {
      toast({
        title: "Error",
        description: "El nombre de usuario ya existe",
        variant: "destructive",
      });
      return;
    }

    const company = {
      id: companies.length + 1,
      ...newCompany,
      status: "active"
    };
    setCompanies([...companies, company]);
    setNewCompany({ name: "", rut: "", username: "", password: "" });
    toast({
      title: "Usuario creado",
      description: `${newCompany.name} con usuario "${newCompany.username}" ha sido registrado exitosamente`,
    });
  };

  const handleEditCompany = (company) => {
    setEditingCompany({...company});
  };

  const handleUpdateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    setCompanies(companies.map(company => 
      company.id === editingCompany.id ? editingCompany : company
    ));
    setEditingCompany(null);
    toast({
      title: "Usuario actualizado",
      description: "Los datos del usuario han sido actualizados exitosamente",
    });
  };

  const handleToggleStatus = (id: number) => {
    setCompanies(companies.map(company => 
      company.id === id 
        ? { ...company, status: company.status === 'active' ? 'inactive' : 'active' }
        : company
    ));
    toast({
      title: "Estado actualizado",
      description: "El estado del usuario ha sido modificado",
    });
  };

  const handleDeleteCompany = (id: number) => {
    setCompanies(companies.filter(company => company.id !== id));
    toast({
      title: "Usuario eliminado",
      description: "El usuario ha sido eliminado del sistema",
    });
  };

  const stats = [
    { title: "Usuarios Activos", value: companies.filter(c => c.status === 'active').length, icon: Users },
    { title: "Usuarios Inactivos", value: companies.filter(c => c.status === 'inactive').length, icon: Users },
    { title: "Total Usuarios", value: companies.length, icon: UserPlus },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text">Panel de Administración</h1>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Administrador Maestro</Badge>
              <Button variant="outline" onClick={() => navigate('/')}>
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover-scale">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Gestión de Usuarios</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Create/Edit User */}
              <Card>
                <CardHeader>
                  <CardTitle>{editingCompany ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</CardTitle>
                  <CardDescription>
                    {editingCompany ? 'Modifica los datos del usuario' : 'Registra una nueva empresa y crea sus credenciales de acceso'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={editingCompany ? handleUpdateCompany : handleCreateCompany} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre Fantasía</Label>
                      <Input
                        id="name"
                        value={editingCompany ? editingCompany.name : newCompany.name}
                        onChange={(e) => editingCompany 
                          ? setEditingCompany({...editingCompany, name: e.target.value})
                          : setNewCompany({...newCompany, name: e.target.value})
                        }
                        placeholder="Ej: TechCorp SA"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rut">RUT</Label>
                      <Input
                        id="rut"
                        value={editingCompany ? editingCompany.rut : newCompany.rut}
                        onChange={(e) => editingCompany 
                          ? setEditingCompany({...editingCompany, rut: e.target.value})
                          : setNewCompany({...newCompany, rut: e.target.value})
                        }
                        placeholder="12.345.678-9"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Nombre de Usuario</Label>
                      <Input
                        id="username"
                        value={editingCompany ? editingCompany.username : newCompany.username}
                        onChange={(e) => editingCompany 
                          ? setEditingCompany({...editingCompany, username: e.target.value})
                          : setNewCompany({...newCompany, username: e.target.value})
                        }
                        placeholder="techcorp_user"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <Input
                        id="password"
                        type="password"
                        value={editingCompany ? editingCompany.password || '' : newCompany.password}
                        onChange={(e) => editingCompany 
                          ? setEditingCompany({...editingCompany, password: e.target.value})
                          : setNewCompany({...newCompany, password: e.target.value})
                        }
                        placeholder="••••••••"
                        required={!editingCompany}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button type="submit" className="flex-1">
                        {editingCompany ? 'Actualizar Usuario' : 'Crear Usuario'}
                      </Button>
                      {editingCompany && (
                        <Button type="button" variant="outline" onClick={() => setEditingCompany(null)}>
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Users Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Usuarios Registrados</CardTitle>
                  <CardDescription>
                    Gestiona todos los usuarios del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {companies.map((company) => (
                        <TableRow key={company.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{company.name}</p>
                              <p className="text-xs text-gray-500">{company.rut}</p>
                            </div>
                          </TableCell>
                          <TableCell>{company.username}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={company.status === 'active' ? 'default' : 'secondary'}
                              className="cursor-pointer"
                              onClick={() => handleToggleStatus(company.id)}
                            >
                              {company.status === 'active' ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditCompany(company)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteCompany(company.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de la Plataforma</CardTitle>
                <CardDescription>
                  Gestiona la configuración global del marketplace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="platform-logo">Logo de la Plataforma</Label>
                    <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                      <Settings className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Haz clic para cargar tu logo</p>
                    </div>
                  </div>
                  <Button>Guardar Configuración</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
