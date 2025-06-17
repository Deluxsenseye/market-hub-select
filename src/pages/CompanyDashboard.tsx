
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileImage, ShoppingCart, Users, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CompanyDashboard = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "Laptop HP ProBook", price: 850000, stock: 15, image: null },
    { id: 2, name: "Monitor Samsung 24''", price: 180000, stock: 8, image: null },
    { id: 3, name: "Teclado Mecánico RGB", price: 45000, stock: 25, image: null },
  ]);

  const [orders, setOrders] = useState([
    { id: 1, customer: "Juan Pérez", items: 3, total: 275000, status: "pending", date: "2024-01-15" },
    { id: 2, customer: "María González", items: 1, total: 850000, status: "completed", date: "2024-01-14" },
    { id: 3, customer: "Carlos López", items: 2, total: 225000, status: "processing", date: "2024-01-13" },
  ]);

  const navigate = useNavigate();
  const { toast } = useToast();
  
  const companyData = {
    name: "TechCorp SA",
    rut: "12.345.678-9",
    storeUrl: "https://marketplace.com/store/techcorp"
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "Archivo subido",
        description: `${file.name} se ha procesado correctamente`,
      });
    }
  };

  const stats = [
    { title: "Productos Activos", value: products.length, icon: FileImage },
    { title: "Pedidos Pendientes", value: orders.filter(o => o.status === 'pending').length, icon: ShoppingCart },
    { title: "Clientes Únicos", value: new Set(orders.map(o => o.customer)).size, icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold gradient-text">{companyData.name}</h1>
              <p className="text-sm text-gray-600">RUT: {companyData.rut}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">Empresa</Badge>
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

        {/* Store URL */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>URL de tu Tienda</CardTitle>
            <CardDescription>Comparte este enlace con tus clientes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Input value={companyData.storeUrl} readOnly className="flex-1" />
              <Button onClick={() => {
                navigator.clipboard.writeText(companyData.storeUrl);
                toast({ title: "Copiado", description: "URL copiada al portapapeles" });
              }}>
                Copiar
              </Button>
              <Button variant="outline" onClick={() => window.open(companyData.storeUrl, '_blank')}>
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
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Productos</CardTitle>
                <CardDescription>
                  Administra tu catálogo de productos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
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
                  ))}
                </div>
                <Button className="w-full mt-4">Agregar Producto Manual</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Pedidos</CardTitle>
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
                        <Badge variant={
                          order.status === 'completed' ? 'default' : 
                          order.status === 'processing' ? 'secondary' : 'outline'
                        }>
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
            <Card>
              <CardHeader>
                <CardTitle>Cargar Productos desde Excel</CardTitle>
                <CardDescription>
                  Sube un archivo Excel con tus productos, precios y stock
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="excel-file">Archivo Excel</Label>
                    <div className="mt-2">
                      <Input
                        id="excel-file"
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileUpload}
                        className="cursor-pointer"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Formato esperado: Columnas A=Nombre, B=Precio, C=Stock, D=Descripción
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Formato del Excel:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Columna A: Nombre del producto</li>
                      <li>• Columna B: Precio unitario</li>
                      <li>• Columna C: Stock disponible</li>
                      <li>• Columna D: Descripción (opcional)</li>
                    </ul>
                  </div>
                  
                  <Button className="w-full">Procesar Archivo</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Perfil de la Empresa</CardTitle>
                <CardDescription>
                  Personaliza la información y branding de tu empresa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="company-name">Nombre Fantasía</Label>
                        <Input id="company-name" value={companyData.name} />
                      </div>
                      <div>
                        <Label htmlFor="company-rut">RUT</Label>
                        <Input id="company-rut" value={companyData.rut} />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="company-logo">Logo de la Empresa</Label>
                      <div className="mt-2 p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
                        <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Haz clic para cargar tu logo</p>
                        <p className="text-xs text-gray-500">PNG, JPG hasta 5MB</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button>Guardar Cambios</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CompanyDashboard;
