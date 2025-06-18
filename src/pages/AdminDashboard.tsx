
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, User, Settings, Users, Palette, BarChart3, FileText, Edit, Trash2, Eye, EyeOff } from "lucide-react";

const AdminDashboard = () => {
  const [companies, setCompanies] = useState([
    { 
      id: 1, 
      name: "TechCorp SA", 
      rut: "12.345.678-9", 
      username: "techcorp_user", 
      password: "tech123",
      status: "active",
      cartEnabled: true,
      logo: null,
      logoPreview: null,
      primaryColor: "#8b5cf6",
      secondaryColor: "#3b82f6",
      backgroundColor: "#f8fafc",
      cardColor: "#ffffff",
      buttonColor: "#10b981",
      slogan: "Especialistas en tecnología empresarial",
      consultEmail: "consultas@techcorp.com",
      salesEmail: "ventas@techcorp.com",
      erpImportEndpoint: "",
      erpExportEndpoint: "",
      erpApiKey: ""
    },
    { 
      id: 2, 
      name: "InnovaShop", 
      rut: "98.765.432-1", 
      username: "innovashop_user", 
      password: "innova123",
      status: "active",
      cartEnabled: true,
      logo: null,
      logoPreview: null,
      primaryColor: "#3b82f6",
      secondaryColor: "#8b5cf6",
      backgroundColor: "#f1f5f9",
      cardColor: "#ffffff",
      buttonColor: "#f59e0b",
      slogan: "Innovación en cada producto",
      consultEmail: "info@innovashop.com",
      salesEmail: "pedidos@innovashop.com",
      erpImportEndpoint: "",
      erpExportEndpoint: "",
      erpApiKey: ""
    },
  ]);

  const [adminConfig, setAdminConfig] = useState({
    username: "ADM",
    password: "ADM123",
    logo: null,
    logoPreview: null,
    primaryColor: "#8b5cf6",
    secondaryColor: "#3b82f6",
    backgroundColor: "#f8fafc"
  });

  const [editingCompany, setEditingCompany] = useState(null);
  const [newCompany, setNewCompany] = useState({
    name: "",
    rut: "",
    username: "",
    password: "",
    logo: null,
    logoPreview: null,
    primaryColor: "#8b5cf6",
    secondaryColor: "#3b82f6",
    backgroundColor: "#f8fafc",
    cardColor: "#ffffff",
    buttonColor: "#10b981",
    slogan: "",
    consultEmail: "",
    salesEmail: "",
    erpImportEndpoint: "",
    erpExportEndpoint: "",
    erpApiKey: ""
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Cargar datos desde localStorage
    const savedCompanies = localStorage.getItem('companies');
    const savedAdminConfig = localStorage.getItem('adminConfig');
    
    if (savedCompanies) {
      setCompanies(JSON.parse(savedCompanies));
    }
    if (savedAdminConfig) {
      setAdminConfig(JSON.parse(savedAdminConfig));
    }
  }, []);

  const saveToLocalStorage = (companiesData, adminData) => {
    localStorage.setItem('companies', JSON.stringify(companiesData));
    localStorage.setItem('adminConfig', JSON.stringify(adminData));
  };

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
      id: Date.now(),
      ...newCompany,
      status: "active",
      cartEnabled: true
    };
    const updatedCompanies = [...companies, company];
    setCompanies(updatedCompanies);
    saveToLocalStorage(updatedCompanies, adminConfig);
    
    setNewCompany({ 
      name: "", 
      rut: "", 
      username: "", 
      password: "", 
      logo: null,
      logoPreview: null,
      primaryColor: "#8b5cf6",
      secondaryColor: "#3b82f6",
      backgroundColor: "#f8fafc",
      cardColor: "#ffffff",
      buttonColor: "#10b981",
      slogan: "",
      consultEmail: "",
      salesEmail: "",
      erpImportEndpoint: "",
      erpExportEndpoint: "",
      erpApiKey: ""
    });
    toast({
      title: "Empresa creada",
      description: `${newCompany.name} ha sido registrada exitosamente`,
    });
  };

  const handleUpdateCompany = (e) => {
    e.preventDefault();
    if (!editingCompany) return;
    
    const updatedCompanies = companies.map(company => 
      company.id === editingCompany.id ? editingCompany : company
    );
    setCompanies(updatedCompanies);
    saveToLocalStorage(updatedCompanies, adminConfig);
    setEditingCompany(null);
    toast({
      title: "Empresa actualizada",
      description: "Los datos han sido actualizados exitosamente",
    });
  };

  const handleUpdateAdminConfig = (e) => {
    e.preventDefault();
    saveToLocalStorage(companies, adminConfig);
    toast({
      title: "Configuración actualizada",
      description: "Los datos del administrador han sido actualizados",
    });
  };

  const handleLogoUpload = (event, isAdmin = false, companyId = null) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (isAdmin) {
          setAdminConfig({...adminConfig, logoPreview: e.target?.result});
        } else if (editingCompany) {
          setEditingCompany({...editingCompany, logoPreview: e.target?.result});
        } else {
          setNewCompany({...newCompany, logoPreview: e.target?.result});
        }
      };
      reader.readAsDataURL(file);
      toast({
        title: "Logo cargado",
        description: "El logo ha sido cargado correctamente",
      });
    }
  };

  const handleToggleStatus = (id) => {
    const updatedCompanies = companies.map(company => 
      company.id === id 
        ? { ...company, status: company.status === 'active' ? 'inactive' : 'active' }
        : company
    );
    setCompanies(updatedCompanies);
    saveToLocalStorage(updatedCompanies, adminConfig);
    toast({
      title: "Estado actualizado",
      description: "El estado de la empresa ha sido modificado",
    });
  };

  const handleToggleCart = (id) => {
    const updatedCompanies = companies.map(company => 
      company.id === id 
        ? { ...company, cartEnabled: !company.cartEnabled }
        : company
    );
    setCompanies(updatedCompanies);
    saveToLocalStorage(updatedCompanies, adminConfig);
    toast({
      title: "Carrito actualizado",
      description: "El estado del carrito ha sido modificado",
    });
  };

  const handleDeleteCompany = (id) => {
    const updatedCompanies = companies.filter(company => company.id !== id);
    setCompanies(updatedCompanies);
    saveToLocalStorage(updatedCompanies, adminConfig);
    toast({
      title: "Empresa eliminada",
      description: "La empresa ha sido eliminada del sistema",
    });
  };

  const getStoreUrl = (companyId) => {
    return `${window.location.origin}/store/${companyId}`;
  };

  const applySystemColors = () => {
    // Aplicar colores del sistema
    document.documentElement.style.setProperty('--primary', adminConfig.primaryColor);
    document.documentElement.style.setProperty('--secondary', adminConfig.secondaryColor);
    document.documentElement.style.setProperty('--background', adminConfig.backgroundColor);
    
    toast({
      title: "Colores aplicados",
      description: "Los colores del sistema han sido actualizados",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {adminConfig.logoPreview ? (
                <img 
                  src={adminConfig.logoPreview} 
                  alt="ATG Informática" 
                  className="max-h-8"
                />
              ) : (
                <ShoppingCart className="w-8 h-8 text-primary" />
              )}
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
                    <div className="space-y-2">
                      <Label>Colores del Sistema</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label className="text-xs">Color Primario</Label>
                          <Input 
                            type="color" 
                            value={adminConfig.primaryColor}
                            onChange={(e) => setAdminConfig({...adminConfig, primaryColor: e.target.value})}
                            className="h-10"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Color Secundario</Label>
                          <Input 
                            type="color" 
                            value={adminConfig.secondaryColor}
                            onChange={(e) => setAdminConfig({...adminConfig, secondaryColor: e.target.value})}
                            className="h-10"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Color de Fondo</Label>
                          <Input 
                            type="color" 
                            value={adminConfig.backgroundColor}
                            onChange={(e) => setAdminConfig({...adminConfig, backgroundColor: e.target.value})}
                            className="h-10"
                          />
                        </div>
                      </div>
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
                    Logo de ATG que aparece en todo el sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
                      {adminConfig.logoPreview ? (
                        <div className="relative inline-block">
                          <img 
                            src={adminConfig.logoPreview} 
                            alt="Logo ATG" 
                            className="max-h-32 max-w-full object-contain mx-auto mb-2 border-2 border-gray-200 rounded"
                            style={{ resize: 'both', overflow: 'auto' }}
                          />
                          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 cursor-se-resize"></div>
                        </div>
                      ) : (
                        <User className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      )}
                      <p className="text-sm text-gray-600 font-medium">Logo actual de ATG</p>
                      <p className="text-xs text-gray-500">Se mostrará en todo el sistema</p>
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
                    <div className="grid md:grid-cols-2 gap-4">
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
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slogan">Slogan de la Empresa</Label>
                      <Input
                        id="slogan"
                        value={editingCompany ? editingCompany.slogan : newCompany.slogan}
                        onChange={(e) => editingCompany 
                          ? setEditingCompany({...editingCompany, slogan: e.target.value})
                          : setNewCompany({...newCompany, slogan: e.target.value})
                        }
                        placeholder="Tu mensaje personalizado"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Colores del Carrito</Label>
                      <div className="grid grid-cols-5 gap-2">
                        <div>
                          <Label className="text-xs">Primario</Label>
                          <Input 
                            type="color" 
                            value={editingCompany ? editingCompany.primaryColor : newCompany.primaryColor}
                            onChange={(e) => editingCompany 
                              ? setEditingCompany({...editingCompany, primaryColor: e.target.value})
                              : setNewCompany({...newCompany, primaryColor: e.target.value})
                            }
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Secundario</Label>
                          <Input 
                            type="color" 
                            value={editingCompany ? editingCompany.secondaryColor : newCompany.secondaryColor}
                            onChange={(e) => editingCompany 
                              ? setEditingCompany({...editingCompany, secondaryColor: e.target.value})
                              : setNewCompany({...newCompany, secondaryColor: e.target.value})
                            }
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Fondo</Label>
                          <Input 
                            type="color" 
                            value={editingCompany ? editingCompany.backgroundColor : newCompany.backgroundColor}
                            onChange={(e) => editingCompany 
                              ? setEditingCompany({...editingCompany, backgroundColor: e.target.value})
                              : setNewCompany({...newCompany, backgroundColor: e.target.value})
                            }
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Tarjetas</Label>
                          <Input 
                            type="color" 
                            value={editingCompany ? editingCompany.cardColor : newCompany.cardColor}
                            onChange={(e) => editingCompany 
                              ? setEditingCompany({...editingCompany, cardColor: e.target.value})
                              : setNewCompany({...newCompany, cardColor: e.target.value})
                            }
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Botones</Label>
                          <Input 
                            type="color" 
                            value={editingCompany ? editingCompany.buttonColor : newCompany.buttonColor}
                            onChange={(e) => editingCompany 
                              ? setEditingCompany({...editingCompany, buttonColor: e.target.value})
                              : setNewCompany({...newCompany, buttonColor: e.target.value})
                            }
                            className="h-8"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
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
                    </div>

                    <div className="space-y-2">
                      <Label>Logo de la Empresa</Label>
                      <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
                        {(editingCompany?.logoPreview || newCompany.logoPreview) ? (
                          <div className="relative inline-block">
                            <img 
                              src={editingCompany?.logoPreview || newCompany.logoPreview} 
                              alt="Logo Empresa" 
                              className="max-h-20 max-w-full object-contain mx-auto mb-2 border-2 border-gray-200 rounded"
                              style={{ resize: 'both', overflow: 'auto' }}
                            />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 cursor-se-resize"></div>
                          </div>
                        ) : (
                          <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        )}
                        <p className="text-xs text-gray-500">Este logo se mostrará destacado en su carrito</p>
                      </div>
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleLogoUpload(e, false)}
                      />
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
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {companies.map((company) => (
                      <div key={company.id} className="p-4 border rounded-lg bg-white">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              {company.logoPreview && (
                                <img 
                                  src={company.logoPreview} 
                                  alt={company.name} 
                                  className="w-8 h-8 object-contain border rounded"
                                />
                              )}
                              <h4 className="font-semibold">{company.name}</h4>
                            </div>
                            <p className="text-sm text-gray-600">RUT: {company.rut}</p>
                            <p className="text-sm text-gray-600">Usuario: {company.username}</p>
                            <p className="text-sm text-gray-500">Slogan: {company.slogan || 'Sin slogan'}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-500">Colores:</span>
                              <div className="flex space-x-1">
                                <div className="w-4 h-4 rounded border" style={{ backgroundColor: company.primaryColor }}></div>
                                <div className="w-4 h-4 rounded border" style={{ backgroundColor: company.secondaryColor }}></div>
                                <div className="w-4 h-4 rounded border" style={{ backgroundColor: company.buttonColor }}></div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-1">
                            <Badge 
                              variant={company.status === 'active' ? 'default' : 'secondary'}
                              className="cursor-pointer"
                              onClick={() => handleToggleStatus(company.id)}
                            >
                              {company.status === 'active' ? 'Activo' : 'Inactivo'}
                            </Badge>
                            <Badge 
                              variant={company.cartEnabled ? 'default' : 'destructive'}
                              className="cursor-pointer"
                              onClick={() => handleToggleCart(company.id)}
                            >
                              {company.cartEnabled ? 'Carrito Activo' : 'Carrito Inhabilitado'}
                            </Badge>
                          </div>
                        </div>
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">URL del Carrito:</p>
                          <p className="text-xs text-blue-600 break-all font-mono bg-gray-50 p-1 rounded">{getStoreUrl(company.id)}</p>
                        </div>
                        <div className="flex space-x-2 flex-wrap gap-1">
                          <Button size="sm" variant="outline" onClick={() => setEditingCompany({...company})}>
                            <Edit className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteCompany(company.id)}>
                            <Trash2 className="w-3 h-3 mr-1" />
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
                      <Input 
                        type="color" 
                        value={adminConfig.primaryColor}
                        onChange={(e) => setAdminConfig({...adminConfig, primaryColor: e.target.value})}
                        className="h-12" 
                      />
                    </div>
                    <div>
                      <Label>Color Secundario</Label>
                      <Input 
                        type="color" 
                        value={adminConfig.secondaryColor}
                        onChange={(e) => setAdminConfig({...adminConfig, secondaryColor: e.target.value})}
                        className="h-12" 
                      />
                    </div>
                    <div>
                      <Label>Color de Fondo</Label>
                      <Input 
                        type="color" 
                        value={adminConfig.backgroundColor}
                        onChange={(e) => setAdminConfig({...adminConfig, backgroundColor: e.target.value})}
                        className="h-12" 
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg" style={{ 
                      background: `linear-gradient(135deg, ${adminConfig.primaryColor} 0%, ${adminConfig.secondaryColor} 100%)`
                    }}>
                      <h3 className="text-white font-semibold mb-2">Vista Previa</h3>
                      <p className="text-white/80 text-sm">Así se verán los colores aplicados</p>
                    </div>
                    <Button onClick={applySystemColors} className="w-full">
                      Aplicar Cambios de Color
                    </Button>
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
                  <CardTitle>Configuración PSIG ERP por Empresa</CardTitle>
                  <CardDescription>
                    Configura los servicios ERP individualmente para cada empresa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {companies.map((company) => (
                      <div key={company.id} className="p-4 border rounded-lg space-y-4 bg-white">
                        <div className="flex items-center space-x-2">
                          {company.logoPreview && (
                            <img src={company.logoPreview} alt={company.name} className="w-6 h-6 object-contain" />
                          )}
                          <h4 className="font-semibold text-lg">{company.name}</h4>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>Endpoint ERP para Importar Productos</Label>
                            <Input 
                              placeholder="https://api-erp.com/productos"
                              value={company.erpImportEndpoint || ''}
                              onChange={(e) => {
                                const updatedCompanies = companies.map(c => 
                                  c.id === company.id ? {...c, erpImportEndpoint: e.target.value} : c
                                );
                                setCompanies(updatedCompanies);
                              }}
                            />
                          </div>
                          <div>
                            <Label>Endpoint ERP para Exportar Ventas</Label>
                            <Input 
                              placeholder="https://api-erp.com/ventas"
                              value={company.erpExportEndpoint || ''}
                              onChange={(e) => {
                                const updatedCompanies = companies.map(c => 
                                  c.id === company.id ? {...c, erpExportEndpoint: e.target.value} : c
                                );
                                setCompanies(updatedCompanies);
                              }}
                            />
                          </div>
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
                        <div className="flex space-x-2">
                          <Button size="sm">Probar Conexión Importar</Button>
                          <Button size="sm" variant="outline">Probar Conexión Exportar</Button>
                          <Button size="sm" variant="outline" onClick={() => saveToLocalStorage(companies, adminConfig)}>
                            Guardar Configuración
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Informes */}
          <TabsContent value="reports">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Informes por Empresa</CardTitle>
                      <CardDescription>
                        Visualiza estadísticas y exporta información de cada empresa
                      </CardDescription>
                    </div>
                    <Button variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Exportar Resumen General
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {companies.map((company) => (
                      <div key={company.id} className="p-4 border rounded-lg bg-white">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center space-x-2">
                            {company.logoPreview && (
                              <img src={company.logoPreview} alt={company.name} className="w-6 h-6 object-contain" />
                            )}
                            <h4 className="font-semibold text-lg">{company.name}</h4>
                          </div>
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

      {/* Footer con logo ATG */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-white/20 py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            {adminConfig.logoPreview ? (
              <img src={adminConfig.logoPreview} alt="ATG Informática" className="max-h-6" />
            ) : (
              <ShoppingCart className="w-4 h-4 text-gray-400" />
            )}
            <span className="text-sm text-gray-500">Especialistas en tecnología empresarial</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
