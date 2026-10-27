/* ============================================
   AgroMarket – API Layer
   File: api.js
   ============================================ */
const API = (window.location.protocol === 'http:' || window.location.protocol === 'https:') ? '/api' : 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('agro_token');
const getUser  = () => JSON.parse(localStorage.getItem('agro_user') || 'null');
const setAuth  = (token, user) => { localStorage.setItem('agro_token', token); localStorage.setItem('agro_user', JSON.stringify(user)); };
const clearAuth = () => { localStorage.removeItem('agro_token'); localStorage.removeItem('agro_user'); };

async function call(endpoint, method='GET', body=null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  try {
    const res = await fetch(`${API}${endpoint}`, opts);
    return await res.json();
  } catch {
    return { success: false, message: 'Cannot connect to server. Make sure node server.js is running.' };
  }
}

window.AgroAPI = {
  // Auth
  register : (d)          => call('/auth/register','POST',d),
  login    : (email,pass) => call('/auth/login','POST',{email,password:pass}),
  profile  : ()           => call('/auth/profile'),
  updateProfile : (d)     => call('/auth/profile','PUT',d),
  changePassword: (d)     => call('/auth/change-password','PUT',d),
  logout   : ()           => { clearAuth(); location.reload(); },
  isLoggedIn: ()          => !!getToken(),
  currentUser: ()         => getUser(),
  setAuth, clearAuth, getToken, getUser,

  // Products
  getProducts  : (p={})  => call('/products?'+new URLSearchParams(p)),
  getProduct   : (id)    => call(`/products/${id}`),
  createProduct: (d)     => call('/products','POST',d),
  updateProduct: (id,d)  => call(`/products/${id}`,'PUT',d),
  deleteProduct: (id)    => call(`/products/${id}`,'DELETE'),
  myProducts   : ()      => call('/products/farmer/my-products'),
  toggleProduct: (id)    => call(`/products/${id}/toggle`,'PATCH'),

  // Categories
  getCategories: () => call('/categories'),

  // Cart
  getCart    : ()         => call('/cart'),
  addToCart  : (pid,qty)  => call('/cart/add','POST',{product_id:pid,quantity:qty}),
  updateCart : (pid,qty)  => call(`/cart/update/${pid}`,'PUT',{quantity:qty}),
  removeCart : (pid)      => call(`/cart/remove/${pid}`,'DELETE'),
  clearCart  : ()         => call('/cart/clear','DELETE'),

  // Wishlist
  getWishlist  : ()    => call('/wishlist'),
  toggleWishlist: (id) => call(`/wishlist/toggle/${id}`,'POST'),

  // Orders
  placeOrder  : (d)   => call('/orders','POST',d),
  myOrders    : ()    => call('/orders/my-orders'),
  getOrder    : (id)  => call(`/orders/${id}`),
  cancelOrder : (id,r)=> call(`/orders/${id}/cancel`,'PATCH',{cancellation_reason:r}),
  updateOrderStatus: (id,status) => call(`/orders/${id}/status`,'PATCH',{status}),

  // Payments
  simulatePayment: (oid,method,amount) => call('/payments/simulate','POST',{order_id:oid,payment_method:method,amount}),
  myPayments: () => call('/payments/my-payments'),

  // Dashboard
  adminDash  : () => call('/dashboard/admin'),
  farmerDash : () => call('/dashboard/farmer'),
  buyerDash  : () => call('/dashboard/buyer'),

  // Farmers
  getFarmers: (p={}) => call('/farmers?'+new URLSearchParams(p)),
  getFarmer : (id)   => call(`/farmers/${id}`),

  // Messages
  sendMessage : (to,msg,pid) => call('/messages/send','POST',{receiver_id:to,message:msg,product_id:pid}),
  inbox       : ()           => call('/messages/inbox'),
  conversation: (uid)        => call(`/messages/conversation/${uid}`),
  unreadCount : ()           => call('/messages/unread-count'),

  // Reviews
  addReview     : (d)   => call('/reviews','POST',d),
  productReviews: (id)  => call(`/reviews/product/${id}`),

  // Notifications
  getNotifications : () => call('/notifications'),
  markAllRead      : () => call('/notifications/mark-all-read','PATCH'),

  // Coupons
  validateCoupon: (code,amt) => call('/coupons/validate','POST',{code,order_amount:amt}),

  // Logistics
  trackShipment: (tn) => call(`/logistics/track/${tn}`),

  // MongoDB Analytics & Logging
  logView         : (d) => call('/analytics/view', 'POST', d),
  logSearch       : (d) => call('/analytics/search', 'POST', d),
  logActivity     : (d) => call('/analytics/activity', 'POST', d),
  getAnalyticsStats: () => call('/analytics/stats'),
  getActivities   : ()  => call('/analytics/activity'),
  getChatLogs     : ()  => call('/analytics/chats'),
  submitContactDoc: (d) => call('/analytics/contact', 'POST', d),
  getContactsDoc  : ()  => call('/analytics/contacts'),

  // Advanced AI Features (Groq + MongoDB)
  aiWeatherAdvisor: (d) => call('/ai/weather-advisor', 'POST', d),
  aiQualityGrade  : (d) => call('/ai/quality-grade', 'POST', d),
  aiNegotiate     : (d) => call('/ai/negotiate', 'POST', d),
  aiSoilAnalyzer  : (d) => call('/ai/soil-analyzer', 'POST', d)
};