
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Users, FileImage, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [adminConfig, setAdminConfig] = useState({
    primaryColor: "#8b5cf6",
    secondaryColor: "#3b82f6",
    backgroundColor: "#f8fafc",
    logoPreview: null
  });

  useEffect(() => {
    // Cargar configuración del admin
    const savedAdminConfig = localStorage.getItem('adminConfig');
    if (savedAdminConfig) {
      const config = JSON.parse(savedAdminConfig);
      setAdminConfig(config);
      // Aplicar colores dinámicos
      document.documentElement.style.setProperty('--primary', config.primaryColor);
      document.documentElement.style.setProperty('--secondary', config.secondaryColor);
    }
  }, []);

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: `linear-gradient(135deg, ${adminConfig.backgroundColor} 0%, ${adminConfig.primaryColor}20 50%, ${adminConfig.secondaryColor}20 100%)`
      }}
    >
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {adminConfig.logoPreview ? (
                <img 
                  src={adminConfig.logoPreview} 
                  alt="ATG Informática" 
                  className="max-h-12"
                />
              ) : (
                <ShoppingCart className="w-8 h-8 text-primary" />
              )}
              <h1 className="text-2xl font-bold gradient-text">Carrito de compras ATG Informática</h1>
            </div>
            <Button onClick={() => navigate('/login')} variant="outline">
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            {adminConfig.logoPreview && (
              <img 
                src={adminConfig.logoPreview} 
                alt="ATG Informática" 
                className="max-h-24 mx-auto mb-6"
              />
            )}
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plataforma de comercio empresarial para gestionar inventarios, procesar pedidos y expandir tu negocio digitalmente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/login')} 
              className="hover-scale text-white"
              style={{ backgroundColor: adminConfig.primaryColor }}
            >
              Acceder a mi Carrito
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="hover-scale"
              style={{ borderColor: adminConfig.primaryColor, color: adminConfig.primaryColor }}
            >
              Ver Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 gradient-text">
            Características Principales
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover-scale border-0 shadow-lg bg-card-gradient">
              <CardHeader>
                <Users className="w-12 h-12 mb-4" style={{ color: adminConfig.primaryColor }} />
                <CardTitle>Multi-Empresa</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Cada empresa tiene su carrito personalizado con acceso exclusivo a sus productos.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover-scale border-0 shadow-lg bg-card-gradient">
              <CardHeader>
                <FileImage className="w-12 h-12 mb-4" style={{ color: adminConfig.primaryColor }} />
                <CardTitle>Carga de Excel</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Importa productos masivamente desde archivos Excel con precios y stock actualizados.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover-scale border-0 shadow-lg bg-card-gradient">
              <CardHeader>
                <ShoppingCart className="w-12 h-12 mb-4" style={{ color: adminConfig.primaryColor }} />
                <CardTitle>Carrito Público</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Cada empresa obtiene una URL única para compartir su carrito con clientes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover-scale border-0 shadow-lg bg-card-gradient">
              <CardHeader>
                <User className="w-12 h-12 mb-4" style={{ color: adminConfig.primaryColor }} />
                <CardTitle>PSIG ERP</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Sincronización automática con sistemas ERP para productos y transacciones.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-white/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            {adminConfig.logoPreview ? (
              <img 
                src={adminConfig.logoPreview} 
                alt="ATG Informática" 
                className="max-h-6"
              />
            ) : (
              <ShoppingCart className="w-6 h-6 text-primary" />
            )}
            <span className="text-lg font-semibold gradient-text">ATG Informática</span>
          </div>
          <p className="text-gray-600">
            Especialistas en tecnología empresarial
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
