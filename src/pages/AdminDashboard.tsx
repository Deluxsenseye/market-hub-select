
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, Palette, BarChart3 } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminUserManagement from "@/components/admin/AdminUserManagement";
import CompanyManagement from "@/components/admin/CompanyManagement";
import SystemConfiguration from "@/components/admin/SystemConfiguration";
import ERPConfiguration from "@/components/admin/ERPConfiguration";
import ReportsSection from "@/components/admin/ReportsSection";
import AdminFooter from "@/components/admin/AdminFooter";

const AdminDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [adminUsers, setAdminUsers] = useState([
    { id: 1, username: "ADM", password: "ADM123" }
  ]);

  const [adminConfig, setAdminConfig] = useState({
    primaryColor: "#8b5cf6",
    secondaryColor: "#3b82f6",
    backgroundColor: "#f8fafc",
    logoPreview: null,
    mainLogoPreview: null
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyAdminColors(adminConfig);
  }, [adminConfig]);

  const loadData = () => {
    const savedCompanies = localStorage.getItem('companies');
    const savedAdminConfig = localStorage.getItem('adminConfig');
    const savedAdminUsers = localStorage.getItem('adminUsers');
    
    console.log('Loading admin data:', { savedCompanies, savedAdminConfig, savedAdminUsers });
    
    if (savedCompanies) {
      const companiesData = JSON.parse(savedCompanies);
      setCompanies(companiesData);
      console.log('Loaded companies in admin:', companiesData);
    }
    if (savedAdminConfig) {
      const config = JSON.parse(savedAdminConfig);
      setAdminConfig(config);
      console.log('Loaded admin config in admin:', config);
    }
    if (savedAdminUsers) {
      const adminUsersData = JSON.parse(savedAdminUsers);
      setAdminUsers(adminUsersData);
      console.log('Loaded admin users in admin:', adminUsersData);
    }
  };

  const applyAdminColors = (config) => {
    document.documentElement.style.setProperty('--primary', config.primaryColor);
    document.documentElement.style.setProperty('--secondary', config.secondaryColor);
    document.documentElement.style.setProperty('--background', config.backgroundColor);
  };

  const saveToLocalStorage = (companiesData, adminData, adminUsersData = null) => {
    console.log('Saving to localStorage:', { companiesData, adminData, adminUsersData });
    localStorage.setItem('companies', JSON.stringify(companiesData));
    localStorage.setItem('adminConfig', JSON.stringify(adminData));
    if (adminUsersData !== null) {
      localStorage.setItem('adminUsers', JSON.stringify(adminUsersData));
      console.log('Admin users saved:', adminUsersData);
    }
  };

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: `linear-gradient(135deg, ${adminConfig.backgroundColor} 0%, ${adminConfig.primaryColor}20 50%, ${adminConfig.secondaryColor}20 100%)`
      }}
    >
      <AdminHeader adminConfig={adminConfig} />

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="admin-config" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="admin-config">
              <Settings className="w-4 h-4 mr-2" />
              Administrar ADM
            </TabsTrigger>
            <TabsTrigger value="companies">
              <Users className="w-4 h-4 mr-2" />
              Usuarios Empresas
            </TabsTrigger>
            <TabsTrigger value="panel-config">
              <Palette className="w-4 h-4 mr-2" />
              Configurar Panel
            </TabsTrigger>
            <TabsTrigger value="erp-config">
              <Settings className="w-4 h-4 mr-2" />
              Configuración ERP
            </TabsTrigger>
            <TabsTrigger value="reports">
              <BarChart3 className="w-4 h-4 mr-2" />
              Informes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="admin-config">
            <AdminUserManagement
              adminUsers={adminUsers}
              setAdminUsers={setAdminUsers}
              onSave={saveToLocalStorage}
              companies={companies}
              adminConfig={adminConfig}
            />
          </TabsContent>

          <TabsContent value="companies">
            <CompanyManagement
              companies={companies}
              setCompanies={setCompanies}
              onSave={saveToLocalStorage}
              adminConfig={adminConfig}
              adminUsers={adminUsers}
            />
          </TabsContent>

          <TabsContent value="panel-config">
            <SystemConfiguration
              adminConfig={adminConfig}
              setAdminConfig={setAdminConfig}
              onSave={saveToLocalStorage}
              companies={companies}
              adminUsers={adminUsers}
            />
          </TabsContent>

          <TabsContent value="erp-config">
            <ERPConfiguration
              companies={companies}
              setCompanies={setCompanies}
              onSave={saveToLocalStorage}
              adminConfig={adminConfig}
              adminUsers={adminUsers}
            />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsSection companies={companies} />
          </TabsContent>
        </Tabs>
      </div>

      <AdminFooter adminConfig={adminConfig} />
    </div>
  );
};

export default AdminDashboard;
