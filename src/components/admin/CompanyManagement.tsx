
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, User, ShoppingCart, Building } from "lucide-react";

interface Company {
  id: number;
  name: string;
  rut: string;
  username: string;
  password: string;
  logoPreview: string | null;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  cardColor: string;
  buttonColor: string;
  slogan: string;
  consultEmail: string;
  salesEmail: string;
  status: string;
  cartEnabled: boolean;
  erpImportEndpoint: string;
  erpExportEndpoint: string;
  erpApiKey: string;
}

interface CompanyManagementProps {
  companies: Company[];
  setCompanies: (companies: Company[]) => void;
  onSave: (companies: Company[], adminConfig: any, adminUsers: any[]) => void;
  adminConfig: any;
  adminUsers: any[];
}

const CompanyManagement = ({ 
  companies, 
  setCompanies, 
  onSave, 
  adminConfig, 
  adminUsers 
}: CompanyManagementProps) => {
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: "",
    rut: "",
    username: "",
    password: "",
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

  const { toast } = useToast();

  const resetNewCompany = () => {
    setNewCompany({
      name: "",
      rut: "",
      username: "",
      password: "",
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
  };

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCompany.name || !newCompany.rut || !newCompany.username || !newCompany.password) {
      toast({
        title: "Error",
        description: "Todos los campos obligatorios deben estar completos",
        variant: "destructive",
      });
      return;
    }

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
    onSave(updatedCompanies, adminConfig, adminUsers);
    
    resetNewCompany();
    setShowCreateForm(false);
    
    toast({
      title: "Empresa creada",
      description: `${company.name} ha sido registrada exitosamente`,
    });
  };

  const handleUpdateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCompany) return;
    
    if (!editingCompany.name || !editingCompany.rut || !editingCompany.username) {
      toast({
        title: "Error",
        description: "Los campos nombre, RUT y usuario son obligatorios",
        variant: "destructive",
      });
      return;
    }
    
    const updatedCompanies = companies.map(company => 
      company.id === editingCompany.id ? editingCompany : company
    );
    setCompanies(updatedCompanies);
    onSave(updatedCompanies, adminConfig, adminUsers);
    setEditingCompany(null);
    toast({
      title: "Empresa actualizada",
      description: "Los datos han sido actualizados exitosamente",
    });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (editingCompany) {
          setEditingCompany({...editingCompany, logoPreview: e.target?.result as string});
        } else {
          setNewCompany({...newCompany, logoPreview: e.target?.result as string});
        }
      };
      reader.readAsDataURL(file);
      toast({
        title: "Logo cargado",
        description: "El logo ha sido cargado correctamente",
      });
    }
  };

  const handleToggleStatus = (id: number) => {
    const updatedCompanies = companies.map(company => 
      company.id === id 
        ? { ...company, status: company.status === 'active' ? 'inactive' : 'active' }
        : company
    );
    setCompanies(updatedCompanies);
    onSave(updatedCompanies, adminConfig, adminUsers);
    
    const company = updatedCompanies.find(c => c.id === id);
    toast({
      title: "Estado actualizado",
      description: `La empresa ${company?.name} está ahora ${company?.status === 'active' ? 'activa' : 'inactiva'}`,
    });
  };

  const handleToggleCart = (id: number) => {
    const updatedCompanies = companies.map(company => 
      company.id === id 
        ? { ...company, cartEnabled: !company.cartEnabled }
        : company
    );
    setCompanies(updatedCompanies);
    onSave(updatedCompanies, adminConfig, adminUsers);
    
    const company = updatedCompanies.find(c => c.id === id);
    toast({
      title: "Carrito actualizado",
      description: `El carrito de ${company?.name} está ahora ${company?.cartEnabled ? 'habilitado' : 'deshabilitado'}`,
    });
  };

  const handleDeleteCompany = (id: number) => {
    const companyToDelete = companies.find(c => c.id === id);
    const updatedCompanies = companies.filter(company => company.id !== id);
    setCompanies(updatedCompanies);
    onSave(updatedCompanies, adminConfig, adminUsers);
    toast({
      title: "Empresa eliminada",
      description: `${companyToDelete?.name} ha sido eliminada del sistema`,
    });
  };

  const getStoreUrl = (companyId: number) => {
    return `${window.location.origin}/store/${companyId}`;
  };

  return (
    <div className="space-y-6">
      {/* Botón principal para crear empresa */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Empresas</h2>
          <p className="text-gray-600">Administra las empresas registradas en el sistema</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2"
          style={{ backgroundColor: adminConfig.primaryColor }}
        >
          <Building className="w-4 h-4" />
          <span>Nueva Empresa</span>
        </Button>
      </div>

      {/* Formulario de creación (mostrar solo cuando se necesite) */}
      {(showCreateForm || editingCompany) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingCompany ? 'Editar Empresa' : 'Crear Nueva Empresa'}</CardTitle>
            <CardDescription>
              {editingCompany ? 'Modifica los datos de la empresa' : 'Registra una nueva empresa con su carrito de compras'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingCompany ? handleUpdateCompany : handleCreateCompany} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la Empresa *</Label>
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
                  <Label htmlFor="rut">RUT *</Label>
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
                  <Label htmlFor="username">Usuario *</Label>
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
                  <Label htmlFor="password">Contraseña *</Label>
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
                <Label>Logo de la Empresa</Label>
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
                  {(editingCompany?.logoPreview || newCompany.logoPreview) ? (
                    <img 
                      src={editingCompany?.logoPreview || newCompany.logoPreview} 
                      alt="Logo Empresa" 
                      className="max-h-20 max-w-full object-contain mx-auto mb-2 border rounded"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  )}
                  <p className="text-xs text-gray-500">Este logo se mostrará destacado en su carrito</p>
                </div>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoUpload}
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="flex-1" style={{ backgroundColor: adminConfig.primaryColor }}>
                  {editingCompany ? 'Actualizar Empresa' : 'Crear Empresa'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setEditingCompany(null);
                    setShowCreateForm(false);
                    resetNewCompany();
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de empresas registradas */}
      <Card>
        <CardHeader>
          <CardTitle>Empresas Registradas ({companies.length})</CardTitle>
          <CardDescription>
            Gestiona todas las empresas del sistema y sus configuraciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          {companies.length === 0 ? (
            <div className="text-center py-8">
              <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-500 mb-2">No hay empresas registradas</h3>
              <p className="text-gray-400 mb-4">Comienza creando tu primera empresa</p>
              <Button 
                onClick={() => setShowCreateForm(true)}
                style={{ backgroundColor: adminConfig.primaryColor }}
              >
                <Building className="w-4 h-4 mr-2" />
                Crear Primera Empresa
              </Button>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {companies.map((company) => (
                <div key={company.id} className="p-4 border rounded-lg bg-white shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {company.logoPreview && (
                          <img 
                            src={company.logoPreview} 
                            alt={company.name} 
                            className="w-8 h-8 object-contain border rounded"
                          />
                        )}
                        <h4 className="font-semibold text-lg">{company.name}</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <p><span className="font-medium">RUT:</span> {company.rut}</p>
                        <p><span className="font-medium">Usuario:</span> {company.username}</p>
                        <p className="col-span-2"><span className="font-medium">Slogan:</span> {company.slogan || 'Sin slogan'}</p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Badge 
                        variant={company.status === 'active' ? 'default' : 'secondary'}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleToggleStatus(company.id)}
                        style={{ 
                          backgroundColor: company.status === 'active' ? '#10b981' : '#6b7280',
                          color: 'white'
                        }}
                      >
                        <Building className="w-3 h-3 mr-1" />
                        {company.status === 'active' ? 'Empresa Activa' : 'Empresa Inactiva'}
                      </Badge>
                      <Badge 
                        variant={company.cartEnabled ? 'default' : 'destructive'}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleToggleCart(company.id)}
                        style={{ 
                          backgroundColor: company.cartEnabled ? adminConfig.secondaryColor : '#dc2626',
                          color: 'white'
                        }}
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        {company.cartEnabled ? 'Carrito Habilitado' : 'Carrito Deshabilitado'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mb-3 p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500 mb-1">URL del Carrito:</p>
                    <p className="text-xs text-blue-600 break-all font-mono">{getStoreUrl(company.id)}</p>
                  </div>
                  
                  <div className="flex space-x-2 flex-wrap gap-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setEditingCompany({...company})}
                      className="hover:bg-blue-50"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => window.open(getStoreUrl(company.id), '_blank')}
                      className="hover:bg-green-50"
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Ver Carrito
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDeleteCompany(company.id)}
                      className="hover:bg-red-50 text-red-600"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyManagement;
