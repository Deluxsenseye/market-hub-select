
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, User, Settings, Users, Palette } from "lucide-react";

const AdminDashboard = () => {
  const [companies, setCompanies] = useState([
    { id: 1, name: "TechCorp SA", rut: "12.345.678-9", username: "techcorp_user", status: "active", logo: null },
    { id: 2, name: "InnovaShop", rut: "98.765.432-1", username: "innovashop_user", status: "active", logo: null },
    { id: 3, name: "MegaSupplies", rut: "11.223.344-5", username: "megasupplies_user", status: "inactive", logo: null },
  ]);

  const [adminConfig, setAdminConfig] = useState({
    username: "ADM",
    password: "ADM123",
    logo: null
  });

  const [editingCompany, setEditingCompany] = useState(null);
  const [newCompany, setNewCompany] = useState({
    name: "",
    rut: "",
    username: "",
    password: "",
    logo: null
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateCompany = (e) => {
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
    setNewCompany({ name: "", rut: "", username: "", password: "", logo: null });
    toast({
      title: "Empresa creada",
      description: `${newCompany.name} ha sido registrada exitosamente`,
    });
  };

  const handleEditCompany = (company) => {
    setEditingCompany({...company});
  };

  const handleUpdateCompany = (e) => {
    e.preventDefault();
    if (!editingCompany) return;
    
    setCompanies(companies.map(company => 
      company.id === editingCompany.id ? editingCompany : company
    ));
    setEditingCompany(null);
    toast({
      title: "Empresa actualizada",
      description: "Los datos han sido actualizados exitosamente",
    });
  };

  const handleToggleStatus = (id) => {
    setCompanies(companies.map(company => 
      company.id === id 
        ? { ...company, status: company.status === 'active' ? 'inactive' : 'active' }
        : company
    ));
    toast({
      title: "Estado actualizado",
      description: "El estado de la empresa ha sido modificado",
    });
  };

  const handleDeleteCompany = (id) => {
    setCompanies(companies.filter(company => company.id !== id));
    toast({
      title: "Empresa eliminada",
      description: "La empresa ha sido eliminada del sistema",
    });
  };

  const handleUpdateAdminConfig = (e) => {
    e.preventDefault();
    toast({
      title: "Configuración actualizada",
      description: "Los datos del administrador han sido actualizados",
    });
  };

  const getStoreUrl = (companyId) => {
    return `${window.location.origin}/store/${companyId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold gradient-text">Panel de Administración - ATG Informática</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Administrador</Badge>
              <Button variant="outline" onClick={() => navigate('/')}>
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="admin-config" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="admin-config">
              <Settings className="w-4 h-4 mr-2" />
              Administrar ADM
            </TabsTrigger>
            <TabsTrigger value="companies">
              <Users className="w-4 h-4 mr-2" />
              Empresas
            </TabsTrigger>
            <TabsTrigger value="panel-config">
              <Palette className="w-4 h-4 mr-2" />
              Configurar Panel
            </TabsTrigger>
            <TabsTrigger value="erp-config">
              <Settings className="w-4 h-4 mr-2" />
              Configuración ERP
            </TabsTrigger>
          </TabsList>

          {/* Administrar usuario ADM */}
          <TabsContent value="admin-config">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración del Administrador</CardTitle>
                  <CardDescription>
                    Cambiar credenciales y logo de ATG Informática
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateAdminConfig} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-username">Usuario Administrador</Label>
                      <Input
                        id="admin-username"
                        value={adminConfig.username}
                        onChange={(e) => setAdminConfig({...adminConfig, username: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Contraseña</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        value={adminConfig.password}
                        onChange={(e) => setAdminConfig({...adminConfig, password: e.target.value})}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Actualizar Credenciales
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Logo ATG Informática</CardTitle>
                  <CardDescription>
                    Logo que aparecerá en la página principal (menos destacado que logos de empresas)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
                      <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Logo actual de ATG</p>
                      <p className="text-xs text-gray-500">Haz clic para cambiar</p>
                    </div>
                    <Input type="file" accept="image/*" />
                    <Button className="w-full">Actualizar Logo ATG</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Administrar Usuarios Empresas */}
          <TabsContent value="companies">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Crear/Editar Empresa */}
              <Card>
                <CardHeader>
                  <CardTitle>{editingCompany ? 'Editar Empresa' : 'Crear Nueva Empresa'}</CardTitle>
                  <CardDescription>
                    {editingCompany ? 'Modifica los datos de la empresa' : 'Registra una nueva empresa con su carrito'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={editingCompany ? handleUpdateCompany : handleCreateCompany} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre de la Empresa</Label>
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
                      <Label htmlFor="username">Usuario</Label>
                      <Input
                        id="username"
                        value={editingCompany ? editingCompany.username : newCompany.username}
                        onChange={(e) => editingCompany 
                          ? setEditingCompany({...editingCompany, username: e.target.value})
                          : setNewCompany({...newCompany, username: e.target.value})
                        }
                        placeholder="usuario_empresa"
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
                    <div className="space-y-2">
                      <Label>Logo de la Empresa</Label>
                      <Input type="file" accept="image/*" />
                    </div>
                    <div className="flex space-x-2">
                      <Button type="submit" className="flex-1">
                        {editingCompany ? 'Actualizar Empresa' : 'Crear Empresa'}
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

              {/* Lista de Empresas */}
              <Card>
                <CardHeader>
                  <CardTitle>Empresas Registradas</CardTitle>
                  <CardDescription>
                    Gestiona todas las empresas del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {companies.map((company) => (
                      <div key={company.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{company.name}</h4>
                            <p className="text-sm text-gray-600">RUT: {company.rut}</p>
                            <p className="text-sm text-gray-600">Usuario: {company.username}</p>
                          </div>
                          <Badge 
                            variant={company.status === 'active' ? 'default' : 'secondary'}
                            className="cursor-pointer"
                            onClick={() => handleToggleStatus(company.id)}
                          >
                            {company.status === 'active' ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">URL del Carrito:</p>
                          <p className="text-xs text-blue-600 break-all">{getStoreUrl(company.id)}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditCompany(company)}>
                            Editar
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteCompany(company.id)}>
                            Eliminar
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => window.open(getStoreUrl(company.id), '_blank')}>
                            Ver Carrito
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Configurar Panel */}
          <TabsContent value="panel-config">
            <Card>
              <CardHeader>
                <CardTitle>Configuración Visual del Panel</CardTitle>
                <CardDescription>
                  Personaliza los colores y apariencia de la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Color Principal</Label>
                      <Input type="color" defaultValue="#8b5cf6" className="h-12" />
                    </div>
                    <div>
                      <Label>Color Secundario</Label>
                      <Input type="color" defaultValue="#3b82f6" className="h-12" />
                    </div>
                    <div>
                      <Label>Color de Fondo</Label>
                      <Input type="color" defaultValue="#f8fafc" className="h-12" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Color de Texto</Label>
                      <Input type="color" defaultValue="#1f2937" className="h-12" />
                    </div>
                    <div>
                      <Label>Color de Enlaces</Label>
                      <Input type="color" defaultValue="#2563eb" className="h-12" />
                    </div>
                    <Button className="w-full">Aplicar Cambios de Color</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuración ERP */}
          <TabsContent value="erp-config">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Servicios ERP para Empresas</CardTitle>
                  <CardDescription>
                    Configuración de integración con sistemas ERP externos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Endpoint para Productos</Label>
                      <Input placeholder="https://api-erp.com/productos" />
                    </div>
                    <div>
                      <Label>Endpoint para Ventas</Label>
                      <Input placeholder="https://api-erp.com/ventas" />
                    </div>
                    <div>
                      <Label>API Key</Label>
                      <Input type="password" placeholder="••••••••••••" />
                    </div>
                    <Button className="w-full">Configurar Integración ERP</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estado de Integraciones</CardTitle>
                  <CardDescription>
                    Monitoreo de conexiones ERP por empresa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {companies.map((company) => (
                      <div key={company.id} className="flex justify-between items-center p-3 border rounded">
                        <span className="font-medium">{company.name}</span>
                        <Badge variant="outline">No configurado</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
