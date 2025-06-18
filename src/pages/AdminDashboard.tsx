
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, User, Settings, Users, Palette, BarChart3, FileText } from "lucide-react";

const AdminDashboard = () => {
  const [companies, setCompanies] = useState([
    { 
      id: 1, 
      name: "TechCorp SA", 
      rut: "12.345.678-9", 
      username: "techcorp_user", 
      status: "active", 
      logo: null,
      primaryColor: "#8b5cf6",
      consultEmail: "",
      salesEmail: "",
      erpEndpoint: "",
      erpApiKey: ""
    },
    { 
      id: 2, 
      name: "InnovaShop", 
      rut: "98.765.432-1", 
      username: "innovashop_user", 
      status: "active", 
      logo: null,
      primaryColor: "#3b82f6",
      consultEmail: "",
      salesEmail: "",
      erpEndpoint: "",
      erpApiKey: ""
    },
  ]);

  const [adminConfig, setAdminConfig] = useState({
    username: "ADM",
    password: "ADM123",
    logo: null,
    logoPreview: null
  });

  const [editingCompany, setEditingCompany] = useState(null);
  const [newCompany, setNewCompany] = useState({
    name: "",
    rut: "",
    username: "",
    password: "",
    logo: null,
    primaryColor: "#8b5cf6",
    consultEmail: "",
    salesEmail: "",
    erpEndpoint: "",
    erpApiKey: ""
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
    setNewCompany({ 
      name: "", 
      rut: "", 
      username: "", 
      password: "", 
      logo: null,
      primaryColor: "#8b5cf6",
      consultEmail: "",
      salesEmail: "",
      erpEndpoint: "",
      erpApiKey: ""
    });
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

  const handleLogoUpload = (event, isAdmin = false) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (isAdmin) {
          setAdminConfig({...adminConfig, logoPreview: e.target?.result});
        }
      };
      reader.readAsDataURL(file);
      toast({
        title: "Logo cargado",
        description: "El logo ha sido cargado correctamente",
      });
    }
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="admin-config">
              <Settings className="w-4 h-4 mr-2" />
              Administrar ADM
            </TabsTrigger>
            <TabsTrigger value="companies">
              <Users className="w-4 h-4 mr-2" />
              Usuarios Empresas
            </TabsTrigger>
            <TabsTrigger value="panel-config">
              <Palette className="w-4 h-4 mr-2" />
              Configurar Panel
            </TabsTrigger>
            <TabsTrigger value="erp-config">
              <Settings className="w-4 h-4 mr-2" />
              Configuración ERP
            </TabsTrigger>
            <TabsTrigger value="reports">
              <BarChart3 className="w-4 h-4 mr-2" />
              Informes
            </TabsTrigger>
          </TabsList>

          {/* Administrar usuario ADM */}
          <TabsContent value="admin-config">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración del Administrador</CardTitle>
                  <CardDescription>
                    Cambiar credenciales del administrador ADM
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
                    Logo de ATG que aparece en todo el sistema (menos destacado que logos de empresas)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
                      {adminConfig.logoPreview ? (
                        <img 
                          src={adminConfig.logoPreview} 
                          alt="Logo ATG" 
                          className="max-h-24 mx-auto mb-2"
                        />
                      ) : (
                        <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      )}
                      <p className="text-sm text-gray-600">Logo actual de ATG</p>
                      <p className="text-xs text-gray-500">Se mostrará pequeño en todo el sistema</p>
                    </div>
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleLogoUpload(e, true)}
                    />
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
                      <Label htmlFor="primaryColor">Color Primario del Carrito</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          type="color" 
                          value={editingCompany ? editingCompany.primaryColor : newCompany.primaryColor}
                          onChange={(e) => editingCompany 
                            ? setEditingCompany({...editingCompany, primaryColor: e.target.value})
                            : setNewCompany({...newCompany, primaryColor: e.target.value})
                          }
                          className="w-16 h-10"
                        />
                        <Input 
                          value={editingCompany ? editingCompany.primaryColor : newCompany.primaryColor}
                          onChange={(e) => editingCompany 
                            ? setEditingCompany({...editingCompany, primaryColor: e.target.value})
                            : setNewCompany({...newCompany, primaryColor: e.target.value})
                          }
                          placeholder="#8b5cf6"
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="consultEmail">Email para Consultas</Label>
                      <Input
                        id="consultEmail"
                        type="email"
                        value={editingCompany ? editingCompany.consultEmail : newCompany.consultEmail}
                        onChange={(e) => editingCompany 
                          ? setEditingCompany({...editingCompany, consultEmail: e.target.value})
                          : setNewCompany({...newCompany, consultEmail: e.target.value})
                        }
                        placeholder="consultas@empresa.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salesEmail">Email para Notificaciones de Ventas</Label>
                      <Input
                        id="salesEmail"
                        type="email"
                        value={editingCompany ? editingCompany.salesEmail : newCompany.salesEmail}
                        onChange={(e) => editingCompany 
                          ? setEditingCompany({...editingCompany, salesEmail: e.target.value})
                          : setNewCompany({...newCompany, salesEmail: e.target.value})
                        }
                        placeholder="ventas@empresa.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Logo de la Empresa</Label>
                      <Input type="file" accept="image/*" />
                      <p className="text-xs text-gray-500">Este logo se mostrará destacado en su carrito</p>
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
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-500">Color:</span>
                              <div 
                                className="w-4 h-4 rounded border"
                                style={{ backgroundColor: company.primaryColor }}
                              ></div>
                              <span className="text-xs text-gray-500">{company.primaryColor}</span>
                            </div>
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
                  Personaliza los colores y apariencia general de la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Color Principal del Sistema</Label>
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
                    <p className="text-xs text-gray-500">Los cambios se aplicarán a todo el sistema</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuración ERP por Empresa */}
          <TabsContent value="erp-config">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración ERP por Empresa</CardTitle>
                  <CardDescription>
                    Configura los servicios ERP individualmente para cada empresa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {companies.map((company) => (
                      <div key={company.id} className="p-4 border rounded-lg space-y-4">
                        <h4 className="font-semibold text-lg">{company.name}</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>Endpoint ERP para Productos</Label>
                            <Input 
                              placeholder="https://api-erp.com/productos"
                              value={company.erpEndpoint || ''}
                              onChange={(e) => {
                                const updatedCompanies = companies.map(c => 
                                  c.id === company.id ? {...c, erpEndpoint: e.target.value} : c
                                );
                                setCompanies(updatedCompanies);
                              }}
                            />
                          </div>
                          <div>
                            <Label>API Key ERP</Label>
                            <Input 
                              type="password" 
                              placeholder="••••••••••••"
                              value={company.erpApiKey || ''}
                              onChange={(e) => {
                                const updatedCompanies = companies.map(c => 
                                  c.id === company.id ? {...c, erpApiKey: e.target.value} : c
                                );
                                setCompanies(updatedCompanies);
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm">Probar Conexión</Button>
                          <Button size="sm" variant="outline">Guardar Configuración</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Nueva pestaña de Informes */}
          <TabsContent value="reports">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informes por Empresa</CardTitle>
                  <CardDescription>
                    Visualiza estadísticas y exporta información de cada empresa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {companies.map((company) => (
                      <div key={company.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold text-lg">{company.name}</h4>
                          <Button size="sm" variant="outline">
                            <FileText className="w-4 h-4 mr-2" />
                            Exportar a Excel
                          </Button>
                        </div>
                        <div className="grid md:grid-cols-4 gap-4">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-600">Ventas Totales</p>
                            <p className="text-2xl font-bold text-blue-600">$0</p>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <p className="text-sm text-gray-600">Productos Vendidos</p>
                            <p className="text-2xl font-bold text-green-600">0</p>
                          </div>
                          <div className="p-3 bg-purple-50 rounded-lg">
                            <p className="text-sm text-gray-600">Facturas Emitidas</p>
                            <p className="text-2xl font-bold text-purple-600">0</p>
                          </div>
                          <div className="p-3 bg-orange-50 rounded-lg">
                            <p className="text-sm text-gray-600">Consultas Recibidas</p>
                            <p className="text-2xl font-bold text-orange-600">0</p>
                          </div>
                        </div>
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
