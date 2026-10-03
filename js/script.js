document.addEventListener('DOMContentLoaded', () => {
  /* ================================
     1. MOBILE NAVIGATION & ACTIVE LINK
     ================================ */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-links a');

  // Highlight active page
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('nav-active');
      hamburger.innerHTML = !isExpanded ? '✕' : '☰';
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('nav-active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.innerHTML = '☰';
      });
    });
  }

  /* ================================
     2. STICKY HEADER
     ================================ */
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.boxShadow = 'var(--shadow-lg)';
      header.style.height = '60px';
    } else {
      header.style.boxShadow = 'var(--shadow)';
      header.style.height = '70px';
    }
  });

  /* ================================
     3. SCROLL REVEAL (IntersectionObserver)
     ================================ */
  const reveals = document.querySelectorAll('.reveal');
  const revealOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    });
  }, revealOptions);
  reveals.forEach(reveal => revealObserver.observe(reveal));

  /* ================================
     4. STAT COUNTERS
     ================================ */
  const counters = document.querySelectorAll('.stat-number');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = +entry.target.getAttribute('data-target');
          let count = 0;
          const increment = target / 50;
          const updateCounter = () => {
            count += increment;
            if (count < target) {
              entry.target.innerText = Math.ceil(count);
              requestAnimationFrame(updateCounter);
            } else {
              entry.target.innerText = target + '+';
            }
          };
          updateCounter();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(counter => counterObserver.observe(counter));
  }

  /* ================================
     5. FAQ ACCORDION
     ================================ */
  const accordions = document.querySelectorAll('.accordion-header');
  accordions.forEach(acc => {
    acc.addEventListener('click', () => {
      const parent = acc.parentElement;
      const isActive = parent.classList.contains('active');

      // Close all
      document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        parent.classList.add('active');
        acc.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ================================
     6. FORM VALIDATION
     ================================ */
  const forms = document.querySelectorAll('.validate-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      const inputs = form.querySelectorAll('[required]');

      inputs.forEach(input => {
        const errorMsg = input.nextElementSibling;
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#ef4444';
          if (errorMsg && errorMsg.classList.contains('form-error')) errorMsg.style.display = 'block';
        } else {
          input.style.borderColor = 'var(--border)';
          if (errorMsg && errorMsg.classList.contains('form-error')) errorMsg.style.display = 'none';
        }
      });

      if (isValid) {
        const successMsg = form.querySelector('.form-success');
        if (successMsg) successMsg.style.display = 'block';
        form.reset();
        setTimeout(() => successMsg.style.display = 'none', 5000);
      }
    });
  });

  /* ================================
     7. TEACHER FILTER
     ================================ */
  const teacherSearch = document.getElementById('teacher-search');
  const teacherCategory = document.getElementById('teacher-category');
  const teacherCards = document.querySelectorAll('.teacher-card');

  function filterTeachers() {
    if (!teacherSearch || !teacherCategory) return;
    const term = teacherSearch.value.toLowerCase();
    const cat = teacherCategory.value;

    teacherCards.forEach(card => {
      const name = card.dataset.name.toLowerCase();
      const subject = card.dataset.subject;
      const matchesSearch = name.includes(term);
      const matchesCat = cat === 'all' || subject === cat;
      card.style.display = (matchesSearch && matchesCat) ? 'block' : 'none';
    });
  }
  if (teacherSearch) teacherSearch.addEventListener('input', filterTeachers);
  if (teacherCategory) teacherCategory.addEventListener('change', filterTeachers);

  /* ================================
     8. GALLERY FILTER & LIGHTBOX
     ================================ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  // Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.filter-btn.active').classList.remove('active');
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox
  let currentImageIndex = 0;
  const visibleItems = () => Array.from(galleryItems).filter(item => item.style.display !== 'none');

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      const imgPath = item.querySelector('img').src;
      lightboxImg.src = imgPath;
      lightbox.classList.add('active');
      currentImageIndex = visibleItems().indexOf(item);
    });
  });

  if (lightbox) {
    document.querySelector('.lightbox-close').addEventListener('click', () => {
      lightbox.classList.remove('active');
    });

    const showImage = (index) => {
      const items = visibleItems();
      if (index >= items.length) currentImageIndex = 0;
      if (index < 0) currentImageIndex = items.length - 1;
      lightboxImg.src = items[currentImageIndex].querySelector('img').src;
    };

    document.querySelector('.lightbox-next').addEventListener('click', () => {
      currentImageIndex++;
      showImage(currentImageIndex);
    });

    document.querySelector('.lightbox-prev').addEventListener('click', () => {
      currentImageIndex--;
      showImage(currentImageIndex);
    });

    // Keyboard support for lightbox
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') lightbox.classList.remove('active');
      if (e.key === 'ArrowRight') { currentImageIndex++; showImage(currentImageIndex); }
      if (e.key === 'ArrowLeft') { currentImageIndex--; showImage(currentImageIndex); }
    });
  }

  // Current year in footer
  document.getElementById('current-year').textContent = new Date().getFullYear();
});