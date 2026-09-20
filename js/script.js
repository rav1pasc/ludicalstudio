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

function renderMarkdown(text) {
  if (!text) return '';

  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const lines = String(text).replace(/\r\n?/g, '\n').split('\n');

  const inline = s => {
    const spans = [];
    let out = esc(s).replace(/`([^`]+)`/g, (m, code) => {
      spans.push('<code>' + code + '</code>');
      return '\u0000' + (spans.length - 1) + '\u0000';
    });
    out = out
      .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;">')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/~~([^~]+)~~/g, '<del>$1</del>');
    return out.replace(/\u0000(\d+)\u0000/g, (m, i) => spans[i]).replace(/\u0001/g, '<br>');
  };

  const isMarker = l => /^\s*(?:[*+-]|\d+[.)])\s+/.test(l);
  const isFence = l => /^\s*(?:```|~~~)/.test(l);
  const isFenceClose = l => /^\s*(?:```|~~~)\s*$/.test(l);
  const isHeading = l => /^#{1,6}\s+/.test(l);
  const isQuote = l => /^\s*>\s?/.test(l);
  const isHr = l => /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(l.trim());

  const renderListBlock = (lines, start) => {
    const raw = [];
    let i = start;
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) break;
      const m = line.match(/^(\s*)([*+-]|\d+[.)])\s*(.*)$/);
      if (!m) break;
      raw.push({ indent: m[1].replace(/\t/g, '  ').length, ordered: /\d+[.)]/.test(m[2]), text: m[3] });
      i++;
    }
    if (!raw.length) return { html: '', nextIndex: start };
    const base = Math.min.apply(null, raw.map(r => r.indent));
    const nodes = raw.map(r => ({ text: r.text, ordered: r.ordered, rel: r.indent - base }));

    const build = list => {
      let html = '<' + (list[0].ordered ? 'ol' : 'ul') + '>';
      let j = 0;
      while (j < list.length) {
        const item = list[j];
        const children = [];
        while (j + 1 < list.length && list[j + 1].rel > item.rel) {
          children.push(list[j + 1]);
          j++;
        }
        html += '<li>' + inline(item.text);
        if (children.length) html += build(children);
        html += '</li>';
        j++;
      }
      return html + '</' + (list[0].ordered ? 'ol' : 'ul') + '>';
    };

    return { html: build(nodes), nextIndex: i };
  };

  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    if (isFence(line)) {
      const code = [];
      i++;
      while (i < lines.length && !isFenceClose(lines[i])) {
        code.push(lines[i]);
        i++;
      }
      i++;
      blocks.push('<pre><code>' + esc(code.join('\n')) + '</code></pre>');
      continue;
    }

    if (isHeading(line)) {
      const m = line.match(/^(#{1,6})\s+(.*)$/);
      const level = m[1].length;
      blocks.push('<h' + level + '>' + inline(m[2]) + '</h' + level + '>');
      i++;
      continue;
    }

    if (isHr(line)) { blocks.push('<hr>'); i++; continue; }

    if (isQuote(line)) {
      const quote = [];
      while (i < lines.length && isQuote(lines[i])) {
        quote.push(lines[i].replace(/^\s*>\s?/, ''));
        i++;
      }
      blocks.push('<blockquote>' + inline(quote.join('\u0001')) + '</blockquote>');
      continue;
    }

    if (isMarker(line)) {
      const res = renderListBlock(lines, i);
      blocks.push(res.html);
      i = res.nextIndex;
      continue;
    }

    const para = [];
    while (i < lines.length) {
      const l = lines[i];
      if (!l.trim() || isFence(l) || isHeading(l) || isHr(l) || isQuote(l) || isMarker(l)) break;
      para.push(l.trim());
      i++;
    }
    blocks.push('<p>' + inline(para.join('\u0001')) + '</p>');
  }

  return blocks.join('\n');
}
