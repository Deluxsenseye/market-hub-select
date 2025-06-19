import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, User } from "lucide-react";

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

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCompany.name || !newCompany.rut || !newCompany.username || !newCompany.password) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
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
    toast({
      title: "Estado actualizado",
      description: "El estado de la empresa ha sido modificado",
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
    toast({
      title: "Carrito actualizado",
      description: "El estado del carrito ha sido modificado",
    });
  };

  const handleDeleteCompany = (id: number) => {
    const updatedCompanies = companies.filter(company => company.id !== id);
    setCompanies(updatedCompanies);
    onSave(updatedCompanies, adminConfig, adminUsers);
    toast({
      title: "Empresa eliminada",
      description: "La empresa ha sido eliminada del sistema",
    });
  };

  const getStoreUrl = (companyId: number) => {
    return `${window.location.origin}/store/${companyId}`;
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
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
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Badge 
                      variant={company.status === 'active' ? 'default' : 'secondary'}
                      className="cursor-pointer"
                      onClick={() => handleToggleStatus(company.id)}
                      style={{ 
                        backgroundColor: company.status === 'active' ? adminConfig.primaryColor : '#6b7280',
                        color: 'white'
                      }}
                    >
                      {company.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                    <Badge 
                      variant={company.cartEnabled ? 'default' : 'destructive'}
                      className="cursor-pointer"
                      onClick={() => handleToggleCart(company.id)}
                      style={{ 
                        backgroundColor: company.cartEnabled ? adminConfig.secondaryColor : '#dc2626',
                        color: 'white'
                      }}
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
  );
};

export default CompanyManagement;
