/* Project content is kept in projects.js so adding work stays straightforward. */
const algorithmArt = '<div class="visual-orbit"></div><div class="algorithm-window"><div class="window-top"><i></i><i></i><i></i><span>ALGORITHM LAB</span></div><div class="bars">'+[28,48,35,72,55,86,66,78,90,100].map(height=>`<i style="height:${height}%"></i>`).join('')+'</div><div class="window-bottom"><span>▶ &nbsp; Step by step. Insight by insight.</span><span>↔</span></div></div>';
const orderedProjects = [...projects].sort((a,b)=>Number(Boolean(b.personal))-Number(Boolean(a.personal)));
document.getElementById('projectsGrid').innerHTML = orderedProjects.map((p,i)=>`
  <article class="project-card visual-${p.kind}${p.personal ? ' featured' : ''}" data-category="${p.personal ? 'personal' : 'company'}">
    ${p.personal ? `<div class="project-visual" aria-hidden="true"><div class="visual-caption"><span>A PERSONAL EXPLORATION</span><span>0${i+1}</span></div>${algorithmArt}</div>` : ''}
    <div class="project-content"><div class="project-meta"><span>${p.category}</span>${p.personal ? '<span class="badge personal">Personal Project</span>' : ''}</div><h3>${p.repo ? `<a href="${p.repo}" target="_blank" rel="noopener noreferrer">${p.title}</a>` : p.title}</h3><p>${p.desc}</p><div class="tags">${p.tech.map(t=>`<span>${t}</span>`).join('')}</div><div class="project-bottom"><span class="project-role">${p.role}</span>${p.repo ? `<a href="${p.repo}" target="_blank" rel="noopener noreferrer" aria-label="View Algorithm Lab repository on GitHub">View repository ↗</a>` : '<span class="project-role">Enterprise / WebGIS</span>'}</div></div>
  </article>`).join('');

const themeToggle=document.getElementById('themeToggle');
function updateTheme(){
  const light=document.documentElement.dataset.theme==='light';
  themeToggle.setAttribute('aria-label',`Switch to ${light?'dark':'light'} theme`);
  themeToggle.setAttribute('aria-pressed',String(light));
  themeToggle.title=themeToggle.getAttribute('aria-label');
  document.querySelector('meta[name="theme-color"]').content=light?'#f4f5fc':'#090b14';
}
updateTheme();
themeToggle.addEventListener('click',()=>{
  const theme=document.documentElement.dataset.theme==='light'?'dark':'light';
  document.documentElement.dataset.theme=theme;
  try{localStorage.setItem('portfolio-theme',theme);}catch{}
  updateTheme();
});

const menuButton=document.getElementById('menuButton');
const navLinks=document.getElementById('navLinks');
function closeMenu(){navLinks.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation');}
menuButton.addEventListener('click',()=>{const open=navLinks.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',`${open?'Close':'Open'} navigation`);});
navLinks.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('click',event=>{if(!navLinks.contains(event.target)&&!menuButton.contains(event.target))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&navLinks.classList.contains('open')){closeMenu();menuButton.focus();}});
matchMedia('(min-width: 721px)').addEventListener('change',event=>{if(event.matches)closeMenu();});

const sections=[...document.querySelectorAll('main section[id]')];
const siteHeader=document.querySelector('.site-header');
let scrollPending=false;
function updateActiveSection(){
  siteHeader.classList.toggle('scrolled', window.scrollY > 16);
  let current='home';
  sections.forEach(section=>{if(section.getBoundingClientRect().top<=160)current=section.id;});
  navLinks.querySelectorAll('a').forEach(link=>{if(link.hash===`#${current}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
  scrollPending=false;
}
addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(updateActiveSection);}},{passive:true});
updateActiveSection();
let toastTimer;
document.getElementById('copyEmail').addEventListener('click',async()=>{
  const toast=document.getElementById('toast');
  try{await navigator.clipboard.writeText('rezamousavi354@gmail.com');toast.textContent='Email address copied.';}catch{toast.textContent='Copy email: rezamousavi354@gmail.com';}
  toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),3500);
});

/* Reveal once; keep all content visible when reduced motion is preferred. */
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.section-heading, .about-grid, .skill-group, .contact-panel').forEach(element => {
    element.classList.add('reveal-ready');
    revealObserver.observe(element);
  });
}
