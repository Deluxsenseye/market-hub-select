
import { ShoppingCart } from "lucide-react";

interface AdminFooterProps {
  adminConfig: {
    logoPreview: string | null;
  };
}

const AdminFooter = ({ adminConfig }: AdminFooterProps) => {
  return (
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
  );
};

export default AdminFooter;
