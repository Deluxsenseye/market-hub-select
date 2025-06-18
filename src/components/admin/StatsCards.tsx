
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus } from "lucide-react";

interface Company {
  id: number;
  name: string;
  rut: string;
  username: string;
  status: string;
}

interface StatsCardsProps {
  companies: Company[];
}

const StatsCards = ({ companies }: StatsCardsProps) => {
  const stats = [
    { title: "Usuarios Activos", value: companies.filter(c => c.status === 'active').length, icon: Users },
    { title: "Usuarios Inactivos", value: companies.filter(c => c.status === 'inactive').length, icon: Users },
    { title: "Total Usuarios", value: companies.length, icon: UserPlus },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
