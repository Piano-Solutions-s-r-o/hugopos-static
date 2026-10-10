/* HUGO-1975. Local illustration only: no form submissions, storage or APIs. */
(() => {
  const root = document.querySelector('.journey');
  if (!root) return;
  const TOTAL = 300;
  const clamp = value => Math.max(0, Math.min(1, value));
  const phases = [...root.querySelectorAll('.journey-phase')].map(element => {
    const steps = [...element.querySelectorAll('.journey-step')];
    const stage = element.querySelector('.journey-stage');
    // Every step's screen is mirrored once into the pinned stage; scrolling only
    // switches which mirror is on, so the screens can cross-fade both ways.
    const screens = steps.map(step => stage.appendChild(step.querySelector('.journey-screen').cloneNode(true)));
    const ticks = element.querySelector('.journey-ticks');
    for (const seconds of new Set(steps.map(step => Number(step.dataset.seconds)))) {
      const tick = document.createElement('i');
      tick.style.left = `${seconds / TOTAL * 100}%`;
      tick.dataset.seconds = seconds;
      ticks.append(tick);
    }
    return {
      element, steps, stage, screens, ticks: [...ticks.children],
      timer: element.querySelector('.journey-time'),
      bar: element.querySelector('.journey-progress span'),
      active: -1,
    };
  });
  const cards = root.querySelector('#journey-cards');
  const hardware = root.querySelector('#journey-hardware');
  const cash = root.querySelector('#cash-only');
  const own = root.querySelector('#own-device');
  const typing = new WeakMap();

  function stopTyping(screen) {
    for (const field of screen.querySelectorAll('[data-type]')) {
      const state = typing.get(field);
      if (!state) continue;
      clearTimeout(state.timer);
      field.textContent = state.text;
      field.classList.remove('is-typing');
    }
  }
  // Fields "fill themselves in" on the mirrored screens only; the static
  // article keeps its full text for no-JS, reduced motion and assistive tech.
  function startTyping(screen) {
    for (const field of screen.querySelectorAll('[data-type]')) {
      const state = typing.get(field) || { text: field.textContent };
      typing.set(field, state);
      clearTimeout(state.timer);
      field.textContent = '';
      field.classList.add('is-typing');
      let shown = 0;
      const type = () => {
        shown += 1;
        field.textContent = state.text.slice(0, shown);
        if (shown < state.text.length) state.timer = setTimeout(type, 38 + (shown * 17) % 46);
        else state.timer = setTimeout(() => field.classList.remove('is-typing'), 700);
      };
      state.timer = setTimeout(type, Number(field.dataset.type));
    }
  }
  function show(phase, index) {
    phase.screens.forEach((screen, i) => {
      screen.classList.toggle('is-before', i < index);
      if (screen.classList.toggle('is-on', i === index)) startTyping(screen);
      else stopTyping(screen);
    });
    phase.steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
    phase.active = index;
  }

  let pending = false;
  function update() {
    pending = false;
    for (const phase of phases) {
      if (phase.element.hidden) continue;
      const rects = phase.steps.map(step => step.querySelector('.journey-copy').getBoundingClientRect());
      // The narrative is below the compact preview on phones.
      const line = innerHeight * (innerWidth <= 760 ? .65 : .45);
      let index = 0;
      rects.forEach((rect, i) => { if (rect.top <= line) index = i; });
      const current = Number(phase.steps[index].dataset.seconds);
      const next = Math.min(index + 1, rects.length - 1);
      const fraction = clamp((line - rects[index].top) / Math.max(1, rects[next].top - rects[index].top));
      const initial = clamp((line - rects[0].top + 180) / 180);
      const seconds = Math.round(line < rects[0].top ? current * initial :
        current + (Number(phase.steps[next].dataset.seconds) - current) * fraction);
      phase.timer.textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
      phase.bar.style.transform = `scaleX(${seconds / TOTAL})`;
      phase.element.classList.toggle('is-done', seconds >= TOTAL);
      for (const tick of phase.ticks) tick.classList.toggle('is-past', Number(tick.dataset.seconds) <= seconds);
      // Scroll position inside the step drives a slight tilt of the device.
      phase.stage.style.setProperty('--f', fraction.toFixed(3));
      // Unrounded: over a rail a few thousand pixels tall, three decimals moved it in visible jumps.
      phase.element.style.setProperty('--p', clamp((line - rects[0].top) / Math.max(1, rects[rects.length - 1].top - rects[0].top)));
      if (index !== phase.active) show(phase, index);
    }
  }
  function schedule() {
    if (!pending) { pending = true; requestAnimationFrame(update); }
  }
  function choose() {
    const wantsCards = root.querySelector('[name="cards"]:checked').value === 'yes';
    const wantsTerminal = root.querySelector('[name="device"]:checked').value === 'terminal';
    cards.hidden = !wantsCards;
    cash.hidden = wantsCards;
    hardware.hidden = !wantsTerminal;
    own.hidden = wantsTerminal;
    schedule();
  }
  root.addEventListener('change', event => {
    if (event.target.matches('[name="cards"], [name="device"]')) choose();
  });
  root.querySelector('[data-enable-cards]').addEventListener('click', () => {
    const yes = root.querySelector('[name="cards"][value="yes"]');
    yes.checked = true;
    yes.focus();
    choose();
  });
  // Headings, choices and the two branch panels rise into view once.
  const reveal = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) { entry.target.classList.add('is-in'); reveal.unobserve(entry.target); }
    }
  }, { rootMargin: '0px 0px -12% 0px' });
  for (const element of root.querySelectorAll('[data-reveal]')) reveal.observe(element);

  root.classList.add('is-enhanced');
  choose();
  update();
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  addEventListener('pageshow', choose);
})();
