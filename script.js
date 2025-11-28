// ============================================
// R.D Motors - JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  
  // ---------- Mobile Navigation ----------
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // ---------- Header Scroll Effect ----------
  const header = document.getElementById('header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ---------- Active Nav Link ----------
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // ---------- Stats Counter ----------
  const statNumbers = document.querySelectorAll('.stat-number');
  let counted = false;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, 16);
  }

  function checkStats() {
    if (counted) return;
    
    const statsSection = document.querySelector('.stats-cards');
    if (!statsSection) return;
    
    const rect = statsSection.getBoundingClientRect();
    
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      counted = true;
      statNumbers.forEach(stat => animateCounter(stat));
    }
  }

  window.addEventListener('scroll', checkStats);
  checkStats();

  // ---------- Car Filter ----------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const carCards = document.querySelectorAll('.car-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      carCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.5s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ---------- Back to Top ----------
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---------- Contact Form ----------
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(this);
      const name = formData.get('name');
      const phone = formData.get('phone');
      const email = formData.get('email') || 'Not provided';
      const message = formData.get('message');

      // Create WhatsApp message
      const whatsappText = `Hello R.D Motors!

*Name:* ${name}
*Phone:* ${phone}
*Email:* ${email}

*Message:*
${message}`;

      const whatsappUrl = `https://wa.me/918638144013?text=${encodeURIComponent(whatsappText)}`;
      window.open(whatsappUrl, '_blank');

      // Reset form
      this.reset();
      
      // Show success notification
      showNotification('Message sent! We will contact you soon.');
    });
  }

  // ---------- Notification ----------
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      font-weight: 600;
      box-shadow: 0 10px 40px rgba(16, 185, 129, 0.3);
      z-index: 10000;
      transform: translateX(150%);
      transition: transform 0.4s ease;
    `;
    notification.innerHTML = `<i class="fas fa-check-circle" style="margin-right: 10px;"></i>${message}`;
    
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
      notification.style.transform = 'translateX(150%)';
      setTimeout(() => notification.remove(), 400);
    }, 4000);
  }

  // ---------- Smooth Scroll ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---------- Fade In Animation ----------
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  // ---------- Intersection Observer for Animations ----------
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeIn 0.6s ease forwards';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements
  document.querySelectorAll('.service-card, .car-card, .review-card, .why-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });

  console.log('🚗 R.D Motors Website Loaded Successfully!');
});
