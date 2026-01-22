import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Receipt, FileText, Plus, Printer, Download, Search, User, Phone, MapPin, Calendar, IndianRupee, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { productAPI, billAPI } from '@/services/api';

export default function Billing() {
  const [billType, setBillType] = useState('kaccha');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [customer, setCustomer] = useState({
    name: '',
    mobile: '',
    address: '',
  });
  const [dueDate, setDueDate] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  const [items, setItems] = useState([]);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productAPI.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    }
  };

  const filteredProducts = products.filter(p => {
    if (!searchProduct) return false;
    return (
      p.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
      p.company.toLowerCase().includes(searchProduct.toLowerCase())
    );
  });

  const addItem = (productId) => {
    const product = products.find(p => p._id === productId);
    if (!product) {
      toast.error('Product not found');
      return;
    }

    // Check stock
    if (product.quantity <= 0) {
      toast.error('Product out of stock');
      return;
    }

    const rate = paymentMode === 'Cash' ? product.sellingPriceCash : product.sellingPriceUdhaar;
    const existingItem = items.find(item => item.productId === productId);

    if (existingItem) {
      if (existingItem.quantity >= product.quantity) {
        toast.error('Not enough stock available');
        return;
      }
      setItems(items.map(item => 
        item.productId === productId 
          ? { 
              ...item, 
              quantity: item.quantity + 1, 
              total: (item.quantity + 1) * item.rate 
            }
          : item
      ));
      toast.success('Quantity increased');
    } else {
      setItems([...items, {
        productId,
        productName: product.name,
        company: product.company,
        quantity: 1,
        rate,
        total: rate,
      }]);
      toast.success(`${product.name} added to bill`);
    }
    setSearchProduct('');
    setShowProductSearch(false);
  };

  const updateItemQuantity = (productId, quantity) => {
    const product = products.find(p => p._id === productId);
    
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    if (quantity > product.quantity) {
      toast.error(`Only ${product.quantity} items available in stock`);
      return;
    }

    setItems(items.map(item =>
      item.productId === productId
        ? { ...item, quantity, total: quantity * item.rate }
        : item
    ));
  };

  const removeItem = (productId) => {
    const item = items.find(i => i.productId === productId);
    setItems(items.filter(item => item.productId !== productId));
    if (item) {
      toast.success(`${item.productName} removed from bill`);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const gstAmount = billType === 'pakka' ? subtotal * 0.18 : 0;
  const total = subtotal + gstAmount;

  const handleGenerateBill = async () => {
    if (items.length === 0) {
      toast.error('Please add at least one product');
      return;
    }
    if (!customer.name || !customer.mobile) {
      toast.error('Please enter customer details');
      return;
    }

    try {
      setLoading(true);
      
      // Generate bill number
      const billNumber = `${billType === 'kaccha' ? 'KB' : 'PB'}-${Date.now()}`;
      
      // Create bill object
      const bill = {
        billNumber,
        billType,
        customer: {
          id: `c${Date.now()}`,
          name: customer.name,
          mobile: customer.mobile,
          address: customer.address || '',
        },
        items: [...items],
        paymentMode,
        dueDate: paymentMode === 'Udhaar' && dueDate ? new Date(dueDate) : null,
        subtotal,
        gst: billType === 'pakka' ? gstAmount : 0,
        total,
      };

      // Save to backend
      await billAPI.create(bill);
      
      // Show success message
      toast.success(`${billType === 'kaccha' ? 'Kaccha' : 'Pakka'} Bill generated successfully!`);

      // Reset form
      setItems([]);
      setCustomer({ name: '', mobile: '', address: '' });
      setDueDate('');
      setSearchProduct('');
      
      // Refresh products in case of quantity updates
      fetchProducts();
    } catch (error) {
      console.error('Error generating bill:', error);
      toast.error('Failed to generate bill');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadBill = () => {
    if (items.length === 0) {
      toast.error('Please add at least one product');
      return;
    }
    if (!customer.name || !customer.mobile) {
      toast.error('Please enter customer details');
      return;
    }

    const billNumber = `${billType === 'kaccha' ? 'KB' : 'PB'}-${Date.now()}`;
    
    // Generate PDF content (simple text version for now)
    const billContent = `
BILL ${billType === 'pakka' ? '(GST INVOICE)' : ''}
Bill Number: ${billNumber}
Date: ${new Date().toLocaleDateString('en-IN')}

Customer Details:
Name: ${customer.name}
Mobile: ${customer.mobile}
${customer.address ? `Address: ${customer.address}` : ''}

Items:
${items.map((item, idx) => 
  `${idx + 1}. ${item.productName} - Qty: ${item.quantity} x ₹${item.rate} = ₹${item.total}`
).join('\n')}

Subtotal: ₹${subtotal.toLocaleString()}
${billType === 'pakka' ? `GST (18%): ₹${gstAmount.toLocaleString()}\n` : ''}
Total: ₹${total.toLocaleString()}

Payment Mode: ${paymentMode}
${paymentMode === 'Udhaar' && dueDate ? `Due Date: ${new Date(dueDate).toLocaleDateString('en-IN')}` : ''}
    `.trim();

    // Create blob and download
    const blob = new Blob([billContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${billNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Bill downloaded successfully!');
  };

  const handlePrintBill = () => {
    if (items.length === 0) {
      toast.error('Please add at least one product');
      return;
    }
    if (!customer.name || !customer.mobile) {
      toast.error('Please enter customer details');
      return;
    }

    const printWindow = window.open('', '_blank');
    const billNumber = `${Date.now()}`;
    const currentDate = new Date().toLocaleDateString('en-IN');
    
    // Kaccha Bill (Pink) or Pakka Bill (Yellow) format
    const backgroundColor = billType === 'kaccha' ? '#FFB6D9' : '#FFF4B3';
    const borderColor = billType === 'kaccha' ? '#FF69B4' : '#FFD700';
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bill ${billNumber}</title>
        <style>
          @page { 
            size: A5; 
            margin: 0; 
          }
          body { 
            font-family: Arial, sans-serif; 
            padding: 15px;
            margin: 0;
            background-color: ${backgroundColor};
          }
          .bill-container {
            border: 2px solid ${borderColor};
            padding: 10px;
            background-color: ${backgroundColor};
          }
          .header {
            text-align: center;
            border-bottom: 2px solid black;
            padding-bottom: 8px;
            margin-bottom: 10px;
          }
          .header h2 {
            margin: 0;
            font-size: 18px;
            font-weight: bold;
          }
          .header p {
            margin: 2px 0;
            font-size: 10px;
          }
          .bill-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 11px;
          }
          .customer-info {
            border: 1px solid black;
            padding: 8px;
            margin-bottom: 10px;
            font-size: 11px;
          }
          .customer-info p {
            margin: 3px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            font-size: 11px;
          }
          th, td {
            border: 1px solid black;
            padding: 5px;
            text-align: left;
          }
          th {
            background-color: rgba(0,0,0,0.1);
            font-weight: bold;
          }
          .total-section {
            margin-top: 10px;
            text-align: right;
            font-size: 12px;
          }
          .total-row {
            display: flex;
            justify-content: flex-end;
            margin: 5px 0;
          }
          .total-label {
            width: 100px;
            text-align: right;
            padding-right: 10px;
          }
          .total-value {
            width: 100px;
            text-align: right;
            font-weight: bold;
          }
          .footer {
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px solid black;
            font-size: 9px;
          }
          .signature {
            text-align: right;
            margin-top: 30px;
            font-size: 11px;
          }
          .terms {
            font-size: 8px;
            margin-top: 10px;
            line-height: 1.3;
          }
        </style>
      </head>
      <body>
        <div class="bill-container">
          <div class="header">
            <p style="font-size: 12px; margin: 0;">|| श्री गणेशाय नमः ||</p>
            <h2>राज कृषि सेवा केन्द्र</h2>
            <p>${billType === 'pakka' ? 'कीटनाशक दवाईयों एवं खाद बीज के विकेता' : ''}</p>
            <p>${billType === 'pakka' ? 'राम मन्दिर के सामने, ग्राम-चांया, तहसील-रेहटी, जिला-सीहोर (म.प्र.)' : 'बस स्टैंड के पास मेन रोड बामा, तह-रेहटी, जिला-सीहोर'}</p>
            <p style="font-size: 9px;">Mo.No.: 8878596230</p>
            ${billType === 'pakka' ? '<p style="font-size: 9px;">GSTIN: 23BGAPC9885P1ZT</p>' : ''}
          </div>

          <div class="bill-info">
            <div>
              <strong>${billType === 'kaccha' ? 'बिल/कैशमेमो' : 'बिल / कैश मेमो'}</strong>
            </div>
            <div style="text-align: right;">
              <div><strong>क्रमांक:</strong> ${billNumber}</div>
              <div><strong>दिनांक:</strong> ${currentDate}</div>
            </div>
          </div>

          <div class="customer-info">
            <p><strong>श्रीमान्:</strong> ${customer.name}</p>
            <p><strong>पता:</strong> ${customer.address || ''}</p>
            <p><strong>मो.नं.:</strong> ${customer.mobile}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 8%;">क्र.</th>
                <th style="width: 40%;">विवरण</th>
                ${billType === 'pakka' ? '<th style="width: 12%;">बैच नं.</th>' : ''}
                ${billType === 'pakka' ? '<th style="width: 12%;">मेनू. दिनांक</th>' : ''}
                ${billType === 'pakka' ? '<th style="width: 12%;">एक्स. दिनांक</th>' : ''}
                <th style="width: ${billType === 'pakka' ? '8%' : '15%'};">${billType === 'pakka' ? 'संख्या/' : ''}मात्रा</th>
                ${billType === 'pakka' ? '<th style="width: 10%;">भाव</th>' : ''}
                <th style="width: ${billType === 'pakka' ? '8%' : '15%'};">${billType === 'pakka' ? 'दर' : 'कीमत'}</th>
                ${billType === 'kaccha' ? '' : '<th style="width: 12%;">कीमत</th>'}
              </tr>
            </thead>
            <tbody>
              ${items.map((item, idx) => `
                <tr>
                  <td style="text-align: center;">${idx + 1}</td>
                  <td>${item.productName}<br/><small>${item.company}</small></td>
                  ${billType === 'pakka' ? '<td></td>' : ''}
                  ${billType === 'pakka' ? '<td></td>' : ''}
                  ${billType === 'pakka' ? '<td></td>' : ''}
                  <td style="text-align: center;">${item.quantity}</td>
                  ${billType === 'pakka' ? `<td style="text-align: right;">₹${item.rate}</td>` : ''}
                  <td style="text-align: right;">₹${billType === 'kaccha' ? item.rate : item.total}</td>
                  ${billType === 'kaccha' ? '' : `<td style="text-align: right;">₹${item.total}</td>`}
                </tr>
              `).join('')}
              ${billType === 'kaccha' ? '' : `
                <tr>
                  <td colspan="${billType === 'pakka' ? '7' : '4'}" style="text-align: right;"><strong>Total</strong></td>
                  <td style="text-align: right;"><strong>₹${subtotal}</strong></td>
                </tr>
                <tr>
                  <td colspan="${billType === 'pakka' ? '7' : '4'}" style="text-align: right;"><strong>CGST</strong></td>
                  <td style="text-align: right;"><strong>₹${(gstAmount/2).toFixed(2)}</strong></td>
                </tr>
                <tr>
                  <td colspan="${billType === 'pakka' ? '7' : '4'}" style="text-align: right;"><strong>SGST</strong></td>
                  <td style="text-align: right;"><strong>₹${(gstAmount/2).toFixed(2)}</strong></td>
                </tr>
                <tr>
                  <td colspan="${billType === 'pakka' ? '7' : '4'}" style="text-align: right;"><strong>G. Total</strong></td>
                  <td style="text-align: right;"><strong>₹${total}</strong></td>
                </tr>
              `}
            </tbody>
          </table>

          ${billType === 'kaccha' ? `
            <div class="total-section">
              <div class="total-row">
                <div class="total-label">योग:</div>
                <div class="total-value">₹${total.toLocaleString()}</div>
              </div>
            </div>
          ` : ''}

          <div class="footer">
            <p style="margin: 5px 0;"><strong>वास्ते :</strong> राज कृषि सेवा केन्द्र</p>
            <div class="signature">
              <p style="margin: 5px 0;"><strong>प्रोपराईटर</strong></p>
            </div>
          </div>

          <div class="terms">
            <p style="margin: 2px 0;"><strong>हस्ताक्षर ग्राहक</strong></p>
            ${billType === 'kaccha' ? `
              <p style="margin: 2px 0;">1. बिना हस्ता वाल वापिस नहीं होगा।</p>
              <p style="margin: 2px 0;">2. माल के अनुसार ही कम्पनी द्वारा माल वेचा गया है। कृपया माल की जिम्मेदारी से पूर्व कम्पनी बन्द सील अबश्य देख लें।</p>
              <p style="margin: 2px 0;">3. हमने यह माल उसपात द्वारा उसकी द्वारा अधिकृत विक्रेता से खरीदा है। इसका उत्पादन उपयोग व रखरखाव कृषि हमारे नियन्त्रण में नहीं अतः हमारी किसी तरह की जिम्मेदारी नहीं होगी।</p>
              <p style="margin: 2px 0;">4. वे वस्तुयें (दवाई) खाने योग्य नहीं है। 5. समय पर भुगतान न होने पर 3% ब्याज देना होगा।</p>
              <p style="margin: 2px 0;">5. सभी प्रसादी का न्याय क्षेत्र बदनी रहेगा।</p>
            ` : `
              <p style="margin: 2px 0;">★ भूल-चूक लेनी देनी।</p>
              <p style="margin: 2px 0;">★ क्वालिटी की गारंटी कम्पनी की है उपयोग करने पर हमारा निवरचन नहीं होने से परिणाम की कोई गारंटी नहीं है।</p>
              <p style="margin: 2px 0;">★ 8 दिन में भुगतान प्राप्त न होने की दशा में 2 प्रतिशत ब्याज देना होगा।</p>
            `}
          </div>

          <div style="margin-top: 10px; font-size: 10px;">
            <p style="margin: 2px 0;"><strong>Payment Mode:</strong> ${paymentMode}</p>
            ${paymentMode === 'Udhaar' && dueDate ? `<p style="margin: 2px 0;"><strong>Due Date (कब देगा):</strong> ${new Date(dueDate).toLocaleDateString('en-IN')}</p>` : ''}
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
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
        <Tabs value={billType} onValueChange={(v) => setBillType(v)}>
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
                    onValueChange={(v) => setPaymentMode(v)}
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
                      placeholder="Search products by name or company..."
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
                              key={product._id}
                              className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex justify-between items-center border-b last:border-b-0"
                              onClick={() => addItem(product._id)}
                            >
                              <div className="flex-1">
                                <p className="font-medium text-foreground">{product.name}</p>
                                <p className="text-sm text-muted-foreground">{product.company}</p>
                              </div>
                              <div className="text-right ml-4">
                                <p className="font-semibold text-foreground">
                                  ₹{(paymentMode === 'Cash' ? product.sellingPriceCash : product.sellingPriceUdhaar).toLocaleString()}
                                </p>
                                <p className={`text-xs font-medium ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  Stock: {product.quantity}
                                </p>
                              </div>
                            </button>
                          ))
                        ) : (
                          <p className="px-4 py-6 text-muted-foreground text-center">
                            No products found
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Items Table */}
                  {items.length > 0 && (
                    <div className="mt-6 border border-border rounded-lg overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted border-b border-border">
                          <tr>
                            <th className="text-left py-3 px-4 font-semibold text-foreground">Product</th>
                            <th className="text-center py-3 px-4 font-semibold text-foreground w-20">Qty</th>
                            <th className="text-right py-3 px-4 font-semibold text-foreground w-24">Rate</th>
                            <th className="text-right py-3 px-4 font-semibold text-foreground w-24">Total</th>
                            <th className="text-center py-3 px-4 font-semibold text-foreground w-10"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item) => (
                            <tr key={item.productId} className="border-b border-border hover:bg-muted/50 transition-colors">
                              <td className="py-3 px-4">
                                <div>
                                  <p className="font-medium text-foreground">{item.productName}</p>
                                  <p className="text-xs text-muted-foreground">{item.company}</p>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <Input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => updateItemQuantity(item.productId, parseInt(e.target.value) || 0)}
                                  className="w-16 text-center h-8 text-sm"
                                />
                              </td>
                              <td className="py-3 px-4 text-right font-medium text-muted-foreground">₹{item.rate.toLocaleString()}</td>
                              <td className="py-3 px-4 text-right font-semibold text-foreground">₹{item.total.toLocaleString()}</td>
                              <td className="py-3 px-4 text-center">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
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
                  {/* Items Count */}
                  <div className="flex justify-between text-sm pb-2 border-b border-border">
                    <span className="text-muted-foreground">Total Items:</span>
                    <span className="font-semibold">{items.length}</span>
                  </div>

                  {/* Subtotal */}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                  </div>

                  {/* GST */}
                  {billType === 'pakka' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">GST (18%):</span>
                      <span className="font-medium">₹{gstAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Total */}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t-2 border-primary">
                    <span>Total:</span>
                    <span className="text-primary">₹{total.toLocaleString()}</span>
                  </div>

                  {/* Due Date Alert */}
                  {paymentMode === 'Udhaar' && dueDate && (
                    <div className="bg-warning/10 rounded-lg p-3 mt-2">
                      <p className="text-xs text-muted-foreground">Due Date</p>
                      <p className="text-sm font-semibold text-warning-foreground">
                        {new Date(dueDate).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="space-y-2 pt-4">
                    <Button 
                      onClick={handleGenerateBill}
                      disabled={items.length === 0 || loading}
                      className="w-full gap-2"
                      size="lg"
                    >
                      <Plus className="w-4 h-4" />
                      {loading ? 'Generating...' : 'Generate Bill'}
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={handleDownloadBill}
                        disabled={items.length === 0}
                        variant="outline"
                        className="gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                      <Button
                        onClick={handlePrintBill}
                        disabled={items.length === 0}
                        variant="outline"
                        className="gap-2"
                      >
                        <Printer className="w-4 h-4" />
                        Print
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
