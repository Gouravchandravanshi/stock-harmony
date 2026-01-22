import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  IndianRupee,
  Plus,
  Receipt,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { productAPI, billAPI } from '@/services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    todaySales: 0,
    todayCashSales: 0,
    todayUdhaarSales: 0,
    pendingUdhaarAmount: 0,
    monthlySalesData: [],
  });
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [pendingBills, setPendingBills] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch products for total and low stock count
      const productsData = await productAPI.getAll();
      const lowStockProds = productsData.filter(p => p.quantity <= p.quantityAlert);
      
      // Fetch bill statistics
      const billStatsData = await billAPI.getStats();
      
      // Fetch pending bills
      const pendingBillsData = await billAPI.getPending();

      // Fetch category sales for pie chart
      const categorySalesData = await billAPI.getCategorySalesReport();

      setStats({
        totalProducts: productsData.length,
        lowStockCount: lowStockProds.length,
        todaySales: billStatsData.todaySales,
        todayCashSales: billStatsData.todayCashSales,
        todayUdhaarSales: billStatsData.todayUdhaarSales,
        pendingUdhaarAmount: billStatsData.pendingUdhaarAmount,
        monthlySalesData: billStatsData.monthlySalesData,
      });
      
      setLowStockProducts(lowStockProds.slice(0, 5));
      // Filter to show ONLY Udhaar bills in pending section
      const udhaarPendingBills = pendingBillsData.filter(bill => bill.paymentMode === 'Udhaar' && bill.status === 'pending');
      setPendingBills(udhaarPendingBills.slice(0, 5));
      
      // Prepare data for pie chart (top 5 products)
      const topProducts = categorySalesData
        .slice(0, 5)
        .map((item, idx) => ({
          name: item.productName,
          value: item.totalSales,
          color: ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'][idx],
        }));
      setCategorySales(topProducts);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="page-header">Dashboard</h1>
            <p className="page-subheader">Welcome back! Here's your store overview.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/products/add">
              <Button>
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </Link>
            <Link to="/billing/new">
              <Button variant="outline-primary">
                <Receipt className="w-4 h-4" />
                Generate Bill
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Products"
            value={stats.totalProducts.toString()}
            icon={Package}
            trend={{ value: 12, positive: true }}
            color="primary"
          />
          <StatCard
            title="Low Stock Items"
            value={stats.lowStockCount.toString()}
            icon={AlertTriangle}
            color="destructive"
            urgent
          />
          <StatCard
            title="Today's Sales"
            value={`₹${stats.todaySales.toLocaleString()}`}
            icon={TrendingUp}
            subtext={`Cash: ₹${stats.todayCashSales.toLocaleString()} | Udhaar: ₹${stats.todayUdhaarSales.toLocaleString()}`}
            color="success"
          />
          <StatCard
            title="Pending Udhaar"
            value={`₹${stats.pendingUdhaarAmount.toLocaleString()}`}
            icon={CreditCard}
            color="warning"
          />
        </div>

        {/* Charts and Low Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Monthly Sales Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.monthlySalesData}>
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(152, 60%, 32%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(152, 60%, 32%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `₹${(value / 1000)}k`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value) => [`₹${value.toLocaleString()}`, 'Sales']}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="hsl(152, 60%, 32%)"
                      strokeWidth={2}
                      fill="url(#salesGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card className="border-destructive/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                Low Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockProducts.slice(0, 5).map((product) => (
                  <div 
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg border border-destructive/20"
                  >
                    <div>
                      <p className="font-medium text-sm text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.company}</p>
                    </div>
                    <div className="text-right">
                      <span className="alert-badge alert-badge-danger">
                        {product.quantity} left
                      </span>
                    </div>
                  </div>
                ))}
                {lowStockProducts.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    All products are well stocked!
                  </p>
                )}
              </div>
              <Link to="/products?filter=low-stock">
                <Button variant="ghost" className="w-full mt-4 text-destructive hover:text-destructive">
                  View All Low Stock Items
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Pending Udhaar */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-warning" />
                Pending Udhaar (Credit)
              </CardTitle>
              <Link to="/reports?tab=udhaar">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Bill No.</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Mobile</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Due Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingBills.map((bill) => (
                    <tr key={bill._id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium">{bill.billNumber}</td>
                      <td className="py-3 px-4 text-sm">{bill.customer.name}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{bill.customer.mobile}</td>
                      <td className="py-3 px-4 text-sm font-semibold">₹{bill.total.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {bill.dueDate ? new Date(bill.dueDate).toLocaleDateString('en-IN') : 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="alert-badge alert-badge-warning">Pending</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickAction
            icon={Plus}
            title="Add New Product"
            description="Add products to your inventory"
            href="/products/add"
          />
          <QuickAction
            icon={Receipt}
            title="Generate Bill"
            description="Create Kaccha or Pakka bill"
            href="/billing/new"
          />
          <QuickAction
            icon={FileText}
            title="View Reports"
            description="Sales, Stock & Udhaar reports"
            href="/reports"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, icon: Icon, trend, color = 'primary', urgent, subtext }) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    destructive: 'bg-destructive/10 text-destructive',
  };

  return (
    <div className={`stat-card ${urgent ? 'border-destructive/50 animate-pulse-gentle' : ''}`}>
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend.positive ? 'text-success' : 'text-destructive'}`}>
            {trend.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {trend.value}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{title}</p>
        {subtext && <p className="text-xs text-muted-foreground mt-2">{subtext}</p>}
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, title, description, href }) {
  return (
    <Link to={href}>
      <div className="stat-card cursor-pointer group">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
