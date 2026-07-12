// Shared site behavior: mobile nav toggle + data utilities
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
  }
});

function fetchProjects() {
  if (typeof PROJECTS_DATA !== 'undefined') {
    return Promise.resolve(PROJECTS_DATA);
  }
  return fetch('data/projects.json').then(r => {
    if (!r.ok) throw new Error('Failed to load projects');
    return r.json();
  });
}

function getProjectById(projects, id) {
  return projects.find(p => p.id === id);
}

function getFeaturedProject(projects) {
  return projects.find(p => p.featured);
}

function getOnTableProjects(projects) {
  return projects.filter(p => p.showOnTable).slice(0, 3);
}

function getStatusLabel(status) {
  const labels = {
    prototype: 'Prototype',
    development: 'In Development',
    released: 'Released'
  };
  return labels[status] || status;
}

function getStatusClass(status) {
  return 'status-' + status;
}

function renderProjectCard(project) {
  const metaParts = [];
  if (project.players) metaParts.push('👥 ' + project.players);
  if (project.playtime) metaParts.push('⏱ ' + project.playtime);
  if (project.age) metaParts.push('🔞 Ages ' + project.age);

  const metaHtml = metaParts.length
    ? '<div class="meta-row">' + metaParts.map(m => '<span>' + m + '</span>').join('') + '</div>'
    : '';

  return `
    <div class="project-card" data-status="${project.status}" data-id="${project.id}">
      <div class="thumb" style="background:${project.coverGradient};">${project.coverImage ? '<img src="' + project.coverImage + '" alt="' + project.name + '" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; border-radius:inherit;">' : ''}${!project.coverImage ? project.name : ''}</div>
      <div class="body">
        <span class="status-pill ${getStatusClass(project.status)}">${getStatusLabel(project.status)}</span>
        <h3>${project.name}</h3>
        <p class="desc">${project.description}</p>
        ${metaHtml}
        <a href="project.html?id=${project.id}" class="card-cta">See details →</a>
      </div>
    </div>
  `;
}

function renderHeroArt(project) {
  if (!project) return '';

  const emojisHtml = (project.coverEmoji || [])
    .map(e => '<div style="width:54px;height:54px;border-radius:50%;background:var(--cream);display:flex;align-items:center;justify-content:center;font-size:1.5rem;">' + e + '</div>')
    .join('');

  const coverImgHtml = project.coverImage
    ? '<img src="' + project.coverImage + '" alt="' + project.name + '" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; border-radius:12px; opacity:0.35;">'
    : '';

  return `
    <span class="tag">Featured — ${getStatusLabel(project.status)}</span>
    <div style="background:${project.coverGradient}; border-radius:12px; padding:38px 20px; text-align:center; color:var(--cream); position:relative; overflow:hidden;">
      ${coverImgHtml}
      <div style="font-family:var(--font-display); font-weight:800; font-size:2rem; text-shadow:0 3px 0 var(--red-dark); position:relative;">${project.name}</div>
      <div style="font-family:var(--font-display); font-size:0.85rem; letter-spacing:1px; text-transform:uppercase; margin-top:4px; opacity:0.9; position:relative;">${project.description.split('.')[0]}</div>
      ${emojisHtml ? '<div style="margin-top:22px; display:flex; justify-content:center; gap:10px; position:relative;">' + emojisHtml + '</div>' : ''}
    </div>
    <p style="margin-top:16px; margin-bottom:0; font-size:0.9rem; color:#555;">${project.longDescription || project.description}</p>
    <div style="margin-top:16px; display:flex; gap:12px; flex-wrap:wrap;">
      <a href="project.html?id=${project.id}" class="btn btn-primary" style="padding:10px 20px; font-size:0.85rem;">View Project</a>
    </div>
  `;
}
