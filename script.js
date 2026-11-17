(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* Sticky nav state */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile menu */
  const menu = $('#mmenu');
  const setMenu = o => { menu.classList.toggle('open', o); menu.setAttribute('aria-hidden', !o); document.body.style.overflow = o ? 'hidden' : '' };
  $('#openMenu').addEventListener('click', () => setMenu(true));
  $('#closeMenu').addEventListener('click', () => setMenu(false));
  $$('.mitem>button.mrow').forEach(b => b.addEventListener('click', () => {
    const li = b.parentElement; if (li.querySelector('.msub')) li.classList.toggle('open');
  }));
  window.addEventListener('resize', () => { if (innerWidth > 900) setMenu(false) });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false) });

  /* Order book mock rows */
  const rows = [[79982.8, .223, 8.234], [79982.6, .003, 8.111], [79981.4, .026, 8.108], [79980.4, .121, 8.234], [79978.8, 5.142, 7.961], [79976.5, .868, 2.379], [79974.7, .051, 1.349], [79974.4, .001, 1.417], [79973.3, .25, 1.416], [79973.2, 1.166, 1.166]];
  const ob = $('#obRows');
  ob.innerHTML = rows.map(r => `<div class="ob-row"><span>${r[0].toLocaleString('en', { minimumFractionDigits: 1 })}</span><span>${r[1].toFixed(3)}</span><span>${r[2].toFixed(3)}</span></div>`).join('')
    + rows.slice().reverse().map(r => `<div class="ob-row g"><span>${(r[0] - 12).toLocaleString('en', { minimumFractionDigits: 1 })}</span><span>${r[1].toFixed(3)}</span><span>${r[2].toFixed(3)}</span></div>`).join('');

  /* Sparklines */
  const spark = seed => {
    let s = seed, pts = [], y = 30;
    for (let i = 0; i < 24; i++) { s = (s * 9301 + 49297) % 233280; y += (s / 233280 - .5) * 18 - .5; y = Math.max(8, Math.min(54, y)); pts.push(`${i * (180 / 23)},${y.toFixed(1)}`) }
    return `<svg viewBox="0 0 180 64" preserveAspectRatio="none"><defs><linearGradient id="g${seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c79a63" stop-opacity=".35"/><stop offset="1" stop-color="#c79a63" stop-opacity="0"/></linearGradient></defs><polyline points="${pts.join(' ')} 180,64 0,64" fill="url(#g${seed})" stroke="none"/><polyline points="${pts.slice(0, 24).join(' ')}" fill="none" stroke="#c79a63" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
  };

  /* Infinite vertical marquees (content duplicated for a seamless loop) */
  const dup = (el, html) => { el.innerHTML = html + html };
  const mkts = [
    ['Crypto', 'BTCUSDT', 'ri-bit-coin-fill', '#f7931a', '#fff'],
    ['Stocks', 'AAPLUSDT', 'ri-apple-fill', '#fff', '#000'],
    ['Commodities', 'XAUUSDT', 'ri-copper-coin-fill', '#e8b21a', '#fff'],
    ['Prediction', 'BTC-5min-Up/Down', 'ri-arrow-up-down-fill', '#1f3a2c', '#2ebd85'],
    ['Forex', 'EURUSDT', 'ri-money-euro-circle-fill', '#2d3a63', '#fff']
  ];
  dup($('#mkts'), mkts.map((m, i) => `<div class="mk"><span class="mi" style="background:${m[3]};color:${m[4]}"><i class="${m[2]}"></i></span><div class="mt"><b>${m[0]}</b><small>${m[1]}</small></div>${spark(11 + i * 7)}</div>`).join(''));
  const ords = [
    ['BNBUSDT', 'Buy', 'ri-binance-fill', '#111', '#f0b90b'],
    ['ASTERUSDT', 'Buy', '', '#f5d6b0', '#111', true],
    ['ETHUSDT', 'Sell', 'ri-ethereum-fill', '#627eea', '#fff'],
    ['CLUSDT', 'Sell', 'ri-drop-fill', '#1a1a1a', '#888']
  ];
  dup($('#orders'), ords.map(o => `<div class="od${o[5] ? ' hl' : ''}"><span class="mi" style="background:${o[3]};color:${o[4]}">${o[2] ? `<i class="${o[2]}"></i>` : '<img src="assets/logo.svg" alt="" width="38" height="38">'}</span>${o[0]} <span class="${o[1] === 'Buy' ? 'buy' : 'sell'}">${o[1]}</span>${o[5] ? '<span class="tag">Hidden</span>' : ''}</div>`).join(''));

  /* Infinite logo marquee */
  const lt = $('#logos'); lt.innerHTML += lt.innerHTML; lt.innerHTML += lt.innerHTML.slice(0, 0);
  lt.innerHTML = lt.innerHTML; /* two sets = translateX(-50%) loop */

  /* Mint / Redeem tabs */
  $$('.mint-tabs button').forEach(b => b.addEventListener('click', () => {
    $$('.mint-tabs button').forEach(x => x.classList.toggle('on', x === b));
    const redeem = b.dataset.tab === 'redeem';
    $('#mFrom').textContent = redeem ? 'Aster' : 'BNB Chain';
    $('#mTo').textContent = redeem ? 'BNB Chain' : 'Aster';
    $('#mintBtn').textContent = redeem ? 'Redeem and Withdraw' : 'Mint and Deposit';
  }));
})();
