// Theme (persisted)
var htmlEl = document.documentElement;
var themeToggle = document.getElementById('themeToggle');
function applyTheme(t){
  htmlEl.setAttribute('data-theme', t);
  themeToggle.textContent = t === 'dark' ? '🌙' : '☀️';
}
try { applyTheme(localStorage.getItem('theme') || 'dark'); } catch(e){ applyTheme('dark'); }
themeToggle.addEventListener('click', function(){
  var next = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('theme', next); } catch(e){}
});

// Sticky header border
var header = document.getElementById('site-header');
function onScroll(){ header.classList.toggle('scrolled', window.scrollY > 20); }
window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

// Mobile nav
var hamburger = document.getElementById('hamburger');
var navLinks = document.getElementById('navLinks');
function setMenuOpen(open){
  navLinks.classList.toggle('open', open);
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
hamburger.addEventListener('click', function(){ setMenuOpen(!navLinks.classList.contains('open')); });
document.addEventListener('keydown', function(e){ if(e.key === 'Escape') setMenuOpen(false); });
window.addEventListener('resize', function(){ if(window.innerWidth > 860) setMenuOpen(false); });

// Reveal on scroll
var revealEls = document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold:.12});
  revealEls.forEach(function(el){ io.observe(el); });
} else {
  revealEls.forEach(function(el){ el.classList.add('in'); });
}

// Home: role typewriter
var roleWord = document.getElementById('roleWord');
if(roleWord){
  var roles = [
    {text:'Full-Stack Developer', cls:'blue'},
    {text:'Web Developer', cls:'brown'},
    {text:'Software Developer', cls:'plain'}
  ];
  var roleIdx = 0, charIdx = 0, isTyping = true;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    roleWord.textContent = roles[0].text;
    roleWord.className = 'role-word ' + roles[0].cls;
  } else {
    roleWord.textContent = '';
    (function tick(){
      var cur = roles[roleIdx];
      roleWord.className = 'role-word ' + cur.cls;
      if(isTyping){
        charIdx++;
        roleWord.textContent = cur.text.slice(0, charIdx);
        if(charIdx >= cur.text.length){ isTyping = false; return setTimeout(tick, 1500); }
        setTimeout(tick, 65);
      } else {
        charIdx--;
        roleWord.textContent = cur.text.slice(0, charIdx);
        if(charIdx <= 0){ isTyping = true; roleIdx = (roleIdx + 1) % roles.length; return setTimeout(tick, 350); }
        setTimeout(tick, 32);
      }
    })();
  }
}

// Contact form -> mailto
var form = document.getElementById('contactForm');
if(form){
  var formMsg = document.getElementById('formMsg');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('cf-name').value.trim();
    var email = document.getElementById('cf-email').value.trim();
    var message = document.getElementById('cf-msg').value.trim();
    if(!name || !email || !message){ formMsg.textContent = 'Please fill in every field.'; return; }
    var subject = encodeURIComponent('Portfolio enquiry from ' + name);
    var body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
    window.location.href = 'mailto:kelvinmkanda01@gmail.com?subject=' + subject + '&body=' + body;
    formMsg.textContent = 'Opening your email app to send this message...';
    form.reset();
  });
}

// Motion layer (pointer devices only)
var canHover = window.matchMedia('(hover:hover)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(canHover){
  document.body.classList.add('motion-ready');
  var cursorGlow = document.createElement('div');
  cursorGlow.className = 'cursor-glow';
  document.body.appendChild(cursorGlow);
  window.addEventListener('pointermove', function(e){
    document.documentElement.style.setProperty('--mx', e.clientX + 'px');
    document.documentElement.style.setProperty('--my', e.clientY + 'px');
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  }, {passive:true});

  document.querySelectorAll('.hero-ctas .btn, .nav-right .btn').forEach(function(el){
    el.classList.add('magnetic');
    el.addEventListener('pointermove', function(e){
      var r = el.getBoundingClientRect(), x = e.clientX - r.left - r.width/2, y = e.clientY - r.top - r.height/2;
      el.style.transform = 'translate(' + (x*.10) + 'px,' + (y*.10 - 2) + 'px)';
    });
    el.addEventListener('pointerleave', function(){ el.style.transform = ''; });
  });

  document.querySelectorAll('.service-card, .p-card').forEach(function(card){
    card.addEventListener('pointermove', function(e){
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left)/r.width - .5, y = (e.clientY - r.top)/r.height - .5;
      card.style.transform = 'perspective(900px) rotateX(' + (-y*3) + 'deg) rotateY(' + (x*3) + 'deg) translateY(-6px)';
    });
    card.addEventListener('pointerleave', function(){ card.style.transform = ''; });
  });
}
