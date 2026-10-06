const FORM_SELECTOR = [
  'form[action$="/minimize-comment"]',
  'form[action$="/minimize"]', // Review thread comments
].join(',');
const MENU_SELECTOR = 'details.details-overlay.position-relative:not(.dropdown)';
const PROCESSED = 'hideOutdatedProcessed';
const SVG_NS = 'http://www.w3.org/2000/svg';
const EYE_CLOSED_PATH = 'M.143 2.31a.75.75 0 0 1 1.047-.167l14.5 10.5a.75.75 0 1 1-.88 1.214l-2.248-1.628C11.346 13.19 9.792 14 8 14c-1.981 0-3.67-.992-4.933-2.078C1.797 10.832.88 9.577.43 8.9a1.619 1.619 0 0 1 0-1.797c.353-.533.995-1.42 1.868-2.305L.31 3.357A.75.75 0 0 1 .143 2.31Zm1.536 5.622A.12.12 0 0 0 1.657 8c0 .021.006.045.022.068.412.621 1.242 1.75 2.366 2.717C5.175 11.758 6.527 12.5 8 12.5c1.195 0 2.31-.488 3.29-1.191L9.063 9.695A2 2 0 0 1 6.058 7.52L3.529 5.688a14.207 14.207 0 0 0-1.85 2.244ZM8 3.5c-.516 0-1.017.09-1.499.251a.75.75 0 1 1-.473-1.423A6.207 6.207 0 0 1 8 2c1.981 0 3.67.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.11.166-.248.365-.41.587a.75.75 0 1 1-1.21-.887c.148-.201.272-.382.371-.53a.119.119 0 0 0 0-.137c-.412-.621-1.242-1.75-2.366-2.717C10.825 4.242 9.473 3.5 8 3.5Z';

function eyeClosedIcon() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'octicon octicon-eye-closed');
  svg.setAttribute('viewBox', '0 0 16 16');
  svg.setAttribute('width', '16');
  svg.setAttribute('height', '16');
  svg.setAttribute('fill', 'currentColor');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', EYE_CLOSED_PATH);
  svg.append(path);
  return svg;
}

function addButton(form) {
  if (form.dataset[PROCESSED]) return;

  const menu = form.closest('.unminimized-comment')?.querySelector(MENU_SELECTOR);
  const summary = menu?.querySelector('summary');
  if (!summary) return;
  form.dataset[PROCESSED] = '1';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = summary.className;
  button.title = 'Hide as outdated';
  button.setAttribute('aria-label', 'Hide as outdated');
  button.append(eyeClosedIcon());
  button.addEventListener('click', () => {
    const option = form.elements.classifier?.querySelector('option[value="outdated" i]');
    if (!option) {
      alert("Toolbelt for GitHub: couldn't find the Outdated option. GitHub may have changed this page.");
      return;
    }
    button.disabled = true;
    option.selected = true;
    form.requestSubmit();
  });
  menu.before(button);
}

function scan() {
  document.querySelectorAll(FORM_SELECTOR).forEach(addButton);
}

scan();
new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
