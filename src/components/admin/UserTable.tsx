
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Company {
  id: number;
  name: string;
  rut: string;
  username: string;
  status: string;
}

interface UserTableProps {
  companies: Company[];
  setCompanies: (companies: Company[]) => void;
  onEditCompany: (company: Company) => void;
}

const UserTable = ({ companies, setCompanies, onEditCompany }: UserTableProps) => {
  const { toast } = useToast();

  const handleToggleStatus = (id: number) => {
    setCompanies(companies.map(company => 
      company.id === id 
        ? { ...company, status: company.status === 'active' ? 'inactive' : 'active' }
        : company
    ));
    toast({
      title: "Estado actualizado",
      description: "El estado del usuario ha sido modificado",
    });
  };

  const handleDeleteCompany = (id: number) => {
    setCompanies(companies.filter(company => company.id !== id));
    toast({
      title: "Usuario eliminado",
      description: "El usuario ha sido eliminado del sistema",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuarios Registrados</CardTitle>
        <CardDescription>
          Gestiona todos los usuarios del sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{company.name}</p>
                    <p className="text-xs text-gray-500">{company.rut}</p>
                  </div>
                </TableCell>
                <TableCell>{company.username}</TableCell>
                <TableCell>
                  <Badge 
                    variant={company.status === 'active' ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => handleToggleStatus(company.id)}
                  >
                    {company.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditCompany(company)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteCompany(company.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserTable;
