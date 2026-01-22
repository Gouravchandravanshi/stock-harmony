import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  FileText,
  TrendingUp,
  AlertTriangle,
  Package,
  Download,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { billAPI, productAPI } from '@/services/api';

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

export default function Reports() {
  const [salesData, setSalesData] = useState([]);
  const [udhaarData, setUdhaarData] = useState({ report: [], summary: {} });
  const [stockData, setStockData] = useState({ report: [], summary: {} });
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const [allBills, allProducts] = await Promise.all([
        billAPI.getAll(),
        productAPI.getAll(),
      ]);

      // Process Sales Report - date-wise breakdown (all bills - completed + pending)
      const salesByDate = {};
      allBills.forEach(bill => {
        const date = new Date(bill.createdAt).toLocaleDateString('en-IN');
        if (!salesByDate[date]) {
          salesByDate[date] = { date, cash: 0, udhaar: 0, count: 0, total: 0 };
        }
        salesByDate[date].total += bill.total;
        if (bill.paymentMode === 'Cash') salesByDate[date].cash += bill.total;
        else salesByDate[date].udhaar += bill.total;
        salesByDate[date].count += 1;
      });
      setSalesData(Object.values(salesByDate).sort((a, b) => new Date(a.date) - new Date(b.date)));

      // Process Udhaar Report - only pending credit bills
      const udhaarBills = allBills.filter(b => b.paymentMode === 'Udhaar');
      const pendingUdhaar = udhaarBills.filter(b => b.status === 'pending');
      const completedUdhaar = udhaarBills.filter(b => b.status === 'completed');
      
      setUdhaarData({
        report: pendingUdhaar.map(bill => ({
          _id: bill._id,
          billNumber: bill.billNumber,
          customerName: bill.customer.name,
          customerMobile: bill.customer.mobile,
          amount: bill.total,
          dueDate: bill.dueDate ? new Date(bill.dueDate).toLocaleDateString('en-IN') : 'N/A',
          isPending: bill.status === 'pending',
        })),
        summary: {
          totalUdhaar: udhaarBills.reduce((sum, b) => sum + b.total, 0),
          totalBills: udhaarBills.length,
          pendingUdhaar: pendingUdhaar.reduce((sum, b) => sum + b.total, 0),
          completedUdhaar: completedUdhaar.reduce((sum, b) => sum + b.total, 0),
        },
      });

      // Process Stock Report - product inventory
      const lowStockCount = allProducts.filter(p => p.quantity <= p.quantityAlert).length;
      setStockData({
        report: allProducts.map(product => ({
          name: product.name,
          company: product.company,
          category: product.category,
          currentStock: product.quantity,
          alertLevel: product.quantityAlert,
          status: product.quantity <= product.quantityAlert ? 'Low Stock' : 'In Stock',
          buyingPrice: product.buyingPrice,
        })),
        summary: {
          totalProducts: allProducts.length,
          totalStock: allProducts.reduce((sum, p) => sum + p.quantity, 0),
          lowStockProducts: lowStockCount,
          totalValue: allProducts.reduce((sum, p) => sum + (p.quantity * p.buyingPrice), 0),
        },
      });

      // Process Category Report - top products by sales (all bills - completed + pending)
      const productSales = {};
      allBills.forEach(bill => {
        bill.items.forEach(item => {
          if (!productSales[item.productId]) {
            const product = allProducts.find(p => p._id === item.productId);
            productSales[item.productId] = {
              productName: item.productName,
              quantity: 0,
              billCount: 0,
              totalSales: 0,
            };
          }
          productSales[item.productId].quantity += item.quantity;
          productSales[item.productId].totalSales += item.total || (item.quantity * item.rate);
          productSales[item.productId].billCount += 1;
        });
      });
      setCategoryData(Object.values(productSales).sort((a, b) => b.totalSales - a.totalSales).slice(0, 6));
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (data, filename) => {
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    toast.success('Report exported successfully');
  };

  const handleMarkPaid = async (billId) => {
    try {
      await billAPI.updateStatus(billId, 'completed');
      toast.success('Bill marked as paid!');
      fetchReports();
    } catch (error) {
      console.error('Error marking bill as paid:', error);
      toast.error('Failed to mark bill as paid');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="page-header">Reports</h1>
            <p className="page-subheader">View detailed sales, credit, and inventory reports</p>
          </div>
          <Button onClick={fetchReports} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="sales" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden md:inline">Sales</span>
            </TabsTrigger>
            <TabsTrigger value="udhaar" className="gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden md:inline">Udhaar</span>
            </TabsTrigger>
            <TabsTrigger value="stock" className="gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden md:inline">Stock</span>
            </TabsTrigger>
            <TabsTrigger value="category" className="gap-2">
              <BarChart className="w-4 h-4" />
              <span className="hidden md:inline">Category</span>
            </TabsTrigger>
          </TabsList>

          {/* Sales Report */}
          <TabsContent value="sales" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Sales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    ₹{salesData.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {salesData.length} transactions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Cash Sales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-success">
                    ₹{salesData.reduce((sum, item) => sum + item.cash, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Immediate payment
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Credit Sales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-warning">
                    ₹{salesData.reduce((sum, item) => sum + item.udhaar, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Pending payment
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sales Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Date-wise Sales Breakdown</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleExport(salesData, 'sales-report.csv')}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                      <Legend />
                      <Bar dataKey="cash" fill="#10B981" name="Cash Sales" />
                      <Bar dataKey="udhaar" fill="#F59E0B" name="Credit Sales" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Sales Table */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-center py-3 px-4">Transactions</th>
                        <th className="text-right py-3 px-4">Cash</th>
                        <th className="text-right py-3 px-4">Credit</th>
                        <th className="text-right py-3 px-4">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesData.map((item, idx) => (
                        <tr key={idx} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-3 px-4">{item.date}</td>
                          <td className="py-3 px-4 text-center">{item.count}</td>
                          <td className="py-3 px-4 text-right">₹{item.cash.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right">₹{item.udhaar.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right font-semibold">
                            ₹{item.total.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Udhaar Report */}
          <TabsContent value="udhaar" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Credit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    ₹{udhaarData.summary.totalUdhaar?.toLocaleString() || 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {udhaarData.summary.totalBills} bills
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Pending Amount
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-destructive">
                    ₹{udhaarData.summary.pendingUdhaar?.toLocaleString() || 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Awaiting payment
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Received
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-success">
                    ₹{udhaarData.summary.completedUdhaar?.toLocaleString() || 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Paid bills
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Udhaar Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Credit Customers</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      handleExport(udhaarData.report, 'udhaar-report.csv')
                    }
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4">Bill No.</th>
                        <th className="text-left py-3 px-4">Customer</th>
                        <th className="text-left py-3 px-4">Mobile</th>
                        <th className="text-center py-3 px-4">Amount</th>
                        <th className="text-left py-3 px-4">Due Date</th>
                        <th className="text-center py-3 px-4">Status</th>
                        <th className="text-center py-3 px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {udhaarData.report?.map((item, idx) => (
                        <tr key={idx} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-3 px-4 font-mono">{item.billNumber}</td>
                          <td className="py-3 px-4">{item.customerName}</td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {item.customerMobile}
                          </td>
                          <td className="py-3 px-4 text-center font-semibold">
                            ₹{item.amount?.toLocaleString() || 0}
                          </td>
                          <td className="py-3 px-4">{item.dueDate}</td>
                          <td className="py-3 px-4 text-center">
                            <Badge
                              variant={item.isPending ? 'destructive' : 'success'}
                            >
                              {item.isPending ? 'Pending' : 'Received'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {item.isPending && (
                              <Button
                                size="sm"
                                className="bg-success hover:bg-success/90 text-white"
                                onClick={() => handleMarkPaid(item._id)}
                              >
                                Mark Paid
                              </Button>
                            )}
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    {stockData.summary.totalProducts}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Stock
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    {stockData.summary.totalStock?.toLocaleString() || 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">units</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Low Stock Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-destructive">
                    {stockData.summary.lowStockProducts}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Stock Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    ₹{stockData.summary.totalValue?.toLocaleString() || 0}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Stock Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Inventory Details</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      handleExport(stockData.report, 'stock-report.csv')
                    }
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4">Product</th>
                        <th className="text-left py-3 px-4">Category</th>
                        <th className="text-center py-3 px-4">Stock</th>
                        <th className="text-center py-3 px-4">Alert Level</th>
                        <th className="text-center py-3 px-4">Status</th>
                        <th className="text-right py-3 px-4">Stock Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockData.report?.map((item, idx) => (
                        <tr key={idx} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.company}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4">{item.category}</td>
                          <td className="py-3 px-4 text-center font-semibold">
                            {item.currentStock}
                          </td>
                          <td className="py-3 px-4 text-center text-muted-foreground">
                            {item.alertLevel}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge
                              variant={
                                item.status === 'Low Stock' ? 'destructive' : 'success'
                              }
                            >
                              {item.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            ₹
                            {(item.currentStock * item.buyingPrice).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Category Report */}
          <TabsContent value="category" className="space-y-6">
            {/* Category Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sales by Top Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ₹${value}`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="totalSales"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Category Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Product Performance</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      handleExport(categoryData, 'category-sales.csv')
                    }
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4">Product</th>
                        <th className="text-center py-3 px-4">Quantity Sold</th>
                        <th className="text-center py-3 px-4">Bills</th>
                        <th className="text-right py-3 px-4">Total Sales</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryData.map((item, idx) => (
                        <tr key={idx} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-3 px-4 font-medium">{item.productName}</td>
                          <td className="py-3 px-4 text-center">{item.quantity}</td>
                          <td className="py-3 px-4 text-center">{item.billCount}</td>
                          <td className="py-3 px-4 text-right font-semibold">
                            ₹{item.totalSales?.toLocaleString() || 0}
                          </td>
                        </tr>
                      ))}
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
