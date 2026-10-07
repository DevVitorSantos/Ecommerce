"use client";

function push(name, params = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...params });
}

export function trackViewItem(item) {
  push("view_item", { currency: "BRL", value: item.price, items: [item] });
}

export function trackSelectItem(item) {
  push("select_item", { currency: "BRL", items: [item] });
}

export function trackAddToCart(item) {
  push("add_to_cart", { currency: "BRL", value: item.price * item.quantity, items: [item] });
}

export function trackRemoveFromCart(item) {
  push("remove_from_cart", { currency: "BRL", value: item.price * item.quantity, items: [item] });
}

export function trackViewCart(items, value) {
  push("view_cart", { currency: "BRL", value, items });
}

export function trackBeginCheckout(items, value) {
  push("begin_checkout", { currency: "BRL", value, coupon: "DOPAMINA10", items });
}

export function trackAddShippingInfo(items, value) {
  push("add_shipping_info", { currency: "BRL", value, shipping_tier: "simulado", items });
}

export function trackAddPaymentInfo(items, value) {
  push("add_payment_info", { currency: "BRL", value, payment_type: "simulado", items });
}

export function trackPurchase(orderId, items, value) {
  push("purchase", { currency: "BRL", value, transaction_id: orderId, coupon: "DOPAMINA10", items });
}

export function trackSearch(term) {
  push("search", { search_term: term });
}

export function trackPromotion(id, name) {
  push("view_promotion", { promotion_id: id, promotion_name: name, items: [] });
}

export function toGaItem(i) {
  return {
    item_id: i.sku,
    item_name: i.name,
    item_category: i.category,
    price: i.price,
    quantity: i.qty,
  };
}
