
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Users, FileImage, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold gradient-text">B2B Marketplace</h1>
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
          <h2 className="text-5xl font-bold mb-6 gradient-text animate-fade-in">
            Plataforma de Comercio B2B
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Conecta empresas con sus clientes a través de tiendas online personalizadas. 
            Gestiona inventarios, procesa pedidos y expande tu negocio digitalmente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/login')} className="hover-scale">
              Acceder a mi Dashboard
            </Button>
            <Button size="lg" variant="outline" className="hover-scale">
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
                <Users className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Multi-Empresa</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Cada empresa tiene su espacio privado y personalizado con acceso exclusivo a sus datos.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover-scale border-0 shadow-lg bg-card-gradient">
              <CardHeader>
                <FileImage className="w-12 h-12 text-primary mb-4" />
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
                <ShoppingCart className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Tienda Pública</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Cada empresa obtiene una URL única para compartir su catálogo con clientes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover-scale border-0 shadow-lg bg-card-gradient">
              <CardHeader>
                <User className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Branding Personal</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Personaliza tu tienda con logo y colores de tu empresa para una experiencia única.
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
            <ShoppingCart className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold gradient-text">B2B Marketplace</span>
          </div>
          <p className="text-gray-600">
            Desarrollado con ❤️ para conectar empresas y expandir negocios
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
