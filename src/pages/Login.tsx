
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [adminConfig, setAdminConfig] = useState({
    primaryColor: "#8b5cf6",
    secondaryColor: "#3b82f6",
    backgroundColor: "#f8fafc",
    logoPreview: null,
    mainLogoPreview: null
  });
  const [adminUsers, setAdminUsers] = useState([
    { id: 1, username: "ADM", password: "ADM123" }
  ]);
  const [companies, setCompanies] = useState([]);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Cargar configuración del admin desde localStorage
    const savedConfig = localStorage.getItem('adminConfig');
    const savedCompanies = localStorage.getItem('companies');
    const savedAdminUsers = localStorage.getItem('adminUsers');
    
    console.log('Loading saved data:', { savedConfig, savedCompanies, savedAdminUsers });
    
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setAdminConfig(config);
      console.log('Loaded admin config:', config);
    }
    if (savedCompanies) {
      const companiesData = JSON.parse(savedCompanies);
      setCompanies(companiesData);
      console.log('Loaded companies:', companiesData);
    }
    if (savedAdminUsers) {
      const adminUsersData = JSON.parse(savedAdminUsers);
      setAdminUsers(adminUsersData);
      console.log('Loaded admin users:', adminUsersData);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('Attempting login with:', { username, password });
    console.log('Available admin users:', adminUsers);
    console.log('Available companies:', companies);

    setTimeout(() => {
      // Verificar si es administrador
      const isAdmin = adminUsers.some(admin => 
        admin.username === username && admin.password === password
      );
      
      console.log('Is admin?', isAdmin);
      
      if (isAdmin) {
        toast({
          title: "Acceso concedido",
          description: "Bienvenido al panel de administración",
        });
        navigate("/admin");
      } else {
        // Verificar si es usuario empresa
        const company = companies.find(comp => 
          comp.username === username && 
          comp.password === password && 
          comp.status === 'active'
        );
        
        console.log('Found company?', company);
        
        if (company) {
          // Guardar la empresa logueada en localStorage
          localStorage.setItem('currentCompany', JSON.stringify(company));
          toast({
            title: "Acceso concedido",
            description: `Bienvenido ${company.name}`,
          });
          navigate("/dashboard");
        } else {
          toast({
            title: "Error de acceso",
            description: "Credenciales incorrectas o cuenta inactiva",
            variant: "destructive",
          });
        }
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ 
        background: `linear-gradient(135deg, ${adminConfig.primaryColor} 0%, ${adminConfig.secondaryColor} 100%)` 
      }}
    >
      <Card className="w-full max-w-md glass-effect shadow-2xl border-0">
        <CardHeader className="text-center pb-8">
          <div className="flex flex-col items-center justify-center mb-6">
            {adminConfig.logoPreview ? (
              <img 
                src={adminConfig.logoPreview} 
                alt="ATG Informática" 
                className="max-h-16 mb-4"
              />
            ) : (
              <ShoppingCart className="w-12 h-12 text-white mb-4" />
            )}
            <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Carrito de compras ATG Informática
            </h1>
          </div>
          <CardTitle className="text-white text-xl">Iniciar Sesión</CardTitle>
          <CardDescription className="text-gray-200">
            Accede a tu carrito de compras
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white font-medium">Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-white/95 border-white/30 text-black placeholder:text-gray-500 focus:bg-white focus:border-white/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-medium">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/95 border-white/30 text-black placeholder:text-gray-500 focus:bg-white focus:border-white/50 transition-all"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-white text-gray-800 hover:bg-gray-100 font-semibold py-3 transition-all transform hover:scale-105" 
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
          
          <div className="text-center pt-4 border-t border-white/20">
            <div className="flex items-center justify-center space-x-2">
              <ShoppingCart className="w-4 h-4 text-white/60" />
              <span className="text-sm text-white/60">Especialistas en tecnología empresarial</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
