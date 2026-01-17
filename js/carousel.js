
/* carrossel.js — Depoimentos (somente #depoimentos)
 * - Se Owl Carousel (jQuery) estiver presente: usa Owl com autoplay 5s.
 * - Caso contrário, fallback em JS puro com autoplay 5s e pausa em hover/toque.
 */
(function () {
  'use strict';

  var SECTION_ID = 'depoimentos';
  var WRAPPER_SELECTOR = '.carousel-testimony';
  var AUTOPLAY_MS = 5000;   // 5s
  var MARGIN_PX = 30;

  // Breakpoints do layout (itens visíveis)
  function visibleCount() {
    var w = window.innerWidth || document.documentElement.clientWidth;
    if (w >= 992) return 2; // desktop mais “estreito” (ajuste para 3 se preferir)
    if (w >= 768) return 2; // tablet
    return 1;               // mobile
  }

  function onDOMReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onDOMReady(function () {
    var section = document.getElementById(SECTION_ID);
    if (!section) return;

    var wrapper = section.querySelector(WRAPPER_SELECTOR);
    if (!wrapper) return;

    // ============== MODO 1 — OWL CAROUSEL (se disponível) ==============
    var $ = window.jQuery;
    var hasOwl = $ && $.fn && $.fn.owlCarousel;

    if (hasOwl) {
      var $el = $(wrapper);

      // Se o tema já inicializou, “reseta” para garantir nossas opções
      if ($el.hasClass('owl-loaded')) {
        $el.trigger('destroy.owl.carousel');
        $el.removeClass('owl-loaded');
        // remove wrappers adicionados pela Owl
        $el.find('.owl-stage-outer').children().unwrap();
      }

      $el.owlCarousel({
        loop: true,
        margin: MARGIN_PX,
        autoplay: true,
        autoplayTimeout: AUTOPLAY_MS,
        autoplayHoverPause: true,
        smartSpeed: 650,
        dots: true,
        nav: false,
        mouseDrag: true,
        touchDrag: true,
        responsive: {
          0:   { items: 1 },
          768: { items: 2 },
          992: { items: 2 } // altere para 3 se quiser três cards no desktop
        }
      });

      // Pausar/retomar também no gesto de pressionar/soltar (touch/mouse)
      $el.on('pointerdown.owl touchstart.owl mousedown.owl', function () {
        $el.trigger('stop.owl.autoplay');
      });
      $el.on('pointerup.owl touchend.owl mouseup.owl mouseleave.owl', function () {
        $el.trigger('play.owl.autoplay', [AUTOPLAY_MS]);
      });

      // Economiza CPU: pausa autoplay quando a seção estiver fora de viewport
      try {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (!e.isIntersecting) $el.trigger('stop.owl.autoplay');
            else $el.trigger('play.owl.autoplay', [AUTOPLAY_MS]);
          });
        }, { threshold: 0.1 });
        io.observe(section);
      } catch (_) { /* sem suporte a IO, segue */ }

      return; // encerra (já estamos usando Owl)
    }

    // ============== MODO 2 — FALLBACK VANILLA (sem Owl/jQuery) ==============

    // Estrutura:
    // <div class="carousel-testimony">
    //   <div class="item"> ... </div>  x N
    // </div>
    var items = Array.prototype.slice.call(wrapper.querySelectorAll('.item'));
    if (items.length === 0) return;

    // Cria trilha e move os itens para dentro
    var track = document.createElement('div');
    track.className = 'carousel-track';
    // CSS mínimo inline para evitar dependência externa
    track.style.display = 'flex';
    track.style.willChange = 'transform';
    track.style.transition = 'transform 650ms ease';

    // Wrapper precisa ocultar overflow para “janelar” os itens
    wrapper.style.overflow = 'hidden';
    wrapper.style.position = 'relative';

    // Move itens para track
    items.forEach(function (it) {
      it.style.flex = '0 0 auto';
      it.style.width = '100%'; // será recalculado no layout()
      it.style.marginRight = MARGIN_PX + 'px';
      track.appendChild(it);
    });
    wrapper.appendChild(track);

    var index = 0;         // índice de “página”
    var timer = null;      // setInterval
    var pages = 1;         // atualizado no layout()

    function layout() {
      var vis = visibleCount();
      // largura útil do wrapper
      var w = wrapper.clientWidth || wrapper.getBoundingClientRect().width;
      var itemWidth = (w - MARGIN_PX * (vis - 1)) / vis;
      // aplica largura por item
      items.forEach(function (it, idx) {
        it.style.width = Math.max(0, itemWidth) + 'px';
        // margin-right já foi aplicada acima
      });
      // total de páginas (ceil)
      pages = Math.max(1, Math.ceil(items.length / vis));
      // corrige índice fora de faixa após resize
      if (index > pages - 1) index = pages - 1;
      goTo(index, false);
    }

    function goTo(i, animate) {
      index = (i + pages) % pages;
      if (animate === false) track.style.transition = 'none';
      else track.style.transition = 'transform 650ms ease';

      var vis = visibleCount();
      var w = wrapper.clientWidth || wrapper.getBoundingClientRect().width;
      var itemWidth = (w - MARGIN_PX * (vis - 1)) / vis;
      var step = index * (itemWidth + MARGIN_PX) * vis;
      track.style.transform = 'translate3d(' + (-step) + 'px,0,0)';

      if (animate === false) {
        // força recálculo para reativar transição em próximos movimentos
        track.offsetHeight; // reflow
        track.style.transition = 'transform 650ms ease';
      }
    }

    function next() { goTo(index + 1, true); }

    function play() {
      stop();
      timer = window.setInterval(next, AUTOPLAY_MS);
    }
    function stop() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }

    // Pausa no hover e em toque/segurar; retoma ao sair/soltar
    wrapper.addEventListener('mouseenter', stop, { passive: true });
    wrapper.addEventListener('mouseleave', play, { passive: true });
    wrapper.addEventListener('pointerdown', stop, { passive: true });
    wrapper.addEventListener('pointerup',   play, { passive: true });
    wrapper.addEventListener('touchstart',  stop, { passive: true });
    wrapper.addEventListener('touchend',    play, { passive: true });

    // Pausa quando a seção não estiver visível
    try {
      var io2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) stop(); else play();
        });
      }, { threshold: 0.1 });
      io2.observe(section);
    } catch (_) { /* sem IO, ignora */ }

    // Relayout em resize/orientation
    window.addEventListener('resize', layout);
    window.addEventListener('orientationchange', layout);

    layout(); // primeiro layout
    play();   // inicia autoplay
  });
})();
``
