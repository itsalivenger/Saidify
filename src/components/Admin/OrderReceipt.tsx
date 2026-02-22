'use client';

import { Package, Globe, Mail, Phone, MapPin } from 'lucide-react';

interface OrderItem {
    title: string;
    price: string | number;
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
    image?: string;
}

interface OrderReceiptProps {
    order: {
        _id: string;
        createdAt: string;
        totalAmount: number;
        paymentMethod: string;
        paymentStatus: string;
        shippingAddress: {
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            address: string;
            city: string;
            zipCode: string;
        };
        items: OrderItem[];
    };
    storeSettings?: {
        name: string;
        logo?: string;
        email?: string;
        phone?: string;
    };
}

export default function OrderReceipt({ order, storeSettings }: OrderReceiptProps) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(amount);
    };

    return (
        <div className="bg-white text-black p-8 max-w-4xl mx-auto print:p-0 print:m-0" id="order-receipt">
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-neutral-100 pb-8 mb-8">
                <div className="flex items-center gap-4">
                    {storeSettings?.logo ? (
                        <img src={storeSettings.logo} alt={storeSettings.name} className="w-16 h-16 object-contain" />
                    ) : (
                        <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center font-black text-xl">
                            {storeSettings?.name?.[0] || 'S'}
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter">{storeSettings?.name || 'SAID STORE'}</h1>
                        <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Official Receipt</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-1">Order ID</p>
                    <p className="text-xl font-black text-neutral-900">#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-neutral-500 mt-1 font-medium">{formatDate(order.createdAt)}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-12">
                {/* Client Information */}
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-4">Customer Details</h3>
                    <div className="space-y-3">
                        <p className="font-black text-lg">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                        <div className="space-y-1.5">
                            <p className="text-sm text-neutral-600 flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-neutral-300" /> {order.shippingAddress.email}
                            </p>
                            <p className="text-sm text-neutral-600 flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-neutral-300" /> {order.shippingAddress.phone}
                            </p>
                            <p className="text-sm text-neutral-600 flex items-center gap-2 items-start">
                                <MapPin className="w-3.5 h-3.5 text-neutral-300 mt-0.5" />
                                <span>
                                    {order.shippingAddress.address}<br />
                                    {order.shippingAddress.zipCode} {order.shippingAddress.city}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Payment Information */}
                <div className="bg-neutral-50 p-6 rounded-3xl">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-4">Payment Summary</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Method</span>
                            <span className="font-black uppercase text-sm">{order.paymentMethod.replace('_', ' ')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Status</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                {order.paymentStatus}
                            </span>
                        </div>
                        <div className="pt-4 border-t border-neutral-200 flex justify-between items-center">
                            <span className="text-sm font-black uppercase tracking-widest text-neutral-900">Total Paid</span>
                            <span className="text-2xl font-black text-neutral-900">{formatCurrency(order.totalAmount)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="mb-12">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-4 border-b border-neutral-100 pb-2">Order Summary</h3>
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-neutral-400 text-[10px] font-black uppercase tracking-widest">
                            <th className="pb-4 pt-2">Item Details</th>
                            <th className="pb-4 pt-2 text-center">Qty</th>
                            <th className="pb-4 pt-2 text-right">Unit Price</th>
                            <th className="pb-4 pt-2 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {order.items.map((item, idx) => {
                            const unitPrice = parseFloat(item.price.toString().replace(/[^0-9.]/g, ''));
                            const itemTotal = unitPrice * item.quantity;

                            return (
                                <tr key={idx} className="group">
                                    <td className="py-2.5">
                                        <div className="flex items-center gap-4">
                                            {item.image && (
                                                <div className="w-12 h-12 rounded-xl bg-neutral-100 overflow-hidden flex-shrink-0 print:hidden">
                                                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-black text-sm text-neutral-900">{item.title}</p>
                                                {(item.selectedSize || item.selectedColor) && (
                                                    <p className="text-[10px] font-bold text-neutral-400 uppercase mt-0.5">
                                                        {item.selectedSize} / {item.selectedColor}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2.5 text-center font-black text-sm">{item.quantity}</td>
                                    <td className="py-2.5 text-right font-bold text-sm">{formatCurrency(unitPrice)}</td>
                                    <td className="py-2.5 text-right font-black text-sm">{formatCurrency(itemTotal)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="pt-8 border-t-2 border-neutral-100 flex justify-between items-center text-neutral-400">
                <div className="text-xs font-medium">
                    <p>Merci pour votre confiance.</p>
                    <p className="mt-1">https://said.shop</p>
                </div>
                <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Order Receipt Proof</span>
                </div>
            </div>

            <style jsx>{`
                @media print {
                    @page { margin: 20mm; }
                    body { -webkit-print-color-adjust: exact; }
                    .print-hidden { display: none !important; }
                }
            `}</style>
        </div>
    );
}
