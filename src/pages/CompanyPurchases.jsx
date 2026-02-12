import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  ShoppingCart, 
  Plus, 
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { companyAPI, productAPI } from '@/services/api';

export default function CompanyPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    items: [],
    totalAmount: 0,
    notes: '',
  });

  useEffect(() => {
    fetchPurchases();
    fetchProducts();
  }, []);

  const fetchPurchases = async () => {
    try {
      const data = await companyAPI.getAll();
      setPurchases(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load company purchases');
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await productAPI.getAll();
      setProducts(data);
    } catch(err) {
      console.error(err);
    }
  };

  const handleAddItem = (productId) => {
    const prod = products.find(p => p._id === productId);
    if (!prod) return;
    const existing = formData.items.find(i => i.productId === productId);
    if (existing) {
      toast.error('Item already added');
      return;
    }
    setFormData({
      ...formData,
      items: [...formData.items, { productId, productName: prod.name, quantity: 1, rate: prod.buyingPrice, total: prod.buyingPrice }],
      totalAmount: formData.totalAmount + prod.buyingPrice,
    });
  };

  const handleItemChange = (productId, field, value) => {
    const updated = formData.items.map(i => {
      if (i.productId !== productId) return i;
      const val = field === 'quantity' ? parseInt(value) : parseFloat(value);
      const item = { ...i, [field]: val };
      item.total = item.quantity * item.rate;
      return item;
    });
    const totalAmt = updated.reduce((sum, i) => sum + i.total, 0);
    setFormData({ ...formData, items: updated, totalAmount: totalAmt });
  };

  const handleRemoveItem = (productId) => {
    const remaining = formData.items.filter(i => i.productId !== productId);
    const totalAmt = remaining.reduce((sum, i) => sum + i.total, 0);
    setFormData({ ...formData, items: remaining, totalAmount: totalAmt });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName) {
      toast.error('Company name required');
      return;
    }
    if (formData.items.length === 0) {
      toast.error('Add at least one item');
      return;
    }
    try {
      await companyAPI.create(formData);
      toast.success('Purchase saved');
      setFormData({ companyName: '', items: [], totalAmount: 0, notes: '' });
      setShowForm(false);
      fetchPurchases();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save purchase');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="page-header">Company Purchases</h1>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" />
            New Purchase
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 bg-card p-4 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input
                  value={formData.companyName}
                  onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Input
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Select product to add</Label>
              <select
                className="w-full border rounded p-2"
                onChange={e => handleAddItem(e.target.value)}
              >
                <option value="">-- choose product --</option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
            {formData.items.length > 0 && (
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map(i => (
                    <tr key={i.productId}>
                      <td>{i.productName}</td>
                      <td>
                        <input
                          type="number"
                          value={i.quantity}
                          className="w-16 border rounded p-1"
                          onChange={e => handleItemChange(i.productId, 'quantity', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={i.rate}
                          className="w-24 border rounded p-1"
                          onChange={e => handleItemChange(i.productId, 'rate', e.target.value)}
                        />
                      </td>
                      <td>{i.total.toFixed(2)}</td>
                      <td>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(i.productId)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="text-right font-semibold">Total: ₹{formData.totalAmount.toFixed(2)}</div>
            <div className="flex gap-2">
              <Button type="submit">Save</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        )}

        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2 text-left">Company</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map(p => (
                  <tr key={p._id}>
                    <td className="px-4 py-2">{p.companyName}</td>
                    <td className="px-4 py-2">₹{p.totalAmount.toFixed(2)}</td>
                    <td className="px-4 py-2">{new Date(p.paymentDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
