import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { 
  Upload, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  ChevronLeft,
  FileImage
} from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Separator } from '~/components/ui/separator';
import { CountdownTimer } from '~/components/shared/countdown-timer';
import { StatusBadge } from '~/components/shared/status-badge';
import { formatCurrency, formatDateTime, TransactionStatus } from '~/types';
import { toast } from 'sonner';

// Mock transaction data
const mockTransaction = {
  id: 'txn-new',
  status: 'waiting_payment' as TransactionStatus,
  eventTitle: 'Jakarta Music Festival 2025',
  ticketType: 'VIP',
  quantity: 2,
  subtotal: 3000000,
  voucherDiscount: 750000,
  couponDiscount: 100000,
  pointsUsed: 20000,
  finalPrice: 2130000,
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
  bankAccount: {
    bank: 'Bank Central Asia (BCA)',
    accountNumber: '1234567890',
    accountName: 'PT Eventku Indonesia',
  },
};

export default function PaymentPage() {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(
    mockTransaction.status
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setUploadedFile(file);
    }
  };

  const handleSubmitProof = async () => {
    if (!uploadedFile) {
      toast.error('Please upload payment proof');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTransactionStatus('waiting_confirmation');
    toast.success('Payment proof uploaded! Waiting for confirmation.');
    setIsSubmitting(false);
  };

  const handleExpire = () => {
    setTransactionStatus('expired');
    toast.error('Payment time expired');
  };

  const getStatusIcon = () => {
    switch (transactionStatus) {
      case 'waiting_payment':
        return <Clock className="h-12 w-12 text-warning" />;
      case 'waiting_confirmation':
        return <AlertCircle className="h-12 w-12 text-info" />;
      case 'done':
        return <CheckCircle className="h-12 w-12 text-success" />;
      case 'rejected':
      case 'expired':
      case 'cancelled':
        return <XCircle className="h-12 w-12 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container-narrow">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/transactions')}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Payment</h1>
            <p className="text-muted-foreground">Order #{transactionId}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Status Card */}
            <div className="bg-card rounded-xl border border-border p-6 text-center">
              <div className="flex justify-center mb-4">
                {getStatusIcon()}
              </div>
              <StatusBadge status={transactionStatus} className="mb-2" />
              
              {transactionStatus === 'waiting_payment' && (
                <>
                  <p className="text-muted-foreground mb-4">
                    Please complete your payment within:
                  </p>
                  <CountdownTimer
                    expiresAt={mockTransaction.expiresAt}
                    onExpire={handleExpire}
                    className="justify-center"
                  />
                </>
              )}

              {transactionStatus === 'waiting_confirmation' && (
                <p className="text-muted-foreground">
                  We're reviewing your payment. This usually takes 1-24 hours.
                </p>
              )}

              {transactionStatus === 'done' && (
                <p className="text-muted-foreground">
                  Your payment has been confirmed! Check your email for tickets.
                </p>
              )}

              {transactionStatus === 'expired' && (
                <p className="text-muted-foreground">
                  Your payment time has expired. Please create a new order.
                </p>
              )}
            </div>

            {/* Bank Transfer Info */}
            {transactionStatus === 'waiting_payment' && (
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Bank Transfer Details
                </h2>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Bank</p>
                    <p className="font-medium">{mockTransaction.bankAccount.bank}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Account Number</p>
                    <p className="font-mono font-bold text-lg">
                      {mockTransaction.bankAccount.accountNumber}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Account Name</p>
                    <p className="font-medium">{mockTransaction.bankAccount.accountName}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">Transfer Amount</p>
                    <p className="font-bold text-2xl text-primary">
                      {formatCurrency(mockTransaction.finalPrice)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Payment Proof */}
            {transactionStatus === 'waiting_payment' && (
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Upload Payment Proof
                </h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="payment-proof">Payment Screenshot</Label>
                    <div className="mt-2">
                      <label
                        htmlFor="payment-proof"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
                      >
                        {uploadedFile ? (
                          <div className="flex items-center gap-2 text-foreground">
                            <FileImage className="h-6 w-6 text-primary" />
                            <span className="text-sm font-medium">{uploadedFile.name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                            <span className="text-sm text-muted-foreground">
                              Click to upload or drag and drop
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                              PNG, JPG up to 5MB
                            </span>
                          </div>
                        )}
                        <Input
                          id="payment-proof"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>

                  <Button
                    className="w-full btn-gradient"
                    size="lg"
                    onClick={handleSubmitProof}
                    disabled={!uploadedFile || isSubmitting}
                  >
                    {isSubmitting ? 'Uploading...' : 'Submit Payment Proof'}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-card rounded-xl border border-border p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Order Summary
              </h2>

              <div className="mb-4">
                <h3 className="font-medium text-foreground">{mockTransaction.eventTitle}</h3>
                <p className="text-sm text-muted-foreground">
                  {mockTransaction.ticketType} × {mockTransaction.quantity}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Order placed: {formatDateTime(mockTransaction.createdAt)}
                </p>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(mockTransaction.subtotal)}</span>
                </div>
                {mockTransaction.voucherDiscount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Voucher Discount</span>
                    <span>-{formatCurrency(mockTransaction.voucherDiscount)}</span>
                  </div>
                )}
                {mockTransaction.couponDiscount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Coupon Discount</span>
                    <span>-{formatCurrency(mockTransaction.couponDiscount)}</span>
                  </div>
                )}
                {mockTransaction.pointsUsed > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Points Used</span>
                    <span>-{formatCurrency(mockTransaction.pointsUsed)}</span>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(mockTransaction.finalPrice)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
