import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  AlertTriangle,
  ChevronDown,
  X,
} from 'lucide-react';
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
import { Link, useSearchParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { productAPI } from '@/services/api';

export default function Products() {
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');
  
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showLowStock, setShowLowStock] = useState(filterParam === 'low-stock');
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [editDialog, setEditDialog] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);

  // Fetch products and categories on mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productAPI.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await productAPI.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleEditClick = (product) => {
    setEditFormData({ ...product });
    setEditDialog(product._id);
  };

  const handleEditSave = async () => {
    try {
      if (!editFormData.name || !editFormData.company || !editFormData.category) {
        toast.error('Please fill in all required fields');
        return;
      }

      setEditLoading(true);
      await productAPI.update(editDialog, {
        name: editFormData.name,
        company: editFormData.company,
        category: editFormData.category,
        quantity: parseInt(editFormData.quantity) || 0,
        quantityAlert: parseInt(editFormData.quantityAlert) || 10,
        buyingPrice: parseFloat(editFormData.buyingPrice) || 0,
        sellingPriceCash: parseFloat(editFormData.sellingPriceCash) || 0,
        sellingPriceUdhaar: parseFloat(editFormData.sellingPriceUdhaar) || 0,
      });
      
      toast.success('Product updated successfully');
      setEditDialog(null);
      fetchProducts();
    } catch (error) {
      toast.error(error.message || 'Failed to update product');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await productAPI.delete(productId);
      toast.success('Product deleted successfully');
      setDeleteDialog(null);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                          product.company.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesLowStock = !showLowStock || product.quantity <= product.quantityAlert;
    
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="page-header">Products</h1>
            <p className="page-subheader">Manage your inventory products</p>
          </div>
          <Link to="/products/add">
            <Button>
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant={showLowStock ? 'destructive' : 'outline'}
            onClick={() => setShowLowStock(!showLowStock)}
          >
            <AlertTriangle className="w-4 h-4" />
            Low Stock
          </Button>
        </div>

        {/* Products Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Product</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Category</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Stock</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Buying Price</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Cash Rate</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Udhaar Rate</th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const isLowStock = product.quantity <= product.quantityAlert;
                  
                  return (
                    <tr 
                      key={product.id} 
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.company}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="secondary" className="font-normal">
                          {product.category}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${isLowStock ? 'text-destructive' : 'text-foreground'}`}>
                            {product.quantity}
                          </span>
                          {isLowStock && (
                            <span className="alert-badge alert-badge-danger">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Low
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">₹{product.buyingPrice}</td>
                      <td className="py-4 px-4 font-medium text-foreground">₹{product.sellingPriceCash}</td>
                      <td className="py-4 px-4 font-medium text-foreground">₹{product.sellingPriceUdhaar}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="hover:text-primary"
                            onClick={() => handleEditClick(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="hover:text-destructive"
                            onClick={() => setDeleteDialog(product._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

                {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-foreground">No products found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* Delete Dialog */}
        <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this product? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialog(null)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleDelete(deleteDialog)}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={!!editDialog} onOpenChange={() => setEditDialog(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update product information and pricing
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="input-label">Product Name *</Label>
                  <Input
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="input-label">Company *</Label>
                  <Input
                    value={editFormData.company || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
                    placeholder="Enter company name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="input-label">Category *</Label>
                <Select 
                  value={editFormData.category || 'all'} 
                  onValueChange={(val) => setEditFormData({ ...editFormData, category: val })}
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="input-label">Stock Quantity</Label>
                  <Input
                    type="number"
                    value={editFormData.quantity || 0}
                    onChange={(e) => setEditFormData({ ...editFormData, quantity: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="input-label">Stock Alert Level</Label>
                  <Input
                    type="number"
                    value={editFormData.quantityAlert || 10}
                    onChange={(e) => setEditFormData({ ...editFormData, quantityAlert: e.target.value })}
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="input-label">Buying Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editFormData.buyingPrice || 0}
                  onChange={(e) => setEditFormData({ ...editFormData, buyingPrice: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="input-label">Selling Price (Cash)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editFormData.sellingPriceCash || 0}
                    onChange={(e) => setEditFormData({ ...editFormData, sellingPriceCash: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="input-label">Selling Price (Udhaar)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editFormData.sellingPriceUdhaar || 0}
                    onChange={(e) => setEditFormData({ ...editFormData, sellingPriceUdhaar: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialog(null)}>
                Cancel
              </Button>
              <Button 
                onClick={handleEditSave}
                disabled={editLoading}
              >
                {editLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
