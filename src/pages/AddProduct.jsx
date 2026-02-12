import { useState, useEffect } from 'react';
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
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { productAPI } from '@/services/api';

export default function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    technicalName: '',
    company: '',
    category: '',
    quantity: '',
    quantityAlert: '',
    buyingPrice: '',
    sellingPriceCash: '',
    sellingPriceUdhaar: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await productAPI.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.company || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await productAPI.create({
        ...formData,
        quantity: parseInt(formData.quantity) || 0,
        quantityAlert: parseInt(formData.quantityAlert) || 10,
        buyingPrice: parseFloat(formData.buyingPrice),
        sellingPriceCash: parseFloat(formData.sellingPriceCash),
        sellingPriceUdhaar: parseFloat(formData.sellingPriceUdhaar),
      });
      toast.success('Product added successfully!');
      navigate('/products');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to add product');
    } finally {
      setLoading(false);
    }
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
                  <Label htmlFor="technicalName" className="input-label">Technical Name</Label>
                  <Input
                    id="technicalName"
                    name="technicalName"
                    placeholder="e.g., CBZ 50WP"
                    value={formData.technicalName}
                    onChange={handleChange}
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
                      {categories.map(cat => (
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
