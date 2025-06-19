
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

interface AdminHeaderProps {
  adminConfig: {
    logoPreview: string | null;
    primaryColor: string;
  };
}

const AdminHeader = ({ adminConfig }: AdminHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {adminConfig.logoPreview ? (
              <img 
                src={adminConfig.logoPreview} 
                alt="ATG Informática" 
                className="max-h-8"
              />
            ) : (
              <ShoppingCart className="w-8 h-8" style={{ color: adminConfig.primaryColor }} />
            )}
            <h1 className="text-2xl font-bold" style={{ color: adminConfig.primaryColor }}>
              Panel de Administración - ATG Informática
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Badge 
              variant="secondary" 
              style={{ backgroundColor: adminConfig.primaryColor, color: 'white' }}
            >
              Administrador
            </Badge>
            <Button variant="outline" onClick={() => navigate('/')}>
              Salir
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
