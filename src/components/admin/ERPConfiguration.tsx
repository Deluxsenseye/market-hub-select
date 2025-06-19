
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Company {
  id: number;
  name: string;
  logoPreview: string | null;
  erpImportEndpoint?: string;
  erpExportEndpoint?: string;
  erpApiKey?: string;
}

interface ERPConfigurationProps {
  companies: Company[];
  setCompanies: (companies: Company[]) => void;
  onSave: (companies: Company[], adminConfig: any, adminUsers: any[]) => void;
  adminConfig: any;
  adminUsers: any[];
}

const ERPConfiguration = ({ 
  companies, 
  setCompanies, 
  onSave, 
  adminConfig, 
  adminUsers 
}: ERPConfigurationProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración PSIG ERP por Empresa</CardTitle>
          <CardDescription>
            Configura los servicios ERP individualmente para cada empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {companies.map((company) => (
              <div key={company.id} className="p-4 border rounded-lg space-y-4 bg-white">
                <div className="flex items-center space-x-2">
                  {company.logoPreview && (
                    <img src={company.logoPreview} alt={company.name} className="w-6 h-6 object-contain" />
                  )}
                  <h4 className="font-semibold text-lg">{company.name}</h4>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Endpoint ERP para Importar Productos</Label>
                    <Input 
                      placeholder="https://api-erp.com/productos"
                      value={company.erpImportEndpoint || ''}
                      onChange={(e) => {
                        const updatedCompanies = companies.map(c => 
                          c.id === company.id ? {...c, erpImportEndpoint: e.target.value} : c
                        );
                        setCompanies(updatedCompanies);
                      }}
                    />
                  </div>
                  <div>
                    <Label>Endpoint ERP para Exportar Ventas</Label>
                    <Input 
                      placeholder="https://api-erp.com/ventas"
                      value={company.erpExportEndpoint || ''}
                      onChange={(e) => {
                        const updatedCompanies = companies.map(c => 
                          c.id === company.id ? {...c, erpExportEndpoint: e.target.value} : c
                        );
                        setCompanies(updatedCompanies);
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Label>API Key ERP</Label>
                  <Input 
                    type="password" 
                    placeholder="••••••••••••"
                    value={company.erpApiKey || ''}
                    onChange={(e) => {
                      const updatedCompanies = companies.map(c => 
                        c.id === company.id ? {...c, erpApiKey: e.target.value} : c
                      );
                      setCompanies(updatedCompanies);
                    }}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button size="sm">Probar Conexión Importar</Button>
                  <Button size="sm" variant="outline">Probar Conexión Exportar</Button>
                  <Button size="sm" variant="outline" onClick={() => onSave(companies, adminConfig, adminUsers)}>
                    Guardar Configuración
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ERPConfiguration;
