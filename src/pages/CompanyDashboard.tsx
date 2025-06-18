
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileImage, ShoppingCart, Users, User, Search, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CompanyDashboard = () => {
  const [currentCompany, setCurrentCompany] = useState(null);
  const [adminConfig, setAdminConfig] = useState({
    logoPreview: null
  });
  const [products, setProducts] = useState([
    { id: 1, name: "Laptop HP ProBook", price: 850000, stock: 15, image: null },
    { id: 2, name: "Monitor Samsung 24''", price: 180000, stock: 8, image: null },
    { id: 3, name: "Teclado Mecánico RGB", price: 45000, stock: 25, image: null },
    { id: 4, name: "Mouse Logitech Inalámbrico", price: 35000, stock: 12, image: null },
    { id: 5, name: "Impresora HP LaserJet", price: 220000, stock: 5, image: null },
    { id: 6, name: "Webcam Logitech HD", price: 75000, stock: 18, image: null },
  ]);

  const [orders, setOrders] = useState([
    { id: 1, customer: "Juan Pérez", items: 3, total: 275000, status: "pending", date: "2024-01-15" },
    { id: 2, customer: "María González", items: 1, total: 850000, status: "completed", date: "2024-01-14" },
    { id: 3, customer: "Carlos López", items: 2, total: 225000, status: "processing", date: "2024-01-13" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Cargar empresa logueada y configuración admin
    const savedCompany = localStorage.getItem('currentCompany');
    const savedAdminConfig = localStorage.getItem('adminConfig');
    
    if (savedCompany) {
      const company = JSON.parse(savedCompany);
      setCurrentCompany(company);
      // Aplicar colores de la empresa
      document.documentElement.style.setProperty('--primary', company.primaryColor);
      document.documentElement.style.setProperty('--secondary', company.secondaryColor);
    } else {
      // Si no hay empresa logueada, redirigir al login
      navigate('/login');
    }
    
    if (savedAdminConfig) {
      setAdminConfig(JSON.parse(savedAdminConfig));
    }
  }, [navigate]);

  if (!currentCompany) {
    return <div>Cargando...</div>;
  }

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "Archivo subido",
        description: `${file.name} se ha procesado correctamente`,
      });
    }
  };

  const handleDownloadSample = () => {
    // Crear un archivo Excel de muestra con headers
    const csvContent = "Nombre,Precio,Stock,Descripción,Clasificación\nEjemplo Producto,100000,50,Descripción del producto,Categoría Ejemplo";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'muestra-productos.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Descarga iniciada",
      description: "Archivo de muestra descargado correctamente",
    });
  };

  const stats = [
    { title: "Productos Activos", value: products.length, icon: FileImage },
    { title: "Pedidos Pendientes", value: orders.filter(o => o.status === 'pending').length, icon: ShoppingCart },
    { title: "Clientes Únicos", value: new Set(orders.map(o => o.customer)).size, icon: Users },
  ];

  const getStoreUrl = () => {
    return `${window.location.origin}/store/${currentCompany.id}`;
  };

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: `linear-gradient(135deg, ${currentCompany.backgroundColor} 0%, ${currentCompany.primaryColor}20 50%, ${currentCompany.secondaryColor}20 100%)`
      }}
    >
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {currentCompany.logoPreview ? (
                <img 
                  src={currentCompany.logoPreview} 
                  alt={currentCompany.name} 
                  className="max-h-8"
                />
              ) : (
                <ShoppingCart className="w-8 h-8" style={{ color: currentCompany.primaryColor }} />
              )}
              <div>
                <h1 className="text-2xl font-bold" style={{ color: currentCompany.primaryColor }}>{currentCompany.name}</h1>
                <div className="text-sm text-gray-600">
                  <span>RUT: {currentCompany.rut}</span>
                  {currentCompany.slogan && <span className="ml-4 italic">"{currentCompany.slogan}"</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge 
                variant="outline"
                style={{ borderColor: currentCompany.primaryColor, color: currentCompany.primaryColor }}
              >
                Empresa
              </Badge>
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
            <Card key={index} className="hover-scale" style={{ backgroundColor: currentCompany.cardColor }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4" style={{ color: currentCompany.primaryColor }} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ color: currentCompany.primaryColor }}>{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Store URL */}
        <Card className="mb-8" style={{ backgroundColor: currentCompany.cardColor }}>
          <CardHeader>
            <CardTitle style={{ color: currentCompany.primaryColor }}>URL de tu Tienda</CardTitle>
            <CardDescription>Comparte este enlace con tus clientes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Input value={getStoreUrl()} readOnly className="flex-1" />
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText(getStoreUrl());
                  toast({ title: "Copiado", description: "URL copiada al portapapeles" });
                }}
                style={{ backgroundColor: currentCompany.buttonColor }}
              >
                Copiar
              </Button>
              <Button variant="outline" onClick={() => window.open(getStoreUrl(), '_blank')}>
                Ver Tienda
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="upload">Cargar Excel</TabsTrigger>
            <TabsTrigger value="profile">Mi Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <Card style={{ backgroundColor: currentCompany.cardColor }}>
              <CardHeader>
                <CardTitle style={{ color: currentCompany.primaryColor }}>Gestión de Productos</CardTitle>
                <CardDescription>
                  Administra tu catálogo de productos
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search Filter */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar productos por nombre..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <FileImage className="w-8 h-8 text-gray-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{product.name}</h4>
                            <p className="text-sm text-gray-600">${product.price.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Stock: {product.stock} unidades</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">Editar</Button>
                          <Button size="sm" variant="outline">Eliminar</Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No se encontraron productos que coincidan con tu búsqueda</p>
                      <p className="text-sm text-gray-500">Intenta con otro término de búsqueda</p>
                    </div>
                  )}
                </div>
                <Button 
                  className="w-full mt-4"
                  style={{ backgroundColor: currentCompany.buttonColor }}
                >
                  Agregar Producto Manual
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card style={{ backgroundColor: currentCompany.cardColor }}>
              <CardHeader>
                <CardTitle style={{ color: currentCompany.primaryColor }}>Gestión de Pedidos</CardTitle>
                <CardDescription>
                  Revisa y gestiona los pedidos de tus clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">Pedido #{order.id}</h4>
                        <p className="text-sm text-gray-600">Cliente: {order.customer}</p>
                        <p className="text-xs text-gray-500">{order.items} productos - ${order.total.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Fecha: {order.date}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={order.status === 'completed' ? 'default' : order.status === 'processing' ? 'secondary' : 'outline'}
                          style={{
                            backgroundColor: order.status === 'completed' ? '#22c55e' : 
                                           order.status === 'processing' ? currentCompany.secondaryColor : 'transparent',
                            color: order.status === 'outline' ? currentCompany.primaryColor : 'white'
                          }}
                        >
                          {order.status === 'completed' ? 'Completado' :
                           order.status === 'processing' ? 'Procesando' : 'Pendiente'}
                        </Badge>
                        <Button size="sm" variant="outline">Ver Detalle</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload">
            <Card style={{ backgroundColor: currentCompany.cardColor }}>
              <CardHeader>
                <CardTitle style={{ color: currentCompany.primaryColor }}>Cargar Productos desde Excel</CardTitle>
                <CardDescription>
                  Sube un archivo Excel con tus productos, precios y stock
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="excel-file">Archivo Excel</Label>
                      <p className="text-xs text-gray-500 mt-1">
                        Formato: Nombre, Precio, Stock, Descripción, Clasificación
                      </p>
                    </div>
                    <Button 
                      onClick={handleDownloadSample}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Descargar Muestra
                    </Button>
                  </div>
                  
                  <div>
                    <Input
                      id="excel-file"
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileUpload}
                      className="cursor-pointer"
                    />
                  </div>
                  
                  <div className="p-4 rounded-lg" style={{ backgroundColor: `${currentCompany.primaryColor}20` }}>
                    <h4 className="font-medium mb-2" style={{ color: currentCompany.primaryColor }}>Formato del Excel:</h4>
                    <ul className="text-sm space-y-1" style={{ color: currentCompany.primaryColor }}>
                      <li>• Columna A: Nombre del producto</li>
                      <li>• Columna B: Precio unitario</li>
                      <li>• Columna C: Stock disponible</li>
                      <li>• Columna D: Descripción (opcional)</li>
                      <li>• Columna E: Clasificación (categoria)</li>
                    </ul>
                  </div>
                  
                  <Button 
                    className="w-full"
                    style={{ backgroundColor: currentCompany.buttonColor }}
                  >
                    Procesar Archivo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card style={{ backgroundColor: currentCompany.cardColor }}>
              <CardHeader>
                <CardTitle style={{ color: currentCompany.primaryColor }}>Perfil de la Empresa</CardTitle>
                <CardDescription>
                  Visualiza y personaliza la información de tu empresa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="company-name">Nombre Fantasía</Label>
                        <Input id="company-name" value={currentCompany.name} readOnly />
                      </div>
                      <div>
                        <Label htmlFor="company-rut">RUT</Label>
                        <Input id="company-rut" value={currentCompany.rut} readOnly />
                      </div>
                      <div>
                        <Label htmlFor="company-slogan">Slogan</Label>
                        <Input id="company-slogan" value={currentCompany.slogan || ''} placeholder="No configurado" readOnly />
                      </div>
                      <div>
                        <Label htmlFor="company-username">Usuario</Label>
                        <Input id="company-username" value={currentCompany.username} readOnly />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Logo de la Empresa</Label>
                        <div className="mt-2 p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
                          {currentCompany.logoPreview ? (
                            <img 
                              src={currentCompany.logoPreview} 
                              alt={currentCompany.name} 
                              className="max-h-20 max-w-full object-contain mx-auto mb-2"
                            />
                          ) : (
                            <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          )}
                          <p className="text-sm text-gray-600">Logo actual de la empresa</p>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Colores del Carrito</Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <div className="text-center">
                            <div 
                              className="w-full h-8 rounded border mb-1"
                              style={{ backgroundColor: currentCompany.primaryColor }}
                            ></div>
                            <span className="text-xs text-gray-500">Primario</span>
                          </div>
                          <div className="text-center">
                            <div 
                              className="w-full h-8 rounded border mb-1"
                              style={{ backgroundColor: currentCompany.secondaryColor }}
                            ></div>
                            <span className="text-xs text-gray-500">Secundario</span>
                          </div>
                          <div className="text-center">
                            <div 
                              className="w-full h-8 rounded border mb-1"
                              style={{ backgroundColor: currentCompany.buttonColor }}
                            ></div>
                            <span className="text-xs text-gray-500">Botones</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="consult-email">Email para Consultas</Label>
                      <Input id="consult-email" value={currentCompany.consultEmail || ''} placeholder="No configurado" readOnly />
                    </div>
                    <div>
                      <Label htmlFor="sales-email">Email para Notificaciones de Ventas</Label>
                      <Input id="sales-email" value={currentCompany.salesEmail || ''} placeholder="No configurado" readOnly />
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: `${currentCompany.primaryColor}10` }}>
                    <p className="text-sm text-gray-600">
                      <strong>Nota:</strong> Para modificar estos datos, contacta al administrador del sistema.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
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

export default CompanyDashboard;
