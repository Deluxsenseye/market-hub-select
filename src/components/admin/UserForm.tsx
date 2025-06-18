
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Company {
  id: number;
  name: string;
  rut: string;
  username: string;
  status: string;
  password?: string;
}

interface UserFormProps {
  companies: Company[];
  setCompanies: (companies: Company[]) => void;
  editingCompany: Company | null;
  setEditingCompany: (company: Company | null) => void;
}

const UserForm = ({ companies, setCompanies, editingCompany, setEditingCompany }: UserFormProps) => {
  const [newCompany, setNewCompany] = useState({
    name: "",
    rut: "",
    username: "",
    password: ""
  });

  const { toast } = useToast();

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userExists = companies.some(company => company.username === newCompany.username);
    if (userExists) {
      toast({
        title: "Error",
        description: "El nombre de usuario ya existe",
        variant: "destructive",
      });
      return;
    }

    const company = {
      id: companies.length + 1,
      ...newCompany,
      status: "active"
    };
    setCompanies([...companies, company]);
    setNewCompany({ name: "", rut: "", username: "", password: "" });
    toast({
      title: "Usuario creado",
      description: `${newCompany.name} con usuario "${newCompany.username}" ha sido registrado exitosamente`,
    });
  };

  const handleUpdateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCompany) return;
    
    setCompanies(companies.map(company => 
      company.id === editingCompany.id ? editingCompany : company
    ));
    setEditingCompany(null);
    toast({
      title: "Usuario actualizado",
      description: "Los datos del usuario han sido actualizados exitosamente",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingCompany ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</CardTitle>
        <CardDescription>
          {editingCompany ? 'Modifica los datos del usuario' : 'Registra una nueva empresa y crea sus credenciales de acceso'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={editingCompany ? handleUpdateCompany : handleCreateCompany} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre Fantasía</Label>
            <Input
              id="name"
              value={editingCompany ? editingCompany.name : newCompany.name}
              onChange={(e) => editingCompany 
                ? setEditingCompany({...editingCompany, name: e.target.value})
                : setNewCompany({...newCompany, name: e.target.value})
              }
              placeholder="Ej: TechCorp SA"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rut">RUT</Label>
            <Input
              id="rut"
              value={editingCompany ? editingCompany.rut : newCompany.rut}
              onChange={(e) => editingCompany 
                ? setEditingCompany({...editingCompany, rut: e.target.value})
                : setNewCompany({...newCompany, rut: e.target.value})
              }
              placeholder="12.345.678-9"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Nombre de Usuario</Label>
            <Input
              id="username"
              value={editingCompany ? editingCompany.username : newCompany.username}
              onChange={(e) => editingCompany 
                ? setEditingCompany({...editingCompany, username: e.target.value})
                : setNewCompany({...newCompany, username: e.target.value})
              }
              placeholder="techcorp_user"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={editingCompany ? editingCompany.password || '' : newCompany.password}
              onChange={(e) => editingCompany 
                ? setEditingCompany({...editingCompany, password: e.target.value})
                : setNewCompany({...newCompany, password: e.target.value})
              }
              placeholder="••••••••"
              required={!editingCompany}
            />
          </div>
          <div className="flex space-x-2">
            <Button type="submit" className="flex-1">
              {editingCompany ? 'Actualizar Usuario' : 'Crear Usuario'}
            </Button>
            {editingCompany && (
              <Button type="button" variant="outline" onClick={() => setEditingCompany(null)}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserForm;
