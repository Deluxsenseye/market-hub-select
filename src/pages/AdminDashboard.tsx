
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import StatsCards from "@/components/admin/StatsCards";
import UserForm from "@/components/admin/UserForm";
import UserTable from "@/components/admin/UserTable";

const AdminDashboard = () => {
  const [companies, setCompanies] = useState([
    { id: 1, name: "TechCorp SA", rut: "12.345.678-9", username: "techcorp_user", status: "active" },
    { id: 2, name: "InnovaShop", rut: "98.765.432-1", username: "innovashop_user", status: "active" },
    { id: 3, name: "MegaSupplies", rut: "11.223.344-5", username: "megasupplies_user", status: "pending" },
  ]);

  const [editingCompany, setEditingCompany] = useState(null);
  const navigate = useNavigate();

  const handleEditCompany = (company) => {
    setEditingCompany({...company});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text">Panel de Administración</h1>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Administrador Maestro</Badge>
              <Button variant="outline" onClick={() => navigate('/')}>
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <StatsCards companies={companies} />

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Create/Edit User */}
          <UserForm 
            companies={companies}
            setCompanies={setCompanies}
            editingCompany={editingCompany}
            setEditingCompany={setEditingCompany}
          />

          {/* Users Table */}
          <UserTable 
            companies={companies}
            setCompanies={setCompanies}
            onEditCompany={handleEditCompany}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
