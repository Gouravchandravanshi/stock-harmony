import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ArrowLeft, Package, Save, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { productCategories } from '@/data/mockData';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    category: '',
    quantity: '',
    quantityAlert: '',
    buyingPrice: '',
    sellingPriceCash: '',
    sellingPriceUdhaar: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For demo, show success and navigate
    toast.success('Product added successfully!');
    navigate('/products');
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="page-header">Add New Product</h1>
            <p className="page-subheader">Add a new product to your inventory</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Product Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="input-label">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Carbendazim 50% WP"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="input-label">Company Name *</Label>
                  <Input
                    id="company"
                    name="company"
                    placeholder="e.g., Bayer CropScience"
                    value={formData.company}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="input-label">Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {productCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity" className="input-label">Quantity *</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    placeholder="Current stock"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantityAlert" className="input-label">Low Stock Alert *</Label>
                  <Input
                    id="quantityAlert"
                    name="quantityAlert"
                    type="number"
                    placeholder="Alert when stock falls below"
                    value={formData.quantityAlert}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                  <IndianRupee className="w-5 h-5 text-primary" />
                  Pricing
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="buyingPrice" className="input-label">Buying Price (₹) *</Label>
                    <Input
                      id="buyingPrice"
                      name="buyingPrice"
                      type="number"
                      placeholder="0.00"
                      value={formData.buyingPrice}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sellingPriceCash" className="input-label">Cash Rate (₹) *</Label>
                    <Input
                      id="sellingPriceCash"
                      name="sellingPriceCash"
                      type="number"
                      placeholder="0.00"
                      value={formData.sellingPriceCash}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sellingPriceUdhaar" className="input-label">Udhaar Rate (₹) *</Label>
                    <Input
                      id="sellingPriceUdhaar"
                      name="sellingPriceUdhaar"
                      type="number"
                      placeholder="0.00"
                      value={formData.sellingPriceUdhaar}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Link to="/products">
                  <Button type="button" variant="outline">Cancel</Button>
                </Link>
                <Button type="submit">
                  <Save className="w-4 h-4" />
                  Save Product
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
