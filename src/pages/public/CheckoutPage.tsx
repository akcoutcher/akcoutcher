import React, { useState } from 'react';
import { useCouture } from '../../context/CoutureContext';
import { createProductOrder } from '../../lib/productDb';
import { CustomerOrderInfo, ProductOrder } from '../../types/product';
import { useToast } from '../../components/common/Toast';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Sparkles,
  Lock,
} from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { cart, cartSubtotal, formatPrice, clearCart } = useCouture();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<CustomerOrderInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Punjab',
    pinCode: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card' | 'netbanking'>('cod');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<ProductOrder | null>(null);

  // Calculations
  const shippingCost = cartSubtotal > 2000 || cartSubtotal === 0 ? 0 : 150;
  const discountAmount = Math.round((cartSubtotal * discountPercent) / 100);
  const orderTotal = Math.max(0, cartSubtotal + shippingCost - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'AK10' || couponCode.trim().toUpperCase() === 'AKCOUTURE10') {
      setDiscountPercent(10);
      setCouponApplied(true);
      showToast('Promotional voucher applied: 10% Privilege Discount!');
    } else {
      showToast('Invalid coupon code. Try "AKCOUTURE10"');
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast('Your shopping bag is empty.');
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.address || !formData.pinCode) {
      showToast('Please fill all mandatory shipping address fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = createProductOrder({
        items: cart,
        customer: formData,
        paymentMethod,
        shippingCost,
        discountAmount,
      });

      setPlacedOrder(order);
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      showToast('There was an issue recording your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ------------------------------------------------------------------
  // SUCCESSFUL ORDER SCREEN
  // ------------------------------------------------------------------
  if (placedOrder) {
    const whatsappText = `Hello AK COUTURE, I have placed order #${placedOrder.orderNumber} for total ${formatPrice(placedOrder.total)}. Patron Name: ${placedOrder.customer.fullName}. Please confirm shipping timeline.`;
    const whatsappLink = `https://wa.me/919501657426?text=${encodeURIComponent(whatsappText)}`;

    return (
      <div className="w-full bg-[#F8F7F4] py-16 sm:py-24 text-[#151515]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl border border-stone-200/80 p-8 sm:p-12 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#C9A227] font-semibold">
                Order Confirmed
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#0B0B0B]">
                Thank You for Your Order
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 font-light">
                Your order has been recorded in our atelier management system. A confirmation notification has been dispatched to <strong>{placedOrder.customer.email || placedOrder.customer.phone}</strong>.
              </p>
            </div>

            {/* Order Summary Receipt Box */}
            <div className="p-5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-left space-y-3 text-xs">
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500 font-mono">Order Number:</span>
                <span className="font-mono font-bold text-stone-900">{placedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Patron Name:</span>
                <span className="font-semibold text-stone-900">{placedOrder.customer.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Shipping Destination:</span>
                <span className="text-stone-900 text-right max-w-xs">{placedOrder.customer.address}, {placedOrder.customer.city}, {placedOrder.customer.state} - {placedOrder.customer.pinCode}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Payment Selection:</span>
                <span className="uppercase font-mono font-semibold text-stone-900">{placedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-semibold text-stone-900">
                <span>Total Amount:</span>
                <span className="font-serif text-base text-[#58111A]">{formatPrice(placedOrder.total)}</span>
              </div>
            </div>

            {/* CTAs: WhatsApp confirmation & Return to Store */}
            <div className="space-y-3 pt-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm Order on WhatsApp</span>
              </a>

              <button
                onClick={() => onNavigate('/collections')}
                className="w-full py-3 px-4 rounded-xl bg-[#0B0B0B] hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Continue Exploring Collections
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // EMPTY CART FALLBACK
  // ------------------------------------------------------------------
  if (cart.length === 0) {
    return (
      <div className="w-full bg-[#F8F7F4] py-20 text-[#151515]">
        <div className="max-w-md mx-auto px-4 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-white border border-stone-200 flex items-center justify-center mx-auto text-stone-400 shadow-sm">
            <Sparkles className="w-8 h-8 text-[#C9A227]" />
          </div>
          <h2 className="font-serif text-3xl text-stone-900">Your Shopping Bag is Empty</h2>
          <p className="text-xs text-stone-500 leading-relaxed font-light">
            You currently have no creations in your cart to checkout.
          </p>
          <button
            onClick={() => onNavigate('/collections')}
            className="px-6 py-3 rounded-xl bg-[#0B0B0B] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#58111A] transition-colors"
          >
            Explore Collections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F8F7F4] py-10 sm:py-16 text-[#151515]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#C9A227] font-semibold">
            Secure Checkout
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#0B0B0B] font-normal">
            Finalize Your Atelier Order
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* -------------------------------------------------- */}
          {/* LEFT: SHIPPING ADDRESS & PAYMENT METHOD (7 Cols)   */}
          {/* -------------------------------------------------- */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Customer Details */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="font-serif text-xl text-stone-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#C9A227]" />
                <span>Shipping Address</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] uppercase font-mono text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Jasleen Kaur"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono text-stone-700 mb-1">
                    Mobile Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase font-mono text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jasleen@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase font-mono text-stone-700 mb-1">
                    Street Address / House / Flat *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="House No., Street, Landmark"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono text-stone-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Jalandhar / Chandigarh"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono text-stone-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="Punjab"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono text-stone-700 mb-1">
                    Postal PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pinCode}
                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                    placeholder="144102"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono text-stone-700 mb-1">
                    Order Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Specific delivery instructions"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Selection */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="font-serif text-xl text-stone-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#C9A227]" />
                <span>Payment Method</span>
              </h2>

              <div className="space-y-3">
                {/* Option 1: Cash on Delivery / Pay on Fitting */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#0B0B0B] bg-[#FAF7F2]'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-0.5 accent-[#0B0B0B]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-emerald-700" />
                      <span className="font-semibold text-xs text-stone-900">
                        Cash on Delivery / Pay on Fitting
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 font-light mt-0.5">
                      Pay securely upon courier delivery or during in-person studio trial at our Adampur Doaba atelier.
                    </p>
                  </div>
                </label>

                {/* Option 2: Instant UPI Payment */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-[#0B0B0B] bg-[#FAF7F2]'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="mt-0.5 accent-[#0B0B0B]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-[#C9A227]" />
                      <span className="font-semibold text-xs text-stone-900">
                        Instant UPI Payment (Google Pay / PhonePe / Paytm / BHIM)
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 font-light mt-0.5">
                      Direct UPI payment to official AK COUTURE account with zero convenience fee.
                    </p>
                  </div>
                </label>

                {/* Option 3: Credit / Debit Card Gateway */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#0B0B0B] bg-[#FAF7F2]'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mt-0.5 accent-[#0B0B0B]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-stone-700" />
                      <span className="font-semibold text-xs text-stone-900">
                        Credit / Debit Card (Visa, Mastercard, Amex, RuPay)
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 font-light mt-0.5">
                      Secured via 256-bit encrypted gateway. No raw card numbers stored.
                    </p>
                  </div>
                </label>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-2">
                <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
                <span>All transactions are encrypted and monitored with bank-grade security protocols.</span>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------- */}
          {/* RIGHT: ORDER SUMMARY SIDEBAR (5 Cols)             */}
          {/* -------------------------------------------------- */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-md space-y-6 sticky top-24">
              <h2 className="font-serif text-xl text-stone-900 border-b border-stone-100 pb-3">
                Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
              </h2>

              {/* Items List */}
              <div className="max-h-72 overflow-y-auto space-y-3 pr-1 divide-y divide-stone-100">
                {cart.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-14 h-16 rounded-lg object-cover bg-stone-100 shrink-0 border border-stone-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-stone-900 truncate">
                        {item.productName}
                      </h4>
                      <div className="text-[10px] text-stone-500 font-mono">
                        Qty: {item.quantity} {item.selectedSize ? `• Size: ${item.selectedSize}` : ''} {item.selectedColor ? `• ${item.selectedColor}` : ''}
                      </div>
                    </div>
                    <span className="font-serif text-xs font-medium text-stone-900 shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon / Voucher Input */}
              <div className="border-t border-stone-100 pt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. AKCOUTURE10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-stone-300 bg-stone-50 uppercase font-mono focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-stone-800 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-[11px] text-emerald-700 font-medium mt-1">
                    ✓ 10% Special Discount has been applied.
                  </p>
                )}
              </div>

              {/* Totals Breakdown */}
              <div className="border-t border-stone-100 pt-4 space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-stone-900">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-mono text-stone-900">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-700 font-semibold">FREE</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Voucher Discount</span>
                    <span className="font-mono font-semibold">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-stone-200">
                  <span className="font-serif">Grand Total</span>
                  <span className="font-serif text-xl text-[#58111A]">
                    {formatPrice(orderTotal)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-[#0B0B0B] hover:bg-[#58111A] text-white text-xs font-semibold uppercase tracking-[0.2em] transition-colors shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing Atelier Order...</span>
                ) : (
                  <>
                    <span>Place Order • {formatPrice(orderTotal)}</span>
                    <ArrowRight className="w-4 h-4 text-[#C9A227]" />
                  </>
                )}
              </button>

              <div className="text-center text-[10px] text-stone-400 font-light">
                By placing your order, you agree to AK COUTURE terms of service and bespoke fitting policy.
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
