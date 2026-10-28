/**
 * AgroMarket – Smart Agricultural Marketplace Portal
 * script.js | Interactive JS
 */

/* ============================================
   1. LOADER
   ============================================ */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    // Kick off entry animations after loader
    revealOnScroll();
  }, 1200);
});
document.body.style.overflow = 'hidden'; // Prevent scroll during load

/* ============================================
   2. NAVBAR – Sticky + Scroll Highlight
   ============================================ */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function handleNavbar() {
  // Scrolled style
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link
  const scrollPos = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}
window.addEventListener('scroll', handleNavbar);

/* Hamburger Menu */
const hamburger = document.getElementById('hamburger');
const navLinksMenu = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksMenu.classList.toggle('open');
});

// Close mobile menu on link click
navLinksMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksMenu.classList.remove('open');
  });
});

/* ============================================
   3. SMOOTH SCROLL
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({
      top: target.offsetTop - offset,
      behavior: 'smooth'
    });
  });
});

/* ============================================
   4. SCROLL REVEAL
   ============================================ */
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger effect based on sibling index
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        let delay = 0;
        siblings.forEach((sibling, idx) => {
          if (sibling === entry.target) delay = idx * 80;
        });
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}
// Run on DOMContentLoaded too (in case loader is already dismissed)
document.addEventListener('DOMContentLoaded', revealOnScroll);

/* ============================================
   5. ANIMATED COUNTER (Stats & KPIs)
   ============================================ */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString('en-IN');
  }, 16);
}

// Observe stat counters
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num, .kpi-num').forEach(el => {
  counterObserver.observe(el);
});

/* ============================================
   6. PARTICLE GENERATOR (Hero)
   ============================================ */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 8 + 4;
    const x = Math.random() * 100;
    const duration = Math.random() * 12 + 8;
    const delay = Math.random() * 8;

    Object.assign(p.style, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${x}%`,
      bottom: '-20px',
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`,
      opacity: Math.random() * 0.3 + 0.1,
    });

    container.appendChild(p);
  }
}

// CSS animation for particles added dynamically
const particleStyle = document.createElement('style');
particleStyle.textContent = `
  @keyframes particleFloat {
    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
    10% { opacity: 0.3; }
    90% { opacity: 0.1; }
    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
  }
`;
document.head.appendChild(particleStyle);
createParticles();

/* ============================================
   7. PRODUCT FILTER
   ============================================ */
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    productCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = 'block';
        card.style.animation = 'none';
        // Trigger reflow
        void card.offsetWidth;
        card.style.animation = 'filterFadeIn 0.4s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// Filter animation keyframe
const filterStyle = document.createElement('style');
filterStyle.textContent = `
  @keyframes filterFadeIn {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
`;
document.head.appendChild(filterStyle);

/* ============================================
   8. WISHLIST TOGGLE
   ============================================ */
document.querySelectorAll('.wishlist-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const icon = btn.querySelector('i');
    icon.classList.toggle('far');
    icon.classList.toggle('fas');
    btn.style.color = icon.classList.contains('fas') ? '#ef4444' : '';
  });
});

/* ============================================
   9. CONTACT FORM
   ============================================ */
const submitBtn = document.getElementById('submitBtn');
const successMsg = document.getElementById('form-success');

if (submitBtn) {
  submitBtn.addEventListener('click', () => {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      // Shake animation for empty fields
      [document.getElementById('name'), document.getElementById('email'), document.getElementById('message')]
        .forEach(el => {
          if (!el.value.trim()) {
            el.style.borderColor = '#ef4444';
            el.style.animation = 'shake 0.4s ease';
            setTimeout(() => {
              el.style.animation = '';
              el.style.borderColor = '';
            }, 600);
          }
        });
      return;
    }

    // Simulate submission
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      submitBtn.disabled = false;
      successMsg.classList.remove('hidden');

      // Clear form
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      document.getElementById('message').value = '';

      setTimeout(() => successMsg.classList.add('hidden'), 5000);
    }, 1800);
  });
}

// Shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(shakeStyle);

/* ============================================
   10. BACK TO TOP BUTTON
   ============================================ */
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================
   11. DASHBOARD SIDEBAR – Active Link
   ============================================ */
window.switchDashboardTab = function(tabName) {
  document.querySelectorAll(".dash-link").forEach(link => {
    const t = link.getAttribute("data-tab");
    if (t === tabName) link.classList.add("active");
    else link.classList.remove("active");
  });
  document.querySelectorAll(".dash-panel").forEach(panel => {
    panel.classList.remove("active");
    panel.style.display = "none";
  });
  const activePanel = document.getElementById("dash-panel-" + tabName);
  if (activePanel) {
    activePanel.classList.add("active");
    activePanel.style.display = "block";
  }
};

document.querySelectorAll(".dash-link").forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const tab = this.getAttribute("data-tab") || "overview";
    window.switchDashboardTab(tab);
  });
});

/* ============================================
   12. HERO SECTION – Tilt Effect on Image
   ============================================ */
const heroImg = document.querySelector('.hero-img-card');
if (heroImg) {
  heroImg.addEventListener('mousemove', (e) => {
    const rect = heroImg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14;
    heroImg.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) translateY(-12px)`;
  });
  heroImg.addEventListener('mouseleave', () => {
    heroImg.style.transform = '';
  });
}

/* ============================================
   13. TESTIMONIAL CAROUSEL (touch swipe)
   ============================================ */
let touchStartX = 0;
let touchEndX = 0;
const testimonialGrid = document.querySelector('.testimonials-grid');

if (testimonialGrid) {
  testimonialGrid.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });
  testimonialGrid.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    // Basic swipe support (could extend with carousel logic)
  });
}

/* ============================================
   14. DYNAMIC NAVBAR TEXT COLOR in HERO
   ============================================ */
function updateNavColor() {
  const heroSection = document.getElementById('hero');
  if (!heroSection) return;
  const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
  if (window.scrollY < heroBottom - 80) {
    navbar.style.background = window.scrollY < 60 ? 'transparent' : '';
  }
}
window.addEventListener('scroll', updateNavColor);

/* ============================================
   15. PROGRESS BARS in KPI (visual touch)
   ============================================ */
// Generate mini sparkline for KPI cards on hover
document.querySelectorAll('.kpi-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-4px)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ============================================
   16. CONSOLE BRANDING
   ============================================ */
console.log(
  '%c🌱 AgroMarket Portal %c– Smart Agricultural Marketplace\n%cBuilt for Final Year Engineering Project Presentation',
  'background:#16a34a;color:#fff;font-size:16px;padding:6px 14px;border-radius:6px 0 0 6px;font-weight:bold;',
  'background:#f0fdf4;color:#15803d;font-size:16px;padding:6px 14px;border-radius:0 6px 6px 0;',
  'color:#6b7280;font-size:12px;padding:4px 0;'
);