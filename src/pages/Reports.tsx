import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  FileText, 
  TrendingUp, 
  IndianRupee, 
  Package, 
  Download, 
  Calendar,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { mockProducts, mockPendingBills, mockDashboardStats } from '@/data/mockData';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = ['hsl(152, 60%, 32%)', 'hsl(40, 90%, 50%)', 'hsl(0, 72%, 51%)', 'hsl(200, 70%, 50%)', 'hsl(280, 60%, 50%)', 'hsl(160, 50%, 45%)'];

export default function Reports() {
  const [dateRange, setDateRange] = useState('this-month');

  const categoryData = productCategories.map((cat, index) => ({
    name: cat,
    value: mockProducts.filter(p => p.category === cat).length,
    color: COLORS[index % COLORS.length],
  }));

  const stockData = mockProducts.map(p => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
    stock: p.quantity,
    alert: p.quantityAlert,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="page-header">Reports</h1>
            <p className="page-subheader">View detailed reports and analytics</p>
          </div>
          <div className="flex gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-48">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Report Tabs */}
        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList>
            <TabsTrigger value="sales" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Sales Report
            </TabsTrigger>
            <TabsTrigger value="udhaar" className="gap-2">
              <IndianRupee className="w-4 h-4" />
              Udhaar Report
            </TabsTrigger>
            <TabsTrigger value="stock" className="gap-2">
              <Package className="w-4 h-4" />
              Stock Report
            </TabsTrigger>
          </TabsList>

          {/* Sales Report */}
          <TabsContent value="sales" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">₹3,12,000</p>
                    <p className="text-sm text-muted-foreground mt-1">Total Sales</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-success">₹2,24,500</p>
                    <p className="text-sm text-muted-foreground mt-1">Cash Sales</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-warning">₹87,500</p>
                    <p className="text-sm text-muted-foreground mt-1">Credit Sales</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockDashboardStats.monthlySalesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
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
                        formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Sales']}
                      />
                      <Bar 
                        dataKey="sales" 
                        fill="hsl(152, 60%, 32%)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Udhaar Report */}
          <TabsContent value="udhaar" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-warning/30">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-warning">₹87,500</p>
                    <p className="text-sm text-muted-foreground mt-1">Total Pending</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">12</p>
                    <p className="text-sm text-muted-foreground mt-1">Pending Bills</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-destructive/30">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-destructive">5</p>
                    <p className="text-sm text-muted-foreground mt-1">Overdue</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Pending Udhaar Details</CardTitle>
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
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockPendingBills.map((bill) => (
                        <tr key={bill.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4 text-sm font-medium">{bill.billNumber}</td>
                          <td className="py-3 px-4 text-sm">{bill.customer.name}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{bill.customer.mobile}</td>
                          <td className="py-3 px-4 text-sm font-semibold">₹{bill.total.toLocaleString()}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {bill.dueDate?.toLocaleDateString('en-IN')}
                          </td>
                          <td className="py-3 px-4">
                            <span className="alert-badge alert-badge-warning">Pending</span>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="outline" size="sm">Mark Paid</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stock Report */}
          <TabsContent value="stock" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{mockProducts.length}</p>
                    <p className="text-sm text-muted-foreground mt-1">Total Products</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-destructive/30">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-destructive">
                      {mockProducts.filter(p => p.quantity <= p.quantityAlert).length}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Low Stock Items</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-success">
                      {mockProducts.filter(p => p.quantity > p.quantityAlert).length}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Well Stocked</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Stock Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stockData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={11}
                        width={120}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="stock" 
                        fill="hsl(152, 60%, 32%)"
                        name="Current Stock"
                        radius={[0, 4, 4, 0]}
                      />
                      <Bar 
                        dataKey="alert" 
                        fill="hsl(0, 72%, 51%)"
                        name="Alert Level"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Complete Stock List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Product</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Stock</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Alert Level</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockProducts.map((product) => {
                        const isLowStock = product.quantity <= product.quantityAlert;
                        return (
                          <tr key={product.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-4">
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">{product.company}</p>
                            </td>
                            <td className="py-3 px-4 text-sm">{product.category}</td>
                            <td className="py-3 px-4 text-sm font-semibold">{product.quantity}</td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{product.quantityAlert}</td>
                            <td className="py-3 px-4">
                              <span className={`alert-badge ${isLowStock ? 'alert-badge-danger' : 'alert-badge-success'}`}>
                                {isLowStock ? 'Low Stock' : 'In Stock'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

const productCategories = [
  'Fungicide',
  'Insecticide',
  'Herbicide',
  'PGR',
  'Water Soluble',
  'Chelated Micronutrient',
];
