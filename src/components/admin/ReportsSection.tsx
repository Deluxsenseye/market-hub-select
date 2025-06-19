
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface Company {
  id: number;
  name: string;
  logoPreview: string | null;
}

interface ReportsSectionProps {
  companies: Company[];
}

const ReportsSection = ({ companies }: ReportsSectionProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Informes por Empresa</CardTitle>
              <CardDescription>
                Visualiza estadísticas y exporta información de cada empresa
              </CardDescription>
            </div>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Exportar Resumen General
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {companies.map((company) => (
              <div key={company.id} className="p-4 border rounded-lg bg-white">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    {company.logoPreview && (
                      <img src={company.logoPreview} alt={company.name} className="w-6 h-6 object-contain" />
                    )}
                    <h4 className="font-semibold text-lg">{company.name}</h4>
                  </div>
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Exportar a Excel
                  </Button>
                </div>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Ventas Totales</p>
                    <p className="text-2xl font-bold text-blue-600">$0</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Productos Vendidos</p>
                    <p className="text-2xl font-bold text-green-600">0</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Facturas Emitidas</p>
                    <p className="text-2xl font-bold text-purple-600">0</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-gray-600">Consultas Recibidas</p>
                    <p className="text-2xl font-bold text-orange-600">0</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsSection;
