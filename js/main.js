/* ══════════════════════════════════════════════
   AKAMPAMOR 2026 — main.js
══════════════════════════════════════════════ */

/* ─── Header scroll ─── */
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  header.classList.toggle('stuck', window.scrollY > 60);
}, { passive: true });

/* ─── Mobile menu ─── */
const burger    = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');

burger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
  document.body.style.overflow = open ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
});

/* ─── Hero parallax ─── */
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    heroBg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
  }, { passive: true });
}

/* ─── Lightbox ─── */
const lb      = document.getElementById('lb');
const lbImg   = document.getElementById('lb-img');
const lbClose = document.getElementById('lb-close');
const lbPrev  = document.getElementById('lb-prev');
const lbNext  = document.getElementById('lb-next');
const gItems  = Array.from(document.querySelectorAll('.g-item'));
let curIdx    = 0;

function getLargeUrl(el) {
  // Usa data-full (URL _b.jpg alta res) se disponível, senão usa o src da img
  return el.dataset.full || el.querySelector('img').src;
}

function openLb(i) {
  curIdx = i;
  lbImg.src = getLargeUrl(gItems[i]);
  lbImg.alt = gItems[i].querySelector('img').alt;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLb() {
  lb.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lbImg.src = ''; }, 200);
}
function stepLb(dir) {
  curIdx = (curIdx + dir + gItems.length) % gItems.length;
  lbImg.style.opacity = '0';
  setTimeout(() => {
    lbImg.src = getLargeUrl(gItems[curIdx]);
    lbImg.alt = gItems[curIdx].querySelector('img').alt;
    lbImg.style.opacity = '1';
  }, 150);
}

gItems.forEach((el, i) => el.addEventListener('click', () => openLb(i)));
lbClose.addEventListener('click', closeLb);
lbPrev.addEventListener('click', () => stepLb(-1));
lbNext.addEventListener('click', () => stepLb(1));
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowLeft') stepLb(-1);
  if (e.key === 'ArrowRight') stepLb(1);
});

/* ─── Copiar PIX ─── */
function copiarPix(btnId) {
  const chave = 'eventos@ibkmaceio.com.br';
  const btn = document.getElementById(btnId || 'btn-pix');
  if (!btn) return;

  function markCopiado() {
    btn.textContent = '✓ Copiado!';
    btn.classList.add('copiado');
    setTimeout(() => {
      btn.textContent = 'Copiar Chave';
      btn.classList.remove('copiado');
    }, 2800);
  }

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(chave).then(markCopiado).catch(() => {
      prompt('Copie a chave PIX:', chave);
    });
  } else {
    const input = Object.assign(document.createElement('input'), {
      value: chave,
      style: 'position:fixed;opacity:0'
    });
    document.body.appendChild(input);
    input.focus();
    input.select();
    input.setSelectionRange(0, chave.length);
    document.body.removeChild(input);
    markCopiado();
  }
}
window.copiarPix = copiarPix;

/* ─── Reveal on scroll ─── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.estacao-card, .prel-card, .info-card, .insc-card, .preco-card, .inclusos-card, .parcela-item, .faq-item, .depo-card, .depo-stats').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  revealObs.observe(el);
});

/* ─── Linha animada sob título da galeria ─── */
const galeriaH2 = document.querySelector('.galeria-header h2');
if (galeriaH2) {
  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        galeriaH2.classList.add('revealed');
      }
    });
  }, { threshold: 0.5 }).observe(galeriaH2);
}

/* ─── Nav active ─── */
const navLinks = document.querySelectorAll('.nav-desk a[href^="#"]');
const sections = document.querySelectorAll('section[id]');
const navObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => navObs.observe(s));

/* ─── Video facade ─── */
const videoFacade = document.getElementById('video-facade');
if (videoFacade) {
  videoFacade.addEventListener('click', () => {
    const vid   = videoFacade.dataset.vid;
    const start = videoFacade.dataset.start || '0';
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${vid}?start=${start}&autoplay=1&rel=0`;
    iframe.title = 'Akampamor 2024';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;';
    // remove thumbnail/button safely via DOM
    while (videoFacade.firstChild) videoFacade.removeChild(videoFacade.firstChild);
    videoFacade.appendChild(iframe);
    videoFacade.style.cursor = 'default';
  }, { once: true });
}

/* ─── Countdown — Akampamor 20 Nov 2026 ─── */
const AKAMPAMOR_TARGET = new Date('2026-11-20T08:00:00-03:00');

(function initCountdown() {
  const target = AKAMPAMOR_TARGET;
  const elDays  = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins  = document.getElementById('cd-mins');
  const cdWrap  = document.getElementById('hero-countdown');

  if (!elDays || !elHours || !elMins) return;

  const pad = n => String(n).padStart(2, '0');

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      cdWrap && cdWrap.classList.add('expired');
      return;
    }
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);

    elDays.textContent  = days;
    elHours.textContent = pad(hours);
    elMins.textContent  = pad(mins);
  }

  tick();
  setInterval(tick, 30000);
})();

/* ─── Deadline bar ─── */
(function initDeadlineBar() {
  const bar = document.getElementById('deadline-bar');
  if (!bar) { document.documentElement.style.setProperty('--db-h', '0px'); return; }
  const elDias = document.getElementById('deadline-dias');
  const elFill = document.getElementById('deadline-fill');

  const deadline = new Date(bar.dataset.deadline);
  const start = new Date(bar.dataset.start);

  function setBarVisible(visible) {
    bar.classList.toggle('hidden', !visible);
    const h = visible ? `${bar.offsetHeight}px` : '0px';
    document.documentElement.style.setProperty('--db-h', h);
  }

  function updateBar() {
    const now = Date.now();
    const diff = deadline - now;

    if (diff <= 0) {
      setBarVisible(false);
      return;
    }

    const dias = Math.ceil(diff / 86400000);
    elDias.textContent = dias;

    const totalMs = deadline - start;
    const decorridoMs = Math.max(0, now - start);
    const pct = Math.min(100, (decorridoMs / totalMs) * 100);
    elFill.style.width = pct + '%';
  }

  updateBar();
  // Medir altura real após layout
  requestAnimationFrame(() => {
    document.documentElement.style.setProperty('--db-h', `${bar.offsetHeight}px`);
  });
  setInterval(updateBar, 60000);
  window.addEventListener('resize', () => {
    if (!bar.classList.contains('hidden')) {
      document.documentElement.style.setProperty('--db-h', `${bar.offsetHeight}px`);
    }
  });

})();

/* ─── Parcelamento — destaca mês atual ─── */
(function initParcelamento() {
  const tabela = document.getElementById('parcelamento-tabela');
  if (!tabela) return;

  const mesAtual = new Date().getMonth() + 1;
  const items = tabela.querySelectorAll('.parcela-item');

  items.forEach(item => {
    const mes = parseInt(item.dataset.mes, 10);
    if (mes < mesAtual) {
      item.classList.add('parcela-passou');
    } else if (mes === mesAtual) {
      item.classList.add('parcela-atual');
    }
  });
})();

/* ─── FAQ accordion — fecha os outros ao abrir um ─── */
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;
  items.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        items.forEach(other => { if (other !== item) other.open = false; });
      }
    });
  });
})();

/* ─── Formulário de pré-inscrição ─── */
(function initFormInscricao() {
  const form = document.getElementById('form-inscricao');
  if (!form) return;

  const telInput = document.getElementById('form-telefone');
  const status = document.getElementById('form-status');

  // Máscara de telefone (XX) XXXXX-XXXX
  if (telInput) {
    telInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 6) {
        v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
      } else if (v.length > 2) {
        v = `(${v.slice(0,2)}) ${v.slice(2)}`;
      } else if (v.length > 0) {
        v = `(${v}`;
      }
      e.target.value = v;
    });
  }

  function limparErros() {
    form.querySelectorAll('.erro').forEach(el => el.classList.remove('erro'));
    status.textContent = '';
    status.classList.remove('erro', 'sucesso');
  }

  function mostrarErro(msg) {
    status.textContent = msg;
    status.classList.add('erro');
    status.classList.remove('sucesso');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    limparErros();

    const data = {
      marido: form.marido.value.trim(),
      esposa: form.esposa.value.trim(),
      email: form.email.value.trim(),
      telefone: form.telefone.value.trim(),
      cidade: form.cidade.value.trim(),
      pagamento: form.pagamento.value,
      casados: form.casados.checked,
    };

    const erros = [];
    if (!data.marido) { erros.push('marido'); }
    if (!data.esposa) { erros.push('esposa'); }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { erros.push('email'); }
    if (data.telefone.replace(/\D/g, '').length < 10) { erros.push('telefone'); }
    if (!data.cidade) { erros.push('cidade'); }
    if (!data.pagamento) { erros.push('pagamento'); }
    if (!data.casados) { erros.push('casados'); }

    if (erros.length) {
      erros.forEach(name => {
        const el = form.querySelector(`[name="${name}"]`);
        if (el) el.classList.add('erro');
        if (name === 'casados') {
          form.querySelector('.form-check').classList.add('erro');
        }
      });
      mostrarErro('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const corpo = [
      'Pré-inscrição Akampamor 2026',
      '',
      `Marido: ${data.marido}`,
      `Esposa: ${data.esposa}`,
      `E-mail: ${data.email}`,
      `WhatsApp: ${data.telefone}`,
      `Cidade/UF: ${data.cidade}`,
      `Forma de pagamento desejada: ${data.pagamento}`,
      `Confirmação de casamento no civil: Sim`,
      '',
      'Enviado via site oficial do Akampamor 2026.'
    ].join('\n');

    const subject = `Pré-inscrição Akampamor 2026 — ${data.marido} & ${data.esposa}`;
    const mailto = `mailto:eventos@ibkmaceio.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(corpo)}`;

    window.location.href = mailto;
    status.textContent = '✓ Abrindo seu cliente de e-mail... Você também pode finalizar no sistema oficial.';
    status.classList.add('sucesso');
    status.classList.remove('erro');
  });
})();

/* ─── Reels Carousel — carrossel com peek, setas, dots e vídeo inline ─── */
(function initReelsCarousel() {
  const carousel = document.getElementById('reels-carousel');
  if (!carousel) return;

  const track   = document.getElementById('reels-track');
  const btnPrev = document.getElementById('reels-prev');
  const btnNext = document.getElementById('reels-next');
  const dots    = Array.from(document.querySelectorAll('.reels-dot'));
  const cards   = Array.from(track.querySelectorAll('.reel-card'));

  if (!cards.length) return;

  let current = 0;

  /* ── Posicionamento: centraliza o card ativo no viewport ── */
  function getTrackOffset(idx) {
    const card = cards[idx];
    const carouselW = carousel.offsetWidth;
    const cardW     = card.offsetWidth;
    const gap       = parseFloat(getComputedStyle(track).gap) || 22;
    // Posição left do card idx dentro do track
    const cardLeft  = idx * (cardW + gap);
    // Offset para centralizar
    return (carouselW / 2) - cardLeft - (cardW / 2);
  }

  function goTo(idx, smooth) {
    // Pausa qualquer vídeo que esteja tocando no card anterior
    const prevCard = cards[current];
    const prevVideo = prevCard.querySelector('video');
    if (prevVideo) prevVideo.pause();

    current = Math.max(0, Math.min(idx, cards.length - 1));

    // Move o track
    const offset = getTrackOffset(current);
    track.style.transition = smooth === false
      ? 'none'
      : 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)';
    track.style.transform = 'translateX(' + offset + 'px)';

    // Atualiza classe .active
    cards.forEach((c, i) => c.classList.toggle('active', i === current));

    // Atualiza dots
    dots.forEach((d, i) => d.classList.toggle('active', i === current));

    // Habilita/desabilita setas
    if (btnPrev) btnPrev.disabled = current === 0;
    if (btnNext) btnNext.disabled = current === cards.length - 1;
  }

  /* ── Inicializa thumbnails ── */
  cards.forEach(card => {
    const facade  = card.querySelector('.reel-facade');
    const thumbEl = card.querySelector('.reel-thumb');
    const thumb   = facade && facade.dataset.thumb;
    if (thumb && thumbEl) {
      const img = new Image();
      img.onload = () => { thumbEl.style.backgroundImage = 'url(' + thumb + ')'; };
      img.src = thumb;
    }
  });

  /* ── Click no facade → injeta vídeo ── */
  cards.forEach((card, i) => {
    const facade = card.querySelector('.reel-facade');
    if (!facade) return;
    const src   = facade.dataset.src;
    const thumb = facade.dataset.thumb;

    // Clicar num card não-ativo navega primeiro para ele
    const activateFacade = () => {
      if (i !== current) {
        goTo(i, true);
        return;
      }
      // Card ativo: injeta vídeo
      const video = document.createElement('video');
      video.src = src;
      video.className = 'reel-video';
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      if (thumb) video.poster = thumb;
      card.replaceChild(video, facade);
      video.play().catch(() => {});
    };
    facade.addEventListener('click', activateFacade);
    facade.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateFacade(); }
    });
  });

  /* ── Setas ── */
  if (btnPrev) btnPrev.addEventListener('click', () => goTo(current - 1, true));
  if (btnNext) btnNext.addEventListener('click', () => goTo(current + 1, true));

  /* ── Dots ── */
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.goto, 10);
      if (!isNaN(idx)) goTo(idx, true);
    });
  });

  /* ── Swipe touch para mobile ── */
  let touchStartX = 0;
  let touchStartY = 0;
  carousel.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      goTo(dx < 0 ? current + 1 : current - 1, true);
    }
  }, { passive: true });

  /* ── Teclado ── */
  carousel.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  goTo(current - 1, true);
    if (e.key === 'ArrowRight') goTo(current + 1, true);
  });

  /* ── Reposiciona ao redimensionar (sem animação) ── */
  window.addEventListener('resize', () => goTo(current, false), { passive: true });

  /* ── Estado inicial ── */
  goTo(0, false);
})();

/* ─── Contato flutuante — esconde na seção #inscricao ─── */
(function initContatoFloat() {
  const float = document.getElementById('contato-float');
  const inscricao = document.getElementById('inscricao');
  if (!float || !inscricao) return;

  new IntersectionObserver((entries) => {
    entries.forEach(e => float.classList.toggle('hidden', e.isIntersecting));
  }, { threshold: 0.1 }).observe(inscricao);
})();
