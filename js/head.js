/* Runs in <head> before the first paint (a file, not inline, so the Content-Security-Policy can stay strict).
   m-enter: the hero's words wait for motion.js and fade in by 700 ms if it is late.
   mo-js: the dealt moment waits for its script; mo-safe shows everything after 2.5 s regardless. */
(function () {
  var root = document.documentElement;
  root.classList.add('m-enter', 'mo-js');
  setTimeout(function () { root.classList.add('m-enter-done'); }, 700);
  setTimeout(function () { root.classList.add('mo-safe'); }, 2500);
})();
