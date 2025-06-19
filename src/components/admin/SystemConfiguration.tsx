
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User } from "lucide-react";

interface SystemConfigurationProps {
  adminConfig: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    logoPreview: string | null;
    mainLogoPreview: string | null;
  };
  setAdminConfig: (config: any) => void;
  onSave: (companies: any[], adminConfig: any, adminUsers: any[]) => void;
  companies: any[];
  adminUsers: any[];
}

const SystemConfiguration = ({ 
  adminConfig, 
  setAdminConfig, 
  onSave, 
  companies, 
  adminUsers 
}: SystemConfigurationProps) => {
  const { toast } = useToast();

  const handleUpdateAdminConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(companies, adminConfig, adminUsers);
    applyAdminColors(adminConfig);
    toast({
      title: "Configuración actualizada",
      description: "Los colores del sistema han sido actualizados",
    });
  };

  const applyAdminColors = (config: any) => {
    document.documentElement.style.setProperty('--primary', config.primaryColor);
    document.documentElement.style.setProperty('--secondary', config.secondaryColor);
    document.documentElement.style.setProperty('--background', config.backgroundColor);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>, logoType: string) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (logoType === 'main') {
          setAdminConfig({...adminConfig, logoPreview: e.target?.result});
        } else if (logoType === 'mainScreen') {
          setAdminConfig({...adminConfig, mainLogoPreview: e.target?.result});
        }
      };
      reader.readAsDataURL(file);
      toast({
        title: "Logo cargado",
        description: "El logo ha sido cargado correctamente",
      });
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración Visual del Sistema</CardTitle>
          <CardDescription>
            Personaliza los colores y apariencia general de la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateAdminConfig} className="space-y-4">
            <div className="space-y-2">
              <Label>Colores del Sistema</Label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs">Color Primario</Label>
                  <Input 
                    type="color" 
                    value={adminConfig.primaryColor}
                    onChange={(e) => setAdminConfig({...adminConfig, primaryColor: e.target.value})}
                    className="h-10"
                  />
                </div>
                <div>
                  <Label className="text-xs">Color Secundario</Label>
                  <Input 
                    type="color" 
                    value={adminConfig.secondaryColor}
                    onChange={(e) => setAdminConfig({...adminConfig, secondaryColor: e.target.value})}
                    className="h-10"
                  />
                </div>
                <div>
                  <Label className="text-xs">Color de Fondo</Label>
                  <Input 
                    type="color" 
                    value={adminConfig.backgroundColor}
                    onChange={(e) => setAdminConfig({...adminConfig, backgroundColor: e.target.value})}
                    className="h-10"
                  />
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Aplicar Cambios de Color
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logos ATG Informática</CardTitle>
          <CardDescription>
            Gestiona los logos del sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Logo Sistema (Headers/Footers)</Label>
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
                {adminConfig.logoPreview ? (
                  <img 
                    src={adminConfig.logoPreview} 
                    alt="Logo ATG Sistema" 
                    className="max-h-16 max-w-full object-contain mx-auto mb-2"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                )}
                <p className="text-xs text-gray-500">Logo para headers y footers</p>
              </div>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleLogoUpload(e, 'main')}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Logo Pantalla Principal</Label>
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
                {adminConfig.mainLogoPreview ? (
                  <img 
                    src={adminConfig.mainLogoPreview} 
                    alt="Logo ATG Pantalla Principal" 
                    className="max-h-20 max-w-full object-contain mx-auto mb-2"
                  />
                ) : (
                  <User className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                )}
                <p className="text-xs text-gray-500">Logo destacado para pantalla principal</p>
              </div>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleLogoUpload(e, 'mainScreen')}
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemConfiguration;
