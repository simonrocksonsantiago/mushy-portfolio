/* ========================================
   MUSHY — Portfolio JS (Black & Red)
   ======================================== */

// --- Particle Background ---
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          this.x += (dx / dist) * force * 1.5;
          this.y += (dy / dist) * force * 1.5;
        }
      }

      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(230, 57, 70, ${this.opacity})`;
      ctx.fill();
    }
  }

  const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 200);
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const opacity = (1 - dist / 120) * 0.12;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(230, 57, 70, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function connectToMouse() {
    if (mouse.x === null) return;
    for (let i = 0; i < particles.length; i++) {
      const dx = particles[i].x - mouse.x;
      const dy = particles[i].y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        const opacity = (1 - dist / 200) * 0.3;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 77, 90, ${opacity})`;
        ctx.lineWidth = 0.6;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    connectToMouse();
    requestAnimationFrame(animate);
  }

  animate();
})();


// --- Navbar scroll ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});


// --- Mobile nav ---
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
  });
});


// --- Active nav on scroll ---
const sections = document.querySelectorAll('section[id]');
function updateActiveLink() {
  const scrollY = window.scrollY + 200;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
}
window.addEventListener('scroll', updateActiveLink);


// --- Stat counter ---
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else counter.textContent = target;
    }

    requestAnimationFrame(update);
  });
}

const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      heroObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);


// --- Scroll reveal (staggered for portfolio) ---
function initReveal() {
  const general = document.querySelectorAll(
    '.section-header, .about-text, .skills-grid, .service-card, .contact-form, .contact-top, .info-card, .discord-widget, .faq-card'
  );
  const portfolioEls = document.querySelectorAll('.portfolio-item');

  general.forEach(el => el.classList.add('reveal'));
  portfolioEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  general.forEach(el => observer.observe(el));
  portfolioEls.forEach(el => observer.observe(el));
}

initReveal();


// --- 3D Tilt + Parallax on portfolio cards ---
(function initTilt() {
  document.querySelectorAll('.portfolio-card').forEach(card => {
    const img = card.querySelector('img') || card.querySelector('video');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const tiltX = (y - 0.5) * -12;
      const tiltY = (x - 0.5) * 12;

      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;

      // Parallax image movement
      if (img) {
        const moveX = (x - 0.5) * -20;
        const moveY = (y - 0.5) * -20;
        img.style.transform = `scale(1.15) translate(${moveX}px, ${moveY}px)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
      if (img) {
        img.style.transform = '';
        img.style.transition = 'transform 0.5s ease';
      }
      setTimeout(() => {
        card.style.transition = '';
        if (img) img.style.transition = '';
      }, 500);
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
      if (img) img.style.transition = 'none';
    });
  });
})();


// --- (No filter needed — separate category sections) ---


// --- Lightbox ---
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  let currentItems = [];
  let currentIndex = 0;

  function getVisibleItems() {
    return Array.from(document.querySelectorAll('.portfolio-item:not(.video-item)'));
  }

  function openLightbox(index) {
    currentItems = getVisibleItems();
    currentIndex = index;
    showItem();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function showItem() {
    const item = currentItems[currentIndex];
    if (!item) return;
    const img = item.querySelector('img');
    const title = item.querySelector('.portfolio-overlay h3');
    const desc = item.querySelector('.portfolio-overlay p');
    if (img) lightboxImg.src = img.src;
    if (title) lightboxTitle.textContent = title.textContent;
    if (desc) lightboxDesc.textContent = desc.textContent;
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
    showItem();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % currentItems.length;
    showItem();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') { currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length; showItem(); }
    if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % currentItems.length; showItem(); }
  });

  // Click on non-video portfolio cards to open lightbox
  document.querySelectorAll('.portfolio-item:not(.video-item)').forEach(item => {
    item.querySelector('.portfolio-card').addEventListener('click', () => {
      const visibles = getVisibleItems();
      const idx = visibles.indexOf(item);
      if (idx !== -1) openLightbox(idx);
    });
  });
})();


// --- Video play on hover / click ---
document.querySelectorAll('.video-wrapper').forEach(wrapper => {
  const video = wrapper.querySelector('video');
  if (!video) return;

  wrapper.addEventListener('mouseenter', () => {
    video.play().catch(() => {});
    wrapper.classList.add('playing');
  });

  wrapper.addEventListener('mouseleave', () => {
    video.pause();
    video.currentTime = 0;
    wrapper.classList.remove('playing');
  });

  wrapper.addEventListener('click', () => {
    if (video.paused) {
      video.play().catch(() => {});
      wrapper.classList.add('playing');
    } else {
      video.pause();
      wrapper.classList.remove('playing');
    }
  });
});


// --- Contact form (Discord webhook) ---
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = contactForm.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span>Sending...</span>';
  btn.disabled = true;

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const discord = document.getElementById('discord').value.trim();
  const service = document.getElementById('service').value;
  const message = document.getElementById('message').value.trim();

  const embed = {
    title: '📩 New Commission Request',
    color: 0xe63946,
    fields: [
      { name: 'Name', value: name, inline: true },
      { name: 'Email', value: email, inline: true },
      { name: 'Discord', value: discord, inline: true },
      { name: 'Service', value: service, inline: true },
      { name: 'Message', value: message }
    ],
    timestamp: new Date().toISOString()
  };

  try {
    const res = await fetch('https://discord.com/api/webhooks/1483663427590295572/le263yXXsgQxtG7y-cOEN9rfSLMIHgrNfs6fVa15Si9WUjfpeNRexMDe9gHRJOmhQG1Z', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    });

    if (res.ok) {
      btn.innerHTML = '<span>Message Sent!</span>';
      btn.style.background = '#27ae60';
      contactForm.reset();
    } else {
      btn.innerHTML = '<span>Failed — try Discord DM</span>';
      btn.style.background = '#c0392b';
    }
  } catch {
    btn.innerHTML = '<span>Failed — try Discord DM</span>';
    btn.style.background = '#c0392b';
  }

  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.background = '';
    btn.disabled = false;
  }, 3000);
});


// --- Smooth scroll ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});
