
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, FileImage, User, Plus, Minus, Search, X, ShoppingBag } from "lucide-react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const PublicStore = () => {
  const { companyId } = useParams();
  const { toast } = useToast();
  
  const [cart, setCart] = useState<{id: number, quantity: number}[]>([]);
  const [companyData, setCompanyData] = useState(null);
  const [adminConfig, setAdminConfig] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isCartMinimized, setIsCartMinimized] = useState(false);
  
  // Simular carga de datos de la empresa específica
  useEffect(() => {
    const savedCompanies = localStorage.getItem('companies');
    const savedAdminConfig = localStorage.getItem('adminConfig');
    
    if (savedCompanies && savedAdminConfig) {
      const companies = JSON.parse(savedCompanies);
      const adminData = JSON.parse(savedAdminConfig);
      setAdminConfig(adminData);
      
      const company = companies.find(c => c.id.toString() === companyId);
      if (company && company.cartEnabled) {
        setCompanyData(company);
        // Aplicar colores dinámicos de la empresa
        document.documentElement.style.setProperty('--company-primary', company.primaryColor);
        document.documentElement.style.setProperty('--company-secondary', company.secondaryColor);
        document.documentElement.style.setProperty('--company-background', company.backgroundColor);
        document.documentElement.style.setProperty('--company-card', company.cardColor);
        document.documentElement.style.setProperty('--company-button', company.buttonColor);
      }
    }
  }, [companyId]);
  
  const products = [
    { id: 1, name: "Laptop HP ProBook 450", price: 850000, stock: 15, image: null, description: "Laptop empresarial de alto rendimiento", category: "Computadoras" },
    { id: 2, name: "Monitor Samsung 24'' Full HD", price: 180000, stock: 8, image: null, description: "Monitor profesional para oficina", category: "Monitores" },
    { id: 3, name: "Teclado Mecánico RGB", price: 45000, stock: 25, image: null, description: "Teclado gaming con retroiluminación", category: "Periféricos" },
    { id: 4, name: "Mouse Inalámbrico Logitech", price: 25000, stock: 30, image: null, description: "Mouse ergonómico inalámbrico", category: "Periféricos" },
    { id: 5, name: "Webcam HD 1080p", price: 65000, stock: 12, image: null, description: "Cámara web para videoconferencias", category: "Accesorios" },
    { id: 6, name: "Auriculares Noise Cancelling", price: 120000, stock: 6, image: null, description: "Auriculares con cancelación de ruido", category: "Audio" },
  ];

  const categories = ["Todos", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.id !== productId));
      return;
    }
    
    const product = products.find(p => p.id === productId);
    if (newQuantity > product.stock) {
      toast({
        title: "Stock insuficiente",
        description: `Solo hay ${product.stock} unidades disponibles`,
        variant: "destructive",
      });
      return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    } else {
      setCart([...cart, { id: productId, quantity: newQuantity }]);
    }
  };

  const addToCart = (productId: number) => {
    const currentQuantity = getCartItemQuantity(productId);
    updateQuantity(productId, currentQuantity + 1);
    toast({
      title: "Producto agregado",
      description: "El producto se agregó al carrito",
    });
  };

  const getCartItemQuantity = (productId: number) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
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

  if (!companyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600">Tienda no disponible</h1>
          <p className="text-gray-500">La tienda que buscas no existe, no está disponible o está deshabilitada.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: `linear-gradient(135deg, ${companyData.backgroundColor} 0%, ${companyData.secondaryColor}20 100%)`
      }}
    >
      {/* Header */}
      <header 
        className="sticky top-0 z-50 border-b backdrop-blur-sm"
        style={{ 
          backgroundColor: `${companyData.primaryColor}15`,
          borderColor: `${companyData.primaryColor}30`
        }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: companyData.primaryColor }}
              >
                {companyData.logoPreview ? (
                  <img 
                    src={companyData.logoPreview} 
                    alt={companyData.name} 
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h1 
                  className="text-2xl font-bold"
                  style={{ color: companyData.primaryColor }}
                >
                  {companyData.name}
                </h1>
                <p className="text-sm text-gray-600">{companyData.slogan}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                className="relative"
                onClick={() => setIsCartMinimized(!isCartMinimized)}
                style={{ 
                  borderColor: companyData.primaryColor,
                  color: companyData.primaryColor
                }}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Carrito
                {getTotalItems() > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 px-2 py-1 text-xs text-white"
                    style={{ backgroundColor: companyData.buttonColor }}
                  >
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Categories and Search */}
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm"
            />
          </div>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                style={selectedCategory === category ? {
                  backgroundColor: companyData.primaryColor,
                  borderColor: companyData.primaryColor
                } : {
                  borderColor: companyData.primaryColor,
                  color: companyData.primaryColor
                }}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredProducts.map((product) => {
            const cartQuantity = getCartItemQuantity(product.id);
            return (
              <Card 
                key={product.id} 
                className="hover-scale overflow-hidden shadow-lg"
                style={{ backgroundColor: companyData.cardColor }}
              >
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Imagen no disponible</p>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <Badge variant="outline" className="text-xs">{product.category}</Badge>
                  </div>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p 
                        className="text-2xl font-bold"
                        style={{ color: companyData.primaryColor }}
                      >
                        ${product.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">Stock: {product.stock} unidades</p>
                    </div>
                    <Badge variant={product.stock > 10 ? "default" : "secondary"}>
                      {product.stock > 10 ? "Disponible" : "Pocas unidades"}
                    </Badge>
                  </div>
                  
                  {/* Quantity Selector */}
                  {cartQuantity > 0 && (
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(product.id, cartQuantity - 1)}
                        disabled={cartQuantity <= 0}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="font-semibold text-lg min-w-[2rem] text-center">
                        {cartQuantity}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(product.id, cartQuantity + 1)}
                        disabled={cartQuantity >= product.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full text-white font-semibold" 
                    onClick={() => addToCart(product.id)}
                    disabled={product.stock === 0 || cartQuantity >= product.stock}
                    style={{ backgroundColor: companyData.buttonColor }}
                  >
                    {product.stock === 0 ? "Sin Stock" : "Agregar al Carrito"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Cart Summary */}
        {getTotalItems() > 0 && (
          <Card 
            className={`fixed bottom-4 right-4 w-80 shadow-2xl transition-all duration-300 ${
              isCartMinimized ? 'h-16' : 'h-auto'
            }`}
            style={{ backgroundColor: companyData.cardColor }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Resumen del Carrito</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCartMinimized(!isCartMinimized)}
                >
                  {isCartMinimized ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                </Button>
              </div>
            </CardHeader>
            {!isCartMinimized && (
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Productos:</span>
                    <span>{getTotalItems()} items</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span style={{ color: companyData.primaryColor }}>
                      ${getTotalPrice().toLocaleString()}
                    </span>
                  </div>
                </div>
                <Button 
                  className="w-full text-white font-semibold"
                  style={{ backgroundColor: companyData.buttonColor }}
                >
                  Proceder al Pago
                </Button>
              </CardContent>
            )}
          </Card>
        )}

        {/* Contact Form */}
        <Card style={{ backgroundColor: companyData.cardColor }}>
          <CardHeader>
            <CardTitle>¿Necesitas ayuda?</CardTitle>
            <CardDescription>
              Contáctanos para consultas o pedidos especiales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Input placeholder="Tu nombre" className="bg-white/80" />
              <Input placeholder="Tu email" className="bg-white/80" />
              <Input placeholder="Teléfono" className="md:col-span-2 bg-white/80"  />
              <Input placeholder="Mensaje" className="md:col-span-2 bg-white/80" />
              <Button 
                className="md:col-span-2 text-white font-semibold"
                style={{ backgroundColor: companyData.buttonColor }}
              >
                Enviar Consulta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer con logo ATG pequeño */}
      <footer 
        className="border-t py-8 mt-16 backdrop-blur-sm"
        style={{ 
          backgroundColor: `${companyData.primaryColor}10`,
          borderColor: `${companyData.primaryColor}20`
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            {adminConfig?.logoPreview ? (
              <img 
                src={adminConfig.logoPreview} 
                alt="ATG Informática" 
                className="max-h-6"
              />
            ) : (
              <ShoppingCart className="w-4 h-4 text-gray-400" />
            )}
            <span className="text-sm font-medium text-gray-500">Powered by ATG Informática</span>
          </div>
          <p className="text-gray-400 text-xs">
            Especialistas en tecnología empresarial
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicStore;
