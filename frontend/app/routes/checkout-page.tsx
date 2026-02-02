import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Tag,
  Coins,
  Ticket,
  Trash2,
  Loader2,
  ShoppingCart,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Slider } from "~/components/ui/slider";
import { EmptyState } from "~/components/shared/empty-state";
import { useCartStore } from "~/store/cart-store";
import { useAuthStore } from "~/store/auth-store";
import { formatCurrency, formatDate } from "~/types";
import { toast } from "sonner";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    items,
    appliedVoucher,
    appliedCouponCode,
    couponDiscount,
    pointsToUse,
    removeItem,
    updateQuantity,
    applyVoucher,
    removeVoucher,
    applyCoupon,
    removeCoupon,
    setPointsToUse,
    getSubtotal,
    getVoucherDiscount,
    getTotal,
    clearCart,
  } = useCartStore();

  const [voucherCode, setVoucherCode] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getSubtotal();
  const voucherDiscountAmount = getVoucherDiscount();
  const total = getTotal();
  const maxPoints = Math.min(user?.points || 0, subtotal);

  const handleApplyVoucher = () => {
    if (!voucherCode.trim()) {
      toast.error("Please enter a voucher code");
      return;
    }

    // Check if voucher exists in any cart item's event
    const event = items[0]?.event;
    const voucher = event?.vouchers.find(
      (v) => v.code.toLowerCase() === voucherCode.toLowerCase(),
    );

    if (voucher) {
      applyVoucher(voucher);
      toast.success("Voucher applied successfully!");
      setVoucherCode("");
    } else {
      toast.error("Invalid voucher code");
    }
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    // Mock coupon validation
    if (couponCode.toUpperCase() === "WELCOME100K") {
      applyCoupon(couponCode, 100000);
      toast.success("Coupon applied! IDR 100,000 discount");
      setCouponCode("");
    } else {
      toast.error("Invalid coupon code");
    }
  };

  const handleCheckout = async () => {
    setIsProcessing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success("Order placed successfully!");
    clearCart();
    navigate("/payment/txn-new");
    setIsProcessing(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-muted/30 py-12">
        <div className="container-wide">
          <EmptyState
            icon={ShoppingCart}
            title="Your cart is empty"
            description="Browse events and add tickets to your cart to continue."
            action={{
              label: "Browse Events",
              onClick: () => navigate("/events"),
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container-wide">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
            <p className="text-muted-foreground">Complete your purchase</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tickets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" />
                Your Tickets
              </h2>

              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.ticketType.id}
                    className="flex gap-4 p-4 rounded-lg bg-muted/50"
                  >
                    <img
                      src={item.event.image}
                      alt={item.event.title}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {item.event.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(item.event.startDate)}
                      </p>
                      <p className="text-sm text-primary font-medium mt-1">
                        {item.ticketType.name} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {formatCurrency(item.ticketType.price * item.quantity)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(
                              item.ticketType.id,
                              item.quantity - 1,
                            )
                          }
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(
                              item.ticketType.id,
                              item.quantity + 1,
                            )
                          }
                        >
                          +
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeItem(item.ticketType.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Voucher */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                Voucher Code
              </h2>

              {appliedVoucher ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20">
                  <div>
                    <p className="font-medium text-success">
                      {appliedVoucher.code}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {appliedVoucher.discountType === "percentage"
                        ? `${appliedVoucher.discountAmount}% off`
                        : formatCurrency(appliedVoucher.discountAmount) +
                          " off"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeVoucher}
                    className="text-destructive"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter voucher code"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={handleApplyVoucher}>
                    Apply
                  </Button>
                </div>
              )}
            </motion.div>

            {/* Coupon */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                Coupon Code
              </h2>

              {appliedCouponCode ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20">
                  <div>
                    <p className="font-medium text-success">
                      {appliedCouponCode}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(couponDiscount)} off
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeCoupon}
                    className="text-destructive"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={handleApplyCoupon}>
                    Apply
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Try: WELCOME100K
              </p>
            </motion.div>

            {/* Points */}
            {user && user.points > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-xl border border-border p-6"
              >
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Coins className="h-5 w-5 text-primary" />
                  Use Points
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Available Points
                    </span>
                    <span className="font-medium">
                      {formatCurrency(user.points)}
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <Label>Points to use</Label>
                      <span className="font-medium text-primary">
                        {formatCurrency(pointsToUse)}
                      </span>
                    </div>
                    <Slider
                      value={[pointsToUse]}
                      onValueChange={([value]) => setPointsToUse(value)}
                      max={maxPoints}
                      step={1000}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>IDR 0</span>
                      <span>{formatCurrency(maxPoints)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-card rounded-xl border border-border p-6 sticky top-24"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                {voucherDiscountAmount > 0 && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Voucher Discount</span>
                    <span>-{formatCurrency(voucherDiscountAmount)}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Coupon Discount</span>
                    <span>-{formatCurrency(couponDiscount)}</span>
                  </div>
                )}

                {pointsToUse > 0 && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Points Used</span>
                    <span>-{formatCurrency(pointsToUse)}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
              </div>

              <Button
                className="w-full mt-6 btn-gradient"
                size="lg"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Proceed to Payment"
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                By continuing, you agree to our{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
