
import { useState } from "react";
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
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (username === "ADM" && password === "ADM123") {
        toast({
          title: "Acceso concedido",
          description: "Bienvenido al panel de administración",
        });
        navigate("/admin");
      } else if (username.length > 0 && password.length > 3) {
        toast({
          title: "Acceso concedido",
          description: "Bienvenido a tu carrito de compras",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Error de acceso",
          description: "Credenciales incorrectas",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-effect">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ShoppingCart className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">Carrito de compras ATG Informática</h1>
          </div>
          <CardTitle className="text-white">Iniciar Sesión</CardTitle>
          <CardDescription className="text-gray-200">
            Accede a tu carrito de compras
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="nombre_usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-white/90 border-white/20 text-black placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/90 border-white/20 text-black placeholder:text-gray-500"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-white/10 rounded-lg">
            <p className="text-sm text-gray-200 mb-2">Demo de acceso:</p>
            <p className="text-xs text-gray-300">Admin: ADM / ADM123</p>
            <p className="text-xs text-gray-300">Empresa: cualquier_usuario / password</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
