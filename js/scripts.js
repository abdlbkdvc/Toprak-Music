(function(){
  // Hero Slider
  let currentSlide = 0;
  const slides = document.querySelectorAll('.hero-slide');
  const arrowLeft = document.querySelector('.hero-arrow-left');
  const arrowRight = document.querySelector('.hero-arrow-right');

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }

  if(arrowLeft && arrowRight && slides.length > 0) {
    arrowLeft.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    });

    arrowRight.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    });

    // Auto-slide every 5 seconds (optional)
    setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }, 5000);
  }

  // Year (guarded)
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if(navToggle && mainNav){
    navToggle.addEventListener('click', ()=>{
      const opening = !mainNav.classList.contains('show');
      mainNav.classList.toggle('show');
      navToggle.setAttribute('aria-expanded', opening ? 'true' : 'false');
    });
    // Close nav when a link is clicked (mobile)
    mainNav.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>{
      mainNav.classList.remove('show');
    }));
    // Ensure nav closes when window is resized to desktop width
    window.addEventListener('resize', ()=>{
      if(window.innerWidth > 640){
        mainNav.classList.remove('show');
        navToggle.setAttribute('aria-expanded','false');
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
    anchor.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href.length>1){
        const el = document.querySelector(href);
        if(el){
          e.preventDefault();
          el.scrollIntoView({behavior:'smooth',block:'start'});
        }
      }
    });
  });

  // Gallery lightbox
  const gallery = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');

  if(gallery && lightbox && lbImg){
    gallery.addEventListener('click', e=>{
      const img = e.target.closest('img');
      if(!img) return;
      lbImg.src = img.src;
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden','false');
    });

    function closeLB(){
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden','true');
      lbImg.src = '';
    }

    if(lbClose) lbClose.addEventListener('click', closeLB);
    lightbox.addEventListener('click', e=>{ if(e.target===lightbox) closeLB(); });
    document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeLB(); });
  }
  
  // Lesson details modal
  const lessonModal = document.getElementById('lessonModal');
  const lessonTitle = document.getElementById('lessonTitle');
  const lessonDesc = document.getElementById('lessonDesc');
  const lessonClose = document.getElementById('lessonClose');
  document.querySelectorAll('.lesson').forEach(card=>{
    function openLesson(){
      if(!lessonModal || !lessonTitle || !lessonDesc) return;
      const title = card.getAttribute('data-title') || '';
      const desc = card.getAttribute('data-desc') || '';
      lessonTitle.textContent = title;
      lessonDesc.textContent = desc;
      lessonModal.classList.add('active');
      lessonModal.setAttribute('aria-hidden','false');
    }
    card.addEventListener('click', openLesson);
    card.addEventListener('keydown', e=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); openLesson(); } });
  });
  function closeLesson(){
    if(!lessonModal || !lessonTitle || !lessonDesc) return;
    lessonModal.classList.remove('active');
    lessonModal.setAttribute('aria-hidden','true');
    lessonTitle.textContent = '';
    lessonDesc.textContent = '';
  }
  if(lessonClose) lessonClose.addEventListener('click', closeLesson);
  if(lessonModal) lessonModal.addEventListener('click', e=>{ if(e.target===lessonModal) closeLesson(); });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeLesson(); });
})();

/* --- Store: dynamic categories & products renderer --- */
(function(){
  const productsGrid = document.getElementById('productsGrid');
  const categoryButtons = Array.from(document.querySelectorAll('.category-btn'));

  if(!productsGrid || !categoryButtons.length) return;

  const productsByCategory = {
    telli: [
      {name:'Klasik Gitar', img:'img/klasıc.jpg', desc:'Klasik gitar — nylon teller, ideal eğitim ve konser.'},
      {name:'Akustik Gitar', img:'img/akustık.webp', desc:'Akustik - sıcak tonlu gövde.'},
      {name:'Elektro Gitar', img:'img/elektro.jpg', desc:'Elektro gitar — sahne ve kayıt uyumlu.'},
      {name:'Bas Gitar', img:'img/bass.jpg', desc:'4 telli bas gitar.'},
      {name:'Kısa Sap Bağlama', img:'img/kısasap.jpg', desc:'Kısa sap bağlama, geleneksel ton.'},
      {name:'Uzun Sap Bağlama', img:'img/uzunsap.jpg', desc:'Uzun sap bağlama, farklı düzenlemeler için.'},
      {name:'Ud', img:'img/ud.jpg', desc:'Ud — makam çalışmaları için.'},
      {name:'Kanun', img:'img/kanun.jpg', desc:'Kanun — klasik Türk müziği enstürmanı.'},
      {name:'Mandolin', img:'img/wp4134879-mandolin-wallpapers.jpg', desc:'Mandolin — küçük gövdeli telli çalgı.'},
      {name:'Ukulele', img:'img/ukulele.jpg', desc:'Ukulele — hafif ve taşınabilir.'},
      {name:'Cümbüş', img:'img/cumbus.jpg', desc:'Cümbüş — metal gövdeli, zengin ton.'},
      {name:'Sazbüş', img:'img/sazbus.jpg', desc:'Sazbüş — metal telli geleneksel çalgı.'}
    ],
    yayli: [
      {name:'Keman', img:'img/keman.jpg', desc:'Keman — eğitim ve performans modelleri.'},
      {name:'Viyola', img:'img/viyola.jpg', desc:'Viyola — daha full tonlu yaylı çalgı.'},
      {name:'Çello', img:'img/cello.jpg', desc:'Çello — derin, rahat ses çıkaran yaylı çalgı.'},
      {name:'Kabak Kemane', img:'img/kabakkemane.jpg', desc:'Kabak kemane — Türk müziği geleneği.'},
      {name:'Kemençe', img:'img/kemence.jpg', desc:'Kemençe — ney gibi saf Türk müziği sesi.'}
    ],
    tuslu: [
      {name:'Dijital Piyano', img:'img/dijitalpiano.jpg', desc:'Dijital piyano, 88 tuş, farklı sesler.'},
      {name:'Piyano', img:'img/piyano.jpg', desc:'Akustik grand/dik piyano — tam profesyonel ses.'},
      {name:'Klavye', img:'img/klavye.jpg', desc:'Elektrik klavye — taşınabilir, çeşitli tınılar.'},
      {name:'Melodika', img:'img/melodika.jpg', desc:'Melodika — tuşlu nefesli, eğitim uyumlu.'}
    ],
    nefesli: [
      {name:'Ney', img:'img/ney.jpg', desc:'Ney — klasik nefesli çalgı.'},
      {name:'Saksafon', img:'img/saksafon.jpg', desc:'Saksafon — tenor/alto seçenekleri.'},
      {name:'Flüt', img:'img/flüt.jpg', desc:'Flüt — okul ve performans modelleri.'},
      {name:'Klarnet', img:'img/klarnet.jpg', desc:'Klarnet — caz ve klasik repertuvar.'},
      {name:'Yan Flüt', img:'img/yanflut.jpg', desc:'Yan flüt — geniş ses spektrumu.'},
      {name:'Kaval', img:'img/kaval.jpg', desc:'Kaval — geleneksel Türk nefesli çalgısı.'}
    ],
    vurmalı: [
      {name:'Darbuka', img:'img/darbuka.jpg', desc:'Darbuka — ritim için el davulu.'},
      {name:'Bendir', img:'img/bendir.jpg', desc:'Bendir — derin vurmalı ritimler.'},
      {name:'Def', img:'img/def.jpg', desc:'Def — geleneksel çerçeve davul.'},
      {name:'Cajon', img:'img/cajon.jpg', desc:'Cajon — modern akustik ritm.'},
      {name:'Erbani', img:'img/erbani.jpg', desc:'Erbani — perküsif ritim enstrümanı.'},
      {name:'Bateri', img:'img/bateri.jpg', desc:'Bateri — tam drum kit, profesyonel kalite.'},
      {name:'Tumba', img:'img/tumba.jpg', desc:'Tumba — Latin vurmalı, sıcak ton.'}
    ],
    elektro: [
      {name:'Amfi', img:'img/amfi.jpg', desc:'Gitar/bas/amfi seçenekleri.'},
      {name:'Tuner', img:'img/tuner.jpg', desc:'Kompakt tuner.'},
      {name:'Metronom', img:'img/metronom.jpg', desc:'Dijital metronom.'},
      {name:'Kapak / Kılıf / Çanta', img:'img/kapakkılıfcanta.jpg', desc:'Koruyucu taşıma çözümleri.'},
      {name:'Pena / Mızrap / Baget', img:'img/pena.jpg', desc:'Aksesuar paketleri.'},
      {name:'Mikrofon & Ses', img:'img/mikrofon.jpg', desc:'Mikrofon ve küçük ses sistemleri.'}
    ]
  };

  function createCard(product){
    const div = document.createElement('article');
    div.className = 'product-card';
    div.innerHTML = `
      <div class="product-media">
        <img src="${product.img}" alt="${product.name}">
      </div>
      <h3>${product.name}</h3>
      <p class="muted">${product.desc}</p>
      <div class="card-actions">
        <a href="https://wa.me/905462503707?text=${encodeURIComponent(`${product.name} hakkında bilgi almak istiyorum.`)}" target="_blank" rel="noopener" class="btn-add wa-link">WhatsApp ile Bilgi Al</a>
      </div>
    `;
    return div;
  }

  function renderProducts(key){
    productsGrid.innerHTML = '';
    const list = productsByCategory[key] || [];
    list.forEach(p => productsGrid.appendChild(createCard(p)));
  }

  function showToast(text){
    let t = document.querySelector('.toast');
    if(!t){ t = document.createElement('div'); t.className='toast'; document.body.appendChild(t); }
    t.textContent = text; t.classList.add('show');
    clearTimeout(t._timeout);
    t._timeout = setTimeout(()=>{ t.classList.remove('show'); }, 2200);
  }

  // initial select first category
  function selectCategory(btn){
    categoryButtons.forEach(b=>{ b.setAttribute('aria-selected','false'); b.classList.remove('active'); });
    btn.setAttribute('aria-selected','true'); btn.classList.add('active');
    const key = btn.getAttribute('data-key');
    renderProducts(key);
  }

  categoryButtons.forEach((btn, idx)=>{
    btn.addEventListener('click', ()=> selectCategory(btn));
    // keyboard
    btn.addEventListener('keydown', e=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); selectCategory(btn); } });
    if(idx===0) selectCategory(btn);
  });

})();
