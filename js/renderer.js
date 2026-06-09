/**
 * renderer.js — Dynamic DOM rendering for portfolio sections
 * Reads data from DataManager and populates the HTML
 */
import { DataManager } from './dataManager.js';
import { parseYouTubeUrl, parseGoogleDriveUrl, createYouTubeEmbed, truncateText, animateCounter, showToast, createLightbox } from './utils.js';

/**
 * Show or hide an entire <section> element based on whether it has content.
 * @param {string} sectionId - The id of the <section> element in index.html
 * @param {boolean} hasContent - true = show, false = hide
 */
function toggleSection(sectionId, hasContent) {
  const el = document.getElementById(sectionId);
  if (!el) return;
  el.style.display = hasContent ? '' : 'none';

  // Also hide/show the matching nav dot if present
  const navDot = document.querySelector(`.section-nav__dot[href="#${sectionId}"]`);
  if (navDot) navDot.style.display = hasContent ? '' : 'none';
}

/**
 * Render all portfolio sections with data
 */
export function renderAll() {
  const data = DataManager.loadData();
  renderHero(data.personal);
  renderAbout(data.personal, data);
  renderEducation(data.education);
  renderProfessionalQualifications(data.professionalQualifications);
  renderVocationalQualifications(data.vocationalQualifications);
  renderExperience(data.experience);
  renderSkills(data.skills);
  renderCompetencies(data.competencies);
  renderAchievements(data.achievements);
  renderPersonality(data.personality);
  renderInterests(data.interests);
  renderSwot(data.swot);
  renderValues(data.values);
  renderGoals(data.goals);
  renderGapAnalysis(data.gapAnalysis);
  renderActionPlan(data.actionPlan);
  renderProjects(data.projects);
  renderContact(data.personal);
}

/* ========== HERO ========== */
function renderHero(personal) {
  // The hero heading uses a .hero__title > .text-gradient span
  const nameSpan = document.querySelector('.hero__title .text-gradient');
  const subtitleEl = document.getElementById('typewriter-text');
  const bioEl = document.getElementById('hero-bio');

  if (nameSpan) {
    nameSpan.textContent = personal.fullName;
  }
  if (subtitleEl) {
    subtitleEl.textContent = personal.title;
    subtitleEl.dataset.text = personal.title;
  }
  if (bioEl) {
    bioEl.textContent = personal.bio;
  }

  // Dynamic CV link setup
  const cvBtn = document.getElementById('hero-cv-btn');
  if (cvBtn) {
    const cvUrl = personal.cvUrl;
    if (cvUrl && cvUrl.trim()) {
      cvBtn.href = cvUrl.trim();
      if (cvUrl.trim().startsWith('http')) {
        cvBtn.target = '_blank';
        cvBtn.rel = 'noopener noreferrer';
        cvBtn.removeAttribute('download');
      } else {
        cvBtn.setAttribute('download', '');
        cvBtn.removeAttribute('target');
        cvBtn.removeAttribute('rel');
      }
    } else {
      // Default fallback
      cvBtn.href = 'assets/cv.pdf';
      cvBtn.setAttribute('download', '');
      cvBtn.removeAttribute('target');
      cvBtn.removeAttribute('rel');
    }
  }
}

/* ========== ABOUT ========== */
function renderAbout(personal, allData) {
  const imgEl = document.getElementById('about-profile-image');
  const bioEl = document.getElementById('about-bio');
  const socialsEl = document.getElementById('about-socials');
  const statsEl = document.getElementById('about-stats');

  if (imgEl) {
    const src = personal.profileImage;
    if (src && src.trim()) {
      imgEl.src = src;
      imgEl.alt = personal.fullName;
      imgEl.onerror = () => {
        imgEl.style.background = 'linear-gradient(135deg, #0a0f2e, #111638)';
        imgEl.src = '';
      };
    } else {
      // Show initials avatar when no photo
      imgEl.style.display = 'none';
      const parent = imgEl.parentElement;
      if (parent && !parent.querySelector('.profile-initials')) {
        const initials = document.createElement('div');
        initials.className = 'profile-initials';
        const name = personal.fullName || 'YD';
        initials.textContent = name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
        parent.appendChild(initials);
      }
    }
  }

  if (bioEl) {
    const paragraphs = personal.bio.split('\n').filter(p => p.trim());
    if (paragraphs.length > 1) {
      bioEl.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
    } else {
      bioEl.innerHTML = `<p>${personal.bio}</p>`;
    }
  }

  if (socialsEl) {
    // Update existing anchor tags rather than replacing (preserves SVG icons)
    const links = personal.socialLinks || {};
    const socialBtns = socialsEl.querySelectorAll('[data-social]');
    socialBtns.forEach(btn => {
      const platform = btn.dataset.social;
      if (links[platform]) {
        btn.href = platform === 'email' ? `mailto:${links[platform]}` : links[platform];
        btn.style.display = '';
      } else {
        btn.style.display = 'none';
      }
    });
    // If no data-social buttons, generate them
    if (socialBtns.length === 0) {
      const icons = {
        linkedin: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
        github: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`
      };
      Object.entries(links).forEach(([platform, url]) => {
        if (url) {
          const a = document.createElement('a');
          a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
          a.className = 'social-btn'; a.setAttribute('aria-label', platform);
          a.innerHTML = icons[platform] || '';
          socialsEl.appendChild(a);
        }
      });
    }
  }

  if (statsEl) {
    // Update existing stat-card numbers (HTML has static stat-cards)
    const statNumbers = statsEl.querySelectorAll('.stat-card__number');
    const statCounts = [
      allData.projects?.length || 0,
      allData.skills?.length || 0,
      (allData.professionalQualifications?.length || 0) + (allData.vocationalQualifications?.length || 0)
    ];
    statNumbers.forEach((el, i) => {
      if (statCounts[i] !== undefined) {
        el.dataset.count = statCounts[i];
        el.textContent = statCounts[i];
      }
    });
  }
}

/* ========== EDUCATION ========== */
function renderEducation(education) {
  const container = document.getElementById('education-timeline');
  if (!container) return;
  container.innerHTML = '';

  education.forEach((item, index) => {
    const el = document.createElement('div');
    el.className = `timeline-item ${index % 2 === 0 ? 'timeline-left' : 'timeline-right'} reveal active`;
    el.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-content glass-card">
        <div class="timeline-date">${item.year || ''}</div>
        <h3 class="timeline-title">${item.degree}</h3>
        <p class="timeline-subtitle">${item.institution}</p>
        ${item.gpa ? `<p class="timeline-detail">GPA: ${item.gpa}</p>` : ''}
        <p class="timeline-description">${item.description || ''}</p>
        ${renderProofs(item.proofs)}
      </div>
    `;
    container.appendChild(el);
  });
}

/* ========== PROFESSIONAL QUALIFICATIONS ========== */
function renderProfessionalQualifications(quals) {
  const container = document.getElementById('professional-quals-grid');
  if (!container) return;

  // A qual is real only if it has a non-placeholder title
  const realQuals = (quals || []).filter(q =>
    q.title && q.title.trim() &&
    !q.title.toLowerCase().includes('add your') &&
    !q.title.toLowerCase().includes('placeholder')
  );

  toggleSection('professional-qualifications', realQuals.length > 0);
  container.innerHTML = '';

  realQuals.forEach(item => {
    const el = document.createElement('div');
    el.className = 'glass-card qualification-card reveal active';
    el.innerHTML = `
      <div class="qual-icon">🏆</div>
      <h3 class="qual-title">${item.title}</h3>
      <p class="qual-issuer">${item.issuer}</p>
      <p class="qual-date">${item.date}</p>
      <p class="qual-description">${item.description || ''}</p>
      ${item.credentialUrl ? `<a href="${item.credentialUrl}" target="_blank" class="qual-link">View Credential →</a>` : ''}
      ${renderProofs(item.proofs)}
    `;
    container.appendChild(el);
  });
}

/* ========== VOCATIONAL QUALIFICATIONS ========== */
function renderVocationalQualifications(quals) {
  const container = document.getElementById('vocational-quals-grid');
  if (!container) return;

  const realQuals = (quals || []).filter(q =>
    q.title && q.title.trim() &&
    !q.title.toLowerCase().includes('add your') &&
    !q.title.toLowerCase().includes('placeholder')
  );

  toggleSection('vocational-qualifications', realQuals.length > 0);
  container.innerHTML = '';

  realQuals.forEach(item => {
    const el = document.createElement('div');
    el.className = 'glass-card qualification-card reveal active';
    el.innerHTML = `
      <div class="qual-icon">📜</div>
      <h3 class="qual-title">${item.title}</h3>
      <p class="qual-issuer">${item.issuer}</p>
      <p class="qual-date">${item.date}</p>
      <p class="qual-description">${item.description || ''}</p>
      ${renderProofs(item.proofs)}
    `;
    container.appendChild(el);
  });
}

/* ========== EXPERIENCE ========== */
function renderExperience(experience) {
  const container = document.getElementById('experience-timeline');
  if (!container) return;
  container.innerHTML = '';

  const typeConfig = {
    'volunteer':       { label: 'Volunteer', color: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.25)',  text: '#34d399', icon: '🌍' },
    'extracurricular': { label: 'Extracurricular', color: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)', text: '#a78bfa', icon: '🎓' },
    'part-time':       { label: 'Part-time', color: 'rgba(0,212,255,0.1)',   border: 'rgba(0,212,255,0.25)',   text: '#00d4ff', icon: '💼' },
    'full-time':       { label: 'Full-time', color: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.25)',  text: '#fbbf24', icon: '💼' },
    'freelance':       { label: 'Freelance', color: 'rgba(244,114,182,0.1)', border: 'rgba(244,114,182,0.25)', text: '#f472b6', icon: '🚀' }
  };

  experience.forEach((item, index) => {
    const cfg = typeConfig[item.type] || { label: item.type || 'Other', color: 'rgba(74,85,104,0.2)', border: 'rgba(74,85,104,0.3)', text: '#8892b0', icon: '📌' };
    const el = document.createElement('div');
    el.className = `timeline-item ${index % 2 === 0 ? 'timeline-left' : 'timeline-right'} reveal active`;
    el.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-content glass-card">
        <div class="timeline-date">${item.period || ''}</div>
        <h3 class="timeline-title">${item.role}</h3>
        <p class="timeline-subtitle">${item.company}</p>
        <span class="badge" style="background:${cfg.color};border-color:${cfg.border};color:${cfg.text}">${cfg.icon} ${cfg.label}</span>
        <p class="timeline-description">${item.description || ''}</p>
        ${renderProofs(item.proofs)}
      </div>
    `;
    container.appendChild(el);
  });
}

/* ========== SKILLS ========== */
function renderSkills(skills) {
  const container = document.getElementById('skills-container');
  const showMoreWrap = document.getElementById('skills-show-more');
  const toggleBtn = document.getElementById('skills-toggle-btn');
  if (!container) return;

  const realSkills = (skills || []).filter(s => s.name && s.name.trim());
  toggleSection('skills', realSkills.length > 0);
  if (!realSkills.length) return;

  const INITIAL_LIMIT = 10;

  // Category accent colours (cycles if more categories than colours)
  const categoryColors = [
    { bg: 'rgba(0,212,255,0.08)',   border: 'rgba(0,212,255,0.25)',   text: '#00d4ff'  },
    { bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.25)', text: '#a78bfa'  },
    { bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.25)',  text: '#34d399'  },
    { bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.25)',  text: '#fbbf24'  },
    { bg: 'rgba(244,114,182,0.08)', border: 'rgba(244,114,182,0.25)', text: '#f472b6'  },
  ];

  const categories = [...new Set(realSkills.map(s => s.category))];

  container.innerHTML = '';

  // Build one group per category
  categories.forEach((cat, catIdx) => {
    const color = categoryColors[catIdx % categoryColors.length];
    const catSkills = realSkills.filter(s => s.category === cat);

    const group = document.createElement('div');
    group.className = 'skill-group';
    group.dataset.category = cat;

    group.innerHTML = `
      <h4 class="skill-group__label" style="color:${color.text}">${cat}</h4>
      <div class="skill-group__pills">
        ${catSkills.map(skill => `
          <span class="skill-pill" data-category="${cat}"
            style="--pill-bg:${color.bg};--pill-border:${color.border};--pill-text:${color.text}">
            ${skill.name}
          </span>`).join('')}
      </div>`;
    container.appendChild(group);
  });

  // Show / hide logic
  const allPills = Array.from(container.querySelectorAll('.skill-pill'));
  if (allPills.length > INITIAL_LIMIT) {
    allPills.forEach((pill, i) => {
      if (i >= INITIAL_LIMIT) pill.classList.add('skill-pill--hidden');
    });
    // Also hide groups that are entirely hidden
    updateGroupVisibility();

    if (showMoreWrap) showMoreWrap.style.display = '';

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', String(!expanded));
        const label = toggleBtn.querySelector('.skills-toggle-label');
        const icon = toggleBtn.querySelector('.skills-toggle-icon');

        if (expanded) {
          // Collapse
          allPills.forEach((pill, i) => { if (i >= INITIAL_LIMIT) pill.classList.add('skill-pill--hidden'); });
          if (label) label.textContent = 'Show all skills';
          if (icon) icon.style.transform = '';
        } else {
          // Expand
          allPills.forEach(pill => pill.classList.remove('skill-pill--hidden'));
          if (label) label.textContent = 'Show less';
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
        updateGroupVisibility();
      });
    }
  }

  function updateGroupVisibility() {
    container.querySelectorAll('.skill-group').forEach(group => {
      const anyVisible = Array.from(group.querySelectorAll('.skill-pill'))
        .some(p => !p.classList.contains('skill-pill--hidden'));
      group.style.display = anyVisible ? '' : 'none';
    });
  }
}


/* ========== COMPETENCIES ========== */
function renderCompetencies(competencies) {
  const container = document.getElementById('competencies-grid');
  if (!container) return;

  const realItems = (competencies || []).filter(c => c.name && c.name.trim());
  toggleSection('competencies', realItems.length > 0);
  container.innerHTML = '';

  const icons = ['🎯', '🧠', '🤝', '⚡', '💡', '🔄', '📊', '🗣️'];
  realItems.forEach((item, index) => {
    const el = document.createElement('div');
    el.className = 'glass-card competency-card reveal active';
    el.innerHTML = `
      <div class="competency-icon">${icons[index % icons.length]}</div>
      <h3 class="competency-name">${item.name}</h3>
      <p class="competency-description">${item.description}</p>
    `;
    container.appendChild(el);
  });
}

/* ========== ACHIEVEMENTS ========== */
function renderAchievements(achievements) {
  const container = document.getElementById('achievements-grid');
  if (!container) return;

  const realItems = (achievements || []).filter(a => a.title && a.title.trim());
  toggleSection('achievements', realItems.length > 0);
  container.innerHTML = '';

  const iconMap = {
    'Leadership':       '🏆',
    'HR & Management':  '👥',
    'Team Award':       '🥇',
    'Academic':         '🎓',
    'Technical':        '⚡',
    'Community':        '🌍',
    'General':          '🏅'
  };

  realItems.forEach(item => {
    const icon = iconMap[item.category] || '🏅';
    const el = document.createElement('div');
    el.className = 'glass-card achievement-card reveal active';
    el.innerHTML = `
      <div class="achievement-header">
        <span class="achievement-icon">${icon}</span>
        <span class="achievement-date">${item.date || ''}</span>
      </div>
      <h3 class="achievement-title">${item.title}</h3>
      <span class="badge">${item.category || 'General'}</span>
      <p class="achievement-description">${item.description || ''}</p>
      ${renderProofs(item.proofs)}
    `;
    container.appendChild(el);
  });
}

/* ========== PERSONALITY ========== */
function renderPersonality(personality) {
  // Hide section if no meaningful data
  const hasPersonality = personality && (
    (personality.mbtiType && !['INTJ','ENFP','ENTJ'].includes(personality.mbtiType) ) ||
    personality.mbtiLabel ||
    personality.mbtiDescription ||
    personality.careerKeyResults
  );
  toggleSection('personality', !!hasPersonality);
  if (!hasPersonality) return;

  const mbtiLetters = document.querySelectorAll('.mbti__letter');
  const mbtiLabel = document.getElementById('mbti-label');
  const mbtiDesc = document.getElementById('mbti-description');
  const careerKeyEl = document.getElementById('career-key-results');
  const proofsEl = document.getElementById('personality-proofs');

  const typeStr = personality.mbtiType || '';
  if (mbtiLetters.length >= 4) {
    mbtiLetters.forEach((el, i) => { el.textContent = typeStr[i] || '-'; });
  }
  if (mbtiLabel) mbtiLabel.textContent = personality.mbtiLabel || personality.mbtiType || '';
  if (mbtiDesc) mbtiDesc.textContent = personality.mbtiDescription || '';
  if (careerKeyEl) careerKeyEl.innerHTML = `<p>${personality.careerKeyResults || ''}</p>`;
  if (proofsEl) proofsEl.innerHTML = renderProofs(personality.proofs);
}

/* ========== INTERESTS ========== */
function renderInterests(interests) {
  const container = document.getElementById('interests-grid');
  if (!container) return;

  const realItems = (interests || []).filter(i => i.name && i.name.trim());
  toggleSection('interests', realItems.length > 0);
  container.innerHTML = '';

  realItems.forEach(item => {
    const el = document.createElement('div');
    el.className = 'glass-card interest-card reveal active';
    el.innerHTML = `
      <div class="interest-icon">${item.icon || '⭐'}</div>
      <h3 class="interest-name">${item.name}</h3>
      <p class="interest-description">${item.description || ''}</p>
    `;
    container.appendChild(el);
  });
}

/* ========== SWOT ========== */
function renderSwot(swot) {
  const quadrants = [
    { key: 'strengths',     id: 'swot-strengths'     },
    { key: 'weaknesses',    id: 'swot-weaknesses'     },
    { key: 'opportunities', id: 'swot-opportunities'  },
    { key: 'threats',       id: 'swot-threats'        }
  ];

  const hasAny = quadrants.some(q => (swot[q.key] || []).length > 0);
  toggleSection('swot', hasAny);

  quadrants.forEach(q => {
    const listEl = document.getElementById(q.id);
    if (listEl) {
      listEl.innerHTML = (swot[q.key] || []).map(item => `<li>${item}</li>`).join('');
    }
  });
}

/* ========== VALUES ========== */
function renderValues(values) {
  const container = document.getElementById('values-grid');
  if (!container) return;

  const realItems = (values || []).filter(v => v.name && v.name.trim());
  toggleSection('values', realItems.length > 0);
  container.innerHTML = '';

  const icons = ['✨', '🌱', '💎', '🔥', '🌟', '🎯', '💡', '🤝'];
  realItems.forEach((item, index) => {
    const el = document.createElement('div');
    el.className = 'glass-card value-card reveal active';
    el.innerHTML = `
      <div class="value-icon">${icons[index % icons.length]}</div>
      <h3 class="value-name">${item.name}</h3>
      <p class="value-description">${item.description}</p>
    `;
    container.appendChild(el);
  });
}

/* ========== GOALS ========== */
function renderGoals(goals) {
  const container = document.getElementById('goals-container');
  const tabsContainer = document.getElementById('goals-tabs');
  if (!container) return;

  const smartItems = (goals && goals.smart) || [];
  const safeItems  = (goals && goals.safe)  || [];
  const hasAny = smartItems.length > 0 || safeItems.length > 0;
  toggleSection('goals', hasAny);
  if (!hasAny) return;

  let activeTab = 'smart';

  function renderGoalCards(type) {
    const items = (type === 'smart' ? smartItems : safeItems);
    container.innerHTML = '';

    if (!items.length) {
      container.innerHTML = '<p style="color:var(--text-muted);font-size:var(--text-sm);padding:var(--space-6) 0">No goals added yet.</p>';
      return;
    }

    items.forEach(goal => {
      const el = document.createElement('div');
      el.className = 'glass-card goal-card reveal active';

      const statusColors = {
        'not-started': 'var(--text-secondary)',
        'in-progress': 'var(--accent-cyan)',
        'completed': 'var(--accent-emerald)',
        'on-hold': 'var(--accent-amber)'
      };

      const fields = type === 'smart'
        ? [
          { label: 'Specific',   value: goal.specific },
          { label: 'Measurable', value: goal.measurable },
          { label: 'Achievable', value: goal.achievable },
          { label: 'Relevant',   value: goal.relevant },
          { label: 'Time-Bound', value: goal.timeBound }
        ]
        : [
          { label: 'Stretch',   value: goal.stretch },
          { label: 'Ambitious', value: goal.ambitious },
          { label: 'Flexible',  value: goal.flexible },
          { label: 'Everyday',  value: goal.everyday }
        ];

      el.innerHTML = `
        <div class="goal-header">
          <h3 class="goal-title">${goal.title}</h3>
          <span class="goal-status" style="color: ${statusColors[goal.status] || statusColors['not-started']}">${(goal.status || 'not-started').replace('-', ' ')}</span>
        </div>
        <div class="goal-details">
          ${fields.map(f => `
            <div class="goal-field">
              <span class="goal-field-label">${f.label}</span>
              <span class="goal-field-value">${f.value || '—'}</span>
            </div>
          `).join('')}
        </div>
        <div class="goal-progress">
          <div class="goal-progress-bar">
            <div class="goal-progress-fill" style="width: ${goal.progress || 0}%"></div>
          </div>
          <span class="goal-progress-text">${goal.progress || 0}%</span>
        </div>
      `;
      container.appendChild(el);
    });
    // Re-observe any new reveal elements (for animation)
    if (window.__reObserve) window.__reObserve();
  }

  // Wire up existing tab buttons (they use data-goal-type attribute)
  if (tabsContainer) {
    tabsContainer.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        tabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active', 'tab-btn--active'));
        btn.classList.add('active', 'tab-btn--active');
        activeTab = btn.dataset.goalType || btn.dataset.tab || 'smart';
        renderGoalCards(activeTab);
      });
    });
  }

  renderGoalCards(activeTab);
}

/* ========== GAP ANALYSIS ========== */
function renderGapAnalysis(gapAnalysis) {
  const container = document.getElementById('gap-analysis-container');
  const tabsContainer = document.getElementById('gap-tabs');
  if (!container) return;

  const knowledgeItems   = (gapAnalysis && gapAnalysis.knowledge)   || [];
  const skillItems       = (gapAnalysis && gapAnalysis.skills)      || [];
  const experienceItems  = (gapAnalysis && gapAnalysis.experience)  || [];
  const hasAny = knowledgeItems.length > 0 || skillItems.length > 0 || experienceItems.length > 0;
  toggleSection('gap-analysis', hasAny);
  if (!hasAny) return;

  let activeTab = 'knowledge';

  function getItems(type) {
    if (type === 'knowledge')  return knowledgeItems;
    if (type === 'skills')     return skillItems;
    if (type === 'experience') return experienceItems;
    return [];
  }

  function renderGapItems(type) {
    const items = getItems(type);
    container.innerHTML = '';

    if (!items.length) {
      container.innerHTML = '<p style="color:var(--text-muted);font-size:var(--text-sm);padding:var(--space-6) 0">No gap analysis items for this category.</p>';
      return;
    }

    items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'glass-card gap-card reveal active';
      el.innerHTML = `
        <div class="gap-row">
          <div class="gap-col">
            <span class="gap-label">Current State</span>
            <p class="gap-value">${item.current}</p>
          </div>
          <div class="gap-arrow">→</div>
          <div class="gap-col">
            <span class="gap-label">Required State</span>
            <p class="gap-value">${item.required}</p>
          </div>
        </div>
        <div class="gap-info">
          <div class="gap-detail">
            <span class="gap-label">Gap</span>
            <p>${item.gap}</p>
          </div>
          <div class="gap-detail">
            <span class="gap-label">Action Plan</span>
            <p>${item.plan}</p>
          </div>
        </div>
      `;
      container.appendChild(el);
    });
    if (window.__reObserve) window.__reObserve();
  }

  // Wire up existing HTML tab buttons (data-gap attribute)
  if (tabsContainer) {
    tabsContainer.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        tabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active', 'tab-btn--active'));
        btn.classList.add('active', 'tab-btn--active');
        activeTab = btn.dataset.gap || btn.dataset.tab || 'knowledge';
        renderGapItems(activeTab);
      });
    });
  }

  renderGapItems(activeTab);
}

/* ========== ACTION PLAN ========== */
function renderActionPlan(actionPlan) {
  const container = document.getElementById('action-plan-timeline');
  if (!container) return;

  const realItems = (actionPlan || []).filter(a => a.year && a.year.trim());
  toggleSection('action-plan', realItems.length > 0);
  container.innerHTML = '';

  const statusIcons = {
    'completed': '✅',
    'in-progress': '🔄',
    'not-started': '⏳'
  };

  realItems.forEach((item, index) => {
    const el = document.createElement('div');
    el.className = `action-plan-year glass-card reveal active stagger-${index + 1}`;
    el.innerHTML = `
      <div class="action-plan-header">
        <span class="action-plan-icon">${statusIcons[item.status] || '⏳'}</span>
        <h3 class="action-plan-title">${item.year}</h3>
      </div>
      <ul class="action-plan-goals">
        ${(item.goals || []).map(g => `<li>${g}</li>`).join('')}
      </ul>
      <span class="badge">${(item.status || 'not-started').replace('-', ' ')}</span>
    `;
    container.appendChild(el);
  });
}

/* ========== PROJECTS ========== */
function renderProjects(projects) {
  const container = document.getElementById('projects-grid');
  const filterContainer = document.getElementById('project-filters');
  if (!container) return;

  const realProjects = (projects || []).filter(p =>
    p.title && p.title.trim() &&
    !p.title.toLowerCase().includes('add your') &&
    !p.title.toLowerCase().includes('placeholder')
  );

  toggleSection('projects', realProjects.length > 0);

  const categories = ['All', ...new Set(realProjects.map(p => p.category))];

  if (filterContainer) {
    filterContainer.innerHTML = categories.map((c, i) =>
      `<button class="tab-btn ${i === 0 ? 'active' : ''}" data-category="${c}">${c}</button>`
    ).join('');

    filterContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('tab-btn')) {
        filterContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const category = e.target.dataset.category;
        renderProjectCards(container, category === 'All' ? realProjects : realProjects.filter(p => p.category === category));
      }
    });
  }

  renderProjectCards(container, realProjects);
}

function renderProjectCards(container, projects) {
  container.innerHTML = '';

  projects.forEach(project => {
    const el = document.createElement('div');
    el.className = 'glass-card project-card reveal active';
    el.innerHTML = `
      <div class="project-image-wrapper">
        ${project.image
        ? `<img src="${project.image}" alt="${project.title}" class="project-image" />`
        : `<div class="project-image-placeholder"><span>🚀</span></div>`
      }
        ${project.featured ? '<span class="project-featured-badge">Featured</span>' : ''}
      </div>
      <div class="project-info">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${truncateText(project.description, 120)}</p>
        <div class="project-tech">
          ${(project.techStack || []).map(t => `<span class="skill-badge">${t}</span>`).join('')}
        </div>
        ${renderProofs(project.proofs)}
        <div class="project-links">
          ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="project-link" aria-label="Live demo">🌐 Live</a>` : ''}
          ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="project-link" aria-label="GitHub repo">💻 Code</a>` : ''}
          ${project.youtubeUrl ? `<a href="${project.youtubeUrl}" target="_blank" class="project-link" aria-label="YouTube video">▶️ Video</a>` : ''}
        </div>
      </div>
    `;
    container.appendChild(el);
  });
}

/* ========== CONTACT ========== */
function renderContact(personal) {
  const emailEl    = document.getElementById('contact-email-value');
  const locationEl = document.getElementById('contact-location-value');
  const socialsEl  = document.getElementById('contact-socials');

  if (emailEl) {
    emailEl.textContent = personal.email || '';
    emailEl.href = `mailto:${personal.email || ''}`;
  }
  if (locationEl) locationEl.textContent = personal.location || '';

  if (socialsEl) {
    socialsEl.innerHTML = '';
    const links = personal.socialLinks || {};

    // Platform icon/colour map
    const platformMeta = {
      linkedin:  { icon: '💼', color: '#0a66c2', label: 'LinkedIn'  },
      github:    { icon: '🐙', color: '#6e5494', label: 'GitHub'    },
      facebook:  { icon: '📘', color: '#1877f2', label: 'Facebook'  },
      instagram: { icon: '📸', color: '#e1306c', label: 'Instagram' },
      threads:   { icon: '🧵', color: '#000000', label: 'Threads'   },
      tiktok:    { icon: '🎵', color: '#010101', label: 'TikTok'    },
      whatsapp:  { icon: '💬', color: '#25d366', label: 'WhatsApp'  },
      twitter:   { icon: '🐦', color: '#1da1f2', label: 'Twitter'   },
      youtube:   { icon: '▶️', color: '#ff0000', label: 'YouTube'   },
    };

    Object.entries(links).forEach(([platform, url]) => {
      if (!url) return;
      const meta = platformMeta[platform.toLowerCase()] || { icon: '🔗', color: 'var(--accent-cyan)', label: platform };
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'social-link-pill';
      a.setAttribute('aria-label', meta.label);
      a.innerHTML = `<span class="social-link-pill__icon">${meta.icon}</span><span class="social-link-pill__label">${meta.label}</span>`;
      socialsEl.appendChild(a);
    });
  }
}

/* ========== PROOF RENDERING ========== */
function renderProofs(proofs) {
  if (!proofs || proofs.length === 0) return '';

  const items = proofs.map((proof) => {
    const videoId = proof.type === 'youtube' ? parseYouTubeUrl(proof.url) : null;
    const driveId = parseGoogleDriveUrl(proof.url);

    // Build the thumbnail/preview area
    let thumbHtml;
    if (driveId) {
      thumbHtml = `<img src="https://drive.google.com/thumbnail?id=${driveId}&sz=w600" alt="${proof.name || 'Google Drive File'}" class="proof-thumbnail" loading="lazy" />`;
    } else if (proof.type === 'image') {
      thumbHtml = `<img src="${proof.url}" alt="${proof.name || 'Proof image'}" class="proof-thumbnail" loading="lazy" />`;
    } else if (proof.type === 'youtube' && videoId) {
      thumbHtml = `
        <div class="proof-yt-thumb">
          <img src="https://img.youtube.com/vi/${videoId}/mqdefault.jpg"
               alt="${proof.name || 'YouTube Video'}" class="proof-thumbnail" loading="lazy"
               onerror="this.style.display='none'" />
          <div class="proof-yt-play"><svg viewBox="0 0 68 48" width="48" height="34"><path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C0 13.05 0 24 0 24s0 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C68 34.95 68 24 68 24s0-10.95-1.48-16.26z" fill="#f00"/><path d="M45 24 27 14v20" fill="#fff"/></svg></div>
        </div>`;
    } else if (proof.type === 'pdf') {
      thumbHtml = `<div class="proof-icon-wrapper"><span class="proof-icon">📄</span><span class="proof-icon-label">PDF</span></div>`;
    } else if (proof.type === 'video') {
      thumbHtml = `<div class="proof-icon-wrapper"><span class="proof-icon">🎥</span><span class="proof-icon-label">Video</span></div>`;
    } else {
      thumbHtml = `<div class="proof-icon-wrapper"><span class="proof-icon">📎</span><span class="proof-icon-label">${proof.type || 'File'}</span></div>`;
    }

    const isVisual = !!driveId || proof.type === 'image' || (proof.type === 'youtube' && videoId);
    const nameHtml = isVisual ? '' : `<span class="proof-name">${proof.name || proof.type}</span>`;
    const safeUrl = (proof.url || '').replace(/"/g, '&quot;');
    const tooltipText = (proof.name || proof.type).replace(/"/g, '&quot;');

    return `
      <div class="proof-item" data-type="${proof.type}" data-url="${safeUrl}" data-vid="${videoId || ''}" data-driveid="${driveId || ''}" title="${tooltipText}" role="button" tabindex="0" onclick="window.__openProof(this)" onkeydown="if(event.key==='Enter')window.__openProof(this)">
        ${thumbHtml}
        ${nameHtml}
        <div class="proof-overlay"><span>🔍 View</span></div>
      </div>`;
  }).join('');

  return `<div class="proof-gallery">${items}</div>`;
}

// Global proof opener (called from inline onclick)
window.__openProof = function (element) {
  const type = element.dataset.type;
  const url = element.dataset.url;
  const vid = element.dataset.vid;
  const driveId = element.dataset.driveid;

  if (!url && !vid && !driveId) return;

  if (driveId) {
    createLightbox(`https://drive.google.com/file/d/${driveId}/preview`, 'pdf');
  } else if (type === 'youtube') {
    createLightbox(url, 'youtube');
  } else if (type === 'pdf') {
    createLightbox(url, 'pdf');
  } else if (type === 'image') {
    createLightbox(url, 'image');
  } else if (type === 'video') {
    createLightbox(url, 'video');
  } else {
    // Fallback: open in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};
