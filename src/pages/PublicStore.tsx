
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, FileImage, User } from "lucide-react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const PublicStore = () => {
  const { companyId } = useParams();
  const { toast } = useToast();
  
  const [cart, setCart] = useState<{id: number, quantity: number}[]>([]);
  
  // Datos simulados de la empresa - en producción vendrían de Supabase
  const companyData = {
    name: "TechCorp SA",
    logo: null,
    description: "Especialistas en tecnología empresarial"
  };
  
  const products = [
    { id: 1, name: "Laptop HP ProBook 450", price: 850000, stock: 15, image: null, description: "Laptop empresarial de alto rendimiento" },
    { id: 2, name: "Monitor Samsung 24'' Full HD", price: 180000, stock: 8, image: null, description: "Monitor profesional para oficina" },
    { id: 3, name: "Teclado Mecánico RGB", price: 45000, stock: 25, image: null, description: "Teclado gaming con retroiluminación" },
    { id: 4, name: "Mouse Inalámbrico Logitech", price: 25000, stock: 30, image: null, description: "Mouse ergonómico inalámbrico" },
    { id: 5, name: "Webcam HD 1080p", price: 65000, stock: 12, image: null, description: "Cámara web para videoconferencias" },
    { id: 6, name: "Auriculares Noise Cancelling", price: 120000, stock: 6, image: null, description: "Auriculares con cancelación de ruido" },
  ];

  const addToCart = (productId: number) => {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { id: productId, quantity: 1 }]);
    }
    
    toast({
      title: "Producto agregado",
      description: "El producto se ha añadido a tu carrito",
    });
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const product = products.find(p => p.id === item.id);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">{companyData.name}</h1>
                <p className="text-sm text-gray-600">{companyData.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="relative">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Carrito
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 px-2 py-1 text-xs">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Store Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Bienvenido a nuestra tienda</CardTitle>
            <CardDescription>
              Explora nuestro catálogo de productos y realiza tu pedido fácilmente
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {products.map((product) => (
            <Card key={product.id} className="hover-scale overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <FileImage className="w-16 h-16 text-gray-400" />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold text-primary">${product.price.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Stock: {product.stock} unidades</p>
                  </div>
                  <Badge variant={product.stock > 10 ? "default" : "secondary"}>
                    {product.stock > 10 ? "Disponible" : "Pocas unidades"}
                  </Badge>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => addToCart(product.id)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? "Sin Stock" : "Agregar al Carrito"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cart Summary */}
        {getTotalItems() > 0 && (
          <Card className="fixed bottom-4 right-4 w-80 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Resumen del Carrito</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Productos:</span>
                  <span>{getTotalItems()} items</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${getTotalPrice().toLocaleString()}</span>
                </div>
              </div>
              <Button className="w-full">
                Proceder al Pago
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>¿Necesitas ayuda?</CardTitle>
            <CardDescription>
              Contáctanos para consultas o pedidos especiales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Input placeholder="Tu nombre" />
              <Input placeholder="Tu email" />
              <Input placeholder="Teléfono" className="md:col-span-2" />
              <Input placeholder="Mensaje" className="md:col-span-2" />
              <Button className="md:col-span-2">Enviar Mensaje</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-white/20 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ShoppingCart className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold gradient-text">Powered by B2B Marketplace</span>
          </div>
          <p className="text-gray-600 text-sm">
            Tienda creada con nuestra plataforma de comercio B2B
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicStore;
