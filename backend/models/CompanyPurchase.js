import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    items: [
      {
        productId: String,
        productName: String,
        quantity: Number,
        rate: Number,
        total: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('CompanyPurchase', purchaseSchema);