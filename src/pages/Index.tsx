
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Car, 
  Wrench, 
  BarChart, 
  Package, 
  DollarSign 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardMetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  variant = 'default' 
}: { 
  title: string, 
  value: string, 
  icon: React.ElementType,
  variant?: 'default' | 'secondary' | 'destructive'
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Car Wash Management Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardMetricCard 
          title="Total Services Today" 
          value="24" 
          icon={Car} 
        />
        <DashboardMetricCard 
          title="Total Revenue" 
          value="$1,245" 
          icon={DollarSign} 
          variant="secondary" 
        />
        <DashboardMetricCard 
          title="Inventory Status" 
          value="87%" 
          icon={Package} 
        />
        <DashboardMetricCard 
          title="Pending Services" 
          value="6" 
          icon={Wrench} 
          variant="destructive" 
        />
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link to="/services" className="w-full">
              <Button variant="outline" className="w-full">
                <Car className="mr-2 h-4 w-4" /> Manage Services
              </Button>
            </Link>
            <Link to="/inventory" className="w-full">
              <Button variant="outline" className="w-full">
                <Package className="mr-2 h-4 w-4" /> Inventory Management
              </Button>
            </Link>
            <Link to="/price-history" className="w-full">
              <Button variant="outline" className="w-full">
                <BarChart className="mr-2 h-4 w-4" /> Price History
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Services</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Placeholder for recent services list */}
            <div className="space-y-2">
              <div className="flex justify-between border-b pb-2">
                <span>Full Car Wash - Sedan</span>
                <span className="text-muted-foreground">09:30 AM</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Oil Change - SUV</span>
                <span className="text-muted-foreground">10:15 AM</span>
              </div>
              <div className="flex justify-between">
                <span>Interior Detailing</span>
                <span className="text-muted-foreground">11:00 AM</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
