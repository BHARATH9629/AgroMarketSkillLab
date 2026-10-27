/* ============================================
   AgroMarket – Frontend to Backend Connector
   File: app.js
   Full working version with Farmer, Buyer,
   Distributor registration saving to MySQL
   ============================================ */

/* ── Toast Notifications ── */
function showToast(message, type='success', title='') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:30px;right:30px;z-index:99999;display:flex;flex-direction:column;gap:10px;';
    document.body.appendChild(container);
  }
  const icons  = { success:'fa-check-circle', error:'fa-times-circle', warning:'fa-exclamation-triangle', info:'fa-info-circle' };
  const colors = { success:'#22c55e', error:'#ef4444', warning:'#f59e0b', info:'#3b82f6' };
  const toast  = document.createElement('div');
  toast.style.cssText = `background:#fff;border-radius:12px;padding:14px 20px;min-width:280px;max-width:340px;box-shadow:0 10px 40px rgba(0,0,0,0.12);border-left:4px solid ${colors[type]};display:flex;align-items:center;gap:12px;font-family:'Poppins',sans-serif;animation:toastIn 0.3s ease;`;
  toast.innerHTML = `
    <i class="fas ${icons[type]}" style="color:${colors[type]};font-size:1.2rem;flex-shrink:0;"></i>
    <div>
      <strong style="display:block;font-size:0.88rem;font-weight:700;color:#111827;">${title||message}</strong>
      ${title ? `<span style="font-size:0.78rem;color:#6b7280;">${message}</span>` : ''}
    </div>`;
  const style = document.createElement('style');
  style.textContent = '@keyframes toastIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes toastOut{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}';
  document.head.appendChild(style);
  container.appendChild(toast);
  setTimeout(() => { toast.style.animation='toastOut 0.3s ease forwards'; setTimeout(()=>toast.remove(),300); }, 3500);
}

/* ── Modal open/close ── */
window.openModal = function(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.visibility = 'visible';
  el.style.opacity    = '0';
  el.style.transition = 'opacity 0.3s';
  setTimeout(() => { el.style.opacity = '1'; }, 10);
};
window.closeModal = function(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.opacity = '0';
  setTimeout(() => { el.style.visibility = 'hidden'; }, 300);
};

/* ============================================
   KANNADA (ಕನ್ನಡ) & ENGLISH TRANSLATION SYSTEM
   ============================================ */
const AgroTranslations = {
  en: {
    // Nav
    nav_home: 'Home',
    nav_features: 'Features',
    nav_marketplace: 'Marketplace',
    nav_dashboard: 'Dashboard',
    nav_contact: 'Contact',
    nav_admin: '<i class="fas fa-shield-halved"></i> Admin Portal',
    btn_browse: 'Browse Market',
    btn_sell: '<i class="fas fa-plus-circle"></i> Sell Produce',
    btn_login: 'Login / Register',
    btn_orders: 'My Orders',
    buyer_mode: 'Buyer Mode',

    // Hero
    hero_badge: '<i class="fas fa-award"></i> India\'s #1 Agri-Tech Marketplace',
    hero_title: 'Smart Agricultural<br /><span class="gradient-text">Marketplace Portal</span>',
    hero_sub: 'Connecting <strong>Farmers</strong>, <strong>Buyers</strong>, and <strong>Distributors</strong> Digitally — a unified ecosystem that empowers every link in the agricultural chain.',
    hero_get_started: '<i class="fas fa-rocket"></i> Get Started',
    hero_explore: '<i class="fas fa-store"></i> Explore Products',
    stat_farmers: 'Farmers',
    stat_buyers: 'Buyers',
    stat_distributors: 'Distributors',
    stat_satisfaction: 'Satisfaction',
    hero_live_market: '<span class="pulse-dot"></span> Live Market',
    hero_best_prices: '<i class="fas fa-tags"></i> Best Prices',
    hero_scroll: 'Scroll to explore',

    // Marquee
    mq_organic: '<i class="fas fa-leaf"></i> Organic Farming',
    mq_modern: '<i class="fas fa-tractor"></i> Modern Agriculture',
    mq_direct: '<i class="fas fa-handshake"></i> Direct Trade',
    mq_ai: '<i class="fas fa-chart-line"></i> AI Price Prediction',
    mq_gps: '<i class="fas fa-map-marker-alt"></i> GPS Logistics',
    mq_secure: '<i class="fas fa-shield-alt"></i> Secure Payments',

    // Features Section
    feat_tag: 'What We Offer',
    feat_heading: 'Powerful Features for <span class="gradient-text">Every Stakeholder</span>',
    feat_subheading: 'Purpose-built modules that serve farmers, buyers, and distributors with equal precision.',
    feat_listing_title: 'Product Listing Module',
    feat_listing_desc: 'Farmers can effortlessly list crops, set prices, upload images, and manage availability in real-time with a guided, mobile-friendly interface.',
    feat_comm_title: 'Buyer-Seller Communication',
    feat_comm_desc: 'Integrated real-time messaging with notifications, image sharing, and negotiation tools — no phone calls or middlemen needed.',
    feat_order_title: 'Order Management',
    feat_order_desc: 'Track every order from placement to delivery. Automated status updates, invoice generation, and dispute resolution built in.',
    feat_payment_title: 'Payment Integration',
    feat_payment_desc: 'Simulated UPI, card, and wallet payment flows. Escrow-based secure transactions ensuring farmers get paid before dispatch.',
    feat_db_title: 'Database Support',
    feat_db_desc: 'Relational database architecture with full CRUD operations, audit logs, role-based access, and automated data backups.',
    feat_auth_title: 'Smart Authentication',
    feat_auth_desc: 'Role-based login for Farmers, Buyers, and Distributors. OTP verification and multi-factor authentication for security.',

    // Marketplace Section
    market_tag: 'Live Marketplace',
    market_heading: 'Fresh Products <span class="gradient-text">Direct from Farms</span>',
    market_subheading: 'Browse hundreds of agricultural products listed by verified farmers across the country.',
    filter_all: 'All Products',
    filter_grains: 'Grains',
    filter_veg: 'Vegetables',
    filter_fruits: 'Fruits',
    filter_organic: 'Organic',
    market_view_all: '<i class="fas fa-store"></i> View All Products',
    badge_in_stock: 'In Stock',
    badge_fresh_today: 'Fresh Today',
    badge_seasonal: 'Seasonal',
    badge_certified_organic: 'Certified Organic',
    btn_view_details: 'View Details',
    btn_add_to_cart: 'Add to Cart',
    btn_buy_now: 'Buy Now',

    // Dashboard Analytics Section
    dash_tag: 'Admin Console',
    dash_heading: 'Powerful <span class="gradient-text">Dashboard Analytics</span>',
    dash_sub: 'A bird\'s eye view of the entire marketplace ecosystem with real-time data.',
    kpi_total_orders: 'Total Orders',
    kpi_active_farmers: 'Active Farmers',
    kpi_monthly_rev: 'Monthly Revenue',
    kpi_categories: 'Product Categories',
    chart_monthly_sales: 'Monthly Sales',
    chart_categories: 'Product Categories',
    chart_recent_orders: 'Recent Orders',
    dash_view_all: 'View All <i class="fas fa-arrow-right"></i>',

    // AI Future Scope Section
    ai_tag: 'Future Roadmap',
    ai_heading: 'Powered by <span class="gradient-text-ai">Artificial Intelligence</span>',
    ai_sub: 'The next evolution of AgroMarket — where technology meets the soil.',
    ai_price_title: 'AI Price Prediction',
    ai_price_desc: 'Machine learning models analyze seasonal trends, demand patterns, and weather data to predict optimal crop prices — maximizing farmer profits.',
    ai_logistics_title: 'GPS Logistics Support',
    ai_logistics_desc: 'Real-time shipment tracking with intelligent route optimization, reducing delivery time by up to 40% and ensuring produce freshness.',
    ai_rec_title: 'Recommendation System',
    ai_rec_desc: 'Collaborative filtering engine suggests products, suppliers, and buyers based on purchase history, location, and behavioral patterns.',
    ai_crop_title: 'Smart Crop Analytics',
    ai_crop_desc: 'Computer vision and satellite imagery analysis to detect crop health, predict yields, and alert farmers about potential diseases early.',

    // Testimonials Section
    test_tag: 'Success Stories',
    test_heading: 'Voices from the <span class="gradient-text">Community</span>',
    test_sub: 'Real experiences from farmers, buyers, and distributors using AgroMarket.',

    // Contact Section
    contact_tag: 'Get In Touch',
    contact_heading: 'Start Your <span class="gradient-text">Journey Today</span>',
    contact_sub: 'Whether you\'re a farmer, buyer, or distributor — we\'re ready to help you grow. Reach out and our team will respond within 24 hours.',
    contact_call_us: 'Call Us',
    contact_email_us: 'Email Us',
    contact_visit_us: 'Visit Us',
    contact_form_title: 'Send a Message',
    contact_name_label: 'Full Name',
    contact_email_label: 'Email Address',
    contact_role_label: 'I am a...',
    contact_msg_label: 'Message',
    contact_send_btn: '<i class="fas fa-paper-plane"></i> Send Message',

    // Footer
    footer_sub: 'India\'s smartest agricultural marketplace — where technology meets tradition to grow a better tomorrow.',
    footer_platform: 'Platform',
    footer_users: 'Users',
    footer_company: 'Company',
    footer_for_farmers: 'For Farmers',
    footer_for_buyers: 'For Buyers',
    footer_for_distributors: 'For Distributors',
    footer_partner: 'Partner with Us',
    footer_about_us: 'About Us',
    footer_blog: 'Blog',
    footer_press: 'Press Kit',
    footer_privacy: 'Privacy Policy',
    footer_terms: 'Terms of Service',

    // Policy & Auth
    login_farmer_distributor: 'Please login as a Farmer or Distributor/Company Seller to post produce',
    only_sellers_allowed: 'Only Farmers and Distributors/Company Sellers can sell products. Buyer accounts cannot list items.',
    buyer_restricted_title: 'Selling Restricted for Buyers',
    buyer_restricted_body: 'Buyer accounts are configured for purchasing produce only. To sell crops or wholesale goods, please register or login as a Farmer or Distributor / Company Seller.'
  },
  kn: {
    // Nav
    nav_home: 'ಮುಖಪುಟ',
    nav_features: 'ವೈಶಿಷ್ಟ್ಯಗಳು',
    nav_marketplace: 'ಮಾರುಕಟ್ಟೆ',
    nav_dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    nav_contact: 'ಸಂಪರ್ಕ',
    nav_admin: '<i class="fas fa-shield-halved"></i> ನಿರ್ವಾಹಕ ಪೋರ್ಟಲ್',
    btn_browse: 'ಮಾರುಕಟ್ಟೆ ವೀಕ್ಷಿಸಿ',
    btn_sell: '<i class="fas fa-plus-circle"></i> ಬೆಳೆ ಮಾರಾಟ ಮಾಡಿ',
    btn_login: 'ಲಾಗಿನ್ / ನೋಂದಣಿ',
    btn_orders: 'ನನ್ನ ಆರ್ಡರ್‌ಗಳು',
    buyer_mode: 'ಖರೀದಿದಾರ ಮೋಡ್',

    // Hero
    hero_badge: '<i class="fas fa-award"></i> ಭಾರತದ ನಂ.1 ಅಗ್ರಿ-ಟೆಕ್ ಮಾರುಕಟ್ಟೆ',
    hero_title: 'ಬುದ್ಧಿವಂತ ಕೃಷಿ<br /><span class="gradient-text">ಮಾರುಕಟ್ಟೆ ಪೋರ್ಟಲ್</span>',
    hero_sub: '<strong>ರೈತರು</strong>, <strong>ಖರೀದಿದಾರರು</strong> ಮತ್ತು <strong>ವಿತರಕರನ್ನು</strong> ಡಿಜಿಟಲ್ ಆಗಿ ಸಂಪರ್ಕಿಸುವ — ಸಮಗ್ರ ಕೃಷಿ ಪರಿಸರ ವ್ಯವಸ್ಥೆ.',
    hero_get_started: '<i class="fas fa-rocket"></i> ಪ್ರಾರಂಭಿಸಿ',
    hero_explore: '<i class="fas fa-store"></i> ಉತ್ಪನ್ನಗಳನ್ನು ನೋಡಿ',
    stat_farmers: 'ರೈತರು',
    stat_buyers: 'ಖರೀದಿದಾರರು',
    stat_distributors: 'ವಿತರಕರು',
    stat_satisfaction: 'ತೃಪ್ತಿ',
    hero_live_market: '<span class="pulse-dot"></span> ಲೈವ್ ಮಾರುಕಟ್ಟೆ',
    hero_best_prices: '<i class="fas fa-tags"></i> ಉತ್ತಮ ಬೆಲೆಗಳು',
    hero_scroll: 'ವೀಕ್ಷಿಸಲು ಕೆಳಗೆ ಸ್ಕ್ರಾಲ್ ಮಾಡಿ',

    // Marquee
    mq_organic: '<i class="fas fa-leaf"></i> ಸಾವಯವ ಕೃಷಿ',
    mq_modern: '<i class="fas fa-tractor"></i> ಆಧುನಿಕ ಕೃಷಿ',
    mq_direct: '<i class="fas fa-handshake"></i> ನೇರ ವ್ಯಾಪಾರ',
    mq_ai: '<i class="fas fa-chart-line"></i> AI ಬೆಲೆ ಮುನ್ಸೂಚನೆ',
    mq_gps: '<i class="fas fa-map-marker-alt"></i> GPS ಸಾಗಾಣಿಕೆ',
    mq_secure: '<i class="fas fa-shield-alt"></i> ಸುರಕ್ಷಿತ ಪಾವತಿ',

    // Features Section
    feat_tag: 'ನಮ್ಮ ವೈಶಿಷ್ಟ್ಯಗಳು',
    feat_heading: 'ಪ್ರತಿಯೊಬ್ಬ ಪಾಲುದಾರರಿಗೂ <span class="gradient-text">ಶಕ್ತಿಶಾಲಿ ಸೌಲಭ್ಯಗಳು</span>',
    feat_subheading: 'ರೈತರು, ಖರೀದಿದಾರರು ಮತ್ತು ವಿತರಕರಿಗೆ ವಿಶೇಷವಾಗಿ ರೂಪಿಸಲಾದ ಅತ್ಯಾಧುನಿಕ ಸೌಲಭ್ಯಗಳು.',
    feat_listing_title: 'ಉತ್ಪನ್ನ ಪಟ್ಟಿ ಮಾಡ್ಯೂಲ್',
    feat_listing_desc: 'ರೈತರು ಸುಲಭವಾಗಿ ಬೆಳೆಗಳನ್ನು ಪಟ್ಟಿ ಮಾಡಬಹುದು, ದರ ನಿಗದಿಪಡಿಸಬಹುದು, ಚಿತ್ರಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ನೈಜ ಸಮಯದಲ್ಲಿ ಲಭ್ಯತೆ ನಿರ್ವಹಿಸಬಹುದು.',
    feat_comm_title: 'ಖರೀದಿದಾರ-ಮಾರಾಟಗಾರ ಸಂವಹನ',
    feat_comm_desc: 'ನೈಜ ಸಮಯದ ಸಂದೇಶ, ಚಿತ್ರ ಹಂಚಿಕೆ ಮತ್ತು ದರ ಚರ್ಚೆಯ ಸೌಲಭ್ಯ — ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ನೇರ ವ್ಯಾಪಾರ.',
    feat_order_title: 'ಆರ್ಡರ್ ನಿರ್ವಹಣೆ',
    feat_order_desc: 'ಬುಕಿಂಗ್‌ನಿಂದ ಹಿಡಿದು ಡೆಲಿವರಿವರೆಗೆ ಪ್ರತಿಯೊಂದು ಆರ್ಡರ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ. ಸ್ವಯಂಚಾಲಿತ ರಶೀದಿ ಮತ್ತು ಪರಿಹಾರ ವ್ಯವಸ್ಥೆ.',
    feat_payment_title: 'ಪಾವತಿ ಸಂಯೋಜನೆ',
    feat_payment_desc: 'UPI, ಕಾರ್ಡ್ ಮತ್ತು ಸುರಕ್ಷಿತ ಎಸ್ಕ್ರೋ ವಹಿವಾಟು — ಬೆಳೆ ಕಳುಹಿಸುವ ಮುನ್ನವೇ ರೈತರಿಗೆ ಹಣದ ಭದ್ರತೆ.',
    feat_db_title: 'ಡೇಟಾಬೇಸ್ ಬೆಂಬಲ',
    feat_db_desc: 'ರಿಲೇಶನಲ್ ಡೇಟಾಬೇಸ್, ಸ್ವಯಂಚಾಲಿತ ಬ್ಯಾಕಪ್ ಮತ್ತು ಸಂಪೂರ್ಣ ಭದ್ರತೆಯೊಂದಿಗೆ ಕಾರ್ಯನಿರ್ವಹಣೆ.',
    feat_auth_title: 'ಸ್ಮಾರ್ಟ್ ದೃಢೀಕರಣ',
    feat_auth_desc: 'ರೈತರು, ಖರೀದಿದಾರರು ಮತ್ತು ವಿತರಕರಿಗೆ ಪ್ರತ್ಯೇಕ ಪಾತ್ರಾಧಾರಿತ ಸುರಕ್ಷಿತ ಲಾಗಿನ್ ವ್ಯವಸ್ಥೆ.',

    // Marketplace Section
    market_tag: 'ಲೈವ್ ಮಾರುಕಟ್ಟೆ',
    market_heading: 'ತೋಟದಿಂದ ನೇರವಾಗಿ <span class="gradient-text">ತಾಜಾ ಉತ್ಪನ್ನಗಳು</span>',
    market_subheading: 'ದೇಶದ ದೃಢೀಕೃತ ರೈತರಿಂದ ನೂರಾರು ತಾಜಾ ಕೃಷಿ ಉತ್ಪನ್ನಗಳನ್ನು ವೀಕ್ಷಿಸಿ ಮತ್ತು ಖರೀದಿಸಿ.',
    filter_all: 'ಎಲ್ಲಾ ಉತ್ಪನ್ನಗಳು',
    filter_grains: 'ಧಾನ್ಯಗಳು',
    filter_veg: 'ತರಕಾರಿಗಳು',
    filter_fruits: 'ಹಣ್ಣುಗಳು',
    filter_organic: 'ಸಾವಯವ',
    market_view_all: '<i class="fas fa-store"></i> ಎಲ್ಲಾ ಉತ್ಪನ್ನಗಳನ್ನು ನೋಡಿ',
    badge_in_stock: 'ಲಭ್ಯವಿದೆ',
    badge_fresh_today: 'ಇಂದಿನ ತಾಜಾ',
    badge_seasonal: 'ಕಾಲೋಚಿತ',
    badge_certified_organic: 'ಪ್ರಮಾಣೀಕೃತ ಸಾವಯವ',
    btn_view_details: 'ವಿವರ ನೋಡಿ',
    btn_add_to_cart: 'ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ',
    btn_buy_now: 'ಈಗಲೇ ಖರೀದಿಸಿ',

    // Dashboard Analytics Section
    dash_tag: 'ನಿರ್ವಾಹಕ ಕನ್ಸೋಲ್',
    dash_heading: 'ಶಕ್ತಿಶಾಲಿ <span class="gradient-text">ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಅಂಕಿಅಂಶಗಳು</span>',
    dash_sub: 'ನೈಜ ಸಮಯದ ಡೇಟಾದೊಂದಿಗೆ ಸಂಪೂರ್ಣ ಮಾರುಕಟ್ಟೆ ವ್ಯವಸ್ಥೆಯ ಸಮಗ್ರ ನೋಟ.',
    kpi_total_orders: 'ಒಟ್ಟು ಆರ್ಡರ್‌ಗಳು',
    kpi_active_farmers: 'ಸಕ್ರಿಯ ರೈತರು',
    kpi_monthly_rev: 'ಮಾಸಿಕ ಆದಾಯ',
    kpi_categories: 'ಉತ್ಪನ್ನ ವಿಭಾಗಗಳು',
    chart_monthly_sales: 'ಮಾಸಿಕ ಮಾರಾಟ',
    chart_categories: 'ಉತ್ಪನ್ನ ವಿಭಾಗಗಳು',
    chart_recent_orders: 'ಇತ್ತೀಚಿನ ಆರ್ಡರ್‌ಗಳು',
    dash_view_all: 'ಎಲ್ಲವನ್ನೂ ನೋಡಿ <i class="fas fa-arrow-right"></i>',

    // AI Future Scope Section
    ai_tag: 'ಭವಿಷ್ಯದ ತಂತ್ರಜ್ಞಾನ',
    ai_heading: 'ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ <span class="gradient-text-ai">(AI) ತಂತ್ರಜ್ಞಾನ</span>',
    ai_sub: 'ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಮಣ್ಣಿನ ಸಮ್ಮಿಲನ — ಅಗ್ರೋಮಾರ್ಕೆಟ್ ಮುಂದಿನ ಕ್ರಾಂತಿ.',
    ai_price_title: 'AI ಬೆಲೆ ಮುನ್ಸೂಚನೆ',
    ai_price_desc: 'ಋತುಮಾನ, ಮಾರುಕಟ್ಟೆ ಬೇಡಿಕೆ ಮತ್ತು ಹವಾಮಾನ ವಿಶ್ಲೇಷಿಸಿ ರೈತರಿಗೆ ಗರಿಷ್ಠ ಲಾಭ ತರುವ ಅತ್ಯುತ್ತಮ ಬೆಲೆ ಸಲಹೆ.',
    ai_logistics_title: 'GPS ಸಾಗಾಣಿಕೆ ವ್ಯವಸ್ಥೆ',
    ai_logistics_desc: 'ಬುದ್ಧಿವಂತ ಮಾರ್ಗ ಆಪ್ಟಿಮೈಸೇಶನ್‌ನೊಂದಿಗೆ ನೈಜ ಸಮಯದ ಟ್ರ್ಯಾಕಿಂಗ್ — ತಲುಪುವ ಸಮಯವನ್ನು 40% ಕಡಿಮೆ ಮಾಡಿ ತಾಜಾತನ ಕಾಪಾಡುತ್ತದೆ.',
    ai_rec_title: 'ಸ್ಮಾರ್ಟ್ ಶಿಫಾರಸು ಎಂಜಿನ್',
    ai_rec_desc: 'ಖರೀದಿ ಇತಿಹಾಸ ಮತ್ತು ಸ್ಥಳದ ಆಧಾರದ ಮೇಲೆ ಅತ್ಯುತ್ತಮ ಉತ್ಪನ್ನಗಳು, ಪೂರೈಕೆದಾರರು ಮತ್ತು ಖರೀದಿದಾರರ ಶಿಫಾರಸು.',
    ai_crop_title: 'ಬೆಳೆ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ರೋಗ ಪತ್ತೆ',
    ai_crop_desc: 'ಬೆಳೆಯ ಆರೋಗ್ಯ ಪರೀಕ್ಷೆ, ಇಳುವರಿ ಅಂದಾಜು ಮತ್ತು ರೋಗಗಳನ್ನು ಆರಂಭದಲ್ಲೇ ಪತ್ತೆಹಚ್ಚುವ AI ತಂತ್ರಜ್ಞಾನ.',

    // Testimonials Section
    test_tag: 'ಯಶೋಗಾಥೆಗಳು',
    test_heading: 'ನಮ್ಮ <span class="gradient-text">ರೈತರು ಮತ್ತು ವ್ಯಾಪಾರಿಗಳ ಮಾತು</span>',
    test_sub: 'ಅಗ್ರೋಮಾರ್ಕೆಟ್ ಬಳಸುವ ರೈತರು, ಖರೀದಿದಾರರು ಮತ್ತು ವಿತರಕರ ನೈಜ ಅನುಭವಗಳು.',

    // Contact Section
    contact_tag: 'ಸಂಪರ್ಕಿಸಿ',
    contact_heading: 'ಇಂದೇ ನಿಮ್ಮ <span class="gradient-text">ಕೃಷಿ ಪಯಣ ಪ್ರಾರಂಭಿಸಿ</span>',
    contact_sub: 'ನೀವು ರೈತರಾಗಿರಲಿ, ಖರೀದಿದಾರರಾಗಿರಲಿ ಅಥವಾ ವಿತರಕರಾಗಿರಲಿ — ನಿಮ್ಮ ಬೆಳವಣಿಗೆಗೆ ಸಹಾಯ ಮಾಡಲು ನಾವು ಸಿದ್ಧರಿದ್ದೇವೆ. 24 ಗಂಟೆಗಳಲ್ಲಿ ನಮ್ಮ ತಂಡ ಪ್ರತಿಕ್ರಿಯಿಸುತ್ತದೆ.',
    contact_call_us: 'ಕರೆ ಮಾಡಿ',
    contact_email_us: 'ಇಮೇಲ್ ಮಾಡಿ',
    contact_visit_us: 'ಕಚೇರಿ ವಿಳಾಸ',
    contact_form_title: 'ಸಂದೇಶ ಕಳುಹಿಸಿ',
    contact_name_label: 'ಪೂರ್ಣ ಹೆಸರು',
    contact_email_label: 'ಇಮೇಲ್ ವಿಳಾಸ',
    contact_role_label: 'ನಾನು ಒಬ್ಬ...',
    contact_msg_label: 'ಸಂದೇಶ',
    contact_send_btn: '<i class="fas fa-paper-plane"></i> ಸಂದೇಶ ಕಳುಹಿಸಿ',

    // Footer
    footer_sub: 'ಭಾರತದ ಅತ್ಯಂತ ಬುದ್ಧಿವಂತ ಕೃಷಿ ಮಾರುಕಟ್ಟೆ — ಉತ್ತಮ ಭವಿಷ್ಯಕ್ಕಾಗಿ ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಸಂಪ್ರದಾಯದ ಸಮ್ಮಿಲನ.',
    footer_platform: 'ವೇದಿಕೆ',
    footer_users: 'ಬಳಕೆದಾರರು',
    footer_company: 'ಕಂಪನಿ',
    footer_for_farmers: 'ರೈತರಿಗಾಗಿ',
    footer_for_buyers: 'ಖರೀದಿದಾರರಿಗಾಗಿ',
    footer_for_distributors: 'ವಿತರಕರಿಗಾಗಿ',
    footer_partner: 'ನಮ್ಮೊಂದಿಗೆ ಪಾಲುದಾರರಾಗಿ',
    footer_about_us: 'ನಮ್ಮ ಬಗ್ಗೆ',
    footer_blog: 'ಬ್ಲಾಗ್',
    footer_press: 'ಮಾಧ್ಯಮ ಮಾಹಿತಿ',
    footer_privacy: 'ಗೌಪ್ಯತಾ ನೀತಿ',
    footer_terms: 'ಸೇವಾ ನಿಯಮಗಳು',

    // Policy & Auth
    login_farmer_distributor: 'ಬೆಳೆಗಳನ್ನು ಮಾರಾಟ ಮಾಡಲು ದಯವಿಟ್ಟು ರೈತ ಅಥವಾ ವಿತರಕರಾಗಿ ಲಾಗಿನ್ ಆಗಿ',
    only_sellers_allowed: 'ಕೇವಲ ರೈತರು ಮತ್ತು ಕಂಪನಿ/ವಿತರಕರು ಮಾತ್ರ ಉತ್ಪನ್ನಗಳನ್ನು ಮಾರಾಟ ಮಾಡಬಹುದು. ಖರೀದಿದಾರರ ಖಾತೆಯಿಂದ ಮಾರಾಟ ಸಾಧ್ಯವಿಲ್ಲ.',
    buyer_restricted_title: 'ಖರೀದಿದಾರರಿಗೆ ಮಾರಾಟ ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ',
    buyer_restricted_body: 'ಖರೀದಿದಾರ ಖಾತೆಯನ್ನು ಕೇವಲ ಉತ್ಪನ್ನಗಳನ್ನು ಖರೀದಿಸಲು ಮಾತ್ರ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ. ನಿಮ್ಮ ಬೆಳೆಗಳನ್ನು ಮಾರಾಟ ಮಾಡಲು, ದಯವಿಟ್ಟು ರೈತ ಅಥವಾ ವಿತರಕರಾಗಿ ಲಾಗಿನ್ ಆಗಿ.'
  }
};

let currentAgroLang = localStorage.getItem('agro_lang') || 'en';

window.setLanguage = function(lang) {
  if (lang !== 'en' && lang !== 'kn') lang = 'en';
  currentAgroLang = lang;
  localStorage.setItem('agro_lang', lang);

  const isKn = lang === 'kn';

  // Update button highlights
  const btnEn = document.getElementById('langBtnEn');
  const btnKn = document.getElementById('langBtnKn');
  if (btnEn && btnKn) {
    if (!isKn) {
      btnEn.style.background = '#16a34a';
      btnEn.style.color = '#fff';
      btnKn.style.background = 'transparent';
      btnKn.style.color = '#166534';
    } else {
      btnKn.style.background = '#16a34a';
      btnKn.style.color = '#fff';
      btnEn.style.background = 'transparent';
      btnEn.style.color = '#166534';
    }
  }

  // Update all DOM elements with data-i18n
  const dict = AgroTranslations[lang] || AgroTranslations.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.innerHTML = dict[key];
  });

  // Update Input Placeholders & Form Controls
  const nameInput = document.getElementById('name');
  if (nameInput) nameInput.placeholder = isKn ? 'ಉದಾ: ರಮೇಶ್ ಕುಮಾರ್' : 'e.g. Ramesh Kumar';

  const msgInput = document.getElementById('message');
  if (msgInput) msgInput.placeholder = isKn ? 'ನಿಮಗೆ ನಾವು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು ಎಂದು ತಿಳಿಸಿ...' : 'Tell us how we can help you...';

  const roleSelect = document.getElementById('role');
  if (roleSelect && roleSelect.options.length >= 4) {
    roleSelect.options[0].text = isKn ? 'ರೈತ' : 'Farmer';
    roleSelect.options[1].text = isKn ? 'ಖರೀದಿದಾರ' : 'Buyer';
    roleSelect.options[2].text = isKn ? 'ವಿತರಕ' : 'Distributor';
    roleSelect.options[3].text = isKn ? 'ಇತರ' : 'Other';
  }

  const searchInput = document.getElementById('searchInput') || document.querySelector('.search-input');
  if (searchInput) searchInput.placeholder = isKn ? 'ಉತ್ಪನ್ನ ಹುಡುಕಿ (ಉದಾ: ಟೊಮ್ಯಾಟೊ, ಬಾಸ್ಮತಿ ಅಕ್ಕಿ)...' : 'Search products (e.g. Organic Tomatoes, Basmati Rice)...';

  // Re-render navbar
  updateNavbar();

  // If Auth modal is open or exists, rebuild it with latest language
  const authModal = document.getElementById('authModal');
  if (authModal) {
    const isVisible = authModal.classList.contains('active') || authModal.style.visibility === 'visible' || authModal.style.display === 'flex';
    authModal.remove();
    buildAuthModal();
    if (isVisible) openModal('authModal');
  }

  // Update AI Chatbot and all AI tools
  if (window.updateAILanguage) {
    window.updateAILanguage(lang);
  }

  // Re-render market product cards in Kannada / English
  const activeFilterBtn = document.querySelector('.filter-btn.active');
  const cat = activeFilterBtn ? (activeFilterBtn.dataset.filter === 'all' ? '' : activeFilterBtn.dataset.filter) : '';
  if (typeof handleFilter === 'function' && activeFilterBtn) {
    handleFilter(activeFilterBtn, cat);
  }

  showToast(isKn ? 'ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಯಶಸ್ವಿಯಾಗಿ ಬದಲಾಯಿಸಲಾಗಿದೆ' : 'Language switched to English', 'info', 'AgroMarket');
};

window.AgroLang = {
  get current() { return currentAgroLang; },
  t(key) {
    const dict = AgroTranslations[currentAgroLang] || AgroTranslations.en;
    return dict[key] || AgroTranslations.en[key] || key;
  }
};

/* ── Buyer Restriction Modal ── */
function showBuyerRestrictionAlert() {
  let modal = document.getElementById('buyerRestrictionModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'buyerRestrictionModal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);backdrop-filter:blur(6px);z-index:99999;display:flex;align-items:center;justify-content:center;visibility:hidden;opacity:0;transition:opacity 0.3s;';
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal('buyerRestrictionModal'); });
    document.body.appendChild(modal);
  }

  const isKn = AgroLang.current === 'kn';
  modal.innerHTML = `
    <div style="background:#fff;border-radius:24px;width:90%;max-width:540px;padding:2.2rem;box-shadow:0 30px 80px rgba(0,0,0,0.25);position:relative;font-family:'Poppins',sans-serif;text-align:center;">
      <button onclick="closeModal('buyerRestrictionModal')" style="position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:50%;background:#f3f4f6;border:none;font-size:1.1rem;color:#6b7280;cursor:pointer;font-weight:700;">✕</button>
      
      <div style="width:72px;height:72px;border-radius:50%;background:#fee2e2;color:#dc2626;display:flex;align-items:center;justify-content:center;font-size:2rem;margin:0 auto 1.25rem;">
        <i class="fas fa-store-slash"></i>
      </div>

      <h3 style="font-size:1.35rem;font-weight:800;color:#0f172a;margin-bottom:0.5rem;">
        ${isKn ? 'ಖರೀದಿದಾರರಿಗೆ ಮಾರಾಟ ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ' : 'Selling Restricted for Buyers'}
      </h3>

      <div style="display:inline-block;background:#fef3c7;color:#92400e;border:1px solid #fde68a;font-size:0.78rem;font-weight:700;padding:4px 14px;border-radius:50px;margin-bottom:1rem;">
        <i class="fas fa-lock"></i> ${isKn ? 'ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಖಾತೆ: ಖರೀದಿದಾರ (Buyer)' : 'Active Account: Buyer'}
      </div>

      <p style="font-size:0.88rem;color:#4b5563;line-height:1.6;margin-bottom:1.5rem;">
        ${isKn 
          ? 'ಅಗ್ರೋಮಾರ್ಕೆಟ್ ನಿಯಮಾವಳಿ ಪ್ರಕಾರ, ಪರಿಶೀಲಿಸಿದ <strong>ರೈತರು (Farmers)</strong> ಮತ್ತು <strong>ವಿತರಕರು / ಕಂಪನಿ ಮಾರಾಟಗಾರರು (Distributors / Company Sellers)</strong> ಮಾತ್ರ ಉತ್ಪನ್ನಗಳನ್ನು ಮಾರಾಟ ಮಾಡಲು ಅನುಮತಿ ಹೊಂದಿದ್ದಾರೆ. ಖರೀದಿದಾರರ ಖಾತೆಗಳು ಬೆಳೆಗಳನ್ನು ಮತ್ತು ಉತ್ಪನ್ನಗಳನ್ನು ಖರೀದಿಸಲು ಮಾತ್ರ ಮೀಸಲಾಗಿವೆ.'
          : 'According to AgroMarket policy, only verified <strong>Farmers</strong> and <strong>Distributors / Company Sellers</strong> are permitted to list products for sale. Buyer accounts are dedicated to purchasing fresh produce.'}
      </p>

      <div style="background:#f0fdf4;border:1.5px dashed #86efac;border-radius:14px;padding:14px;margin-bottom:1.5rem;text-align:left;font-size:0.82rem;color:#166534;">
        <div style="font-weight:700;margin-bottom:4px;"><i class="fas fa-lightbulb"></i> ${isKn ? 'ನೀವು ಮಾರಾಟ ಮಾಡಲು ಬಯಸುವಿರಾ?' : 'Want to Sell Produce or Wholesale Stock?'}</div>
        <div>${isKn 
          ? 'ಹೊಸ ರೈತ ಅಥವಾ ವಿತರಕ/ಕಂಪನಿ ಖಾತೆಯನ್ನು ತೆರೆಯಿರಿ ಅಥವಾ ಲಾಗೌಟ್ ಮಾಡಿ ಆ ಪಾತ್ರದಲ್ಲಿ ನೋಂದಾಯಿಸಿ.' 
          : 'Register as a Farmer (direct crops) or Distributor (company wholesale & bulk inventory).'}</div>
      </div>

      <div style="display:flex;gap:10px;">
        <button onclick="closeModal('buyerRestrictionModal');AgroAPI.logout();openModal('authModal');switchAuthTab('register');"
          style="flex:1;padding:12px;background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;border:none;border-radius:12px;font-size:0.88rem;font-weight:700;cursor:pointer;">
          <i class="fas fa-user-plus"></i> ${isKn ? 'ರೈತ/ವಿತರಕರಾಗಿ ನೋಂದಾಯಿಸಿ' : 'Register as Farmer / Seller'}
        </button>
        <button onclick="closeModal('buyerRestrictionModal')"
          style="padding:12px 18px;background:#f3f4f6;color:#4b5563;border:none;border-radius:12px;font-size:0.88rem;font-weight:600;cursor:pointer;">
          ${isKn ? 'ಸರಿ, ಅರ್ಥವಾಯಿತು' : 'Got it'}
        </button>
      </div>
    </div>`;

  openModal('buyerRestrictionModal');
}
window.showBuyerRestrictionAlert = showBuyerRestrictionAlert;

/* ── Image Upload Helpers (Drag & Drop, Paste, Browse) ── */
function applyUploadedImage(dataUrl, sourceLabel) {
  const imgInput = document.getElementById('pImage');
  const preview  = document.getElementById('postImgPreview');
  const badge    = document.getElementById('imgSourceBadge');
  const clearBtn = document.getElementById('imgClearBtn');
  if (imgInput) imgInput.value = dataUrl;
  if (preview)  preview.src = dataUrl;
  if (badge)    badge.textContent = sourceLabel || 'Image Ready ✓';
  if (clearBtn) clearBtn.style.display = 'inline-block';
}

function clearProductImage() {
  const imgInput = document.getElementById('pImage');
  const preview  = document.getElementById('postImgPreview');
  const badge    = document.getElementById('imgSourceBadge');
  const clearBtn = document.getElementById('imgClearBtn');
  if (imgInput) imgInput.value = '';
  if (preview)  preview.src = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400';
  if (badge)    badge.textContent = 'No Image Selected';
  if (clearBtn) clearBtn.style.display = 'none';
  showToast('Image cleared', 'info', 'Image Reset');
}

function handleImageFileSelected(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        applyUploadedImage(evt.target.result, `File: ${file.name} 🖼️`);
        showToast('Image selected from device!', 'success', 'Image Loaded');
      };
      reader.readAsDataURL(file);
    } else {
      showToast('Please select a valid image file', 'error', 'Invalid File');
    }
  }
}

// Global Paste Event Listener for Modal
window.handleModalImagePaste = function(e) {
  const modal = document.getElementById('postProductModal');
  if (!modal || modal.style.visibility === 'hidden') return;

  const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
  if (!items) return;

  for (const item of items) {
    if (item.type.indexOf('image') !== -1) {
      const blob = item.getAsFile();
      const reader = new FileReader();
      reader.onload = (evt) => {
        applyUploadedImage(evt.target.result, 'Pasted from Clipboard (Ctrl+V) 📋');
        showToast('Image pasted from clipboard!', 'success', 'Image Uploaded');
      };
      reader.readAsDataURL(blob);
      e.preventDefault();
      break;
    }
  }
};
window.removeEventListener('paste', window.handleModalImagePaste);
window.addEventListener('paste', window.handleModalImagePaste);

/* ── Navbar ── */
function updateNavbar() {
  const user   = AgroAPI.currentUser();
  const navCta = document.querySelector('.nav-cta');
  if (!navCta) return;

  const isKn    = AgroLang.current === 'kn';
  const isBuyer = user && user.role === 'buyer';

  const postAction = user ? 'openPostProductModal()' : 'openAuthModalDirect()';
  let actionBtn = '';
  if (isBuyer) {
    actionBtn = `
      <button onclick="openMyOrders()" class="btn-orders-nav" title="${isKn ? 'ನನ್ನ ಆರ್ಡರ್‌ಗಳು' : 'My Orders'}"
        style="background:linear-gradient(135deg,#2563eb,#3b82f6);color:#fff;border:none;padding:7px 15px;border-radius:50px;font-size:0.82rem;font-weight:700;letter-spacing:0.2px;cursor:pointer;display:flex;align-items:center;gap:6px;font-family:'Poppins',sans-serif;box-shadow:0 4px 14px rgba(37,99,235,0.32);transition:all 0.25s;flex-shrink:0;white-space:nowrap;"
        onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 22px rgba(37,99,235,0.48)';"
        onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 14px rgba(37,99,235,0.32)';">
        <i class="fas fa-box-open" style="font-size:0.95rem;"></i> <span>${isKn ? 'ಆರ್ಡರ್‌ಗಳು' : 'My Orders'}</span>
      </button>`;
  } else {
    const postProduceAction = user ? 'openPostProductModal()' : 'openAuthModalDirect()';
    actionBtn = `
      <button onclick="${postProduceAction}" class="btn-sell-nav" title="${isKn ? 'ನಿಮ್ಮ ಬೆಳೆಗಳನ್ನು ಮಾರಾಟಕ್ಕೆ ಪಟ್ಟಿ ಮಾಡಿ' : 'List your crops for sale'}"
        style="background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;border:none;padding:7px 15px;border-radius:50px;font-size:0.82rem;font-weight:700;letter-spacing:0.2px;cursor:pointer;display:flex;align-items:center;gap:6px;box-shadow:0 4px 14px rgba(22,163,74,0.32);font-family:'Poppins',sans-serif;transition:all 0.25s;flex-shrink:0;white-space:nowrap;"
        onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 22px rgba(34,197,94,0.48)';"
        onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 14px rgba(22,163,74,0.32)';">
        <i class="fas fa-plus-circle" style="font-size:0.95rem;"></i> <span>${isKn ? 'ಬೆಳೆ ಮಾರಾಟ' : 'Sell Produce'}</span>
      </button>`;
  }

  if (user) {
    const isSeller = user.role === 'farmer' || user.role === 'distributor';

    navCta.innerHTML = `
      <div class="nav-user-menu" style="display:flex;align-items:center;gap:7px;position:relative;flex-shrink:0;">
        ${actionBtn}
        
        <!-- Notification Bell -->
        <div style="position:relative;flex-shrink:0;">
          <button onclick="toggleNotificationDropdown()" title="Notifications" id="notifBellBtn"
            style="position:relative;background:#f0fdf4;border:1.5px solid #86efac;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#16a34a;font-size:0.95rem;cursor:pointer;transition:all 0.2s;"
            onmouseover="this.style.background='#dcfce7';this.style.borderColor='#16a34a';"
            onmouseout="this.style.background='#f0fdf4';this.style.borderColor='#86efac';">
            <i class="fas fa-bell"></i>
            <span id="notifBadge" style="display:none;position:absolute;top:-4px;right:-4px;background:#ef4444;color:#fff;width:17px;height:17px;border-radius:50%;font-size:0.62rem;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(239,68,68,0.4);">0</span>
          </button>
          <div id="notifDropdown" style="display:none;position:absolute;top:115%;right:0;background:#fff;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,0.15);border:1px solid #d1fae5;width:320px;max-height:380px;overflow-y:auto;padding:12px;z-index:9000;font-family:'Poppins',sans-serif;">
            <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:8px;border-bottom:1px solid #f0fdf4;margin-bottom:8px;">
              <strong style="font-size:0.9rem;color:#052e16;"><i class="fas fa-bell" style="color:#16a34a;"></i> ${isKn ? 'ಸೂಚನೆಗಳು' : 'Notifications'}</strong>
              <span onclick="markNotificationsRead()" style="font-size:0.75rem;color:#16a34a;cursor:pointer;font-weight:600;">${isKn ? 'ಎಲ್ಲವನ್ನೂ ಓದಿದೆ ಎಂದು ಗುರುತಿಸಿ' : 'Mark all read'}</span>
            </div>
            <div id="notifList" style="font-size:0.8rem;color:#6b7280;text-align:center;padding:12px 0;">${isKn ? 'ಯಾವುದೇ ಹೊಸ ಸೂಚನೆಗಳಿಲ್ಲ' : 'No new notifications'}</div>
          </div>
        </div>

        <!-- Cart Button -->
        <button onclick="toggleCart()" title="Cart"
          style="position:relative;background:#f0fdf4;border:1.5px solid #86efac;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#16a34a;font-size:0.95rem;cursor:pointer;flex-shrink:0;transition:all 0.2s;"
          onmouseover="this.style.background='#dcfce7';this.style.borderColor='#16a34a';"
          onmouseout="this.style.background='#f0fdf4';this.style.borderColor='#86efac';">
          <i class="fas fa-shopping-cart"></i>
          <span id="cartBadge" style="display:none;position:absolute;top:-4px;right:-4px;background:#ef4444;color:#fff;width:17px;height:17px;border-radius:50%;font-size:0.62rem;font-weight:700;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(239,68,68,0.4);">0</span>
        </button>

        <!-- User Dropdown Menu -->
        <div style="position:relative;flex-shrink:0;">
          <button onclick="toggleUserDropdown()"
            style="display:flex;align-items:center;gap:7px;background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1.5px solid #86efac;padding:6px 13px;border-radius:50px;font-size:0.82rem;font-weight:700;color:#15803d;cursor:pointer;font-family:'Poppins',sans-serif;white-space:nowrap;box-shadow:0 2px 8px rgba(22,163,74,0.12);transition:all 0.2s;"
            onmouseover="this.style.borderColor='#16a34a';this.style.boxShadow='0 4px 12px rgba(22,163,74,0.2)';"
            onmouseout="this.style.borderColor='#86efac';this.style.boxShadow='0 2px 8px rgba(22,163,74,0.12)';">
            <i class="fas fa-user-circle" style="font-size:0.95rem;color:#16a34a;"></i> <span>${user.full_name.split(' ')[0]}</span>
            <i class="fas fa-chevron-down" style="font-size:0.65rem;color:#15803d;"></i>
          </button>
          <div id="userDropdown" style="display:none;position:absolute;top:110%;right:0;background:#fff;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,0.15);border:1px solid #d1fae5;min-width:240px;padding:8px;z-index:9000;">
            <div style="padding:12px;border-bottom:1px solid #f0fdf4;margin-bottom:4px;">
              <strong style="display:block;font-size:0.9rem;color:#052e16;font-family:'Poppins',sans-serif;">${user.full_name}</strong>
              <div style="display:flex;gap:6px;margin-top:4px;flex-wrap:wrap;">
                <span style="font-size:0.72rem;color:#fff;background:${user.role==='buyer' ? '#3b82f6' : user.role==='farmer' ? '#16a34a' : user.role==='distributor' ? '#8b5cf6' : '#ef4444'};padding:2px 10px;border-radius:50px;display:inline-block;font-family:'Poppins',sans-serif;font-weight:600;text-transform:capitalize;">${user.role}</span>
                ${user.role === 'distributor' ? '<span style="font-size:0.72rem;background:#f3e8ff;color:#6b21a8;padding:2px 8px;border-radius:50px;font-weight:600;">🏢 Company Seller</span>' : ''}
              </div>
            </div>
            <div onclick="openProfileModal()" style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;font-size:0.85rem;color:#374151;cursor:pointer;font-family:'Poppins',sans-serif;" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='none'">
              <i class="fas fa-user" style="color:#16a34a;width:16px;"></i> ${isKn ? 'ನನ್ನ ಪ್ರೊಫೈಲ್' : 'My Profile'}
            </div>
            <div onclick="openMyOrders()" style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;font-size:0.85rem;color:#374151;cursor:pointer;font-family:'Poppins',sans-serif;" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='none'">
              <i class="fas fa-box" style="color:#16a34a;width:16px;"></i> ${isKn ? 'ನನ್ನ ಆರ್ಡರ್‌ಗಳು' : 'My Orders'}
            </div>
            ${isSeller ? `
            <div onclick="openFarmerDash()" style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;font-size:0.85rem;color:#374151;cursor:pointer;font-family:'Poppins',sans-serif;" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='none'">
              <i class="fas fa-tractor" style="color:#16a34a;width:16px;"></i> ${isKn ? 'ಮಾರಾಟಗಾರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್' : 'Seller Dashboard'}
            </div>
            <div onclick="openPostProductModal()" style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;font-size:0.85rem;color:#374151;cursor:pointer;font-family:'Poppins',sans-serif;" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='none'">
              <i class="fas fa-plus-circle" style="color:#16a34a;width:16px;"></i> ${isKn ? 'ಹೊಸ ಬೆಳೆ ಪೋಸ್ಟ್ ಮಾಡಿ' : 'Post New Item'}
            </div>` : ''}
            <div onclick="openAdminDash()" style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;font-size:0.85rem;color:#374151;cursor:pointer;font-family:'Poppins',sans-serif;" onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='none'">
              <i class="fas fa-chart-pie" style="color:#2563eb;width:16px;"></i> Admin Console (Live)
            </div>
            <a href="/admin" target="_blank" style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;font-size:0.85rem;color:#2563eb;font-weight:700;cursor:pointer;font-family:'Poppins',sans-serif;text-decoration:none;" onmouseover="this.style.background='#eff6ff'" onmouseout="this.style.background='none'">
              <i class="fas fa-shield-halved" style="color:#2563eb;width:16px;"></i> ${isKn ? 'ಮಾಸ್ಟರ್ ಅಡ್ಮಿನ್ ಪೋರ್ಟಲ್ ↗' : 'Master Admin Portal ↗'}
            </a>
            <div style="height:1px;background:#f0fdf4;margin:4px 0;"></div>
            <div onclick="AgroAPI.logout()" style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;font-size:0.85rem;color:#ef4444;cursor:pointer;font-family:'Poppins',sans-serif;" onmouseover="this.style.background='#fee2e2'" onmouseout="this.style.background='none'">
              <i class="fas fa-sign-out-alt" style="width:16px;"></i> ${isKn ? 'ಲಾಗೌಟ್' : 'Logout'}
            </div>
          </div>
        </div>

        <!-- Direct Navbar Logout Button -->
        <button onclick="AgroAPI.logout()" title="Logout"
          style="background:linear-gradient(135deg,#fee2e2,#fecaca);border:1.5px solid #fca5a5;color:#dc2626;padding:6px 13px;border-radius:50px;font-size:0.8rem;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:5px;font-family:'Poppins',sans-serif;transition:all 0.25s;flex-shrink:0;white-space:nowrap;box-shadow:0 2px 8px rgba(239,68,68,0.15);"
          onmouseover="this.style.background='#ef4444';this.style.color='#fff';this.style.borderColor='#ef4444';this.style.boxShadow='0 4px 14px rgba(239,68,68,0.4)';"
          onmouseout="this.style.background='linear-gradient(135deg,#fee2e2,#fecaca)';this.style.color='#dc2626';this.style.borderColor='#fca5a5';this.style.boxShadow='0 2px 8px rgba(239,68,68,0.15)';">
          <i class="fas fa-sign-out-alt"></i> <span>${isKn ? 'ಲಾಗೌಟ್' : 'Logout'}</span>
        </button>
      </div>`;
    loadCartCount();
    loadNotificationsBadge();
    checkFarmerNewOrdersAlert();
  } else {
    // Both Sell Produce AND Login buttons displayed side by side (just like earlier!)
    navCta.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
        <button onclick="openModal('authModal')" class="btn-sell-nav" title="${isKn ? 'ನಿಮ್ಮ ಬೆಳೆಗಳನ್ನು ಮಾರಾಟಕ್ಕೆ ಪಟ್ಟಿ ಮಾಡಿ' : 'List your crops for sale'}"
          style="background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;border:none;padding:8px 16px;border-radius:50px;font-size:0.84rem;font-weight:700;letter-spacing:0.2px;cursor:pointer;display:flex;align-items:center;gap:6px;box-shadow:0 4px 14px rgba(22,163,74,0.32);font-family:'Poppins',sans-serif;transition:all 0.25s;flex-shrink:0;white-space:nowrap;"
          onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 22px rgba(34,197,94,0.48)';"
          onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 14px rgba(22,163,74,0.32)';">
          <i class="fas fa-plus-circle" style="font-size:0.95rem;"></i> <span>${isKn ? 'ಬೆಳೆ ಮಾರಾಟ' : 'Sell Produce'}</span>
        </button>
        <button onclick="openModal('authModal')" class="btn-nav" id="navLoginBtn" title="${isKn ? 'ಖಾತೆಗೆ ಲಾಗಿನ್ ಅಥವಾ ನೋಂದಣಿ' : 'Login or Register'}"
          style="background:linear-gradient(135deg,#15803d,#16a34a);color:#fff;padding:8px 18px;border-radius:50px;font-size:0.84rem;font-weight:700;letter-spacing:0.2px;border:none;cursor:pointer;font-family:'Poppins',sans-serif;box-shadow:0 4px 16px rgba(21,128,61,0.38);white-space:nowrap;display:flex;align-items:center;gap:6px;flex-shrink:0;transition:all 0.25s cubic-bezier(0.4, 0, 0.2, 1);"
          onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 24px rgba(22,163,74,0.5)';"
          onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 16px rgba(21,128,61,0.38)';">
          <i class="fas fa-user-circle" style="font-size:1rem;"></i> <span>${isKn ? 'ಲಾಗಿನ್ / ನೋಂದಣಿ' : 'Login / Register'}</span>
        </button>
      </div>`;
  }

  // Also update mobile drawer actions so mobile users NEVER lose the login button!
  const navLinksUl = document.getElementById('navLinks');
  if (navLinksUl) {
    let mobActions = document.getElementById('mobileNavActions');
    if (!mobActions) {
      mobActions = document.createElement('li');
      mobActions.id = 'mobileNavActions';
      mobActions.className = 'mobile-menu-actions';
      navLinksUl.appendChild(mobActions);
    }
    if (user) {
      mobActions.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:8px;padding-top:10px;">
          ${actionBtn}
          <button onclick="AgroAPI.logout()" style="background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;padding:8px;border-radius:50px;font-size:0.85rem;font-weight:700;cursor:pointer;">
            <i class="fas fa-sign-out-alt"></i> ${isKn ? 'ಲಾಗೌಟ್' : 'Logout'} (${user.full_name.split(' ')[0]})
          </button>
        </div>`;
    } else {
      mobActions.innerHTML = `
        <div style="display:flex;gap:8px;padding-top:10px;">
          <button onclick="openModal('authModal');document.getElementById('hamburger')?.click();" style="flex:1;background:#16a34a;color:#fff;padding:9px;border-radius:50px;font-size:0.85rem;font-weight:700;border:none;cursor:pointer;">
            <i class="fas fa-user-circle"></i> ${isKn ? 'ಲಾಗಿನ್ / ನೋಂದಣಿ' : 'Login / Register'}
          </button>
          <button onclick="openModal('authModal');document.getElementById('hamburger')?.click();" style="flex:1;background:#f0fdf4;color:#166534;border:1.5px solid #86efac;padding:9px;border-radius:50px;font-size:0.85rem;font-weight:700;cursor:pointer;">
            <i class="fas fa-plus-circle"></i> ${isKn ? 'ಬೆಳೆ ಮಾರಾಟ' : 'Sell Produce'}
          </button>
        </div>`;
    }
  }
}

function toggleUserDropdown() {
  const dd = document.getElementById('userDropdown');
  if (dd) dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
}
function toggleNotificationDropdown() {
  const dd = document.getElementById('notifDropdown');
  if (!dd) return;
  const isHidden = dd.style.display === 'none';
  dd.style.display = isHidden ? 'block' : 'none';
  if (isHidden) fetchAndRenderNotifications();
}
async function loadNotificationsBadge() {
  if (!AgroAPI.isLoggedIn()) return;
  const res = await AgroAPI.getNotifications();
  const count = res.unreadCount ?? res.unread ?? 0;
  if (res.success && count > 0) {
    const badge = document.getElementById('notifBadge');
    if (badge) {
      badge.textContent = count;
      badge.style.display = 'flex';
    }
  }
}

async function checkFarmerNewOrdersAlert() {
  const user = AgroAPI.currentUser();
  if (!user || (user.role !== 'farmer' && user.role !== 'distributor')) return;
  try {
    const res = await AgroAPI.farmerDash();
    if (res.success && res.recentOrders && res.recentOrders.length > 0) {
      const pending = res.recentOrders.filter(o => (o.order_status === 'pending' || o.status === 'pending'));
      if (pending.length > 0) {
        const isKn = AgroLang.current === 'kn';
        const msg = isKn
          ? `ಗ್ರಾಹಕರಿಂದ ${pending.length} ಹೊಸ ಬೆಳೆ ಆರ್ಡರ್‌ಗಳು ಬಂದಿವೆ! ವಿವರಗಳನ್ನು ನೋಡಲು ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ.`
          : `You have ${pending.length} new crop order(s) received from buyers! Click to view and dispatch.`;
        showToast(
          `<div onclick="openFarmerDash()" style="cursor:pointer;font-weight:700;">${msg}</div>`,
          'success',
          isKn ? '🌾 ಹೊಸ ಆರ್ಡರ್ ಬಂದಿದೆ!' : '🌾 New Customer Orders!'
        );
      }
    }
  } catch(e) {}
}
async function fetchAndRenderNotifications() {
  const list = document.getElementById('notifList');
  if (!list) return;
  list.innerHTML = '<i class="fas fa-spinner fa-spin" style="color:#16a34a;"></i> Loading alerts...';
  const res = await AgroAPI.getNotifications();
  if (res.success && res.notifications?.length) {
    list.innerHTML = res.notifications.map(n => `
      <div style="padding:8px 10px;border-radius:8px;background:${n.is_read ? '#fff' : '#f0fdf4'};border:1px solid #e5e7eb;margin-bottom:6px;text-align:left;">
        <div style="font-weight:700;color:#052e16;font-size:0.82rem;">${n.title || 'Market Update'}</div>
        <div style="font-size:0.75rem;color:#4b5563;margin:2px 0;">${n.message}</div>
        <span style="font-size:0.68rem;color:#9ca3af;">${new Date(n.created_at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</span>
      </div>`).join('');
  } else {
    list.innerHTML = '<div style="padding:10px 0;color:#9ca3af;">No recent alerts.</div>';
  }
}
async function markNotificationsRead() {
  await AgroAPI.markAllRead();
  const badge = document.getElementById('notifBadge');
  if (badge) badge.style.display = 'none';
  showToast('All notifications marked as read', 'info', 'Notifications');
  fetchAndRenderNotifications();
}
document.addEventListener('click', (e) => {
  const dd = document.getElementById('userDropdown');
  if (dd && !e.target.closest('.nav-user-menu')) dd.style.display = 'none';
  const nd = document.getElementById('notifDropdown');
  if (nd && !e.target.closest('#notifBellBtn') && !e.target.closest('#notifDropdown')) nd.style.display = 'none';
});


/* ============================================
   AUTH MODAL — Login + Register
   Supports: Farmer, Buyer, Distributor
   All data saved to MySQL
   ============================================ */
function buildAuthModal() {
  if (document.getElementById('authModal')) return;
  const isKn = typeof AgroLang !== 'undefined' && AgroLang.current === 'kn';

  const modal = document.createElement('div');
  modal.id = 'authModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(6px);z-index:9999;display:flex;align-items:center;justify-content:center;visibility:hidden;opacity:0;transition:opacity 0.3s;';
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal('authModal'); });

  modal.innerHTML = `
    <div id="authBox" style="background:#fff;border-radius:24px;padding:2.2rem;width:90%;max-width:540px;box-shadow:0 30px 80px rgba(0,0,0,0.2);position:relative;max-height:92vh;overflow-y:auto;font-family:'Poppins',sans-serif;">
      <button onclick="closeModal('authModal')" style="position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:50%;background:#f0fdf4;border:none;font-size:1.1rem;color:#16a34a;cursor:pointer;font-weight:700;">✕</button>

      <!-- Logo -->
      <div style="display:flex;align-items:center;gap:10px;font-size:1.3rem;font-weight:800;color:#14532d;margin-bottom:0.5rem;">
        <i class="fas fa-seedling" style="color:#22c55e;"></i> AgroMarket ${isKn ? '<span style="font-size:0.8rem;background:#dcfce7;color:#166534;padding:2px 8px;border-radius:20px;margin-left:6px;">ಕನ್ನಡ</span>' : ''}
      </div>

      <!-- Tabs -->
      <div style="display:flex;background:#f0fdf4;border-radius:12px;padding:4px;margin:1.25rem 0;">
        <button id="tabLogin" onclick="switchAuthTab('login')"
          style="flex:1;padding:10px;border:none;border-radius:10px;font-size:0.9rem;font-weight:700;cursor:pointer;font-family:'Poppins',sans-serif;background:#fff;color:#16a34a;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          ${isKn ? 'ಲಾಗಿನ್' : 'Login'}
        </button>
        <button id="tabRegister" onclick="switchAuthTab('register')"
          style="flex:1;padding:10px;border:none;border-radius:10px;font-size:0.9rem;font-weight:700;cursor:pointer;font-family:'Poppins',sans-serif;background:transparent;color:#6b7280;">
          ${isKn ? 'ನೋಂದಣಿ' : 'Register'}
        </button>
      </div>

      <!-- LOGIN FORM -->
      <div id="loginForm">
        <h3 style="font-size:1.35rem;font-weight:800;color:#052e16;">${isKn ? 'ಮರಳಿ ಸ್ವಾಗತ!' : 'Welcome Back!'}</h3>
        <p style="font-size:0.85rem;color:#6b7280;margin-bottom:1.4rem;">${isKn ? 'ನಿಮ್ಮ ಅಗ್ರೋಮಾರ್ಕೆಟ್ ಖಾತೆಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ' : 'Sign in to your AgroMarket account'}</p>
        ${authField('loginEmail','fa-envelope', isKn ? 'ಇಮೇಲ್ ವಿಳಾಸ' : 'Email Address', 'email', 'you@example.com')}
        ${authField('loginPassword','fa-lock', isKn ? 'ಪಾಸ್‌ವರ್ಡ್' : 'Password', 'password', isKn ? 'ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್' : 'Your password')}
        <div id="loginMsg" style="display:none;padding:10px 14px;border-radius:8px;font-size:0.82rem;font-weight:600;margin-top:0.5rem;"></div>
        <button onclick="handleLogin()" id="loginBtn"
          style="width:100%;padding:13px;background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;border:none;border-radius:10px;font-size:0.95rem;font-weight:700;cursor:pointer;margin-top:0.75rem;transition:all 0.2s;">
          <i class="fas fa-sign-in-alt"></i> ${isKn ? 'ಲಾಗಿನ್ ಮಾಡಿ' : 'Login'}
        </button>
        <p style="text-align:center;font-size:0.8rem;color:#6b7280;margin-top:1rem;line-height:1.5;">
          ${isKn ? 'ಪರೀಕ್ಷಾರ್ಥ ಖಾತೆ:' : 'Test:'} <strong>ramesh@agriproject.in</strong> (${isKn ? 'ರೈತ' : 'farmer'}) &nbsp;|&nbsp; <strong>priya@agriproject.in</strong> (${isKn ? 'ಖರೀದಿದಾರ' : 'buyer'})<br/>${isKn ? 'ಪಾಸ್‌ವರ್ಡ್:' : 'Password:'} <strong>password</strong>
        </p>
      </div>

      <!-- REGISTER FORM -->
      <div id="registerForm" style="display:none;">
        <h3 style="font-size:1.35rem;font-weight:800;color:#052e16;">${isKn ? 'ಹೊಸ ಖಾತೆ ರಚಿಸಿ' : 'Create Account'}</h3>
        <p style="font-size:0.85rem;color:#6b7280;margin-bottom:1.25rem;">${isKn ? 'ಸಾವಿರಾರು ರೈತರು, ಖರೀದಿದಾರರು ಮತ್ತು ವಿತರಕರೊಂದಿಗೆ ಕೈಜೋಡಿಸಿ' : 'Join thousands of farmers, buyers and distributors'}</p>

        <!-- Role selector first so dynamic fields can update -->
        <div style="margin-bottom:1rem;">
          <label style="display:block;font-size:0.82rem;font-weight:600;color:#374151;margin-bottom:0.4rem;">${isKn ? 'ನಾನು ನೋಂದಾಯಿಸಲು ಬಯಸುವುದು *' : 'I want to register as *'}</label>
          <div style="position:relative;">
            <i class="fas fa-user-tag" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#16a34a;font-size:0.85rem;pointer-events:none;"></i>
            <select id="regRole" onchange="updateRoleFields()"
              style="width:100%;padding:11px 12px 11px 36px;border:1.5px solid #d1fae5;border-radius:10px;font-size:0.88rem;color:#111827;background:#f0fdf4;outline:none;cursor:pointer;box-sizing:border-box;">
              <option value="farmer">${isKn ? '🌾 ರೈತ (ಬೆಳೆ ಮಾರಾಟ ಮತ್ತು ಪೋಸ್ಟ್)' : '🌾 Farmer (Sell & Post Farm Crops)'}</option>
              <option value="distributor">${isKn ? '🏢 ವಿತರಕ / ಕಂಪನಿ ಮಾರಾಟಗಾರ (ಸಗಟು ಬೆಳೆ ಮಾರಾಟ)' : '🏢 Distributor / Company Seller (Sell Wholesale & Bulk Produce)'}</option>
              <option value="buyer">${isKn ? '🛒 ಖರೀದಿದಾರ (ಬೆಳೆ ಖರೀದಿ ಮಾತ್ರ — ಮಾರಾಟ ನಿರ್ಬಂಧ)' : '🛒 Buyer (Purchase Produce Only — Selling Disabled)'}</option>
            </select>
          </div>
          <div id="rolePermissionNote" style="font-size:0.75rem;margin-top:6px;padding:6px 10px;border-radius:8px;background:#f0fdf4;color:#15803d;font-weight:600;">
            <i class="fas fa-check-circle"></i> ${isKn ? 'ರೈತರು ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಬೆಳೆಗಳನ್ನು ಪೋಸ್ಟ್ ಮಾಡಲು ಮತ್ತು ಮಾರಾಟ ಮಾಡಲು ಸಂಪೂರ್ಣ ಅನುಮತಿ ಹೊಂದಿದ್ದಾರೆ.' : 'Farmers have full permission to post and sell crops on the marketplace.'}
          </div>
        </div>

        <!-- Static fields grid -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.75rem;">
          ${authFieldCompact('regName','fa-user', isKn ? 'ಪೂರ್ಣ ಹೆಸರು' : 'Full Name', 'text', isKn ? 'ರಮೇಶ್ ಕುಮಾರ್' : 'Ramesh Kumar')}
          ${authFieldCompact('regPhone','fa-phone', isKn ? 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ' : 'Phone Number', 'tel', '9876543210')}
          ${authFieldCompact('regEmail','fa-envelope', isKn ? 'ಇಮೇಲ್ ವಿಳಾಸ' : 'Email Address', 'email', 'you@example.com')}
          ${authFieldCompact('regPassword','fa-lock', isKn ? 'ಪಾಸ್‌ವರ್ಡ್' : 'Password', 'password', isKn ? 'ಕನಿಷ್ಠ 6 ಅಕ್ಷರ' : 'Min 6 characters')}
          ${authFieldCompact('regCity','fa-city', isKn ? 'ನಗರ' : 'City', 'text', isKn ? 'ಬೆಂಗಳೂರು' : 'Bangalore')}
          ${authFieldCompact('regState','fa-map', isKn ? 'ರಾಜ್ಯ' : 'State', 'text', isKn ? 'ಕರ್ನಾಟಕ' : 'Karnataka')}
        </div>

        <!-- Dynamic field based on role -->
        <div id="roleDynamicField" style="margin-bottom:0.75rem;">
          ${authField('regBusinessName','fa-tractor', isKn ? 'ಫಾರ್ಮ್ / ತೋಟದ ಹೆಸರು' : 'Farm Name', 'text', isKn ? 'ಉದಾ: ರಮೇಶ್ ಗ್ರೀನ್ ಅಗ್ರೋ ಫಾರ್ಮ್ಸ್' : 'e.g. Ramesh Green Agro Farms')}
        </div>

        <!-- Address -->
        <div style="margin-bottom:0.75rem;">
          <label style="display:block;font-size:0.82rem;font-weight:600;color:#374151;margin-bottom:0.4rem;">${isKn ? 'ಪೂರ್ಣ ವಿಳಾಸ' : 'Full Address'}</label>
          <textarea id="regAddress" rows="2" placeholder="${isKn ? 'ನಿಮ್ಮ ಪೂರ್ಣ ವಿಳಾಸ ಇಲ್ಲಿ ಬರೆಯಿರಿ...' : 'Your full address...'}"
            style="width:100%;padding:11px;border:1.5px solid #d1fae5;border-radius:10px;font-size:0.88rem;color:#111827;background:#f0fdf4;outline:none;resize:vertical;box-sizing:border-box;"
            onfocus="this.style.borderColor='#22c55e';this.style.background='#fff'" onblur="this.style.borderColor='#d1fae5';this.style.background='#f0fdf4'"></textarea>
        </div>

        <div id="registerMsg" style="display:none;padding:10px 14px;border-radius:8px;font-size:0.82rem;font-weight:600;margin-bottom:0.5rem;"></div>

        <button onclick="handleRegister()" id="registerBtn"
          style="width:100%;padding:13px;background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;border:none;border-radius:10px;font-size:0.95rem;font-weight:700;cursor:pointer;transition:all 0.2s;">
          <i class="fas fa-user-plus"></i> ${isKn ? 'ಖಾತೆ ರಚಿಸಿ' : 'Create Account'}
        </button>
      </div>
    </div>`;

  document.body.appendChild(modal);
}

/* Auth field helpers */
function authField(id, icon, label, type, placeholder) {
  return `
    <div style="margin-bottom:0.75rem;">
      <label style="display:block;font-size:0.82rem;font-weight:600;color:#374151;margin-bottom:0.4rem;">${label}</label>
      <div style="position:relative;">
        <i class="fas ${icon}" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#9ca3af;font-size:0.85rem;pointer-events:none;"></i>
        <input id="${id}" type="${type}" placeholder="${placeholder}"
          style="width:100%;padding:11px 12px 11px 36px;border:1.5px solid #d1fae5;border-radius:10px;font-size:0.88rem;color:#111827;background:#f0fdf4;outline:none;box-sizing:border-box;"
          onfocus="this.style.borderColor='#22c55e';this.style.background='#fff'" onblur="this.style.borderColor='#d1fae5';this.style.background='#f0fdf4'" />
      </div>
    </div>`;
}

function authFieldCompact(id, icon, label, type, placeholder) {
  return `
    <div>
      <label style="display:block;font-size:0.82rem;font-weight:600;color:#374151;margin-bottom:0.4rem;">${label}</label>
      <div style="position:relative;">
        <i class="fas ${icon}" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#9ca3af;font-size:0.85rem;pointer-events:none;"></i>
        <input id="${id}" type="${type}" placeholder="${placeholder}"
          style="width:100%;padding:11px 12px 11px 36px;border:1.5px solid #d1fae5;border-radius:10px;font-size:0.85rem;color:#111827;background:#f0fdf4;outline:none;box-sizing:border-box;"
          onfocus="this.style.borderColor='#22c55e';this.style.background='#fff'" onblur="this.style.borderColor='#d1fae5';this.style.background='#f0fdf4'" />
      </div>
    </div>`;
}

window.openAuthModalDirect = function() {
  openModal('authModal');
};

/* Update dynamic field label based on role */
function updateRoleFields() {
  const role    = document.getElementById('regRole')?.value || 'farmer';
  const dynamic = document.getElementById('roleDynamicField');
  const note    = document.getElementById('rolePermissionNote');

  if (note) {
    if (role === 'farmer') {
      note.style.background = '#f0fdf4';
      note.style.color = '#15803d';
      note.innerHTML = '<i class="fas fa-seedling"></i> <strong>Farmer:</strong> You can list and sell fresh harvest directly to buyers nationwide.';
    } else if (role === 'distributor') {
      note.style.background = '#f3e8ff';
      note.style.color = '#6b21a8';
      note.innerHTML = '<i class="fas fa-building"></i> <strong>Company Seller / Distributor:</strong> You can sell wholesale produce, bulk stock, and distribution items.';
    } else if (role === 'buyer') {
      note.style.background = '#fee2e2';
      note.style.color = '#991b1b';
      note.innerHTML = '<i class="fas fa-ban"></i> <strong>Buyer Only:</strong> You can purchase fresh produce and order crops. Selling items is <u>not permitted</u> on buyer accounts.';
    }
  }

  if (!dynamic) return;
  const labels = {
    buyer:       { label:'Household / Shop Name',              placeholder:'e.g. Priya Grocery Mart Bangalore',     icon:'fa-store'    },
    farmer:      { label:'Farm Name',                          placeholder:'e.g. Ramesh Green Agro Farms',          icon:'fa-tractor'  },
    distributor: { label:'Company / Logistics Business Name',  placeholder:'e.g. Karnataka Fresh Agro Logistics',   icon:'fa-truck'    },
  };
  const info = labels[role] || labels.farmer;
  dynamic.innerHTML = authField('regBusinessName', info.icon, info.label, 'text', info.placeholder);
}

/* Switch between login and register tabs */
function switchAuthTab(tab) {
  const loginForm    = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const tabLogin     = document.getElementById('tabLogin');
  const tabRegister  = document.getElementById('tabRegister');
  if (!loginForm) return;

  const activeStyle   = 'flex:1;padding:10px;border:none;border-radius:10px;font-size:0.9rem;font-weight:600;cursor:pointer;font-family:Poppins,sans-serif;background:#fff;color:#16a34a;box-shadow:0 2px 8px rgba(0,0,0,0.08);';
  const inactiveStyle = 'flex:1;padding:10px;border:none;border-radius:10px;font-size:0.9rem;font-weight:600;cursor:pointer;font-family:Poppins,sans-serif;background:transparent;color:#6b7280;box-shadow:none;';

  if (tab === 'login') {
    loginForm.style.display    = 'block';
    registerForm.style.display = 'none';
    tabLogin.style.cssText     = activeStyle;
    tabRegister.style.cssText  = inactiveStyle;
  } else {
    loginForm.style.display    = 'none';
    registerForm.style.display = 'block';
    tabLogin.style.cssText     = inactiveStyle;
    tabRegister.style.cssText  = activeStyle;
    updateRoleFields();
  }
}

/* Show message inside form */
function showFormMsg(id, message, isError=false) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display    = 'block';
  el.style.background = isError ? '#fee2e2' : '#dcfce7';
  el.style.color      = isError ? '#991b1b' : '#15803d';
  el.textContent      = message;
}

/* ── LOGIN ── */
async function handleLogin() {
  const email = document.getElementById('loginEmail')?.value.trim();
  const pass  = document.getElementById('loginPassword')?.value.trim();
  if (!email || !pass) return showFormMsg('loginMsg', 'Email and password are required.', true);

  const btn = document.getElementById('loginBtn');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
  btn.disabled  = true;

  const res = await AgroAPI.login(email, pass);

  btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
  btn.disabled  = false;

  if (res.success) {
    AgroAPI.setAuth(res.token, res.user);
    closeModal('authModal');
    showToast(`Welcome back, ${res.user.full_name}!`, 'success', 'Login Successful 🎉');
    updateNavbar();
    loadProducts();
  } else {
    showFormMsg('loginMsg', res.message || 'Login failed.', true);
  }
}

/* ── REGISTER — Farmer / Buyer / Distributor ── */
async function handleRegister() {
  const role         = document.getElementById('regRole')?.value || 'buyer';
  const full_name    = document.getElementById('regName')?.value.trim()         || '';
  const email        = document.getElementById('regEmail')?.value.trim()        || '';
  const password     = document.getElementById('regPassword')?.value.trim()     || '';
  const phone        = document.getElementById('regPhone')?.value.trim()        || '';
  const city         = document.getElementById('regCity')?.value.trim()         || '';
  const state        = document.getElementById('regState')?.value.trim()        || '';
  const address      = document.getElementById('regAddress')?.value.trim()      || '';
  const businessName = document.getElementById('regBusinessName')?.value.trim() || '';

  /* Validation */
  if (!full_name)    return showFormMsg('registerMsg', 'Full name is required.', true);
  if (!email)        return showFormMsg('registerMsg', 'Email is required.', true);
  if (!password)     return showFormMsg('registerMsg', 'Password is required.', true);
  if (password.length < 6) return showFormMsg('registerMsg', 'Password must be at least 6 characters.', true);
  if (!phone)        return showFormMsg('registerMsg', 'Phone number is required.', true);

  /* Build payload — role-specific fields */
  const payload = {
    full_name,
    email,
    password,
    phone,
    role,
    city,
    state,
    address,
  };

  if (role === 'farmer') {
    payload.farm_name    = businessName || `${full_name}'s Farm`;
    payload.farming_type = 'conventional';
  } else if (role === 'buyer') {
    payload.business_name = businessName || `${full_name}'s Business`;
    payload.business_type = 'individual';
  } else if (role === 'distributor') {
    payload.company_name = businessName || `${full_name}'s Company`;
  }

  const btn = document.getElementById('registerBtn');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
  btn.disabled  = true;

  const res = await AgroAPI.register(payload);

  btn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
  btn.disabled  = false;

  if (res.success) {
    AgroAPI.setAuth(res.token, res.user);
    closeModal('authModal');
    showToast(`Welcome to AgroMarket, ${res.user.full_name}!`, 'success', 'Account Created 🌱');
    updateNavbar();
    loadProducts();
  } else {
    showFormMsg('registerMsg', res.message || 'Registration failed. Try again.', true);
  }
}

/* ============================================
   PRODUCTS — Load from backend
   ============================================ */
async function loadProducts() {
  const grid = document.querySelector('.products-grid');
  if (!grid) return;

  grid.innerHTML = `
    <div style="grid-column:1/-1;text-align:center;padding:3rem;">
      <i class="fas fa-spinner fa-spin" style="font-size:2rem;color:#22c55e;"></i>
      <p style="margin-top:1rem;color:#6b7280;font-family:'Poppins',sans-serif;">Loading fresh products...</p>
    </div>`;

  const res = await AgroAPI.getProducts({ limit: 6 });

  if (!res.success || !res.products?.length) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:3rem;color:#6b7280;font-family:'Poppins',sans-serif;">
        <i class="fas fa-box-open" style="font-size:3rem;margin-bottom:1rem;display:block;color:#d1fae5;"></i>
        No products available yet.
      </div>`;
    return;
  }

  grid.innerHTML = res.products.map(p => buildProductCard(p)).join('');
}

function buildProductCard(p) {
  const isKn = typeof AgroLang !== 'undefined' && AgroLang.current === 'kn';
  const img = p.image_url || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400';
  const badgeLabel = p.is_organic ? (isKn ? 'ಸಾವಯವ' : 'Organic') : (isKn ? 'ಲಭ್ಯವಿದೆ' : 'In Stock');
  const viewDetailsLabel = isKn ? 'ವಿವರ ನೋಡಿ' : 'View Details';
  const qtyLabel = isKn ? 'ಪ್ರಮಾಣ:' : 'Qty:';
  const farmerRole = isKn ? 'ರೈತ' : 'Farmer';

  return `
    <div class="product-card reveal visible" data-category="${(p.category_name||'').toLowerCase()}">
      <div class="product-img-wrap">
        <img src="${img}" alt="${p.name}" loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'" />
        <span class="product-badge ${p.is_organic ? 'organic' : 'available'}">${badgeLabel}</span>
        <button class="wishlist-btn" onclick="handleWishlist(${p.id}, this)" title="Wishlist">
          <i class="far fa-heart"></i>
        </button>
      </div>
      <div class="product-info">
        <div class="product-meta">
          <span class="product-category"><i class="fas fa-seedling"></i> ${p.category_name || 'General'}</span>
          <div class="product-rating"><i class="fas fa-star"></i> ${p.rating || 'New'}</div>
        </div>
        <h3>${p.name}</h3>
        <p class="product-seller"><i class="fas fa-user-tie"></i> ${p.farmer_name || farmerRole}, ${p.city || ''}</p>
        <div class="product-bottom">
          <div class="product-price">
            <span class="price">₹ ${p.price_per_unit}<small>/${p.unit || 'kg'}</small></span>
            <span class="old-price">${qtyLabel} ${p.quantity_available}</span>
          </div>
          <button class="btn-view" onclick='openProductModal(${JSON.stringify(JSON.stringify(p))})'>${viewDetailsLabel}</button>
        </div>
      </div>
    </div>`;
}

/* ── Category Filters ── */
async function loadCategoryFilters() {
  const res = await AgroAPI.getCategories();
  if (!res.success) return;
  const filterBar = document.querySelector('.market-filters');
  if (!filterBar) return;

  filterBar.innerHTML = '<button class="filter-btn active" data-filter="all" onclick="handleFilter(this,\'\')">All Products</button>';

  res.categories.slice(0, 6).forEach(cat => {
    const btn = document.createElement('button');
    btn.className     = 'filter-btn';
    btn.dataset.filter = cat.name.toLowerCase();
    btn.textContent   = `${cat.name} (${cat.product_count || 0})`;
    btn.onclick       = () => handleFilter(btn, cat.name);
    filterBar.appendChild(btn);
  });
}

async function handleFilter(btn, categoryName) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const grid = document.querySelector('.products-grid');
  grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:2rem;"><i class="fas fa-spinner fa-spin" style="font-size:1.5rem;color:#22c55e;"></i></div>`;

  const params = categoryName ? { category: categoryName, limit: 6 } : { limit: 6 };
  const res    = await AgroAPI.getProducts(params);

  if (res.success && res.products?.length) {
    grid.innerHTML = res.products.map(p => buildProductCard(p)).join('');
  } else {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:2rem;color:#6b7280;font-family:'Poppins',sans-serif;">No products found.</div>`;
  }
}

/* ============================================
   PRODUCT DETAIL MODAL
   ============================================ */
let _qty = 1;
let _currentProduct = null;

function openProductModal(pStr) {
  _currentProduct = JSON.parse(pStr);
  _qty = 1;
  const p   = _currentProduct;
  const img = p.image_url || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400';

  // 🍃 Log Product View to MongoDB Analytics
  if (typeof AgroAPI !== 'undefined' && AgroAPI.logView) {
    const u = AgroAPI.currentUser();
    AgroAPI.logView({
      userId: u ? u.id : null,
      productId: p.id,
      productName: p.name,
      page: 'product_modal',
      action: 'view'
    }).catch(() => {});
  }

  let modal = document.getElementById('productModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'productModal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(6px);z-index:9999;display:flex;align-items:center;justify-content:center;visibility:hidden;opacity:0;transition:opacity 0.3s;';
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal('productModal'); });
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="background:#fff;border-radius:24px;padding:2rem;width:90%;max-width:680px;box-shadow:0 30px 80px rgba(0,0,0,0.2);position:relative;max-height:90vh;overflow-y:auto;">
      <button onclick="closeModal('productModal')" style="position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:50%;background:#f0fdf4;border:none;font-size:1.1rem;color:#16a34a;cursor:pointer;font-weight:700;">✕</button>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;">
        <img src="${img}" alt="${p.name}"
          style="width:100%;height:220px;object-fit:cover;border-radius:16px;"
          onerror="this.src='https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'" />
        <div>
          <span style="font-size:0.75rem;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:0.5px;font-family:'Poppins',sans-serif;">${p.category_name || ''}</span>
          <h2 style="font-size:1.35rem;font-weight:800;color:#052e16;margin:0.4rem 0;font-family:'Poppins',sans-serif;">${p.name}</h2>
          <p style="font-size:0.85rem;color:#6b7280;margin-bottom:0.75rem;font-family:'Poppins',sans-serif;">${p.description || 'Fresh from the farm.'}</p>
          <div style="font-size:1.8rem;font-weight:900;color:#16a34a;font-family:'Poppins',sans-serif;">
            ₹ ${p.price_per_unit}<small style="font-size:0.85rem;font-weight:500;">/${p.unit || 'kg'}</small>
          </div>
          <p style="font-size:0.82rem;color:#6b7280;margin:0.4rem 0;font-family:'Poppins',sans-serif;">
            <i class="fas fa-user-tie"></i> ${p.farmer_name || ''}, ${p.city || ''}
          </p>
          <p style="font-size:0.82rem;color:#16a34a;margin-bottom:1rem;font-family:'Poppins',sans-serif;">
            <i class="fas fa-box"></i> ${p.quantity_available} ${p.unit || 'kg'} available &nbsp;|&nbsp;
            ${p.is_organic ? '<i class="fas fa-leaf"></i> Organic' : '<i class="fas fa-check"></i> Grade ' + (p.grade || 'A')}
          </p>
          <!-- Quantity -->
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem;">
            <button onclick="changeQty(-1)"
              style="width:36px;height:36px;border-radius:50%;border:2px solid #22c55e;background:#fff;color:#16a34a;font-size:1.1rem;font-weight:700;cursor:pointer;">−</button>
            <span id="qtyDisplay" style="font-size:1.1rem;font-weight:700;color:#052e16;min-width:30px;text-align:center;font-family:'Poppins',sans-serif;">1</span>
            <button onclick="changeQty(1)"
              style="width:36px;height:36px;border-radius:50%;border:2px solid #22c55e;background:#fff;color:#16a34a;font-size:1.1rem;font-weight:700;cursor:pointer;">+</button>
            <span style="font-size:0.85rem;color:#6b7280;font-family:'Poppins',sans-serif;">
              Total: <strong id="totalCalc" style="color:#16a34a;">₹${p.price_per_unit}</strong>
            </span>
          </div>
          <!-- Buttons -->
          <button onclick="handleAddToCart(${p.id})"
            style="width:100%;padding:12px;background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;border:none;border-radius:10px;font-size:0.95rem;font-weight:700;cursor:pointer;font-family:'Poppins',sans-serif;margin-bottom:0.5rem;transition:all 0.2s;"
            onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
            <i class="fas fa-cart-plus"></i> Add to Cart
          </button>
          <button onclick="handleWishlistById(${p.id})"
            style="width:100%;padding:10px;background:#f0fdf4;color:#16a34a;border:2px solid #22c55e;border-radius:10px;font-size:0.88rem;font-weight:600;cursor:pointer;font-family:'Poppins',sans-serif;transition:all 0.2s;margin-bottom:0.5rem;"
            onmouseover="this.style.background='#dcfce7'" onmouseout="this.style.background='#f0fdf4'">
            <i class="fas fa-heart"></i> Add to Wishlist
          </button>

          <!-- AI Bargain & Direct Message Buttons -->
          <div style="display:flex;gap:8px;">
            <button onclick="closeModal('productModal');buildNegotiateModal('${(p.name||'').replace(/'/g, "\\'")}', ${p.price_per_unit});"
              style="flex:1;padding:9px;background:#f5f3ff;color:#7c3aed;border:1.5px solid #c4b5fd;border-radius:10px;font-size:0.82rem;font-weight:700;cursor:pointer;font-family:'Poppins',sans-serif;display:flex;align-items:center;justify-content:center;gap:6px;">
              <i class="fas fa-handshake"></i> AI Bargain
            </button>
            <button onclick="closeModal('productModal');openDirectMessage(${p.farmer_id || 1}, '${(p.farmer_name || 'Farmer').replace(/'/g, "\\'")}', ${p.id}, '${(p.name||'').replace(/'/g, "\\'")}');"
              style="flex:1;padding:9px;background:#f0fdf4;color:#16a34a;border:1.5px solid #86efac;border-radius:10px;font-size:0.82rem;font-weight:700;cursor:pointer;font-family:'Poppins',sans-serif;display:flex;align-items:center;justify-content:center;gap:6px;">
              <i class="fas fa-comments"></i> Chat Farmer
            </button>
          </div>
        </div>
      </div>
    </div>`;

  openModal('productModal');
}

function changeQty(delta) {
  if (!_currentProduct) return;
  _qty = Math.max(1, Math.min(_qty + delta, _currentProduct.quantity_available || 999));
  const display = document.getElementById('qtyDisplay');
  const total   = document.getElementById('totalCalc');
  if (display) display.textContent = _qty;
  if (total)   total.textContent   = `₹${(_qty * _currentProduct.price_per_unit).toFixed(0)}`;
}

async function handleAddToCart(productId) {
  if (!AgroAPI.isLoggedIn()) {
    closeModal('productModal');
    openModal('authModal');
    showToast('Please login to add items to cart', 'warning', 'Login Required');
    return;
  }
  const res = await AgroAPI.addToCart(productId, _qty);
  if (res.success) {
    showToast(`${_qty} item(s) added to cart!`, 'success', 'Cart Updated 🛒');
    closeModal('productModal');
    loadCartCount();
    openCart();
  } else {
    showToast(res.message, 'error', 'Error Adding to Cart');
  }
  _qty = 1;
}

async function handleWishlist(productId, btn) {
  if (!AgroAPI.isLoggedIn()) { openModal('authModal'); return; }
  const res = await AgroAPI.toggleWishlist(productId);
  if (res.success) {
    const icon = btn.querySelector('i');
    icon.classList.toggle('far', !res.wishlisted);
    icon.classList.toggle('fas', res.wishlisted);
    btn.style.color = res.wishlisted ? '#ef4444' : '';
    showToast(res.message, 'success', res.wishlisted ? 'Added to Wishlist ❤️' : 'Removed from Wishlist');
  }
}

async function handleWishlistById(productId) {
  if (!AgroAPI.isLoggedIn()) { closeModal('productModal'); openModal('authModal'); return; }
  const res = await AgroAPI.toggleWishlist(productId);
  if (res.success) showToast(res.message, 'success', res.wishlisted ? 'Added to Wishlist ❤️' : 'Removed');
}

/* ============================================
   CART SIDEBAR
   ============================================ */
function buildCartSidebar() {
  if (document.getElementById('cartSidebar')) return;

  const overlay = document.createElement('div');
  overlay.id = 'cartOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:9997;opacity:0;visibility:hidden;transition:all 0.3s;';
  overlay.onclick = () => closeCart();
  document.body.appendChild(overlay);

  const sidebar = document.createElement('div');
  sidebar.id = 'cartSidebar';
  sidebar.style.cssText = 'position:fixed;top:0;right:-420px;width:400px;height:100vh;background:#fff;z-index:9998;box-shadow:-10px 0 40px rgba(0,0,0,0.12);transition:right 0.3s ease;display:flex;flex-direction:column;font-family:"Poppins",sans-serif;';
  sidebar.innerHTML = `
    <div style="padding:1.5rem;border-bottom:1px solid #f0fdf4;display:flex;align-items:center;justify-content:space-between;">
      <h3 style="font-size:1.1rem;font-weight:800;color:#052e16;margin:0;">🛒 My Cart</h3>
      <button onclick="closeCart()" style="width:36px;height:36px;border-radius:50%;background:#f0fdf4;border:none;color:#16a34a;font-size:1rem;cursor:pointer;font-weight:700;">✕</button>
    </div>
    <div id="cartItems" style="flex:1;overflow-y:auto;padding:1rem 1.5rem;"></div>
    <div id="cartFooter" style="padding:1.5rem;border-top:1px solid #f0fdf4;"></div>`;
  document.body.appendChild(sidebar);
}

function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  if (!sidebar) return;
  sidebar.style.right === '0px' ? closeCart() : openCart();
}

function openCart()  {
  loadCart();
  document.getElementById('cartSidebar').style.right = '0';
  const ov = document.getElementById('cartOverlay');
  ov.style.opacity    = '1';
  ov.style.visibility = 'visible';
}

function closeCart() {
  document.getElementById('cartSidebar').style.right = '-420px';
  const ov = document.getElementById('cartOverlay');
  ov.style.opacity    = '0';
  ov.style.visibility = 'hidden';
}

async function loadCart() {
  if (!AgroAPI.isLoggedIn()) return;
  const cartItems  = document.getElementById('cartItems');
  const cartFooter = document.getElementById('cartFooter');
  if (!cartItems) return;

  cartItems.innerHTML = '<div style="text-align:center;padding:2rem;"><i class="fas fa-spinner fa-spin" style="font-size:1.5rem;color:#22c55e;"></i></div>';

  const res = await AgroAPI.getCart();

  if (!res.success || !res.items?.length) {
    cartItems.innerHTML  = '<div style="text-align:center;padding:3rem;color:#9ca3af;"><i class="fas fa-shopping-cart" style="font-size:3rem;margin-bottom:1rem;display:block;"></i>Your cart is empty</div>';
    cartFooter.innerHTML = '';
    return;
  }

  cartItems.innerHTML = res.items.map(item => `
    <div style="display:flex;gap:12px;padding:12px 0;border-bottom:1px solid #f9fafb;">
      <img src="${item.image_url || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100'}"
        style="width:64px;height:64px;border-radius:10px;object-fit:cover;"
        onerror="this.src='https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100'" />
      <div style="flex:1;">
        <h4 style="font-size:0.88rem;font-weight:700;color:#052e16;margin:0 0 4px;">${item.name}</h4>
        <p style="font-size:0.78rem;color:#6b7280;margin:0;">By ${item.farmer_name || ''}</p>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:6px;">
          <span style="font-size:0.95rem;font-weight:800;color:#16a34a;">₹${parseFloat(item.item_total).toFixed(2)}</span>
          <div style="display:flex;align-items:center;gap:6px;">
            <button onclick="updateCartItem(${item.product_id}, ${item.quantity - 1})"
              style="width:26px;height:26px;border-radius:50%;border:1px solid #22c55e;background:#fff;color:#16a34a;cursor:pointer;font-size:0.85rem;">−</button>
            <span style="font-size:0.85rem;font-weight:700;min-width:20px;text-align:center;">${item.quantity}</span>
            <button onclick="updateCartItem(${item.product_id}, ${item.quantity + 1})"
              style="width:26px;height:26px;border-radius:50%;border:1px solid #22c55e;background:#fff;color:#16a34a;cursor:pointer;font-size:0.85rem;">+</button>
            <button onclick="removeCartItem(${item.product_id})"
              style="background:none;border:none;color:#ef4444;cursor:pointer;padding:4px;">
              <i class="fas fa-trash" style="font-size:0.8rem;"></i>
            </button>
          </div>
        </div>
      </div>
    </div>`).join('');

  cartFooter.innerHTML = `
    <div style="display:flex;justify-content:space-between;font-size:1rem;font-weight:700;color:#052e16;margin-bottom:1rem;">
      <span>Total (${res.count} items)</span>
      <span style="color:#16a34a;font-size:1.2rem;">₹${res.total}</span>
    </div>
    <button onclick="openCheckout(${res.total})"
      style="width:100%;padding:14px;background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;border:none;border-radius:12px;font-size:1rem;font-weight:700;cursor:pointer;font-family:'Poppins',sans-serif;transition:all 0.2s;"
      onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
      <i class="fas fa-credit-card"></i> Proceed to Checkout
    </button>`;

  updateCartBadge(res.count);
}

async function updateCartItem(productId, qty) {
  if (qty <= 0) { removeCartItem(productId); return; }
  await AgroAPI.updateCart(productId, qty);
  loadCart();
}

async function removeCartItem(productId) {
  await AgroAPI.removeCart(productId);
  loadCart();
  showToast('Item removed from cart', 'info', 'Cart Updated');
}

async function loadCartCount() {
  if (!AgroAPI.isLoggedIn()) return;
  const res = await AgroAPI.getCart();
  if (res.success) updateCartBadge(res.count);
}

function updateCartBadge(count) {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  badge.style.display = count > 0 ? 'flex' : 'none';
  badge.textContent   = count;
}

/* ============================================
   CHECKOUT MODAL
   ============================================ */
function openCheckout(total) {
  closeCart();
  let modal = document.getElementById('checkoutModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'checkoutModal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(6px);z-index:9999;display:flex;align-items:center;justify-content:center;visibility:hidden;opacity:0;transition:opacity 0.3s;';
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal('checkoutModal'); });
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="background:#fff;border-radius:24px;padding:2.5rem;width:90%;max-width:500px;box-shadow:0 30px 80px rgba(0,0,0,0.2);position:relative;max-height:90vh;overflow-y:auto;">
      <button onclick="closeModal('checkoutModal')" style="position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:50%;background:#f0fdf4;border:none;font-size:1.1rem;color:#16a34a;cursor:pointer;font-weight:700;">✕</button>
      <h3 style="font-size:1.4rem;font-weight:800;color:#052e16;margin-bottom:1.5rem;font-family:'Poppins',sans-serif;">
        <i class="fas fa-shopping-bag"></i> Checkout
      </h3>

      ${authField('checkAddr','fa-map-pin','Delivery Address','text','123 Main Street, Bangalore')}

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.75rem;">
        ${authFieldCompact('checkCity','fa-city','City','text','Bangalore')}
        ${authFieldCompact('checkPin','fa-hashtag','Pincode','text','560001')}
      </div>

      <div style="margin-bottom:1rem;">
        <label style="display:block;font-size:0.82rem;font-weight:600;color:#374151;margin-bottom:0.4rem;font-family:'Poppins',sans-serif;">Payment Method</label>
        <div style="position:relative;">
          <i class="fas fa-credit-card" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#9ca3af;font-size:0.85rem;pointer-events:none;"></i>
          <select id="checkPayment"
            style="width:100%;padding:11px 12px 11px 36px;border:1.5px solid #d1fae5;border-radius:10px;font-size:0.88rem;color:#111827;background:#f0fdf4;outline:none;font-family:'Poppins',sans-serif;appearance:none;box-sizing:border-box;">
            <option value="upi">UPI</option>
            <option value="card">Credit / Debit Card</option>
            <option value="cod">Cash on Delivery</option>
            <option value="netbanking">Net Banking</option>
            <option value="wallet">Wallet</option>
          </select>
        </div>
      </div>

      <div style="background:#f0fdf4;border-radius:12px;padding:1rem;margin-bottom:1.5rem;border:1px solid #d1fae5;">
        <div style="display:flex;justify-content:space-between;font-family:'Poppins',sans-serif;font-size:0.9rem;margin-bottom:0.4rem;">
          <span style="color:#6b7280;">Subtotal</span><span>₹${total}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-family:'Poppins',sans-serif;font-size:0.9rem;margin-bottom:0.4rem;color:#16a34a;">
          <span>Delivery</span><span>FREE</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-family:'Poppins',sans-serif;font-size:1.1rem;font-weight:800;color:#052e16;border-top:1px solid #d1fae5;padding-top:0.5rem;">
          <span>Total</span><span style="color:#16a34a;">₹${total}</span>
        </div>
      </div>

      <div id="checkoutMsg" style="display:none;padding:10px;border-radius:8px;font-size:0.82rem;font-weight:600;margin-bottom:0.75rem;font-family:'Poppins',sans-serif;"></div>

      <button onclick="placeOrder(${total})" id="placeOrderBtn"
        style="width:100%;padding:14px;background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;border:none;border-radius:12px;font-size:1rem;font-weight:700;cursor:pointer;font-family:'Poppins',sans-serif;transition:all 0.2s;"
        onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
        <i class="fas fa-check-circle"></i> Place Order — ₹${total}
      </button>
    </div>`;

  openModal('checkoutModal');
}

async function placeOrder(total) {
  const address = document.getElementById('checkAddr')?.value.trim()    || '';
  const city    = document.getElementById('checkCity')?.value.trim()    || '';
  const pincode = document.getElementById('checkPin')?.value.trim()     || '';
  const payment = document.getElementById('checkPayment')?.value        || 'cod';

  if (!address) {
    const m = document.getElementById('checkoutMsg');
    m.style.display = 'block'; m.style.background = '#fee2e2'; m.style.color = '#991b1b';
    m.textContent = 'Please enter delivery address.';
    return;
  }

  const btn = document.getElementById('placeOrderBtn');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Placing Order...';
  btn.disabled  = true;

  const cartRes = await AgroAPI.getCart();
  if (!cartRes.success || !cartRes.items?.length) {
    btn.innerHTML = `<i class="fas fa-check-circle"></i> Place Order — ₹${total}`;
    btn.disabled  = false;
    return;
  }

  const items  = cartRes.items.map(i => ({ product_id: i.product_id, quantity: i.quantity }));
  const res    = await AgroAPI.placeOrder({ items, delivery_address: address, delivery_city: city, delivery_pincode: pincode, payment_method: payment });

  if (res.success) {
    await AgroAPI.simulatePayment(res.orderId, payment, total);
    await AgroAPI.clearCart();
    closeModal('checkoutModal');
    showToast(`Order #ORD-${res.orderId} placed!`, 'success', 'Order Confirmed 🎉');
    updateCartBadge(0);
    loadProducts();
  } else {
    btn.innerHTML = `<i class="fas fa-check-circle"></i> Place Order — ₹${total}`;
    btn.disabled  = false;
    const m = document.getElementById('checkoutMsg');
    m.style.display = 'block'; m.style.background = '#fee2e2'; m.style.color = '#991b1b';
    m.textContent = res.message || 'Order failed. Try again.';
  }
}

/* ============================================
   MY ORDERS MODAL (Enhanced with item cards, tracking & Kannada)
   ============================================ */
async function openMyOrders() {
  const dd = document.getElementById('userDropdown');
  if (dd) dd.style.display = 'none';

  let modal = document.getElementById('ordersModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'ordersModal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);backdrop-filter:blur(6px);z-index:9999;display:flex;align-items:center;justify-content:center;visibility:hidden;opacity:0;transition:opacity 0.3s;';
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal('ordersModal'); });
    document.body.appendChild(modal);
  }

  const isKn = AgroLang.current === 'kn';

  modal.innerHTML = `
    <div style="background:#fff;border-radius:24px;width:92%;max-width:740px;max-height:88vh;overflow-y:auto;box-shadow:0 30px 80px rgba(0,0,0,0.25);position:relative;font-family:'Poppins',sans-serif;">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#1e3a8a,#3b82f6);color:#fff;padding:22px 28px;border-radius:24px 24px 0 0;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:10;">
        <div>
          <h3 style="margin:0;font-size:1.35rem;font-weight:800;display:flex;align-items:center;gap:10px;">
            <i class="fas fa-box-open"></i> ${isKn ? 'ನನ್ನ ಆರ್ಡರ್‌ಗಳು ಮತ್ತು ಖರೀದಿ ಇತಿಹಾಸ' : 'My Orders & Purchase History'}
          </h3>
          <p style="margin:4px 0 0;font-size:0.8rem;opacity:0.9;">
            ${isKn ? 'ನಿಮ್ಮ ಎಲ್ಲಾ ಕೃಷಿ ಉತ್ಪನ್ನ ಖರೀದಿಗಳು ಮತ್ತು ಡೆಲಿವರಿ ಸ್ಥಿತಿ' : 'Track your farm produce orders, dispatch progress & receipts'}
          </p>
        </div>
        <button onclick="closeModal('ordersModal')" style="background:rgba(255,255,255,0.2);border:none;color:#fff;width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:1.1rem;font-weight:700;">✕</button>
      </div>

      <!-- Content -->
      <div id="ordersContent" style="padding:24px 28px;">
        <div style="text-align:center;padding:3rem;"><i class="fas fa-spinner fa-spin" style="font-size:1.8rem;color:#3b82f6;"></i></div>
      </div>
    </div>`;

  openModal('ordersModal');

  const res = await AgroAPI.myOrders();
  const content = document.getElementById('ordersContent');

  if (!res.success || !res.orders?.length) {
    content.innerHTML = `
      <div style="text-align:center;padding:3.5rem 1rem;color:#6b7280;">
        <i class="fas fa-basket-shopping" style="font-size:3.5rem;display:block;margin-bottom:1rem;color:#93c5fd;"></i>
        <h4 style="font-size:1.1rem;color:#1e293b;margin-bottom:6px;">${isKn ? 'ಯಾವುದೇ ಆರ್ಡರ್‌ಗಳು ಕಂಡುಬಂದಿಲ್ಲ' : 'No orders placed yet'}</h4>
        <p style="font-size:0.85rem;color:#94a3b8;max-width:380px;margin:0 auto 1.5rem;">
          ${isKn ? 'ರೈತರಿಂದ ತಾಜಾ ಕೃಷಿ ಬೆಳೆಗಳನ್ನು ನೇರವಾಗಿ ಖರೀದಿಸಲು ಮಾರುಕಟ್ಟೆಯನ್ನು ಅನ್ವೇಷಿಸಿ!' : 'Explore our fresh farm marketplace and buy directly from verified farmers!'}
        </p>
        <button onclick="closeModal('ordersModal');location.href='#marketplace';"
          style="background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;border:none;padding:10px 24px;border-radius:50px;font-size:0.88rem;font-weight:700;cursor:pointer;box-shadow:0 4px 15px rgba(22,163,74,0.3);">
          ${isKn ? 'ಮಾರುಕಟ್ಟೆಗೆ ಹೋಗಿ' : 'Browse Marketplace'}
        </button>
      </div>`;
    return;
  }

  const statusColors = {
    pending:   { bg: '#fef3c7', text: '#b45309', label: isKn ? 'ಬಾಕಿ ಉಳಿದಿದೆ' : 'Pending' },
    confirmed: { bg: '#dbeafe', text: '#1d4ed8', label: isKn ? 'ದೃಢೀಕರಿಸಲಾಗಿದೆ' : 'Confirmed' },
    processing:{ bg: '#f3e8ff', text: '#7e22ce', label: isKn ? 'ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ' : 'Processing' },
    shipped:   { bg: '#cffafe', text: '#0e7490', label: isKn ? 'ರವಾನಿಸಲಾಗಿದೆ' : 'Dispatched / Shipped' },
    delivered: { bg: '#dcfce7', text: '#15803d', label: isKn ? 'ಡೆಲಿವರಿ ಮಾಡಲಾಗಿದೆ' : 'Delivered' },
    cancelled: { bg: '#fee2e2', text: '#b91c1c', label: isKn ? 'ರದ್ದುಗೊಳಿಸಲಾಗಿದೆ' : 'Cancelled' }
  };

  const steps = ['pending', 'confirmed', 'shipped', 'delivered'];

  content.innerHTML = res.orders.map(o => {
    const st = (o.status || 'pending').toLowerCase();
    const stConfig = statusColors[st] || { bg: '#f1f5f9', text: '#475569', label: st.toUpperCase() };
    const stepIdx = steps.indexOf(st);

    return `
      <div style="border:1.5px solid #e2e8f0;border-radius:18px;padding:1.4rem;margin-bottom:1.4rem;background:#fff;box-shadow:0 4px 15px rgba(0,0,0,0.03);transition:box-shadow 0.2s;" onmouseover="this.style.boxShadow='0 8px 25px rgba(0,0,0,0.08)'" onmouseout="this.style.boxShadow='0 4px 15px rgba(0,0,0,0.03)'">
        <!-- Order Header -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;padding-bottom:12px;border-bottom:1px solid #f1f5f9;">
          <div>
            <div style="display:flex;align-items:center;gap:10px;">
              <strong style="color:#0f172a;font-size:1.05rem;">#ORD-${o.id}</strong>
              <span style="padding:4px 12px;border-radius:50px;font-size:0.75rem;font-weight:700;background:${stConfig.bg};color:${stConfig.text};">
                ● ${stConfig.label}
              </span>
            </div>
            <div style="font-size:0.78rem;color:#64748b;margin-top:4px;">
              <i class="far fa-calendar-alt"></i> ${new Date(o.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:1.2rem;font-weight:800;color:#16a34a;">₹${o.total_amount}</div>
            <span style="font-size:0.72rem;color:#64748b;background:#f8fafc;padding:2px 8px;border-radius:4px;border:1px solid #e2e8f0;">
              💳 ${(o.payment_method||'COD').toUpperCase()} · ${o.payment_status === 'paid' ? 'Paid ✅' : 'Payment on Delivery'}
            </span>
          </div>
        </div>

        <!-- Tracking Progress Bar -->
        ${st !== 'cancelled' ? `
        <div style="margin:16px 0;background:#f8fafc;padding:12px 14px;border-radius:12px;border:1px solid #edf2f7;">
          <div style="display:flex;align-items:center;justify-content:space-between;position:relative;">
            ${[
              { id: 'pending',   label: isKn ? 'ಆರ್ಡರ್ ಆಗಿದೆ' : 'Placed' },
              { id: 'confirmed', label: isKn ? 'ದೃಢೀಕರಿಸಲಾಗಿದೆ' : 'Confirmed' },
              { id: 'shipped',   label: isKn ? 'ರವಾನಿಸಲಾಗಿದೆ' : 'Shipped' },
              { id: 'delivered', label: isKn ? 'ತಲುಪಿದೆ' : 'Delivered' }
            ].map((step, idx) => {
              const isPastOrCurrent = stepIdx >= idx || st === 'delivered';
              const isCurrent = stepIdx === idx;
              return `
                <div style="display:flex;flex-direction:column;align-items:center;flex:1;text-align:center;z-index:2;">
                  <div style="width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;color:#fff;background:${isPastOrCurrent ? '#16a34a' : '#cbd5e1'};box-shadow:${isCurrent ? '0 0 0 4px #bbf7d0' : 'none'};">
                    ${isPastOrCurrent ? '✓' : idx + 1}
                  </div>
                  <span style="font-size:0.7rem;margin-top:4px;font-weight:${isCurrent ? '700' : '500'};color:${isPastOrCurrent ? '#15803d' : '#94a3b8'};">
                    ${step.label}
                  </span>
                </div>
              `;
            }).join('')}
          </div>
        </div>` : ''}

        <!-- Items Breakdown -->
        <div style="background:#f8fafc;border-radius:12px;padding:12px;margin:12px 0;border:1px solid #f1f5f9;">
          <div style="font-size:0.75rem;font-weight:700;color:#475569;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px;">
            ${isKn ? 'ಖರೀದಿಸಿದ ಬೆಳೆಗಳು' : 'Items Ordered'} (${(o.items||[]).length || o.item_count || 1})
          </div>
          ${(o.items && o.items.length) ? o.items.map(it => `
            <div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px dashed #e2e8f0;">
              <img src="${it.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120'}"
                style="width:48px;height:48px;border-radius:10px;object-fit:cover;border:1px solid #e2e8f0;flex-shrink:0;"
                onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=120'"/>
              <div style="flex:1;">
                <div style="font-weight:700;color:#0f172a;font-size:0.88rem;">${it.product_name}</div>
                <div style="font-size:0.76rem;color:#64748b;margin-top:2px;">
                  <span>${it.quantity} ${it.unit||'kg'} × ₹${it.price_per_unit}</span>
                  ${it.farmer_name ? `<span style="margin-left:8px;color:#16a34a;font-weight:600;"><i class="fas fa-tractor"></i> ${it.farmer_name}</span>` : ''}
                </div>
              </div>
              <div style="font-weight:800;color:#0f172a;font-size:0.92rem;">₹${it.total_price}</div>
            </div>
          `).join('') : `
            <div style="font-size:0.82rem;color:#64748b;">${o.item_count || 1} item(s) ordered.</div>
          `}
        </div>

        <!-- Footer / Delivery Destination & Actions -->
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;padding-top:4px;">
          <div style="font-size:0.78rem;color:#64748b;max-width:420px;">
            <i class="fas fa-map-marker-alt" style="color:#ef4444;margin-right:4px;"></i>
            <strong>${isKn ? 'ವಿತರಣಾ ವಿಳಾಸ:' : 'Delivery Address:'}</strong>
            ${o.delivery_address || 'Address on file'}, ${o.delivery_city || ''} ${o.delivery_pincode || ''}
          </div>
          ${(st === 'pending' || st === 'confirmed') ? `
            <button onclick="cancelMyOrder(${o.id})"
              style="padding:6px 14px;background:#fee2e2;color:#ef4444;border:1px solid #fca5a5;border-radius:8px;font-size:0.78rem;font-weight:600;cursor:pointer;font-family:'Poppins',sans-serif;transition:all 0.2s;"
              onmouseover="this.style.background='#ef4444';this.style.color='#fff';" onmouseout="this.style.background='#fee2e2';this.style.color='#ef4444';">
              <i class="fas fa-times-circle"></i> ${isKn ? 'ಆರ್ಡರ್ ರದ್ದುಮಾಡಿ' : 'Cancel Order'}
            </button>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

async function cancelMyOrder(orderId) {
  if (!confirm('Are you sure you want to cancel this order?')) return;
  const res = await AgroAPI.cancelOrder(orderId, 'Customer requested cancellation');
  if (res.success) { showToast('Order cancelled', 'success', 'Cancelled ✅'); openMyOrders(); }
  else showToast(res.message, 'error', 'Error');
}

/* ============================================
   PROFILE MODAL
   ============================================ */
async function openProfileModal() {
  document.getElementById('userDropdown').style.display = 'none';
  const user = AgroAPI.currentUser();

  let modal = document.getElementById('profileModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'profileModal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(6px);z-index:9999;display:flex;align-items:center;justify-content:center;visibility:hidden;opacity:0;transition:opacity 0.3s;';
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal('profileModal'); });
    document.body.appendChild(modal);
  }

  const res = await AgroAPI.profile();
  const u   = res.success ? res.user : user;

  modal.innerHTML = `
    <div style="background:#fff;border-radius:24px;padding:2.5rem;width:90%;max-width:500px;box-shadow:0 30px 80px rgba(0,0,0,0.2);position:relative;max-height:90vh;overflow-y:auto;">
      <button onclick="closeModal('profileModal')" style="position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:50%;background:#f0fdf4;border:none;font-size:1.1rem;color:#16a34a;cursor:pointer;font-weight:700;">✕</button>
      <div style="text-align:center;margin-bottom:1.5rem;">
        <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#16a34a,#22c55e);display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;font-size:2rem;color:#fff;">
          <i class="fas fa-user"></i>
        </div>
        <h3 style="font-size:1.3rem;font-weight:800;color:#052e16;font-family:'Poppins',sans-serif;">${u?.full_name || ''}</h3>
        <span style="font-size:0.8rem;background:#dcfce7;color:#16a34a;padding:4px 14px;border-radius:50px;font-family:'Poppins',sans-serif;font-weight:600;">${u?.role || ''}</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1.5rem;">
        ${pField('Full Name',    u?.full_name    || 'N/A')}
        ${pField('Email',        u?.email        || 'N/A')}
        ${pField('Phone',        u?.phone        || 'Not set')}
        ${pField('City',         u?.city         || 'Not set')}
        ${pField('State',        u?.state        || 'Not set')}
        ${pField('Member Since', new Date(u?.created_at || Date.now()).toLocaleDateString('en-IN'))}
        ${u?.profile?.farm_name     ? pField('Farm Name',     u.profile.farm_name)     : ''}
        ${u?.profile?.business_name ? pField('Business Name', u.profile.business_name) : ''}
        ${u?.profile?.company_name  ? pField('Company Name',  u.profile.company_name)  : ''}
      </div>
      <button onclick="AgroAPI.logout()"
        style="width:100%;padding:12px;background:#fee2e2;color:#ef4444;border:2px solid #fca5a5;border-radius:10px;font-size:0.9rem;font-weight:700;cursor:pointer;font-family:'Poppins',sans-serif;">
        <i class="fas fa-sign-out-alt"></i> Logout
      </button>
    </div>`;

  openModal('profileModal');
}

function pField(label, value) {
  return `
    <div style="background:#f0fdf4;border-radius:10px;padding:0.75rem;">
      <p style="font-size:0.72rem;color:#6b7280;margin:0 0 4px;font-family:'Poppins',sans-serif;text-transform:uppercase;letter-spacing:0.5px;">${label}</p>
      <strong style="font-size:0.88rem;color:#052e16;font-family:'Poppins',sans-serif;">${value}</strong>
    </div>`;
}

/* ============================================
   PRODUCT POSTING MODAL
   Restricted to Farmers & Distributors/Company Sellers
   Features Drag & Drop, Clipboard Paste (Ctrl+V),
   Local File Browsing, URL & AI tools
   ============================================ */
function openPostProductModal() {
  const user = AgroAPI.currentUser();
  const isKn = AgroLang.current === 'kn';

  if (!user) {
    showToast(AgroLang.t('login_farmer_distributor') || 'Please login as a Farmer or Distributor/Company Seller to post produce', 'warning', 'Login Required');
    openModal('authModal');
    return;
  }
  if (user.role === 'buyer') {
    showBuyerRestrictionAlert();
    return;
  }
  if (user.role !== 'farmer' && user.role !== 'distributor' && user.role !== 'admin') {
    showToast('Only Farmers and Distributors/Company Sellers can list products.', 'warning', 'Role Restricted');
    return;
  }

  let modal = document.getElementById('postProductModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'postProductModal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);backdrop-filter:blur(6px);z-index:9999;display:flex;align-items:center;justify-content:center;visibility:hidden;opacity:0;transition:opacity 0.3s;';
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal('postProductModal'); });
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="background:#fff;border-radius:24px;width:92%;max-width:680px;max-height:90vh;overflow-y:auto;box-shadow:0 30px 80px rgba(0,0,0,0.25);position:relative;font-family:'Poppins',sans-serif;">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#16a34a,#22c55e);padding:22px 28px;display:flex;align-items:center;justify-content:space-between;color:#fff;border-radius:24px 24px 0 0;position:sticky;top:0;z-index:10;">
        <div>
          <h3 style="margin:0;font-size:1.3rem;font-weight:800;display:flex;align-items:center;gap:8px;">
            <i class="fas fa-plus-circle"></i> ${isKn ? 'ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ಮಾರಾಟಕ್ಕೆ ಪೋಸ್ಟ್ ಮಾಡಿ' : 'Post Your Produce for Sale'}
          </h3>
          <p style="margin:4px 0 0;font-size:0.8rem;opacity:0.9;">
            ${isKn ? 'ನಿಮ್ಮ ಹೊಲ/ಕಂಪನಿಯಿಂದ ನೇರವಾಗಿ ದೇಶದಾದ್ಯಂತ ಖರೀದಿದಾರರು ಮತ್ತು ವಿತರಕರಿಗೆ ತಲುಪಿಸಿ' : 'Direct from your farm or company to nationwide buyers & distributors'}
          </p>
        </div>
        <button onclick="closeModal('postProductModal')" style="background:rgba(255,255,255,0.2);border:none;color:#fff;width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:1.1rem;font-weight:700;">✕</button>
      </div>

      <!-- Form Body -->
      <div style="padding:24px 28px;">
        <!-- Produce Name & Category -->
        <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:14px;margin-bottom:14px;">
          <div>
            <label style="display:block;font-size:0.82rem;font-weight:700;color:#374151;margin-bottom:6px;">
              ${isKn ? 'ಉತ್ಪನ್ನದ ಹೆಸರು *' : 'Produce Name *'}
            </label>
            <input id="pName" placeholder="${isKn ? 'ಉದಾ: ಕೆಂಪು ಟೊಮೆಟೊ, ಶರ್ಬತಿ ಗೋಧಿ...' : 'e.g. Fresh Red Tomatoes, Sharbati Wheat...'}" required
              style="width:100%;padding:11px 14px;border:1.5px solid #d1fae5;border-radius:12px;font-size:0.9rem;outline:none;box-sizing:border-box;font-family:'Poppins',sans-serif;"
              onfocus="this.style.borderColor='#16a34a'" onblur="this.style.borderColor='#d1fae5'"/>
          </div>
          <div>
            <label style="display:block;font-size:0.82rem;font-weight:700;color:#374151;margin-bottom:6px;">
              ${isKn ? 'ವರ್ಗ *' : 'Category *'}
            </label>
            <select id="pCategory"
              style="width:100%;padding:11px 14px;border:1.5px solid #d1fae5;border-radius:12px;font-size:0.9rem;outline:none;box-sizing:border-box;background:#f9fafb;font-family:'Poppins',sans-serif;"
              onfocus="this.style.borderColor='#16a34a'" onblur="this.style.borderColor='#d1fae5'">
              <option value="1">🌾 ${isKn ? 'ಧಾನ್ಯಗಳು (Grains)' : 'Grains'}</option>
              <option value="2">🥦 ${isKn ? 'ತರಕಾರಿಗಳು (Vegetables)' : 'Vegetables'}</option>
              <option value="3">🍎 ${isKn ? 'ಹಣ್ಣುಗಳು (Fruits)' : 'Fruits'}</option>
              <option value="4">🌿 ${isKn ? 'ಸಾವಯವ (Organic)' : 'Organic'}</option>
              <option value="5">🌱 ${isKn ? 'ದ್ವಿದಳ ಧಾನ್ಯಗಳು (Pulses)' : 'Pulses'}</option>
              <option value="6">🌶️ ${isKn ? 'ಮಸಾಲೆಗಳು (Spices)' : 'Spices'}</option>
              <option value="7">🥛 ${isKn ? 'ಹೈನುಗಾರಿಕೆ (Dairy)' : 'Dairy'}</option>
              <option value="8">🌻 ${isKn ? 'ಎಣ್ಣೆಕಾಳುಗಳು (Oilseeds)' : 'Oilseeds'}</option>
            </select>
          </div>
        </div>

        <!-- AI Assistant Toolbar -->
        <div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;background:#f0fdf4;padding:10px 14px;border-radius:12px;border:1px dashed #86efac;align-items:center;">
          <span style="font-size:0.75rem;font-weight:700;color:#15803d;"><i class="fas fa-robot"></i> ${isKn ? 'AI ಕೃಷಿ ಸಹಾಯಕ:' : 'AI Farm Assistant:'}</span>
          <button type="button" onclick="aiSuggestPrice()" id="aiPriceBtn"
            style="background:#fff;border:1.5px solid #16a34a;color:#15803d;padding:6px 12px;border-radius:20px;font-size:0.75rem;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:5px;">
            <i class="fas fa-rupee-sign"></i> ${isKn ? 'AI ಮಂಡಿ ಬೆಲೆ ಸಲಹೆ' : 'AI Suggest Mandi Price'}
          </button>
          <button type="button" onclick="aiWriteDescription()" id="aiDescBtn"
            style="background:#fff;border:1.5px solid #16a34a;color:#15803d;padding:6px 12px;border-radius:20px;font-size:0.75rem;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:5px;">
            <i class="fas fa-magic"></i> ${isKn ? 'AI ವಿವರಣೆ ರಚಿಸಿ' : 'AI Write Description'}
          </button>
          <button type="button" onclick="openModal('qualityGraderModal')"
            style="background:#fff;border:1.5px solid #ca8a04;color:#a16207;padding:6px 12px;border-radius:20px;font-size:0.75rem;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:5px;">
            <i class="fas fa-award"></i> ${isKn ? 'AI ಬೆಳೆ ಶ್ರೇಣೀಕರಣ' : 'AI Grade Harvest'}
          </button>
          <div id="aiFormMsg" style="width:100%;font-size:0.75rem;color:#15803d;display:none;padding:6px 8px;background:#fff;border-radius:6px;"></div>
        </div>

        <!-- Price, Unit & Quantities -->
        <div style="display:grid;grid-template-columns:1.2fr 1fr 1fr 1fr;gap:12px;margin-bottom:16px;">
          <div>
            <label style="display:block;font-size:0.82rem;font-weight:700;color:#374151;margin-bottom:6px;">
              ${isKn ? 'ಬೆಲೆ (₹) *' : 'Price (₹) *'}
            </label>
            <input id="pPrice" type="number" placeholder="e.g. 45" min="1" step="0.5" required
              style="width:100%;padding:10px 12px;border:1.5px solid #d1fae5;border-radius:12px;font-size:0.9rem;outline:none;box-sizing:border-box;"
              onfocus="this.style.borderColor='#16a34a'" onblur="this.style.borderColor='#d1fae5'"/>
          </div>
          <div>
            <label style="display:block;font-size:0.82rem;font-weight:700;color:#374151;margin-bottom:6px;">
              ${isKn ? 'ಪ್ರಮಾಣ (Unit)' : 'Unit'}
            </label>
            <select id="pUnit" style="width:100%;padding:10px 12px;border:1.5px solid #d1fae5;border-radius:12px;font-size:0.88rem;outline:none;box-sizing:border-box;background:#f9fafb;">
              <option value="kg">kg</option>
              <option value="quintal">quintal (100kg)</option>
              <option value="ton">ton</option>
              <option value="dozen">dozen</option>
              <option value="bag">bag</option>
            </select>
          </div>
          <div>
            <label style="display:block;font-size:0.82rem;font-weight:700;color:#374151;margin-bottom:6px;">
              ${isKn ? 'ಒಟ್ಟು ದಾಸ್ತಾನು *' : 'Total Stock *'}
            </label>
            <input id="pQty" type="number" placeholder="e.g. 500" min="1" required
              style="width:100%;padding:10px 12px;border:1.5px solid #d1fae5;border-radius:12px;font-size:0.9rem;outline:none;box-sizing:border-box;"
              onfocus="this.style.borderColor='#16a34a'" onblur="this.style.borderColor='#d1fae5'"/>
          </div>
          <div>
            <label style="display:block;font-size:0.82rem;font-weight:700;color:#374151;margin-bottom:6px;">
              ${isKn ? 'ಕನಿಷ್ಠ ಆರ್ಡರ್' : 'Min Order'}
            </label>
            <input id="pMinQty" type="number" value="5" min="1"
              style="width:100%;padding:10px 12px;border:1.5px solid #d1fae5;border-radius:12px;font-size:0.9rem;outline:none;box-sizing:border-box;"
              onfocus="this.style.borderColor='#16a34a'" onblur="this.style.borderColor='#d1fae5'"/>
          </div>
        </div>

        <!-- ============================================
             IMAGE UPLOADER: DRAG & DROP + COPY-PASTE (Ctrl+V) + FILE BROWSE
             ============================================ -->
        <div style="background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:16px;padding:16px;margin-bottom:18px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
            <label style="font-size:0.84rem;font-weight:700;color:#1e293b;display:flex;align-items:center;gap:6px;">
              <i class="fas fa-camera" style="color:#16a34a;"></i> ${isKn ? 'ಉತ್ಪನ್ನದ ಚಿತ್ರ (Image)' : 'Product Image'}
            </label>
            <span style="font-size:0.72rem;background:#dcfce7;color:#15803d;padding:2px 10px;border-radius:20px;font-weight:700;">
              <i class="fas fa-magic"></i> Drag-Drop &amp; Paste (Ctrl+V) Enabled
            </span>
          </div>

          <!-- Hidden File Input -->
          <input type="file" id="pImageFileInput" accept="image/*" style="display:none;" onchange="handleImageFileSelected(this)"/>

          <!-- Drag & Drop / Paste Zone -->
          <div id="imageDropZone"
            onclick="document.getElementById('pImageFileInput').click()"
            style="border:2px dashed #86efac;background:#f0fdf4;border-radius:14px;padding:18px 14px;text-align:center;cursor:pointer;transition:all 0.25s;margin-bottom:12px;position:relative;">
            
            <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
              <div style="width:48px;height:48px;border-radius:50%;background:#dcfce7;display:flex;align-items:center;justify-content:center;color:#16a34a;font-size:1.4rem;">
                <i class="fas fa-cloud-arrow-up"></i>
              </div>
              <div style="font-size:0.9rem;font-weight:700;color:#052e16;">
                ${isKn ? 'ಚಿತ್ರವನ್ನು ಇಲ್ಲಿಗೆ Drag & Drop ಮಾಡಿ, ಅಥವಾ' : 'Drag & Drop image here, or'} <span style="color:#16a34a;text-decoration:underline;">${isKn ? 'ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ (Browse)' : 'Browse File'}</span>
              </div>
              <div style="font-size:0.75rem;color:#4b5563;">
                📋 <strong>Tip:</strong> ${isKn ? 'ಯಾವುದೇ ಚಿತ್ರವನ್ನು Copy ಮಾಡಿ ನೇರವಾಗಿ ಇಲ್ಲಿ' : 'Copy any image & press'} <strong>Ctrl+V</strong> ${isKn ? 'ಒತ್ತಿ Paste ಮಾಡಬಹುದು!' : 'to paste directly!'}
              </div>
            </div>
          </div>

          <!-- Preview & Controls -->
          <div style="display:flex;align-items:center;gap:14px;background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;margin-bottom:12px;">
            <div style="position:relative;width:80px;height:80px;border-radius:12px;overflow:hidden;border:2px solid #22c55e;flex-shrink:0;background:#f1f5f9;">
              <img id="postImgPreview" src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400" alt="Preview"
                style="width:100%;height:100%;object-fit:cover;"
                onerror="this.src='https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'"/>
            </div>
            <div style="flex:1;min-width:0;">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;flex-wrap:wrap;">
                <span id="imgSourceBadge" style="font-size:0.72rem;background:#f0fdf4;border:1px solid #86efac;color:#166534;padding:2px 8px;border-radius:6px;font-weight:700;">
                  Sample Preset Loaded
                </span>
                <button type="button" onclick="clearProductImage()" id="imgClearBtn"
                  style="background:#fee2e2;border:none;color:#b91c1c;padding:2px 8px;border-radius:6px;font-size:0.72rem;font-weight:700;cursor:pointer;">
                  ✕ Clear
                </button>
              </div>
              <div style="font-size:0.75rem;color:#64748b;margin-bottom:6px;">
                ${isKn ? 'JPG, PNG, WebP & ನೇರ Clipboard ಚಿತ್ರಗಳನ್ನು ಬೆಂಬಲಿಸುತ್ತದೆ' : 'Supports JPG, PNG, WebP & direct clipboard blobs'}
              </div>
              <!-- URL Input Fallback -->
              <input id="pImage" placeholder="Or paste image URL (https://...)"
                value="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400"
                oninput="updateImagePreview(this.value)"
                style="width:100%;padding:7px 10px;border:1px solid #cbd5e1;border-radius:8px;font-size:0.78rem;outline:none;box-sizing:border-box;background:#f8fafc;font-family:'Poppins',sans-serif;"/>
            </div>
          </div>

          <!-- Quick 1-Click Presets -->
          <div>
            <span style="font-size:0.72rem;color:#64748b;display:block;margin-bottom:5px;font-weight:600;">
              ${isKn ? '1-ಕ್ಲಿಕ್ ಮಾದರಿ ಉತ್ಪನ್ನಗಳು (Quick Samples):' : '1-Click Sample Produce:'}
            </span>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button type="button" onclick="setPostSampleImg('https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400','Fresh Red Tomatoes',2,35)"
                style="background:#fff;border:1px solid #d1fae5;border-radius:6px;padding:3px 8px;font-size:0.72rem;cursor:pointer;color:#374151;">🍅 Tomatoes</button>
              <button type="button" onclick="setPostSampleImg('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400','Golden Sharbati Wheat',1,32)"
                style="background:#fff;border:1px solid #d1fae5;border-radius:6px;padding:3px 8px;font-size:0.72rem;cursor:pointer;color:#374151;">🌾 Wheat</button>
              <button type="button" onclick="setPostSampleImg('https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400','Organic Basmati Rice',1,65)"
                style="background:#fff;border:1px solid #d1fae5;border-radius:6px;padding:3px 8px;font-size:0.72rem;cursor:pointer;color:#374151;">🍚 Basmati Rice</button>
              <button type="button" onclick="setPostSampleImg('https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400','Shimla Royal Apples',3,120)"
                style="background:#fff;border:1px solid #d1fae5;border-radius:6px;padding:3px 8px;font-size:0.72rem;cursor:pointer;color:#374151;">🍎 Apples</button>
              <button type="button" onclick="setPostSampleImg('https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400','Fresh Farm Potatoes',2,25)"
                style="background:#fff;border:1px solid #d1fae5;border-radius:6px;padding:3px 8px;font-size:0.72rem;cursor:pointer;color:#374151;">🥔 Potatoes</button>
              <button type="button" onclick="setPostSampleImg('https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400','Nashik Red Onions',2,28)"
                style="background:#fff;border:1px solid #d1fae5;border-radius:6px;padding:3px 8px;font-size:0.72rem;cursor:pointer;color:#374151;">🧅 Onions</button>
            </div>
          </div>
        </div>

        <!-- Grade, Organic, Harvest Date -->
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px;">
          <div>
            <label style="display:block;font-size:0.82rem;font-weight:700;color:#374151;margin-bottom:6px;">
              ${isKn ? 'ಗುಣಮಟ್ಟದ ಶ್ರೇಣಿ' : 'Quality Grade'}
            </label>
            <select id="pGrade" style="width:100%;padding:10px 12px;border:1.5px solid #d1fae5;border-radius:12px;font-size:0.88rem;outline:none;box-sizing:border-box;background:#f9fafb;">
              <option value="A">Grade A (Premium)</option>
              <option value="B">Grade B (Standard)</option>
              <option value="C">Grade C (Processing)</option>
            </select>
          </div>
          <div>
            <label style="display:block;font-size:0.82rem;font-weight:700;color:#374151;margin-bottom:6px;">
              ${isKn ? 'ಕೊಯ್ಲು ದಿನಾಂಕ' : 'Harvest Date'}
            </label>
            <input id="pHarvestDate" type="date"
              style="width:100%;padding:9px 12px;border:1.5px solid #d1fae5;border-radius:12px;font-size:0.85rem;outline:none;box-sizing:border-box;background:#f9fafb;"/>
          </div>
          <div style="display:flex;align-items:center;padding-top:22px;">
            <label style="display:flex;align-items:center;gap:8px;font-size:0.85rem;font-weight:600;color:#052e16;cursor:pointer;">
              <input type="checkbox" id="pOrganic" style="width:18px;height:18px;accent-color:#16a34a;"/>
              🌿 ${isKn ? 'ಪ್ರಮಾಣೀಕೃತ ಸಾವಯವ' : 'Certified Organic'}
            </label>
          </div>
        </div>

        <!-- Description -->
        <div style="margin-bottom:20px;">
          <label style="display:block;font-size:0.82rem;font-weight:700;color:#374151;margin-bottom:6px;">
            ${isKn ? 'ಉತ್ಪನ್ನ ವಿವರಣೆ' : 'Product Description'}
          </label>
          <textarea id="pDesc" rows="3" placeholder="${isKn ? 'ರುಚಿ, ತಾಜಾತನ, ಕೃಷಿ ವಿಧಾನ ಅಥವಾ ಜಾಗದ ವಿವರಣೆ...' : 'Describe taste, freshness, cultivation methods or farm location...'}"
            style="width:100%;padding:11px 14px;border:1.5px solid #d1fae5;border-radius:12px;font-size:0.88rem;outline:none;box-sizing:border-box;resize:vertical;font-family:'Poppins',sans-serif;"
            onfocus="this.style.borderColor='#16a34a'" onblur="this.style.borderColor='#d1fae5'"></textarea>
        </div>

        <!-- Submit Button -->
        <button id="postProductSubmitBtn" type="button" onclick="submitPostProduct()"
          style="width:100%;padding:14px;background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;border:none;border-radius:12px;font-size:1rem;font-weight:800;cursor:pointer;box-shadow:0 6px 20px rgba(22,163,74,0.35);display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s;"
          onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
          <i class="fas fa-paper-plane"></i> ${isKn ? 'ಮಾರುಕಟ್ಟೆಗೆ ಪ್ರಕಟಿಸಿ' : 'Publish Item to Live Market'}
        </button>
      </div>
    </div>`;

  // Attach drag & drop listeners directly to the drop zone
  const dropZone = document.getElementById('imageDropZone');
  if (dropZone) {
    dropZone.ondragover = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.style.borderColor = '#16a34a';
      dropZone.style.background = '#dcfce7';
      dropZone.style.transform = 'scale(1.01)';
    };
    dropZone.ondragleave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.style.borderColor = '#86efac';
      dropZone.style.background = '#f0fdf4';
      dropZone.style.transform = 'none';
    };
    dropZone.ondrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.style.borderColor = '#86efac';
      dropZone.style.background = '#f0fdf4';
      dropZone.style.transform = 'none';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            applyUploadedImage(evt.target.result, `Dropped: ${file.name} 📁`);
            showToast('Image uploaded via Drag & Drop!', 'success', 'Image Uploaded');
          };
          reader.readAsDataURL(file);
        } else {
          showToast('Please drop a valid image file (JPG, PNG, WebP)', 'error', 'Invalid File');
        }
      }
    };
  }

  openModal('postProductModal');
}

function updateImagePreview(url) {
  const img = document.getElementById('postImgPreview');
  if (img) img.src = url || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400';
}

function setPostSampleImg(url, name, categoryId, price) {
  const pImg  = document.getElementById('pImage');
  const pName = document.getElementById('pName');
  const pCat  = document.getElementById('pCategory');
  const pPrc  = document.getElementById('pPrice');

  if (pImg)  { pImg.value = url; updateImagePreview(url); }
  if (pName && !pName.value) pName.value = name;
  if (pCat && categoryId)    pCat.value  = categoryId;
  if (pPrc && !pPrc.value)   pPrc.value  = price;

  const badge = document.getElementById('imgSourceBadge');
  if (badge) badge.textContent = `Preset: ${name}`;
  const clearBtn = document.getElementById('imgClearBtn');
  if (clearBtn) clearBtn.style.display = 'inline-block';
}

async function submitPostProduct() {
  const user = AgroAPI.currentUser();
  if (!user) { openModal('authModal'); return; }

  // Strict Buyer Restriction Check
  if (user.role === 'buyer') {
    showBuyerRestrictionAlert();
    return;
  }
  if (user.role !== 'farmer' && user.role !== 'distributor' && user.role !== 'admin') {
    showToast('Only Farmers and Distributors/Company Sellers can sell items.', 'error', 'Restricted');
    return;
  }

  const name  = document.getElementById('pName')?.value.trim();
  const catId = parseInt(document.getElementById('pCategory')?.value || 1);
  const price = parseFloat(document.getElementById('pPrice')?.value);
  const unit  = document.getElementById('pUnit')?.value || 'kg';
  const qty   = parseFloat(document.getElementById('pQty')?.value);
  const minQty= parseFloat(document.getElementById('pMinQty')?.value || 1);
  const img   = document.getElementById('pImage')?.value.trim() || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400';
  const org   = document.getElementById('pOrganic')?.checked || false;
  const grade = document.getElementById('pGrade')?.value || 'A';
  const hDate = document.getElementById('pHarvestDate')?.value || null;
  const desc  = document.getElementById('pDesc')?.value.trim();
  const btn   = document.getElementById('postProductSubmitBtn');

  if (!name || isNaN(price) || isNaN(qty)) {
    showToast('Name, price and quantity are required', 'warning', 'Missing Fields');
    return;
  }

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing to Marketplace…';
  btn.disabled  = true;

  try {
    const res = await AgroAPI.createProduct({
      category_id: catId,
      name,
      description: desc || 'Freshly harvested farm produce.',
      price_per_unit: price,
      unit,
      quantity_available: qty,
      min_order_quantity: minQty,
      image_url: img,
      is_organic: org,
      grade,
      harvest_date: hDate
    });

    if (res.success) {
      showToast(`🎉 "${name}" is now live on AgroMarket!`, 'success', 'Listed Successfully');
      
      // 🍃 Log Activity to MongoDB
      if (typeof AgroAPI !== 'undefined' && AgroAPI.logActivity) {
        AgroAPI.logActivity({
          userId: user.id,
          userName: user.full_name,
          action: 'post_product',
          details: { name, price, unit, quantity: qty }
        }).catch(() => {});
      }

      closeModal('postProductModal');
      loadProducts();
    } else {
      showToast(res.message || 'Failed to list product', 'error', 'Error');
    }
  } catch (err) {
    showToast(err.message, 'error', 'Error');
  } finally {
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Publish Item to Live Market';
    btn.disabled  = false;
  }
}

/* ============================================
   ENHANCED FARMER DASHBOARD MODAL
   Includes listed products management (toggle/delete)
   ============================================ */
async function openFarmerDash() {
  const dd = document.getElementById('userDropdown');
  if (dd) dd.style.display = 'none';
  showToast('Loading seller analytics & orders...', 'info', '');

  const [dashRes, myProdRes] = await Promise.all([
    AgroAPI.farmerDash(),
    AgroAPI.myProducts()
  ]);

  if (!dashRes.success) { showToast(dashRes.message || 'Failed', 'error', 'Error'); return; }

  const isKn = AgroLang.current === 'kn';
  const s = dashRes.stats;
  const products = myProdRes.success ? (myProdRes.products || []) : [];
  const recentOrders = dashRes.recentOrders || [];

  let modal = document.getElementById('farmerModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'farmerModal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);backdrop-filter:blur(6px);z-index:9999;display:flex;align-items:center;justify-content:center;visibility:hidden;opacity:0;transition:opacity 0.3s;';
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal('farmerModal'); });
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="background:#fff;border-radius:24px;padding:2rem;width:92%;max-width:820px;max-height:88vh;overflow-y:auto;box-shadow:0 30px 80px rgba(0,0,0,0.25);position:relative;font-family:'Poppins',sans-serif;">
      <button onclick="closeModal('farmerModal')" style="position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:50%;background:#f0fdf4;border:none;font-size:1.1rem;color:#16a34a;cursor:pointer;font-weight:700;">✕</button>
      
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap;gap:10px;">
        <div>
          <h3 style="font-size:1.4rem;font-weight:800;color:#052e16;margin:0;display:flex;align-items:center;gap:10px;">
            <i class="fas fa-tractor" style="color:#16a34a;"></i> ${isKn ? 'ರೈತ ಮತ್ತು ಮಾರಾಟಗಾರ ಹಬ್' : 'Farmer & Seller Producer Hub'}
          </h3>
          <p style="margin:4px 0 0;font-size:0.8rem;color:#6b7280;">
            ${isKn ? 'ನಿಮ್ಮ ಉತ್ಪನ್ನಗಳನ್ನು ನಿರ್ವಹಿಸಿ ಮತ್ತು ಗ್ರಾಹಕರ ಆರ್ಡರ್‌ಗಳನ್ನು ರವಾನಿಸಿ' : 'Manage your listed produce and fulfill incoming buyer orders'}
          </p>
        </div>
        <button onclick="closeModal('farmerModal');openPostProductModal();"
          style="background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;border:none;padding:9px 18px;border-radius:50px;font-size:0.85rem;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:6px;box-shadow:0 3px 12px rgba(22,163,74,0.3);">
          <i class="fas fa-plus"></i> ${isKn ? 'ಹೊಸ ಬೆಳೆ ಪೋಸ್ಟ್ ಮಾಡಿ' : 'Post New Produce'}
        </button>
      </div>

      <!-- KPI Cards -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:1.5rem;">
        ${dCard(isKn ? 'ನನ್ನ ಬೆಳೆಗಳು' : 'My Products',   s.myProducts,  'fa-boxes-stacked',     '#22c55e')}
        ${dCard(isKn ? 'ಒಟ್ಟು ಆರ್ಡರ್‌ಗಳು' : 'Total Orders',  s.myOrders,    'fa-shopping-bag',      '#f59e0b')}
        ${dCard(isKn ? 'ಮಾರಾಟವಾದ ಕೆಜಿ' : 'Sold kg',       s.totalSold,   'fa-weight-hanging',    '#3b82f6')}
        ${dCard(isKn ? 'ಒಟ್ಟು ಗಳಿಕೆ ₹' : 'Revenue ₹',     s.revenue,     'fa-indian-rupee-sign', '#a855f7')}
      </div>

      <!-- Customer Orders & Deliveries Section -->
      <div style="margin-bottom:1.5rem;border:1.5px solid #d1fae5;border-radius:18px;padding:16px;background:#f0fdf4;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
          <h4 style="font-size:1.05rem;font-weight:800;color:#052e16;margin:0;display:flex;align-items:center;gap:8px;">
            <i class="fas fa-truck-fast" style="color:#16a34a;"></i>
            ${isKn ? 'ಗ್ರಾಹಕರ ಆರ್ಡರ್‌ಗಳು ಮತ್ತು ರವಾನೆ' : 'Incoming Customer Orders & Dispatches'}
            <span style="font-size:0.75rem;background:#16a34a;color:#fff;padding:2px 10px;border-radius:50px;font-weight:700;">
              ${recentOrders.length}
            </span>
          </h4>
          <span style="font-size:0.75rem;color:#15803d;font-weight:600;">
            ${isKn ? 'ಆರ್ಡರ್ ಸ್ಥಿತಿಯನ್ನು ನವೀಕರಿಸಿ (ದೃಢೀಕರಿಸಿ / ರವಾನಿಸಿ)' : 'Update order status to keep buyers informed'}
          </span>
        </div>

        ${recentOrders.length ? `
          <div style="display:flex;flex-direction:column;gap:12px;">
            ${recentOrders.map(o => {
              const currentSt = (o.order_status || o.status || 'pending').toLowerCase();
              const stBadge = currentSt === 'pending' ? { bg:'#fef3c7', text:'#b45309', label:'PENDING' }
                            : currentSt === 'confirmed' ? { bg:'#dbeafe', text:'#1d4ed8', label:'CONFIRMED' }
                            : currentSt === 'shipped' ? { bg:'#cffafe', text:'#0e7490', label:'SHIPPED' }
                            : currentSt === 'delivered' ? { bg:'#dcfce7', text:'#15803d', label:'DELIVERED' }
                            : { bg:'#fee2e2', text:'#b91c1c', label: currentSt.toUpperCase() };

              return `
                <div style="background:#fff;border:1px solid #bbf7d0;border-radius:14px;padding:14px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                  <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
                    <div>
                      <span style="font-weight:800;color:#0f172a;font-size:0.95rem;">#ORD-${o.order_id || o.id}</span>
                      <span style="font-size:0.75rem;padding:3px 10px;border-radius:50px;background:${stBadge.bg};color:${stBadge.text};font-weight:700;margin-left:6px;">
                        ● ${stBadge.label}
                      </span>
                      <span style="font-size:0.74rem;color:#64748b;margin-left:8px;">
                        ${new Date(o.created_at).toLocaleString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
                      </span>
                    </div>
                    <div style="font-size:1.05rem;font-weight:800;color:#16a34a;">
                      ₹${o.total_price}
                    </div>
                  </div>

                  <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:12px;padding:10px;background:#f8fafc;border-radius:10px;margin-bottom:10px;font-size:0.8rem;">
                    <!-- Crop Info -->
                    <div>
                      <strong style="color:#0f172a;display:block;font-size:0.88rem;">🌱 ${o.product_name}</strong>
                      <div style="color:#64748b;margin-top:2px;">
                        Quantity: <strong>${o.quantity} ${o.unit || 'kg'}</strong> &nbsp;|&nbsp; Rate: ₹${o.price_per_unit || (o.total_price/o.quantity).toFixed(0)}/${o.unit || 'kg'}
                      </div>
                      <div style="color:#64748b;margin-top:2px;">
                        Payment: <strong style="color:${o.payment_status === 'paid' ? '#16a34a' : '#b45309'};">${o.payment_status === 'paid' ? 'Paid Online ✅' : (o.payment_method||'COD').toUpperCase()}</strong>
                      </div>
                    </div>

                    <!-- Buyer Contact & Destination -->
                    <div>
                      <strong style="color:#0f172a;display:block;">👤 Buyer: ${o.buyer_name}</strong>
                      <div style="color:#2563eb;margin-top:2px;font-weight:600;">
                        📞 <a href="tel:${o.buyer_phone}" style="color:#2563eb;text-decoration:none;">${o.buyer_phone || 'Contact on file'}</a>
                      </div>
                      <div style="color:#64748b;margin-top:2px;font-size:0.75rem;">
                        📍 ${o.delivery_address || 'Address provided'}, ${o.delivery_city || ''} ${o.delivery_pincode || ''}
                      </div>
                    </div>
                  </div>

                  <!-- Farmer Action Buttons -->
                  <div style="display:flex;justify-content:flex-end;align-items:center;gap:8px;flex-wrap:wrap;">
                    <span style="font-size:0.75rem;color:#64748b;margin-right:auto;">Action:</span>
                    ${currentSt === 'pending' ? `
                      <button onclick="updateOrderStatusFromDash(${o.order_id || o.id}, 'confirmed')"
                        style="background:#2563eb;color:#fff;border:none;padding:6px 14px;border-radius:8px;font-size:0.78rem;font-weight:700;cursor:pointer;">
                        ✔ Confirm Order
                      </button>` : ''}
                    ${(currentSt === 'confirmed' || currentSt === 'pending') ? `
                      <button onclick="updateOrderStatusFromDash(${o.order_id || o.id}, 'shipped')"
                        style="background:#059669;color:#fff;border:none;padding:6px 14px;border-radius:8px;font-size:0.78rem;font-weight:700;cursor:pointer;">
                        🚚 Mark Dispatched / Shipped
                      </button>` : ''}
                    ${currentSt === 'shipped' ? `
                      <button onclick="updateOrderStatusFromDash(${o.order_id || o.id}, 'delivered')"
                        style="background:#16a34a;color:#fff;border:none;padding:6px 14px;border-radius:8px;font-size:0.78rem;font-weight:700;cursor:pointer;">
                        ✅ Mark Delivered
                      </button>` : ''}
                    ${currentSt === 'delivered' ? `
                      <span style="font-size:0.78rem;color:#15803d;font-weight:700;">✅ Completed & Delivered</span>
                    ` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : `
          <div style="text-align:center;padding:2rem;color:#6b7280;background:#fff;border-radius:12px;">
            <i class="fas fa-inbox" style="font-size:2rem;display:block;margin-bottom:8px;color:#a7f3d0;"></i>
            <p style="margin:0;font-size:0.85rem;">No customer orders received yet. Keep your crop listings active!</p>
          </div>
        `}
      </div>

      <!-- My Listed Products Table -->
      <div style="margin-bottom:1.5rem;border:1px solid #e5e7eb;border-radius:14px;padding:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <h4 style="font-size:0.95rem;font-weight:700;color:#052e16;margin:0;">
            <i class="fas fa-boxes-stacked" style="color:#16a34a;"></i> My Listed Produce (${products.length})
          </h4>
        </div>
        ${products.length ? `
          <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;font-size:0.82rem;text-align:left;">
              <thead>
                <tr style="border-bottom:1px solid #f0fdf4;color:#6b7280;">
                  <th style="padding:6px;">Item</th>
                  <th style="padding:6px;">Price</th>
                  <th style="padding:6px;">Stock</th>
                  <th style="padding:6px;">Status</th>
                  <th style="padding:6px;text-align:right;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${products.map(p => `
                  <tr style="border-bottom:1px solid #f9fafb;">
                    <td style="padding:8px 6px;font-weight:600;color:#111827;">${p.name}</td>
                    <td style="padding:8px 6px;color:#16a34a;font-weight:700;">₹${p.price_per_unit}/${p.unit||'kg'}</td>
                    <td style="padding:8px 6px;">${p.quantity_available} ${p.unit||'kg'}</td>
                    <td style="padding:8px 6px;">
                      <span style="font-size:0.7rem;padding:2px 8px;border-radius:20px;background:${p.is_available ? '#dcfce7' : '#fee2e2'};color:${p.is_available ? '#16a34a' : '#ef4444'};">
                        ${p.is_available ? 'Available' : 'Paused'}
                      </span>
                    </td>
                    <td style="padding:8px 6px;text-align:right;">
                      <button onclick="toggleProductAvailability(${p.id})" title="Toggle Stock"
                        style="background:#f0fdf4;border:1px solid #86efac;color:#16a34a;padding:3px 8px;border-radius:6px;cursor:pointer;font-size:0.75rem;margin-right:4px;">
                        <i class="fas fa-power-off"></i>
                      </button>
                      <button onclick="deleteProductById(${p.id})" title="Delete Product"
                        style="background:#fef2f2;border:1px solid #fca5a5;color:#ef4444;padding:3px 8px;border-radius:6px;cursor:pointer;font-size:0.75rem;">
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>` : '<p style="color:#9ca3af;font-size:0.85rem;margin:6px 0;">You have not listed any items yet. Click "+ Post New Produce" above!</p>'}
      </div>
    </div>`;

  openModal('farmerModal');
}

async function updateOrderStatusFromDash(orderId, newStatus) {
  const res = await AgroAPI.updateOrderStatus(orderId, newStatus);
  if (res.success) {
    showToast(`Order status updated to ${newStatus.toUpperCase()}!`, 'success', 'Status Updated');
    openFarmerDash();
  } else {
    showToast(res.message || 'Failed to update order status', 'error', 'Error');
  }
}

async function toggleProductAvailability(id) {
  const res = await AgroAPI.toggleProduct(id);
  if (res.success) {
    showToast('Product status updated', 'success', 'Status Toggled');
    openFarmerDash();
    loadProducts();
  }
}

async function deleteProductById(id) {
  if (!confirm('Are you sure you want to remove this product from the marketplace?')) return;
  const res = await AgroAPI.deleteProduct(id);
  if (res.success) {
    showToast('Product deleted', 'success', 'Removed');
    openFarmerDash();
    loadProducts();
  }
}

/* ============================================
   LIVE DUAL-DATABASE ADMIN CONSOLE (MySQL + MongoDB)
   ============================================ */
async function openAdminDash() {
  showToast('Connecting to MySQL & MongoDB analytics...', 'info', 'Admin Console');

  const [adminRes, mongoRes, actRes] = await Promise.all([
    AgroAPI.adminDash(),
    AgroAPI.getAnalyticsStats(),
    AgroAPI.getActivities()
  ]);

  const s = adminRes.success ? adminRes.stats : { farmers: 0, buyers: 0, distributors: 0, products: 0, orders: 0, revenue: 0, pending: 0 };
  const m = mongoRes.success ? (mongoRes.stats || {}) : { totalViews: 0, totalSearches: 0, totalChats: 0, topSearches: [] };
  const acts = actRes.success ? (actRes.activities || []) : [];

  let modal = document.getElementById('adminModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'adminModal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);backdrop-filter:blur(6px);z-index:9999;display:flex;align-items:center;justify-content:center;visibility:hidden;opacity:0;transition:opacity 0.3s;';
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal('adminModal'); });
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="background:#fff;border-radius:24px;width:94%;max-width:850px;max-height:90vh;overflow-y:auto;box-shadow:0 30px 80px rgba(0,0,0,0.25);position:relative;font-family:'Poppins',sans-serif;">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#1e293b,#0f172a);padding:22px 28px;display:flex;align-items:center;justify-content:space-between;color:#fff;border-radius:24px 24px 0 0;position:sticky;top:0;z-index:10;">
        <div>
          <div style="display:flex;align-items:center;gap:10px;">
            <h3 style="margin:0;font-size:1.35rem;font-weight:800;"><i class="fas fa-server" style="color:#38bdf8;"></i> Enterprise Admin Console</h3>
            <span style="font-size:0.7rem;padding:3px 10px;border-radius:20px;background:#22c55e22;color:#4ade80;border:1px solid #22c55e;">🐬 MySQL + 🍃 MongoDB Live</span>
          </div>
          <p style="margin:4px 0 0;font-size:0.78rem;opacity:0.8;">Unified telemetry across relational orders &amp; NoSQL event stream</p>
        </div>
        <button onclick="closeModal('adminModal')" style="background:rgba(255,255,255,0.2);border:none;color:#fff;width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:1.1rem;font-weight:700;">✕</button>
      </div>

      <div style="padding:24px 28px;">
        <!-- Standalone Master Admin Portal Banner -->
        <div style="background:linear-gradient(135deg,#0b1120,#1e293b);border:1px solid #334155;border-radius:14px;padding:16px 20px;margin-bottom:1.5rem;display:flex;align-items:center;justify-content:space-between;gap:14px;box-shadow:0 8px 24px rgba(0,0,0,0.15);">
          <div>
            <div style="color:#f8fafc;font-weight:800;font-size:0.95rem;display:flex;align-items:center;gap:8px;">
              <i class="fas fa-shield-halved" style="color:#22c55e;"></i> Master Administrator Portal (Special Powers)
            </div>
            <div style="color:#94a3b8;font-size:0.75rem;margin-top:3px;">
              Full superuser console: User Governance (Ban/Verify/Delete), Product Moderation, Order Overrides, Live System Telemetry, Emergency Broadcasts &amp; Direct MongoDB Audit Browser.
            </div>
          </div>
          <a href="/admin" target="_blank"
            style="background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-weight:700;padding:10px 18px;border-radius:10px;font-size:0.82rem;text-decoration:none;display:flex;align-items:center;gap:6px;flex-shrink:0;box-shadow:0 4px 14px rgba(34,197,94,0.35);transition:all 0.2s;"
            onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
            Open Full Admin Portal <i class="fas fa-external-link-alt"></i>
          </a>
        </div>

        <!-- MySQL Section -->
        <div style="margin-bottom:1.5rem;">
          <h4 style="font-size:0.95rem;font-weight:800;color:#0f172a;margin-bottom:10px;display:flex;align-items:center;gap:8px;">
            <i class="fas fa-database" style="color:#2563eb;"></i> MySQL Relational Datastore (agriproject_db)
          </h4>
          <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px;">
            ${dCardMini('Total Rev', '₹' + parseFloat(s.revenue||0).toLocaleString('en-IN'), '#22c55e')}
            ${dCardMini('Orders', s.orders, '#f59e0b')}
            ${dCardMini('Products', s.products, '#3b82f6')}
            ${dCardMini('Farmers', s.farmers, '#16a34a')}
            ${dCardMini('Buyers', s.buyers, '#8b5cf6')}
            ${dCardMini('Pending', s.pending, '#ef4444')}
          </div>
        </div>

        <!-- MongoDB Section -->
        <div style="margin-bottom:1.5rem;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:16px;padding:16px;">
          <h4 style="font-size:0.95rem;font-weight:800;color:#065f46;margin:0 0 10px;display:flex;align-items:center;gap:8px;">
            <i class="fas fa-leaf" style="color:#16a34a;"></i> MongoDB Analytics &amp; Log Engine (agrimarket_analytics)
          </h4>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:12px;">
            <div style="background:#fff;padding:12px;border-radius:12px;border:1px solid #d1fae5;">
              <div style="font-size:1.4rem;font-weight:900;color:#052e16;">${m.totalViews || 0}</div>
              <div style="font-size:0.75rem;color:#6b7280;">Page &amp; Product Views</div>
            </div>
            <div style="background:#fff;padding:12px;border-radius:12px;border:1px solid #d1fae5;">
              <div style="font-size:1.4rem;font-weight:900;color:#052e16;">${m.totalChats || 0}</div>
              <div style="font-size:0.75rem;color:#6b7280;">AI AgroBot Queries Logged</div>
            </div>
            <div style="background:#fff;padding:12px;border-radius:12px;border:1px solid #d1fae5;">
              <div style="font-size:1.4rem;font-weight:900;color:#052e16;">${m.totalSearches || 0}</div>
              <div style="font-size:0.75rem;color:#6b7280;">Marketplace Searches</div>
            </div>
            <div style="background:#fff;padding:12px;border-radius:12px;border:1px solid #d1fae5;">
              <div style="font-size:1.4rem;font-weight:900;color:#052e16;">${m.totalContacts || 0}</div>
              <div style="font-size:0.75rem;color:#6b7280;">Feedback Documents</div>
            </div>
          </div>

          <!-- Top Searches from MongoDB -->
          ${m.topSearches?.length ? `
            <div style="font-size:0.8rem;color:#374151;">
              <strong>🔥 Top Search Keywords:</strong>
              ${m.topSearches.map(t => `<span style="display:inline-block;background:#fff;padding:2px 8px;border-radius:12px;margin:2px 4px;border:1px solid #86efac;font-size:0.75rem;">${t.query} (${t.count})</span>`).join('')}
            </div>` : ''}
        </div>

        <!-- Recent MySQL Orders -->
        <div style="margin-bottom:1.5rem;">
          <h4 style="font-size:0.95rem;font-weight:800;color:#0f172a;margin-bottom:10px;">Recent Platform Orders</h4>
          <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;font-size:0.82rem;text-align:left;">
              <thead>
                <tr style="border-bottom:1.5px solid #e2e8f0;color:#64748b;">
                  <th style="padding:8px 6px;">Order No</th>
                  <th style="padding:8px 6px;">Buyer</th>
                  <th style="padding:8px 6px;">Amount</th>
                  <th style="padding:8px 6px;">Payment</th>
                  <th style="padding:8px 6px;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${(adminRes.recentOrders || []).map(o => `
                  <tr style="border-bottom:1px solid #f1f5f9;">
                    <td style="padding:8px 6px;font-weight:700;color:#0284c7;">#ORD-${o.id}</td>
                    <td style="padding:8px 6px;color:#334155;">${o.buyer_name}</td>
                    <td style="padding:8px 6px;font-weight:700;color:#16a34a;">₹${o.total_amount}</td>
                    <td style="padding:8px 6px;"><span style="font-size:0.7rem;padding:2px 6px;border-radius:4px;background:#e0f2fe;color:#0369a1;">${o.payment_status}</span></td>
                    <td style="padding:8px 6px;"><span style="font-size:0.7rem;padding:2px 8px;border-radius:20px;background:#dcfce7;color:#16a34a;">${o.status}</span></td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- MongoDB Live Activity Audit Feed -->
        ${acts.length ? `
          <div>
            <h4 style="font-size:0.95rem;font-weight:800;color:#0f172a;margin-bottom:10px;">
              <i class="fas fa-stream" style="color:#10b981;"></i> Live MongoDB Event Audit Stream
            </h4>
            <div style="max-height:160px;overflow-y:auto;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:10px;">
              ${acts.map(a => `
                <div style="font-size:0.75rem;padding:4px 0;border-bottom:1px solid #f1f5f9;display:flex;justify-content:space-between;">
                  <span><strong>${a.userName || 'User'}</strong> — ${a.action}</span>
                  <span style="color:#94a3b8;">${new Date(a.createdAt).toLocaleTimeString()}</span>
                </div>`).join('')}
            </div>
          </div>` : ''}
      </div>
    </div>`;

  openModal('adminModal');
}

function dCardMini(label, val, color) {
  return `
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:10px;text-align:center;">
      <div style="font-size:1.1rem;font-weight:900;color:${color};">${val || 0}</div>
      <div style="font-size:0.7rem;color:#64748b;margin-top:2px;">${label}</div>
    </div>`;
}

function dCard(label, value, icon, color) {
  return `
    <div style="background:#f0fdf4;border-radius:14px;padding:1rem;border:1px solid #d1fae5;">
      <div style="width:36px;height:36px;border-radius:8px;background:${color};display:flex;align-items:center;justify-content:center;color:#fff;font-size:0.95rem;margin-bottom:0.5rem;">
        <i class="fas ${icon}"></i>
      </div>
      <div style="font-size:1.35rem;font-weight:900;color:#052e16;">${parseFloat(value || 0).toLocaleString('en-IN')}</div>
      <div style="font-size:0.75rem;color:#6b7280;">${label}</div>
    </div>`;
}

/* ============================================
   DIRECT MESSAGING & CHAT WITH FARMER
   ============================================ */
function openDirectMessage(farmerId, farmerName, productId, productName) {
  if (!AgroAPI.isLoggedIn()) {
    showToast('Please login to send message to farmer', 'warning', 'Login Required');
    openModal('authModal');
    return;
  }

  let modal = document.getElementById('directMsgModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'directMsgModal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);backdrop-filter:blur(6px);z-index:9999;display:flex;align-items:center;justify-content:center;visibility:hidden;opacity:0;transition:opacity 0.3s;';
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal('directMsgModal'); });
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="background:#fff;border-radius:24px;width:90%;max-width:480px;padding:24px;box-shadow:0 30px 80px rgba(0,0,0,0.25);position:relative;font-family:'Poppins',sans-serif;">
      <button onclick="closeModal('directMsgModal')" style="position:absolute;top:16px;right:16px;width:34px;height:34px;border-radius:50%;background:#f0fdf4;border:none;font-size:1.1rem;color:#16a34a;cursor:pointer;font-weight:700;">✕</button>
      <h3 style="margin:0 0 4px;font-size:1.2rem;font-weight:800;color:#052e16;">
        <i class="fas fa-comment-dots" style="color:#16a34a;"></i> Chat with ${farmerName}
      </h3>
      <p style="margin:0 0 14px;font-size:0.8rem;color:#6b7280;">Inquiry regarding: <strong>${productName}</strong></p>
      <textarea id="dmMessage" rows="4" placeholder="Hello! I am interested in purchasing your ${productName}. Can you supply..."
        style="width:100%;padding:12px;border:1.5px solid #d1fae5;border-radius:12px;font-size:0.88rem;outline:none;box-sizing:border-box;resize:vertical;font-family:'Poppins',sans-serif;margin-bottom:14px;"></textarea>
      <button onclick="sendDirectMessage(${farmerId}, ${productId})"
        style="width:100%;padding:12px;background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;border:none;border-radius:12px;font-size:0.95rem;font-weight:700;cursor:pointer;">
        <i class="fas fa-paper-plane"></i> Send Inquiry
      </button>
    </div>`;

  openModal('directMsgModal');
}

async function sendDirectMessage(farmerId, productId) {
  const text = document.getElementById('dmMessage')?.value.trim();
  if (!text) { showToast('Type a message first', 'warning', 'Empty'); return; }

  const res = await AgroAPI.sendMessage(farmerId, text, productId);
  if (res.success) {
    showToast('Inquiry sent to farmer!', 'success', 'Message Sent 📩');
    closeModal('directMsgModal');
  } else {
    showToast(res.message || 'Failed to send message', 'error', 'Error');
  }
}

/* ============================================
   CONTACT FORM (Saved to MySQL + MongoDB)
   ============================================ */
async function handleContactForm() {
  const name    = document.getElementById('name')?.value.trim();
  const email   = document.getElementById('email')?.value.trim();
  const message = document.getElementById('message')?.value.trim();
  const btn     = document.getElementById('submitBtn');
  const success = document.getElementById('form-success');

  if (!name || !email || !message) {
    showToast('Please fill all fields', 'error', 'Error');
    return;
  }

  if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'; btn.disabled = true; }

  // 1. MySQL message if logged in
  if (AgroAPI.isLoggedIn()) {
    await AgroAPI.sendMessage(1, `Contact Form Submission\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);
  }

  // 2. 🍃 MongoDB document submission
  if (typeof AgroAPI !== 'undefined' && AgroAPI.submitContactDoc) {
    AgroAPI.submitContactDoc({ name, email, message }).catch(() => {});
  }

  setTimeout(() => {
    if (btn)     { btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message'; btn.disabled = false; }
    if (success) { success.classList.remove('hidden'); setTimeout(() => success.classList.add('hidden'), 5000); }
    showToast('Message sent and saved to MongoDB & MySQL!', 'success', 'Thank You 🎉');
    if (document.getElementById('name'))    document.getElementById('name').value    = '';
    if (document.getElementById('email'))   document.getElementById('email').value   = '';
    if (document.getElementById('message')) document.getElementById('message').value = '';
  }, 1200);
}

/* ── Hero Buttons & Navbar Listeners ── */
function connectHeroButtons() {
  document.querySelectorAll('a[href="#features"], .btn-primary, .btn-outline').forEach(btn => {
    if (btn.textContent.includes('Get Started')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!AgroAPI.isLoggedIn()) openModal('authModal');
        else document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  });

  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) {
    submitBtn.removeAttribute('onclick');
    submitBtn.addEventListener('click', handleContactForm);
  }

  // Wire up Dashboard link in main navbar to role-specific dashboard
  document.querySelectorAll('a[href="#dashboard"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const u = AgroAPI.currentUser();
      if (!u) {
        showToast('Please login to access your account dashboard.', 'info', 'Login Required');
        openModal('authModal');
      } else if (u.role === 'buyer') {
        openMyOrders();
      } else if (u.role === 'farmer' || u.role === 'distributor') {
        openFarmerDash();
      } else {
        openAdminDash();
      }
    });
  });
}

/* ============================================
   INIT — runs when page loads
   ============================================ */
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Kannada / English language
  const savedLang = localStorage.getItem('agro_lang') || 'en';
  if (savedLang === 'kn') {
    setLanguage('kn');
  } else {
    const btnEn = document.getElementById('langBtnEn');
    const btnKn = document.getElementById('langBtnKn');
    if (btnEn && btnKn) {
      btnEn.style.background = '#16a34a';
      btnEn.style.color = '#fff';
      btnKn.style.background = 'transparent';
      btnKn.style.color = '#166534';
    }
  }

  buildAuthModal();
  buildCartSidebar();
  updateNavbar();
  connectHeroButtons();
  loadProducts();
  loadCategoryFilters();
  if (AgroAPI.isLoggedIn()) {
    loadCartCount();
    loadNotificationsBadge();
    checkFarmerNewOrdersAlert();
  }
  // 🍃 Log home page view in MongoDB
  if (typeof AgroAPI !== 'undefined' && AgroAPI.logView) {
    const u = AgroAPI.currentUser();
    AgroAPI.logView({ userId: u ? u.id : null, page: 'home', action: 'visit' }).catch(() => {});
  }
});

// Window globals
window.openPostProductModal = openPostProductModal;
window.submitPostProduct    = submitPostProduct;
window.updateImagePreview   = updateImagePreview;
window.setPostSampleImg     = setPostSampleImg;
window.applyUploadedImage   = applyUploadedImage;
window.clearProductImage    = clearProductImage;
window.handleImageFileSelected = handleImageFileSelected;
window.setLanguage          = setLanguage;
window.showBuyerRestrictionAlert = showBuyerRestrictionAlert;
window.openMyOrders         = openMyOrders;
window.openFarmerDash       = openFarmerDash;
window.openAdminDash        = openAdminDash;
window.updateOrderStatusFromDash = updateOrderStatusFromDash;
window.openDirectMessage    = openDirectMessage;
window.sendDirectMessage    = sendDirectMessage;
window.toggleProductAvailability = toggleProductAvailability;
window.deleteProductById    = deleteProductById;
window.toggleNotificationDropdown = toggleNotificationDropdown;
window.markNotificationsRead = markNotificationsRead;