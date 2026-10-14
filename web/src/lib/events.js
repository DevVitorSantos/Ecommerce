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

export function trackViewItemList(category, items) {
  push("view_item_list", {
    item_list_name: category,
    item_list_id: category,
    items,
  });
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

export function trackBeginCheckout(items, value, coupon) {
  push("begin_checkout", {
    currency: "BRL",
    value,
    ...(coupon ? { coupon } : {}),
    items,
  });
}

export function trackAddShippingInfo(items, value) {
  push("add_shipping_info", { currency: "BRL", value, shipping_tier: "simulado", items });
}

export function trackAddPaymentInfo(items, value) {
  push("add_payment_info", { currency: "BRL", value, payment_type: "simulado", items });
}

export function trackPurchase(orderId, items, value, coupon) {
  push("purchase", {
    currency: "BRL",
    value,
    transaction_id: orderId,
    ...(coupon ? { coupon } : {}),
    items,
  });
}

export function trackApplyCoupon(code, discountValue, cartValue) {
  // GA4 não tem evento padrão para "aplicar cupom" — o padrão é o parâmetro
  // `coupon` em begin_checkout/purchase (já enviado). Este custom alimenta funil.
  push("apply_coupon", {
    currency: "BRL",
    coupon: code,
    discount_value: discountValue,
    value: cartValue,
  });
}

export function trackAddToWishlist(item) {
  push("add_to_wishlist", { currency: "BRL", value: item.price, items: [item] });
}

export function trackRemoveFromWishlist(item) {
  push("remove_from_wishlist", { currency: "BRL", value: item.price, items: [item] });
}

export function trackShare(item, method) {
  push("share", {
    method,
    content_type: "product",
    item_id: item.item_id,
    item_name: item.item_name,
  });
}

export function trackAddSuggestedItem(item, suggestedFrom) {
  push("add_suggested_item", {
    currency: "BRL",
    value: item.price * (item.quantity || 1),
    suggestion_source: "pdp_combo",
    suggested_from: suggestedFrom,
    items: [{ ...item, item_source: "suggestion" }],
  });
}

export function trackSearch(term) {
  push("search", { search_term: term });
}

export function trackPromotion(id, name) {
  push("view_promotion", { promotion_id: id, promotion_name: name, items: [] });
}

export function toGaItem(i) {
  const item = {
    item_id: i.sku,
    item_name: i.name,
    item_category: i.category,
    price: i.price,
    quantity: i.qty,
  };
  // itens sugeridos na PDP carregam a origem para atribuir receita à sugestão
  if (i.source) item.item_source = i.source;
  if (i.suggested_from) item.suggested_from = i.suggested_from;
  return item;
}
