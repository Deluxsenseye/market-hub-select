
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Search, Plus, Minus, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PublicStore = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [adminConfig, setAdminConfig] = useState({ logoPreview: null });
  const [products] = useState([
    { id: 1, name: "Laptop HP ProBook", price: 850000, stock: 15, category: "Computación" },
    { id: 2, name: "Monitor Samsung 24''", price: 180000, stock: 8, category: "Monitores" },
    { id: 3, name: "Teclado Mecánico RGB", price: 45000, stock: 25, category: "Accesorios" },
    { id: 4, name: "Mouse Logitech Inalámbrico", price: 35000, stock: 12, category: "Accesorios" },
  ]);
  
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isCartMinimized, setIsCartMinimized] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    // Cargar empresa específica y configuración admin
    const savedCompanies = localStorage.getItem('companies');
    const savedAdminConfig = localStorage.getItem('adminConfig');
    
    if (savedCompanies) {
      const companies = JSON.parse(savedCompanies);
      const foundCompany = companies.find(c => c.id.toString() === companyId);
      
      if (foundCompany && foundCompany.cartEnabled && foundCompany.status === 'active') {
        setCompany(foundCompany);
        // Aplicar colores de la empresa
        document.documentElement.style.setProperty('--primary', foundCompany.primaryColor);
        document.documentElement.style.setProperty('--secondary', foundCompany.secondaryColor);
      }
    }
    
    if (savedAdminConfig) {
      setAdminConfig(JSON.parse(savedAdminConfig));
    }
  }, [companyId]);

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Carrito no disponible</h2>
            <p className="text-gray-600">
              Esta tienda no está disponible o ha sido deshabilitada.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categories = ["Todos", ...new Set(products.map(p => p.category))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    toast({
      title: "Producto agregado",
      description: `${product.name} agregado al carrito`,
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.id !== productId));
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: `linear-gradient(135deg, ${company.backgroundColor} 0%, ${company.primaryColor}20 50%, ${company.secondaryColor}20 100%)`
      }}
    >
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {company.logoPreview ? (
                <img 
                  src={company.logoPreview} 
                  alt={company.name} 
                  className="max-h-12"
                />
              ) : (
                <ShoppingCart className="w-8 h-8" style={{ color: company.primaryColor }} />
              )}
              <div>
                <h1 className="text-xl md:text-2xl font-bold" style={{ color: company.primaryColor }}>
                  {company.name}
                </h1>
                {company.slogan && (
                  <p className="text-sm text-gray-600 italic">"{company.slogan}"</p>
                )}
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => setIsCartMinimized(!isCartMinimized)}
              className="relative"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Carrito ({cartItemsCount})
              {cartItemsCount > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 px-1 min-w-5 h-5"
                  style={{ backgroundColor: company.buttonColor }}
                >
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Categories and Search */}
          <div className="lg:col-span-1">
            <Card style={{ backgroundColor: company.cardColor }}>
              <CardHeader>
                <CardTitle style={{ color: company.primaryColor }}>Buscar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div>
                  <h4 className="font-medium mb-2" style={{ color: company.primaryColor }}>Categorías</h4>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="w-full justify-start"
                        style={selectedCategory === category ? { backgroundColor: company.primaryColor } : {}}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="hover-scale"
                  style={{ backgroundColor: company.cardColor }}
                >
                  <CardHeader>
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                      <Package className="w-12 h-12 text-gray-400" />
                    </div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription>Stock: {product.stock} unidades</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold" style={{ color: company.primaryColor }}>
                        ${product.price.toLocaleString()}
                      </span>
                      <Badge variant="secondary">{product.category}</Badge>
                    </div>
                    
                    {cart.find(item => item.id === product.id) ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateQuantity(product.id, cart.find(item => item.id === product.id).quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-medium">
                            {cart.find(item => item.id === product.id)?.quantity || 0}
                          </span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateQuantity(product.id, cart.find(item => item.id === product.id).quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button 
                          size="sm"
                          style={{ backgroundColor: company.buttonColor }}
                        >
                          En Carrito
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => addToCart(product)}
                        className="w-full"
                        style={{ backgroundColor: company.buttonColor }}
                      >
                        Agregar al Carrito
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${isCartMinimized ? 'w-16 h-16' : 'w-80'}`}>
            <Card style={{ backgroundColor: company.cardColor }} className="shadow-lg">
              {isCartMinimized ? (
                <CardContent className="p-4 text-center">
                  <Button
                    onClick={() => setIsCartMinimized(false)}
                    className="w-full h-full"
                    style={{ backgroundColor: company.primaryColor }}
                  >
                    <ShoppingCart className="w-6 h-6" />
                  </Button>
                </CardContent>
              ) : (
                <>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle style={{ color: company.primaryColor }}>Resumen de Compra</CardTitle>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setIsCartMinimized(true)}
                      >
                        −
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <span>{item.name}</span>
                          <span>{item.quantity} x ${item.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center font-bold">
                        <span>Total:</span>
                        <span style={{ color: company.primaryColor }}>
                          ${cartTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-4"
                      style={{ backgroundColor: company.buttonColor }}
                    >
                      Proceder al Pago
                    </Button>
                  </CardContent>
                </>
              )}
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-white/20 py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            {adminConfig.logoPreview ? (
              <img src={adminConfig.logoPreview} alt="ATG Informática" className="max-h-6" />
            ) : (
              <ShoppingCart className="w-5 h-5 text-gray-400" />
            )}
            <span className="text-sm font-medium text-gray-600">ATG Informática</span>
          </div>
          <p className="text-xs text-gray-500">Especialistas en tecnología empresarial</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicStore;
