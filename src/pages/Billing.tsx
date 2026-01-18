import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Receipt, FileText, Plus, Printer, Download, Search, User, Phone, MapPin, Calendar, IndianRupee, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { mockProducts } from '@/data/mockData';
import { toast } from 'sonner';
import { BillItem, PaymentMode } from '@/types/inventory';

export default function Billing() {
  const [billType, setBillType] = useState<'kaccha' | 'pakka'>('kaccha');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Cash');
  const [customer, setCustomer] = useState({
    name: '',
    mobile: '',
    address: '',
  });
  const [dueDate, setDueDate] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  const [items, setItems] = useState<BillItem[]>([]);
  const [showProductSearch, setShowProductSearch] = useState(false);

  const filteredProducts = mockProducts.filter(p => 
    p.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
    p.company.toLowerCase().includes(searchProduct.toLowerCase())
  );

  const addItem = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (!product) return;

    const rate = paymentMode === 'Cash' ? product.sellingPriceCash : product.sellingPriceUdhaar;
    const existingItem = items.find(item => item.productId === productId);

    if (existingItem) {
      setItems(items.map(item => 
        item.productId === productId 
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.rate }
          : item
      ));
    } else {
      setItems([...items, {
        productId,
        productName: product.name,
        quantity: 1,
        rate,
        total: rate,
      }]);
    }
    setSearchProduct('');
    setShowProductSearch(false);
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(items.map(item =>
      item.productId === productId
        ? { ...item, quantity, total: quantity * item.rate }
        : item
    ));
  };

  const removeItem = (productId: string) => {
    setItems(items.filter(item => item.productId !== productId));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const gstAmount = billType === 'pakka' ? subtotal * 0.18 : 0;
  const total = subtotal + gstAmount;

  const handleGenerateBill = () => {
    if (items.length === 0) {
      toast.error('Please add at least one product');
      return;
    }
    if (!customer.name || !customer.mobile) {
      toast.error('Please enter customer details');
      return;
    }
    toast.success(`${billType === 'kaccha' ? 'Kaccha' : 'Pakka'} Bill generated successfully!`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="page-header">Billing</h1>
            <p className="page-subheader">Generate Kaccha or Pakka bills</p>
          </div>
        </div>

        {/* Bill Type Tabs */}
        <Tabs value={billType} onValueChange={(v) => setBillType(v as 'kaccha' | 'pakka')}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="kaccha" className="gap-2">
              <Receipt className="w-4 h-4" />
              Kaccha Bill
            </TabsTrigger>
            <TabsTrigger value="pakka" className="gap-2">
              <FileText className="w-4 h-4" />
              Pakka Bill (GST)
            </TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Left: Customer & Products */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Details */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Customer Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="input-label">Customer Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Enter customer name"
                          value={customer.name}
                          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="input-label">Mobile Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Enter mobile number"
                          value={customer.mobile}
                          onChange={(e) => setCustomer({ ...customer, mobile: e.target.value })}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="input-label">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Enter address"
                        value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Mode */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <IndianRupee className="w-5 h-5 text-primary" />
                    Payment Mode
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={paymentMode} 
                    onValueChange={(v) => setPaymentMode(v as PaymentMode)}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Cash" id="cash" />
                      <Label htmlFor="cash" className="cursor-pointer font-medium">Cash (Nagad)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Udhaar" id="udhaar" />
                      <Label htmlFor="udhaar" className="cursor-pointer font-medium">Udhaar (Credit)</Label>
                    </div>
                  </RadioGroup>

                  {paymentMode === 'Udhaar' && (
                    <div className="mt-4 space-y-2">
                      <Label className="input-label">Due Date (Kab Dega)</Label>
                      <div className="relative max-w-xs">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="date"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Add Products */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    Add Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={searchProduct}
                      onChange={(e) => {
                        setSearchProduct(e.target.value);
                        setShowProductSearch(e.target.value.length > 0);
                      }}
                      onFocus={() => setShowProductSearch(searchProduct.length > 0)}
                      className="pl-9"
                    />

                    {/* Product Search Dropdown */}
                    {showProductSearch && searchProduct && (
                      <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map(product => (
                            <button
                              key={product.id}
                              className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex justify-between items-center"
                              onClick={() => addItem(product.id)}
                            >
                              <div>
                                <p className="font-medium text-foreground">{product.name}</p>
                                <p className="text-sm text-muted-foreground">{product.company}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-foreground">
                                  ₹{paymentMode === 'Cash' ? product.sellingPriceCash : product.sellingPriceUdhaar}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Stock: {product.quantity}
                                </p>
                              </div>
                            </button>
                          ))
                        ) : (
                          <p className="px-4 py-3 text-muted-foreground text-center">
                            No products found
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Items Table */}
                  {items.length > 0 && (
                    <div className="mt-6 overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 text-sm font-medium text-muted-foreground">Product</th>
                            <th className="text-center py-3 text-sm font-medium text-muted-foreground">Qty</th>
                            <th className="text-right py-3 text-sm font-medium text-muted-foreground">Rate</th>
                            <th className="text-right py-3 text-sm font-medium text-muted-foreground">Total</th>
                            <th className="text-center py-3 text-sm font-medium text-muted-foreground"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item) => (
                            <tr key={item.productId} className="border-b border-border/50">
                              <td className="py-3 font-medium">{item.productName}</td>
                              <td className="py-3">
                                <Input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => updateItemQuantity(item.productId, parseInt(e.target.value) || 0)}
                                  className="w-20 text-center mx-auto"
                                />
                              </td>
                              <td className="py-3 text-right text-muted-foreground">₹{item.rate}</td>
                              <td className="py-3 text-right font-semibold">₹{item.total}</td>
                              <td className="py-3 text-center">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="hover:text-destructive"
                                  onClick={() => removeItem(item.productId)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {items.length === 0 && (
                    <div className="mt-6 text-center py-8 border border-dashed border-border rounded-lg">
                      <Receipt className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No products added yet</p>
                      <p className="text-sm text-muted-foreground">Search and add products above</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right: Bill Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Bill Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                    </div>
                    
                    {billType === 'pakka' && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">GST (18%)</span>
                        <span className="font-medium">₹{gstAmount.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="text-xl font-bold text-primary">
                          ₹{total.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {paymentMode === 'Udhaar' && dueDate && (
                      <div className="bg-warning/10 rounded-lg p-3 mt-4">
                        <p className="text-sm text-warning-foreground font-medium">
                          Due Date: {new Date(dueDate).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 space-y-3">
                    <Button className="w-full" size="lg" onClick={handleGenerateBill}>
                      <CheckCircle className="w-4 h-4" />
                      Generate Bill
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" disabled={items.length === 0}>
                        <Printer className="w-4 h-4" />
                        Print
                      </Button>
                      <Button variant="outline" disabled={items.length === 0}>
                        <Download className="w-4 h-4" />
                        Save
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
