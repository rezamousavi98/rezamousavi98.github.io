/* Project content is kept in projects.js so adding work stays straightforward. */
const diagram = kind => {
  const drawings = [
    '<g class="stroke"><path d="m150 35 95 45-95 45-95-45Z"/><path d="m55 100 95 45 95-45M55 120l95 45 95-45"/><path d="M150 35v90M55 80l95 45 95-45"/></g><path class="soft" d="m150 35 95 45-95 45-95-45Z"/>',
    '<g class="stroke" opacity=".2"><path d="M0 40h300M0 80h300M0 120h300M0 160h300M50 0v180M100 0v180M150 0v180M200 0v180M250 0v180"/></g><path class="stroke" d="m30 140 65-40 55 15 50-70 70 20" stroke-dasharray="5 4"/><g class="node"><circle cx="30" cy="140" r="6"/><circle cx="95" cy="100" r="6"/><circle cx="150" cy="115" r="6"/><circle cx="200" cy="45" r="6"/><circle cx="270" cy="65" r="6"/></g><circle class="stroke" cx="200" cy="45" r="19" opacity=".4"/>',
    '<rect class="stroke" x="45" y="30" width="210" height="130" rx="6"/><path class="stroke" d="M45 55h210M105 55v105"/><path class="soft" d="m120 140 25-55 38 26 24-45 30 74Z"/><path class="stroke" d="m120 140 25-55 38 26 24-45 30 74M57 72h33M57 85h25M57 98h30"/>',
    '<g class="stroke"><path d="M60 65h70v50H60zM170 35h70v50h-70zM170 125h70v40h-70zM130 90h20V60h20M150 90v55h20"/></g><path class="stroke" d="m83 88 9 9 17-18m82-20 8 8 17-17m-25 94 8 8 17-17"/>',
    '<g class="stroke"><ellipse cx="150" cy="45" rx="70" ry="22"/><path d="M80 45v90c0 30 140 30 140 0V45M80 75c0 30 140 30 140 0M80 105c0 30 140 30 140 0"/></g><ellipse class="soft" cx="150" cy="45" rx="70" ry="22"/>',
    '<rect class="stroke" x="45" y="30" width="210" height="130" rx="6"/><path class="stroke" d="M45 55h210m-140 25-25 25 25 25m70-50 25 25-25 25m-23-54-23 60"/><circle class="bright" cx="58" cy="43" r="2"/><circle class="bright" cx="68" cy="43" r="2"/>'
  ];
  return `<svg class="diagram" viewBox="0 0 300 190" aria-hidden="true">${drawings[kind]}</svg>`;
};
const algorithmArt = '<div class="visual-orbit"></div><div class="algorithm-window"><div class="window-top"><i></i><i></i><i></i><span>ALGORITHM LAB</span></div><div class="bars">'+[28,48,35,72,55,86,66,78,90,100].map(height=>`<i style="height:${height}%"></i>`).join('')+'</div><div class="window-bottom"><span>▶ &nbsp; Step by step. Insight by insight.</span><span>↔</span></div></div>';
const orderedProjects = [...projects].sort((a,b)=>Number(Boolean(b.personal))-Number(Boolean(a.personal)));
document.getElementById('projectsGrid').innerHTML = orderedProjects.map((p,i)=>`
  <article class="project-card visual-${p.kind}${p.personal ? ' featured' : ''}" data-category="${p.personal ? 'personal' : 'company'}">
    <div class="project-visual" aria-hidden="true"><div class="visual-caption"><span>${p.personal ? 'A PERSONAL EXPLORATION' : p.category.toUpperCase()}</span><span>0${i+1}</span></div>${p.personal ? algorithmArt : diagram(p.kind)}</div>
    <div class="project-content"><div class="project-meta"><span>${p.category}</span><span class="badge${p.personal ? ' personal' : ''}">${p.personal ? 'Personal Project' : 'Company Project'}</span></div><h3>${p.repo ? `<a href="${p.repo}" target="_blank" rel="noopener noreferrer">${p.title}</a>` : p.title}</h3><p>${p.desc}</p><div class="tags">${p.tech.map(t=>`<span>${t}</span>`).join('')}</div><div class="project-bottom"><span class="project-role">${p.role}</span>${p.repo ? `<a href="${p.repo}" target="_blank" rel="noopener noreferrer" aria-label="View Algorithm Lab repository on GitHub">View repository ↗</a>` : '<span class="project-role">Enterprise / WebGIS</span>'}</div></div>
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

const filters=document.querySelectorAll('.filter');
filters.forEach(button=>button.addEventListener('click',()=>{
  filters.forEach(filter=>{const active=filter===button;filter.classList.toggle('active',active);filter.setAttribute('aria-pressed',String(active));});
  let count=0;
  document.querySelectorAll('.project-card').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;if(!card.hidden)count++;});
  document.getElementById('projectStatus').textContent=`Showing ${count} ${button.dataset.filter==='all'?'':button.dataset.filter+' '}project${count===1?'':'s'}.`;
}));

const menuButton=document.getElementById('menuButton');
const navLinks=document.getElementById('navLinks');
function closeMenu(){navLinks.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation');}
menuButton.addEventListener('click',()=>{const open=navLinks.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',`${open?'Close':'Open'} navigation`);});
navLinks.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('click',event=>{if(!navLinks.contains(event.target)&&!menuButton.contains(event.target))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&navLinks.classList.contains('open')){closeMenu();menuButton.focus();}});
matchMedia('(min-width: 721px)').addEventListener('change',event=>{if(event.matches)closeMenu();});

const sections=[...document.querySelectorAll('main section[id]')];
let scrollPending=false;
function updateActiveSection(){
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
