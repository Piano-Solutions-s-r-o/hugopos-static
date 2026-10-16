/* HUGO-2086. Local illustration only: no form submissions, storage or APIs. */
(() => {
  const player = document.querySelector('[data-eet-player]');
  if (!player) return;
  const steps = [...player.querySelectorAll('.eet-step')];
  const segments = [...player.querySelectorAll('.eet-seg')];
  const controls = player.querySelector('.eet-controls');
  const toggle = player.querySelector('.eet-toggle');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;

  const canPlay = () => !player.classList.contains('is-paused') && !player.classList.contains('is-offscreen');
  // Dropping and re-adding the class restarts that element's CSS animations.
  function restart(element, on) {
    element.classList.remove('is-on');
    if (!on) return;
    void element.offsetWidth;
    element.classList.add('is-on');
  }
  function show(index) {
    active = (index + steps.length) % steps.length;
    // A step that cannot play yet waits in its finished state (.is-waiting): frozen on
    // its first frame it would be an empty screen.
    player.classList.toggle('is-waiting', !canPlay());
    steps.forEach((step, i) => restart(step, i === active));
    segments.forEach((segment, i) => {
      segment.classList.toggle('is-past', i < active);
      restart(segment, i === active);
      if (i === active) segment.setAttribute('aria-current', 'step');
      else segment.removeAttribute('aria-current');
    });
  }
  // Plays the waiting step once nothing holds it back any more.
  function resume() {
    if (player.classList.contains('is-waiting') && canPlay()) show(active);
  }
  function setPaused(paused) {
    player.classList.toggle('is-paused', paused);
    toggle.setAttribute('aria-label', paused ? toggle.dataset.play : toggle.dataset.pause);
  }
  // Picking a step lifts the pause and plays that step.
  function choose(index) {
    setPaused(false);
    show(index);
  }
  // Reduced motion keeps, or returns to, the static page: every step next to its
  // finished screen, and no controls that would have nothing to control.
  function enhance() {
    const on = !reducedMotion.matches;
    player.classList.toggle('is-enhanced', on);
    controls.hidden = !on;
    if (on) choose(0);
  }

  segments.forEach((segment, i) => segment.addEventListener('click', () => choose(i)));
  steps.forEach((step, i) => step.querySelector('.eet-cap').addEventListener('click', () => choose(i)));
  toggle.addEventListener('click', () => {
    setPaused(!player.classList.contains('is-paused'));
    resume();
  });
  // The active segment's bar is the clock: once it has filled, the next step plays.
  player.addEventListener('animationend', event => {
    if (event.animationName === 'eet-bar') show(active + 1);
  });
  // Play only while the walkthrough crosses the middle half of the window. A share of
  // the player's own height could never be reached in a window shorter than the player.
  new IntersectionObserver(entries => {
    player.classList.toggle('is-offscreen', !entries[entries.length - 1].isIntersecting);
    resume();
  }, { rootMargin: '-25% 0px' }).observe(player);
  reducedMotion.addEventListener('change', enhance);

  player.classList.add('is-offscreen');
  enhance();
})();
