
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, ShoppingCart, FileImage } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [companies, setCompanies] = useState([
    { id: 1, name: "TechCorp SA", rut: "12.345.678-9", email: "admin@techcorp.com", status: "active" },
    { id: 2, name: "InnovaShop", rut: "98.765.432-1", email: "ventas@innovashop.com", status: "active" },
    { id: 3, name: "MegaSupplies", rut: "11.223.344-5", email: "contacto@megasupplies.com", status: "pending" },
  ]);

  const [newCompany, setNewCompany] = useState({
    name: "",
    rut: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    const company = {
      id: companies.length + 1,
      ...newCompany,
      status: "active"
    };
    setCompanies([...companies, company]);
    setNewCompany({ name: "", rut: "", email: "", password: "" });
    toast({
      title: "Empresa creada",
      description: `${newCompany.name} ha sido registrada exitosamente`,
    });
  };

  const stats = [
    { title: "Empresas Registradas", value: companies.length, icon: Users },
    { title: "Pedidos Totales", value: "1,247", icon: ShoppingCart },
    { title: "Productos Activos", value: "15,432", icon: FileImage },
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
        <Tabs defaultValue="companies" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="companies">Gestión de Empresas</TabsTrigger>
            <TabsTrigger value="orders">Pedidos Globales</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="companies" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Create Company */}
              <Card>
                <CardHeader>
                  <CardTitle>Crear Nueva Empresa</CardTitle>
                  <CardDescription>
                    Registra una nueva empresa en la plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateCompany} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre Fantasía</Label>
                      <Input
                        id="name"
                        value={newCompany.name}
                        onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                        placeholder="Ej: TechCorp SA"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rut">RUT</Label>
                      <Input
                        id="rut"
                        value={newCompany.rut}
                        onChange={(e) => setNewCompany({...newCompany, rut: e.target.value})}
                        placeholder="12.345.678-9"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newCompany.email}
                        onChange={(e) => setNewCompany({...newCompany, email: e.target.value})}
                        placeholder="admin@empresa.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newCompany.password}
                        onChange={(e) => setNewCompany({...newCompany, password: e.target.value})}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Crear Empresa
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Companies List */}
              <Card>
                <CardHeader>
                  <CardTitle>Empresas Registradas</CardTitle>
                  <CardDescription>
                    Lista de todas las empresas en la plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {companies.map((company) => (
                      <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{company.name}</h4>
                          <p className="text-sm text-gray-600">{company.email}</p>
                          <p className="text-xs text-gray-500">RUT: {company.rut}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                            {company.status === 'active' ? 'Activa' : 'Pendiente'}
                          </Badge>
                          <Button size="sm" variant="outline">
                            Ver Tienda
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Pedidos Globales</CardTitle>
                <CardDescription>
                  Visualiza todos los pedidos de todas las empresas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Panel de pedidos globales en desarrollo</p>
                  <p className="text-sm text-gray-500">Aquí verás estadísticas y reportes de ventas</p>
                </div>
              </CardContent>
            </Card>
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
                      <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-2" />
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
