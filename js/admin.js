/**
 * admin.js — Admin panel logic for managing portfolio content
 * Handles authentication, CRUD operations, form generation, and file uploads
 */
import { DataManager } from './dataManager.js';
import { showToast, fileToBase64, getFileType, compressImage } from './utils.js';

/* ========== INITIALIZATION ========== */
document.addEventListener('DOMContentLoaded', async () => {
  await DataManager.initCloud();
  initAuth();
  initSidebar();
  initHeaderActions();
  initModal();
});

/* ========== AUTHENTICATION ========== */
function initAuth() {
  const passwordScreen = document.getElementById('password-screen');
  const adminApp = document.getElementById('admin-app');
  const loginBtn = document.getElementById('admin-login-btn');
  const passwordInput = document.getElementById('admin-password');
  const loginError = document.getElementById('login-error');

  // Check if already authenticated this session
  if (sessionStorage.getItem('admin_authenticated') === 'true') {
    passwordScreen.style.display = 'none';
    adminApp.style.display = 'flex';
    loadSection('personal');
    setTimeout(updateMsgBadge, 100);
    return;
  }

  loginBtn.addEventListener('click', () => attemptLogin());
  passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') attemptLogin();
  });

  function attemptLogin() {
    const password = passwordInput.value;
    if (DataManager.verifyPassword(password)) {
      sessionStorage.setItem('admin_authenticated', 'true');
      passwordScreen.style.display = 'none';
      adminApp.style.display = 'flex';
      loadSection('personal');
      setTimeout(updateMsgBadge, 100);
    } else {
      loginError.textContent = 'Incorrect password. Try again.';
      loginError.style.display = 'block';
      passwordInput.value = '';
      passwordInput.classList.add('shake');
      setTimeout(() => passwordInput.classList.remove('shake'), 500);
    }
  }
}

/* ========== SIDEBAR NAVIGATION ========== */
let currentSection = 'personal';

function initSidebar() {
  const sidebarLinks = document.querySelectorAll('.admin-sidebar__link');
  const sidebarToggle = document.getElementById('admin-sidebar-toggle');
  const sidebar = document.querySelector('.admin-sidebar');

  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      if (section) {
        sidebarLinks.forEach(l => l.classList.remove('active'));
        sidebarLinks.forEach(l => l.classList.remove('admin-sidebar__link--active'));
        link.classList.add('active');
        link.classList.add('admin-sidebar__link--active');
        loadSection(section);

        // Close sidebar on mobile
        if (sidebar) sidebar.classList.remove('sidebar-open');
      }
    });
  });

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('sidebar-open');
    });
  }
}

/* ========== HEADER ACTIONS ========== */
function initHeaderActions() {
  const exportBtn = document.getElementById('export-btn');
  const importBtn = document.getElementById('import-btn');
  const importFileInput = document.getElementById('import-file-input');
  const saveAllBtn = document.getElementById('save-all-btn');

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      DataManager.exportData();
      showToast('Data exported successfully!', 'success');
    });
  }

  if (importBtn && importFileInput) {
    importBtn.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          await DataManager.importData(file);
          showToast('Data imported successfully! Reloading...', 'success');
          setTimeout(() => {
            loadSection(currentSection);
          }, 1000);
        } catch (err) {
          showToast('Import failed: ' + err.message, 'error');
        }
      }
    });
  }

  if (saveAllBtn) {
    saveAllBtn.addEventListener('click', () => {
      showToast('All changes are auto-saved!', 'info');
    });
  }
}

/* ========== MODAL ========== */
let modalResolve = null;

function initModal() {
  const modal = document.getElementById('admin-modal');
  const confirmBtn = document.getElementById('modal-confirm-btn');
  const cancelBtn = document.getElementById('modal-cancel-btn');

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (modal) modal.classList.remove('is-open');
      if (modalResolve) modalResolve(true);
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      if (modal) modal.classList.remove('is-open');
      if (modalResolve) modalResolve(false);
    });
  }
}

function showModal(title, message) {
  const modal = document.getElementById('admin-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalMessage = document.getElementById('modal-message');

  if (modalTitle) modalTitle.textContent = title;
  if (modalMessage) modalMessage.textContent = message;
  if (modal) modal.classList.add('is-open');

  return new Promise((resolve) => {
    modalResolve = resolve;
  });
}

/* ========== SECTION LOADER ========== */
function loadSection(sectionKey) {
  currentSection = sectionKey;

  // Update page title
  const titleEl = document.getElementById('admin-page-title');
  const titles = {
    personal: '👤 Personal Info',
    education: '🎓 Education',
    professionalQualifications: '🏆 Professional Qualifications',
    vocationalQualifications: '📜 Vocational Qualifications',
    experience: '💼 Experience',
    skills: '⚡ Skills',
    competencies: '🎯 Competencies',
    achievements: '🏅 Achievements',
    personality: '🧠 Personality',
    interests: '🎮 Interests & Hobbies',
    swot: '📊 SWOT Analysis',
    values: '✨ Values',
    goals: '🎯 Goals',
    gapAnalysis: '📈 Gap Analysis',
    actionPlan: '📋 Action Plan',
    projects: '🚀 Projects',
    messages: '📬 Messages Inbox',
    settings: '⚙️ Settings'
  };
  if (titleEl) titleEl.textContent = titles[sectionKey] || sectionKey;

  // Hide all sections, show active
  document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
  const activeSection = document.getElementById(`section-${sectionKey}`);
  if (activeSection) {
    activeSection.style.display = 'block';
  }

  // Render section content
  const renderers = {
    personal: renderPersonalForm,
    education: () => renderListSection('education', educationFields),
    professionalQualifications: () => renderListSection('professionalQualifications', profQualFields),
    vocationalQualifications: () => renderListSection('vocationalQualifications', vocQualFields),
    experience: () => renderListSection('experience', experienceFields),
    skills: () => renderListSection('skills', skillFields),
    competencies: () => renderListSection('competencies', competencyFields),
    achievements: () => renderListSection('achievements', achievementFields),
    personality: renderPersonalityForm,
    interests: () => renderListSection('interests', interestFields),
    swot: renderSwotForm,
    values: () => renderListSection('values', valueFields),
    goals: renderGoalsForm,
    gapAnalysis: renderGapAnalysisForm,
    actionPlan: renderActionPlanForm,
    projects: () => renderListSection('projects', projectFields),
    messages: renderMessagesSection,
    settings: renderSettingsForm
  };

  const renderer = renderers[sectionKey];
  if (renderer) renderer();
}

/* ========== FIELD DEFINITIONS ========== */
const educationFields = [
  { key: 'degree', label: 'Degree / Certificate', type: 'text', required: true },
  { key: 'institution', label: 'Institution', type: 'text', required: true },
  { key: 'year', label: 'Year / Period', type: 'text' },
  { key: 'gpa', label: 'GPA', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' }
];

const profQualFields = [
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'issuer', label: 'Issuing Organization', type: 'text' },
  { key: 'date', label: 'Date', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'credentialUrl', label: 'Credential URL', type: 'url' }
];

const vocQualFields = [
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'issuer', label: 'Issuing Organization', type: 'text' },
  { key: 'date', label: 'Date', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' }
];

const experienceFields = [
  { key: 'role', label: 'Role / Position', type: 'text', required: true },
  { key: 'company', label: 'Company / Organization', type: 'text', required: true },
  { key: 'period', label: 'Period', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'type', label: 'Type', type: 'select', options: ['work', 'internship', 'volunteer', 'freelance'] }
];

const skillFields = [
  { key: 'name', label: 'Skill Name', type: 'text', required: true },
  { key: 'level', label: 'Proficiency Level (0-100)', type: 'range', min: 0, max: 100 },
  { key: 'category', label: 'Category', type: 'text' }
];

const competencyFields = [
  { key: 'name', label: 'Competency Name', type: 'text', required: true },
  { key: 'description', label: 'Description', type: 'textarea' }
];

const achievementFields = [
  { key: 'title', label: 'Achievement Title', type: 'text', required: true },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'date', label: 'Date', type: 'text' },
  { key: 'category', label: 'Category', type: 'select', options: ['Academic', 'Professional', 'Personal', 'Competition', 'Other'] }
];

const interestFields = [
  { key: 'name', label: 'Interest Name', type: 'text', required: true },
  { key: 'icon', label: 'Icon (emoji)', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' }
];

const valueFields = [
  { key: 'name', label: 'Value Name', type: 'text', required: true },
  { key: 'description', label: 'Description', type: 'textarea' }
];

const projectFields = [
  { key: 'title', label: 'Project Title', type: 'text', required: true },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'techStack', label: 'Tech Stack (comma-separated)', type: 'text' },
  { key: 'liveUrl', label: 'Live Demo URL', type: 'url' },
  { key: 'githubUrl', label: 'GitHub URL', type: 'url' },
  { key: 'youtubeUrl', label: 'YouTube URL', type: 'url' },
  { key: 'category', label: 'Category', type: 'text' },
  { key: 'featured', label: 'Featured', type: 'checkbox' }
];

/* ========== PERSONAL INFO FORM ========== */
function renderPersonalForm() {
  const container = document.getElementById('section-personal');
  if (!container) return;

  const data = DataManager.getSection('personal');

  container.innerHTML = `
    <form id="personal-form" class="admin-form">
      <div class="form-row">
        <div class="form-group">
          <label for="personal-fullName">Full Name</label>
          <input type="text" id="personal-fullName" name="fullName" value="${escapeHtml(data.fullName || '')}" required />
        </div>
        <div class="form-group">
          <label for="personal-title">Professional Title</label>
          <input type="text" id="personal-title" name="title" value="${escapeHtml(data.title || '')}" />
        </div>
      </div>

      <div class="form-group">
        <label for="personal-bio">Bio</label>
        <textarea id="personal-bio" name="bio" rows="4">${escapeHtml(data.bio || '')}</textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="personal-email">Email</label>
          <input type="email" id="personal-email" name="email" value="${escapeHtml(data.email || '')}" />
        </div>
        <div class="form-group">
          <label for="personal-location">Location</label>
          <input type="text" id="personal-location" name="location" value="${escapeHtml(data.location || '')}" />
        </div>
      </div>

      <div class="form-group">
        <label>Profile Image</label>
        <div class="file-upload" id="profile-image-upload">
          ${data.profileImage ? `<img src="${data.profileImage}" class="upload-preview" alt="Profile preview" />` : ''}
          <div class="upload-placeholder">
            <span class="upload-icon">📷</span>
            <span>Click or drag to upload profile photo</span>
          </div>
          <input type="file" id="profile-image-input" accept="image/*" class="file-input-hidden" />
        </div>
      </div>

      <h3 class="form-section-title">Social Links</h3>
      <div class="form-row">
        <div class="form-group">
          <label for="personal-linkedin">LinkedIn URL</label>
          <input type="url" id="personal-linkedin" name="linkedin" value="${escapeHtml(data.socialLinks?.linkedin || '')}" />
        </div>
        <div class="form-group">
          <label for="personal-github">GitHub URL</label>
          <input type="url" id="personal-github" name="github" value="${escapeHtml(data.socialLinks?.github || '')}" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="personal-facebook">Facebook URL</label>
          <input type="url" id="personal-facebook" name="facebook" value="${escapeHtml(data.socialLinks?.facebook || '')}" />
        </div>
        <div class="form-group">
          <label for="personal-instagram">Instagram URL</label>
          <input type="url" id="personal-instagram" name="instagram" value="${escapeHtml(data.socialLinks?.instagram || '')}" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="personal-threads">Threads URL</label>
          <input type="url" id="personal-threads" name="threads" value="${escapeHtml(data.socialLinks?.threads || '')}" />
        </div>
        <div class="form-group">
          <label for="personal-tiktok">TikTok URL</label>
          <input type="url" id="personal-tiktok" name="tiktok" value="${escapeHtml(data.socialLinks?.tiktok || '')}" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="personal-whatsapp">WhatsApp URL</label>
          <input type="url" id="personal-whatsapp" name="whatsapp" value="${escapeHtml(data.socialLinks?.whatsapp || '')}" />
        </div>
        <div class="form-group">
          <label for="personal-website">Website URL</label>
          <input type="url" id="personal-website" name="website" value="${escapeHtml(data.socialLinks?.website || '')}" />
        </div>
      </div>

      <button type="submit" class="admin-btn admin-btn-primary">💾 Save Personal Info</button>
    </form>
  `;

  // Form submit handler
  const form = document.getElementById('personal-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const updated = {
      ...data,
      fullName: formData.get('fullName'),
      title: formData.get('title'),
      bio: formData.get('bio'),
      email: formData.get('email'),
      location: formData.get('location'),
      socialLinks: {
        linkedin: formData.get('linkedin'),
        github: formData.get('github'),
        facebook: formData.get('facebook'),
        instagram: formData.get('instagram'),
        threads: formData.get('threads'),
        tiktok: formData.get('tiktok'),
        whatsapp: formData.get('whatsapp'),
        website: formData.get('website')
      }
    };
    DataManager.updateSection('personal', updated);
    showToast('Personal info saved!', 'success');
  });

  // Profile image upload
  const imageUpload = document.getElementById('profile-image-upload');
  const imageInput = document.getElementById('profile-image-input');

  imageUpload.addEventListener('click', () => imageInput.click());
  imageUpload.addEventListener('dragover', (e) => {
    e.preventDefault();
    imageUpload.classList.add('drag-over');
  });
  imageUpload.addEventListener('dragleave', () => {
    imageUpload.classList.remove('drag-over');
  });
  imageUpload.addEventListener('drop', (e) => {
    e.preventDefault();
    imageUpload.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) handleProfileImage(file, data);
  });
  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleProfileImage(file, data);
  });
}

async function handleProfileImage(file, data) {
  try {
    // Compress profile picture to max 800px width and 0.75 quality to save localStorage quota
    const base64 = await compressImage(file, 800, 0.75);
    data.profileImage = base64;
    DataManager.updateSection('personal', data);

    const preview = document.querySelector('.upload-preview');
    const upload = document.getElementById('profile-image-upload');
    if (preview) {
      preview.src = base64;
    } else {
      const img = document.createElement('img');
      img.src = base64;
      img.className = 'upload-preview';
      img.alt = 'Profile preview';
      upload.insertBefore(img, upload.firstChild);
    }
    showToast('Profile image updated!', 'success');
  } catch (err) {
    showToast(`Failed to update profile image: ${err.message}`, 'error');
  }
}

/* ========== GENERIC LIST SECTION RENDERER ========== */
function renderListSection(sectionKey, fields) {
  const container = document.getElementById(`section-${sectionKey}`);
  if (!container) return;

  const data = DataManager.getSection(sectionKey);
  const items = Array.isArray(data) ? data : [];

  const hasProofs = !['skills', 'competencies', 'interests', 'values'].includes(sectionKey);

  container.innerHTML = `
    <div class="admin-list-header">
      <span class="item-count">${items.length} item${items.length !== 1 ? 's' : ''}</span>
      <button class="admin-btn admin-btn-primary" id="add-${sectionKey}-btn">+ Add New</button>
    </div>
    <div class="item-list" id="${sectionKey}-list">
      ${items.map(item => renderItemCard(sectionKey, item, fields)).join('')}
    </div>
    <div id="${sectionKey}-form-container" style="display:none;"></div>
  `;

  // Add button
  document.getElementById(`add-${sectionKey}-btn`).addEventListener('click', () => {
    showItemForm(sectionKey, null, fields, hasProofs);
  });

  // Edit & Delete buttons
  container.querySelectorAll('.item-edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const itemId = btn.dataset.id;
      const item = items.find(i => i.id === itemId);
      if (item) showItemForm(sectionKey, item, fields, hasProofs);
    });
  });

  container.querySelectorAll('.item-delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const itemId = btn.dataset.id;
      const confirmed = await showModal('Delete Item', 'Are you sure you want to delete this item? This cannot be undone.');
      if (confirmed) {
        DataManager.deleteItem(sectionKey, itemId);
        renderListSection(sectionKey, fields);
        showToast('Item deleted', 'success');
      }
    });
  });
}

function renderItemCard(sectionKey, item, fields) {
  const primaryField = fields[0];
  const secondaryField = fields.length > 1 ? fields[1] : null;
  const primaryValue = item[primaryField.key] || 'Untitled';
  const secondaryValue = secondaryField ? (item[secondaryField.key] || '') : '';

  // Special handling for tech stack arrays
  let displayPrimary = primaryValue;
  if (Array.isArray(primaryValue)) displayPrimary = primaryValue.join(', ');

  let displaySecondary = secondaryValue;
  if (Array.isArray(secondaryValue)) displaySecondary = secondaryValue.join(', ');

  // Show level for skills
  const levelDisplay = item.level !== undefined ? `<div class=\"item-level-bar\"><div class=\"item-level-fill\" style=\"width:${item.level}%\"></div><span>${item.level}%</span></div>` : '';

  // Show proofs count
  const proofsCount = item.proofs ? item.proofs.length : 0;
  const proofsDisplay = proofsCount > 0 ? `<span class=\"item-proofs-badge\">📎 ${proofsCount} proof${proofsCount > 1 ? 's' : ''}</span>` : '';

  return `
    <div class="item-card glass-card">
      <div class="item-info">
        <h4 class="item-title">${escapeHtml(String(displayPrimary))}</h4>
        <p class="item-subtitle">${escapeHtml(String(displaySecondary))}</p>
        ${levelDisplay}
        ${proofsDisplay}
      </div>
      <div class="item-actions">
        <button class="admin-btn admin-btn-small item-edit-btn" data-id="${item.id}">✏️ Edit</button>
        <button class="admin-btn admin-btn-small admin-btn-danger item-delete-btn" data-id="${item.id}">🗑️ Delete</button>
      </div>
    </div>
  `;
}

function showItemForm(sectionKey, item, fields, hasProofs) {
  const formContainer = document.getElementById(`${sectionKey}-form-container`);
  if (!formContainer) return;

  const isEdit = !!item;
  const prefix = sectionKey;

  formContainer.style.display = 'block';
  formContainer.innerHTML = `
    <div class="admin-item-form glass-card">
      <h3>${isEdit ? 'Edit' : 'Add New'} Item</h3>
      <form id="${prefix}-item-form">
        ${fields.map(field => renderFormField(field, item)).join('')}
        ${hasProofs ? renderProofUploader(item) : ''}
        <div class="form-actions">
          <button type="submit" class="admin-btn admin-btn-primary">💾 ${isEdit ? 'Save Changes' : 'Add Item'}</button>
          <button type="button" class="admin-btn admin-btn-secondary" id="${prefix}-cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  `;

  // Scroll to form
  formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Cancel button
  document.getElementById(`${prefix}-cancel-btn`).addEventListener('click', () => {
    formContainer.style.display = 'none';
    formContainer.innerHTML = '';
  });

  // Submit handler
  const form = document.getElementById(`${prefix}-item-form`);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const newItem = {};

    fields.forEach(field => {
      let value = formData.get(field.key);
      if (field.type === 'checkbox') {
        value = form.querySelector(`[name="${field.key}"]`).checked;
      } else if (field.type === 'range') {
        value = parseInt(value) || 0;
      } else if (field.key === 'techStack') {
        value = value ? value.split(',').map(s => s.trim()).filter(Boolean) : [];
      }
      newItem[field.key] = value || '';
    });

    if (isEdit) {
      newItem.id = item.id;
      newItem.proofs = item.proofs || [];
      DataManager.updateItem(sectionKey, item.id, newItem);
      showToast('Item updated!', 'success');
    } else {
      newItem.id = DataManager.generateId(sectionKey.substring(0, 3));
      newItem.proofs = [];
      DataManager.addItem(sectionKey, newItem);
      showToast('Item added!', 'success');
    }

    formContainer.style.display = 'none';
    formContainer.innerHTML = '';
    renderListSection(sectionKey, fields);
  });

  // Proof upload handlers
  if (hasProofs) {
    initProofUpload(sectionKey, item);
  }
}

function renderFormField(field, item) {
  const value = item ? (item[field.key] || '') : (field.default || '');
  const displayValue = Array.isArray(value) ? value.join(', ') : value;
  const required = field.required ? 'required' : '';

  switch (field.type) {
    case 'textarea':
      return `
        <div class="form-group">
          <label for="field-${field.key}">${field.label}</label>
          <textarea id="field-${field.key}" name="${field.key}" rows="3" ${required}>${escapeHtml(String(displayValue))}</textarea>
        </div>
      `;
    case 'select':
      return `
        <div class="form-group">
          <label for="field-${field.key}">${field.label}</label>
          <select id="field-${field.key}" name="${field.key}" ${required}>
            ${(field.options || []).map(opt =>
        `<option value="${opt}" ${value === opt ? 'selected' : ''}>${opt.charAt(0).toUpperCase() + opt.slice(1)}</option>`
      ).join('')}
          </select>
        </div>
      `;
    case 'range':
      return `
        <div class="form-group">
          <label for="field-${field.key}">${field.label}: <span id="range-value-${field.key}">${value || 50}</span>%</label>
          <input type="range" id="field-${field.key}" name="${field.key}" min="${field.min || 0}" max="${field.max || 100}" value="${value || 50}" 
            oninput="document.getElementById('range-value-${field.key}').textContent = this.value" />
        </div>
      `;
    case 'checkbox':
      return `
        <div class="form-group form-group-checkbox">
          <label>
            <input type="checkbox" id="field-${field.key}" name="${field.key}" ${value ? 'checked' : ''} />
            ${field.label}
          </label>
        </div>
      `;
    default:
      return `
        <div class="form-group">
          <label for="field-${field.key}">${field.label}</label>
          <input type="${field.type || 'text'}" id="field-${field.key}" name="${field.key}" value="${escapeHtml(String(displayValue))}" ${required} />
        </div>
      `;
  }
}

/* ========== PROOF UPLOADER ========== */
function renderProofUploader(item) {
  const proofs = item?.proofs || [];

  return `
    <div class="proof-upload-section">
      <h4>Proof Attachments</h4>
      <div class="proof-list" id="proof-list">
        ${proofs.map((proof, index) => `
          <div class="proof-upload-item">
            <span class="proof-upload-icon">${proof.type === 'image' ? '🖼️' : proof.type === 'pdf' ? '📄' : proof.type === 'youtube' ? '▶️' : '🎥'}</span>
            <span class="proof-upload-name">${escapeHtml(proof.name || 'Proof')}</span>
            <button type="button" class="admin-btn admin-btn-small admin-btn-danger proof-remove-btn" data-index="${index}">✕</button>
          </div>
        `).join('')}
      </div>
      <div class="proof-upload-actions">
        <div class="file-upload proof-file-upload" id="proof-drop-area">
          <span class="upload-icon">📎</span>
          <span>Drop files here or click to upload (images, PDFs)</span>
          <input type="file" id="proof-file-input" accept="image/*,.pdf,video/*" multiple class="file-input-hidden" />
        </div>
        <div class="form-group" style="margin-top: 0.5rem;">
          <label for="youtube-proof-url">Or add YouTube URL:</label>
          <div class="input-with-btn">
            <input type="url" id="youtube-proof-url" placeholder="https://youtube.com/watch?v=..." />
            <button type="button" class="admin-btn admin-btn-small" id="add-youtube-proof-btn">Add</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function initProofUpload(sectionKey, item) {
  if (!item) return; // Proofs only for existing items

  const dropArea = document.getElementById('proof-drop-area');
  const fileInput = document.getElementById('proof-file-input');
  const youtubeInput = document.getElementById('youtube-proof-url');
  const addYoutubeBtn = document.getElementById('add-youtube-proof-btn');

  if (dropArea && fileInput) {
    dropArea.addEventListener('click', () => fileInput.click());
    dropArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropArea.classList.add('drag-over');
    });
    dropArea.addEventListener('dragleave', () => dropArea.classList.remove('drag-over'));
    dropArea.addEventListener('drop', (e) => {
      e.preventDefault();
      dropArea.classList.remove('drag-over');
      handleProofFiles(e.dataTransfer.files, sectionKey, item);
    });
    fileInput.addEventListener('change', (e) => {
      handleProofFiles(e.target.files, sectionKey, item);
    });
  }

  if (addYoutubeBtn && youtubeInput) {
    addYoutubeBtn.addEventListener('click', () => {
      const url = youtubeInput.value.trim();
      if (url) {
        const proof = { type: 'youtube', url, name: 'YouTube Video' };
        DataManager.addProof(sectionKey, item.id, proof);
        item.proofs = item.proofs || [];
        item.proofs.push(proof);
        youtubeInput.value = '';
        showToast('YouTube proof added!', 'success');
        // Refresh proof list display
        refreshProofList(item);
      }
    });
  }

  // Remove proof buttons using event delegation so dynamic refreshes keep remove buttons working
  const proofList = document.getElementById('proof-list');
  if (proofList) {
    proofList.addEventListener('click', (e) => {
      const btn = e.target.closest('.proof-remove-btn');
      if (btn) {
        const index = parseInt(btn.dataset.index);
        DataManager.removeProof(sectionKey, item.id, index);
        item.proofs.splice(index, 1);
        refreshProofList(item);
        showToast('Proof removed', 'success');
      }
    });
  }
}

async function handleProofFiles(files, sectionKey, item) {
  const MAX_FILE_SIZE = 1.5 * 1024 * 1024; // 1.5 MB limit
  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      showToast(`Failed to upload ${file.name}: File is too large. Please use files under 1.5 MB.`, 'error');
      continue;
    }
    try {
      const type = getFileType(file.name);
      let base64;
      if (type === 'image') {
        // Compress images to save space in localStorage
        base64 = await compressImage(file, 1200, 0.75);
      } else {
        base64 = await fileToBase64(file);
      }
      const proof = { type, url: base64, name: file.name };
      const success = DataManager.addProof(sectionKey, item.id, proof);
      if (!success) {
        showToast(`Failed to upload ${file.name}: Storage limit reached. Try clearing old files.`, 'error');
        continue;
      }
      item.proofs = item.proofs || [];
      item.proofs.push(proof);
      showToast(`Proof "${file.name}" uploaded!`, 'success');
    } catch (err) {
      showToast(`Failed to upload ${file.name}: ${err.message}`, 'error');
    }
  }
  refreshProofList(item);
}

function refreshProofList(item) {
  const proofList = document.getElementById('proof-list');
  if (!proofList) return;
  const proofs = item.proofs || [];
  proofList.innerHTML = proofs.map((proof, index) => `
    <div class="proof-upload-item">
      <span class="proof-upload-icon">${proof.type === 'image' ? '🖼️' : proof.type === 'pdf' ? '📄' : proof.type === 'youtube' ? '▶️' : '🎥'}</span>
      <span class="proof-upload-name">${escapeHtml(proof.name || 'Proof')}</span>
      <button type="button" class="admin-btn admin-btn-small admin-btn-danger proof-remove-btn" data-index="${index}">✕</button>
    </div>
  `).join('');
}

/* ========== PERSONALITY FORM ========== */
function renderPersonalityForm() {
  const container = document.getElementById('section-personality');
  if (!container) return;

  const data = DataManager.getSection('personality');

  container.innerHTML = `
    <form id="personality-form" class="admin-form">
      <div class="form-row">
        <div class="form-group">
          <label for="mbti-type">MBTI Type</label>
          <input type="text" id="mbti-type" name="mbtiType" value="${escapeHtml(data.mbtiType || '')}" maxlength="4" placeholder="e.g., INTJ" />
        </div>
        <div class="form-group">
          <label for="mbti-label">MBTI Label</label>
          <input type="text" id="mbti-label" name="mbtiLabel" value="${escapeHtml(data.mbtiLabel || '')}" placeholder="e.g., Architect" />
        </div>
      </div>
      <div class="form-group">
        <label for="mbti-description">MBTI Description</label>
        <textarea id="mbti-description" name="mbtiDescription" rows="3">${escapeHtml(data.mbtiDescription || '')}</textarea>
      </div>
      <div class="form-group">
        <label for="career-key">Career Key Results</label>
        <textarea id="career-key" name="careerKeyResults" rows="3">${escapeHtml(data.careerKeyResults || '')}</textarea>
      </div>

      ${renderProofUploader({ proofs: data.proofs || [] })}

      <button type="submit" class="admin-btn admin-btn-primary">💾 Save Personality</button>
    </form>
  `;

  initProofUpload('personality', data);

  const form = document.getElementById('personality-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const updated = {
      ...data,
      mbtiType: formData.get('mbtiType'),
      mbtiLabel: formData.get('mbtiLabel'),
      mbtiDescription: formData.get('mbtiDescription'),
      careerKeyResults: formData.get('careerKeyResults')
    };
    DataManager.updateSection('personality', updated);
    showToast('Personality info saved!', 'success');
  });
}

/* ========== SWOT FORM ========== */
function renderSwotForm() {
  const container = document.getElementById('section-swot');
  if (!container) return;

  const data = DataManager.getSection('swot');

  const quadrants = [
    { key: 'strengths', label: '💪 Strengths', color: 'cyan' },
    { key: 'weaknesses', label: '⚠️ Weaknesses', color: 'pink' },
    { key: 'opportunities', label: '🚀 Opportunities', color: 'emerald' },
    { key: 'threats', label: '🔥 Threats', color: 'amber' }
  ];

  container.innerHTML = `
    <form id="swot-form" class="admin-form">
      <div class="swot-form-grid">
        ${quadrants.map(q => `
          <div class="swot-form-quadrant swot-form-${q.color}">
            <h4>${q.label}</h4>
            <div class="swot-items" id="swot-${q.key}-items">
              ${(data[q.key] || []).map((item, i) => `
                <div class="swot-form-item">
                  <input type="text" name="${q.key}-${i}" value="${escapeHtml(item)}" />
                  <button type="button" class="admin-btn admin-btn-small admin-btn-danger swot-remove" data-quadrant="${q.key}" data-index="${i}">✕</button>
                </div>
              `).join('')}
            </div>
            <button type="button" class="admin-btn admin-btn-small swot-add" data-quadrant="${q.key}">+ Add</button>
          </div>
        `).join('')}
      </div>
      <button type="submit" class="admin-btn admin-btn-primary">💾 Save SWOT</button>
    </form>
  `;

  // Add item buttons
  container.querySelectorAll('.swot-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const quadrant = btn.dataset.quadrant;
      const itemsContainer = document.getElementById(`swot-${quadrant}-items`);
      const index = itemsContainer.children.length;
      const div = document.createElement('div');
      div.className = 'swot-form-item';
      div.innerHTML = `
        <input type="text" name="${quadrant}-${index}" placeholder="Enter item..." />
        <button type="button" class="admin-btn admin-btn-small admin-btn-danger swot-remove" data-quadrant="${quadrant}" data-index="${index}">✕</button>
      `;
      itemsContainer.appendChild(div);
      div.querySelector('input').focus();
    });
  });

  // Remove item buttons (delegated)
  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('swot-remove')) {
      e.target.closest('.swot-form-item').remove();
    }
  });

  // Save
  const form = document.getElementById('swot-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const updated = {};
    quadrants.forEach(q => {
      const items = [];
      const inputs = form.querySelectorAll(`[name^="${q.key}-"]`);
      inputs.forEach(input => {
        const val = input.value.trim();
        if (val) items.push(val);
      });
      updated[q.key] = items;
    });
    DataManager.updateSection('swot', updated);
    showToast('SWOT Analysis saved!', 'success');
  });
}

/* ========== GOALS FORM ========== */
function renderGoalsForm() {
  const container = document.getElementById('section-goals');
  if (!container) return;

  const data = DataManager.getSection('goals');
  let activeTab = 'smart';

  function renderGoalList(type) {
    const items = data[type] || [];
    const fields = type === 'smart'
      ? ['specific', 'measurable', 'achievable', 'relevant', 'timeBound']
      : ['stretch', 'ambitious', 'flexible', 'everyday'];

    return `
      <div class="item-list">
        ${items.map(goal => `
          <div class="item-card glass-card">
            <div class="item-info">
              <h4 class="item-title">${escapeHtml(goal.title)}</h4>
              <p class="item-subtitle">Progress: ${goal.progress || 0}% | Status: ${goal.status || 'not-started'}</p>
            </div>
            <div class="item-actions">
              <button class="admin-btn admin-btn-small goal-edit-btn" data-id="${goal.id}" data-type="${type}">✏️ Edit</button>
              <button class="admin-btn admin-btn-small admin-btn-danger goal-delete-btn" data-id="${goal.id}" data-type="${type}">🗑️ Delete</button>
            </div>
          </div>
        `).join('')}
      </div>
      <button class="admin-btn admin-btn-primary goal-add-btn" data-type="${type}">+ Add ${type.toUpperCase()} Goal</button>
      <div id="goal-form-container-${type}" style="display:none;"></div>
    `;
  }

  container.innerHTML = `
    <div class="admin-tabs">
      <button class="tab-btn active" data-tab="smart">SMART Goals</button>
      <button class="tab-btn" data-tab="safe">SAFE Goals</button>
    </div>
    <div id="goals-tab-content">
      ${renderGoalList('smart')}
    </div>
  `;

  // Tab switching
  container.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTab = btn.dataset.tab;
      document.getElementById('goals-tab-content').innerHTML = renderGoalList(activeTab);
      attachGoalListeners(container, data);
    });
  });

  attachGoalListeners(container, data);
}

function attachGoalListeners(container, data) {
  container.querySelectorAll('.goal-add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      showGoalForm(type, null, data);
    });
  });

  container.querySelectorAll('.goal-edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      const id = btn.dataset.id;
      const goal = data[type].find(g => g.id === id);
      if (goal) showGoalForm(type, goal, data);
    });
  });

  container.querySelectorAll('.goal-delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const type = btn.dataset.type;
      const id = btn.dataset.id;
      const confirmed = await showModal('Delete Goal', 'Are you sure?');
      if (confirmed) {
        data[type] = data[type].filter(g => g.id !== id);
        DataManager.updateSection('goals', data);
        renderGoalsForm();
        showToast('Goal deleted', 'success');
      }
    });
  });
}

function showGoalForm(type, goal, data) {
  const formContainer = document.getElementById(`goal-form-container-${type}`);
  if (!formContainer) return;

  const isEdit = !!goal;
  const fields = type === 'smart'
    ? [
      { key: 'title', label: 'Goal Title', type: 'text' },
      { key: 'specific', label: 'Specific', type: 'textarea' },
      { key: 'measurable', label: 'Measurable', type: 'textarea' },
      { key: 'achievable', label: 'Achievable', type: 'textarea' },
      { key: 'relevant', label: 'Relevant', type: 'textarea' },
      { key: 'timeBound', label: 'Time-Bound', type: 'textarea' },
      { key: 'progress', label: 'Progress (%)', type: 'range', min: 0, max: 100 },
      { key: 'status', label: 'Status', type: 'select', options: ['not-started', 'in-progress', 'completed', 'on-hold'] }
    ]
    : [
      { key: 'title', label: 'Goal Title', type: 'text' },
      { key: 'stretch', label: 'Stretch', type: 'textarea' },
      { key: 'ambitious', label: 'Ambitious', type: 'textarea' },
      { key: 'flexible', label: 'Flexible', type: 'textarea' },
      { key: 'everyday', label: 'Everyday', type: 'textarea' },
      { key: 'progress', label: 'Progress (%)', type: 'range', min: 0, max: 100 },
      { key: 'status', label: 'Status', type: 'select', options: ['not-started', 'in-progress', 'completed', 'on-hold'] }
    ];

  formContainer.style.display = 'block';
  formContainer.innerHTML = `
    <div class="admin-item-form glass-card">
      <h3>${isEdit ? 'Edit' : 'Add'} ${type.toUpperCase()} Goal</h3>
      <form id="goal-edit-form">
        ${fields.map(f => renderFormField(f, goal)).join('')}
        <div class="form-actions">
          <button type="submit" class="admin-btn admin-btn-primary">💾 Save</button>
          <button type="button" class="admin-btn admin-btn-secondary" id="goal-cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  `;

  document.getElementById('goal-cancel-btn').addEventListener('click', () => {
    formContainer.style.display = 'none';
  });

  document.getElementById('goal-edit-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newGoal = {};
    fields.forEach(f => {
      let val = formData.get(f.key);
      if (f.type === 'range') val = parseInt(val) || 0;
      newGoal[f.key] = val || '';
    });

    if (isEdit) {
      newGoal.id = goal.id;
      const idx = data[type].findIndex(g => g.id === goal.id);
      if (idx >= 0) data[type][idx] = newGoal;
    } else {
      newGoal.id = DataManager.generateId(type);
      data[type] = data[type] || [];
      data[type].push(newGoal);
    }

    DataManager.updateSection('goals', data);
    renderGoalsForm();
    showToast(`Goal ${isEdit ? 'updated' : 'added'}!`, 'success');
  });
}

/* ========== GAP ANALYSIS FORM ========== */
function renderGapAnalysisForm() {
  const container = document.getElementById('section-gapAnalysis');
  if (!container) return;

  const data = DataManager.getSection('gapAnalysis');
  let activeTab = 'knowledge';

  function renderGapList(type) {
    const items = data[type] || [];
    return `
      <div class="item-list">
        ${items.map(item => `
          <div class="item-card glass-card">
            <div class="item-info">
              <h4 class="item-title">${escapeHtml(item.current)} → ${escapeHtml(item.required)}</h4>
              <p class="item-subtitle">Gap: ${escapeHtml(item.gap)}</p>
            </div>
            <div class="item-actions">
              <button class="admin-btn admin-btn-small gap-edit-btn" data-id="${item.id}" data-type="${type}">✏️</button>
              <button class="admin-btn admin-btn-small admin-btn-danger gap-delete-btn" data-id="${item.id}" data-type="${type}">🗑️</button>
            </div>
          </div>
        `).join('')}
      </div>
      <button class="admin-btn admin-btn-primary gap-add-btn" data-type="${type}">+ Add Gap</button>
      <div id="gap-form-container-${type}" style="display:none;"></div>
    `;
  }

  container.innerHTML = `
    <div class="admin-tabs">
      <button class="tab-btn active" data-tab="knowledge">Knowledge</button>
      <button class="tab-btn" data-tab="skills">Skills</button>
      <button class="tab-btn" data-tab="experience">Experience</button>
    </div>
    <div id="gap-tab-content">${renderGapList('knowledge')}</div>
  `;

  container.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTab = btn.dataset.tab;
      document.getElementById('gap-tab-content').innerHTML = renderGapList(activeTab);
      attachGapListeners(container, data);
    });
  });

  attachGapListeners(container, data);
}

function attachGapListeners(container, data) {
  container.querySelectorAll('.gap-add-btn').forEach(btn => {
    btn.addEventListener('click', () => showGapForm(btn.dataset.type, null, data));
  });
  container.querySelectorAll('.gap-edit-btn').forEach(btn => {
    const type = btn.dataset.type;
    const item = data[type]?.find(i => i.id === btn.dataset.id);
    if (item) btn.addEventListener('click', () => showGapForm(type, item, data));
  });
  container.querySelectorAll('.gap-delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const confirmed = await showModal('Delete', 'Delete this gap item?');
      if (confirmed) {
        const type = btn.dataset.type;
        data[type] = data[type].filter(i => i.id !== btn.dataset.id);
        DataManager.updateSection('gapAnalysis', data);
        renderGapAnalysisForm();
        showToast('Deleted', 'success');
      }
    });
  });
}

function showGapForm(type, item, data) {
  const formContainer = document.getElementById(`gap-form-container-${type}`);
  if (!formContainer) return;
  const isEdit = !!item;

  formContainer.style.display = 'block';
  formContainer.innerHTML = `
    <div class="admin-item-form glass-card">
      <form id="gap-edit-form">
        <div class="form-group"><label>Current State</label><textarea name="current" rows="2">${escapeHtml(item?.current || '')}</textarea></div>
        <div class="form-group"><label>Required State</label><textarea name="required" rows="2">${escapeHtml(item?.required || '')}</textarea></div>
        <div class="form-group"><label>Gap</label><textarea name="gap" rows="2">${escapeHtml(item?.gap || '')}</textarea></div>
        <div class="form-group"><label>Action Plan</label><textarea name="plan" rows="2">${escapeHtml(item?.plan || '')}</textarea></div>
        <div class="form-actions">
          <button type="submit" class="admin-btn admin-btn-primary">💾 Save</button>
          <button type="button" class="admin-btn admin-btn-secondary" onclick="this.closest('.admin-item-form').parentElement.style.display='none'">Cancel</button>
        </div>
      </form>
    </div>
  `;

  document.getElementById('gap-edit-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newItem = { current: fd.get('current'), required: fd.get('required'), gap: fd.get('gap'), plan: fd.get('plan') };

    if (isEdit) {
      newItem.id = item.id;
      const idx = data[type].findIndex(i => i.id === item.id);
      if (idx >= 0) data[type][idx] = newItem;
    } else {
      newItem.id = DataManager.generateId('gap');
      data[type] = data[type] || [];
      data[type].push(newItem);
    }

    DataManager.updateSection('gapAnalysis', data);
    renderGapAnalysisForm();
    showToast('Saved!', 'success');
  });
}

/* ========== ACTION PLAN FORM ========== */
function renderActionPlanForm() {
  const container = document.getElementById('section-actionPlan');
  if (!container) return;

  const data = DataManager.getSection('actionPlan');

  container.innerHTML = `
    <form id="action-plan-form" class="admin-form">
      ${data.map((year, yi) => `
        <div class="action-plan-year-form glass-card">
          <div class="form-row">
            <div class="form-group">
              <label>Year Label</label>
              <input type="text" name="year-${yi}" value="${escapeHtml(year.year)}" />
            </div>
            <div class="form-group">
              <label>Status</label>
              <select name="status-${yi}">
                <option value="not-started" ${year.status === 'not-started' ? 'selected' : ''}>Not Started</option>
                <option value="in-progress" ${year.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                <option value="completed" ${year.status === 'completed' ? 'selected' : ''}>Completed</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Goals (one per line)</label>
            <textarea name="goals-${yi}" rows="4">${(year.goals || []).join('\n')}</textarea>
          </div>
        </div>
      `).join('')}
      <button type="button" class="admin-btn admin-btn-secondary" id="add-year-btn">+ Add Year</button>
      <button type="submit" class="admin-btn admin-btn-primary">💾 Save Action Plan</button>
    </form>
  `;

  document.getElementById('add-year-btn').addEventListener('click', () => {
    data.push({
      id: DataManager.generateId('ap'),
      year: `Year ${data.length + 1}`,
      goals: [],
      status: 'not-started'
    });
    DataManager.updateSection('actionPlan', data);
    renderActionPlanForm();
  });

  document.getElementById('action-plan-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    data.forEach((year, yi) => {
      year.year = fd.get(`year-${yi}`) || year.year;
      year.status = fd.get(`status-${yi}`) || year.status;
      const goalsText = fd.get(`goals-${yi}`) || '';
      year.goals = goalsText.split('\n').map(g => g.trim()).filter(Boolean);
    });
    DataManager.updateSection('actionPlan', data);
    showToast('Action Plan saved!', 'success');
  });
}

/* ========== SETTINGS FORM ========== */
function renderSettingsForm() {
  const container = document.getElementById('section-settings');
  if (!container) return;

  container.innerHTML = `
    <div class="admin-form">
      <div class="glass-card settings-card">
        <h3>🔑 Change Admin Password</h3>
        <form id="password-form">
          <div class="form-group">
            <label for="current-password">Current Password</label>
            <input type="password" id="current-password" name="currentPassword" required />
          </div>
          <div class="form-group">
            <label for="new-password">New Password</label>
            <input type="password" id="new-password" name="newPassword" required />
          </div>
          <div class="form-group">
            <label for="confirm-password">Confirm New Password</label>
            <input type="password" id="confirm-password" name="confirmPassword" required />
          </div>
          <button type="submit" class="admin-btn admin-btn-primary">Update Password</button>
        </form>
      </div>

      <div class="glass-card settings-card">
        <h3>📦 Data Management</h3>
        <p>Export your portfolio data as a JSON file for backup, or import from a previous export.</p>
        <div class="storage-usage-container" style="margin: 15px 0; padding: 12px; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
            <span style="color: var(--text-secondary);">Storage Usage</span>
            <span id="storage-usage-text" style="color: var(--admin-accent); font-weight: 600;">Calculating...</span>
          </div>
          <div style="height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden;">
            <div id="storage-usage-bar" style="height: 100%; width: 0%; background: linear-gradient(90deg, var(--admin-accent), var(--admin-purple)); transition: width 0.3s ease;"></div>
          </div>
        </div>
        <div class="settings-actions">
          <button class="admin-btn admin-btn-primary" id="settings-export-btn">📤 Export Data</button>
          <button class="admin-btn admin-btn-secondary" id="settings-import-btn">📥 Import Data</button>
        </div>
      </div>

      <div class="glass-card settings-card">
        <h3>☁️ Cloud Database Sync</h3>
        <p>Sync your portfolio data dynamically using a free cloud database on <strong>JSONBin.io</strong>. This keeps your changes safe when deploying your portfolio to platforms like GitHub Pages, Netlify, or Vercel.</p>
        
        <form id="cloud-sync-form" style="margin-top: 15px;">
          <div class="form-group">
            <label for="cloud-api-key">JSONBin.io API Key (X-Master-Key)</label>
            <input type="password" id="cloud-api-key" name="apiKey" placeholder="Pasted API Key" />
          </div>
          <div class="form-group">
            <label for="cloud-bin-id">JSONBin.io Bin ID</label>
            <input type="text" id="cloud-bin-id" name="binId" placeholder="e.g. 64abc123..." />
          </div>
          <div style="margin-bottom: var(--space-4); font-size: 11.5px; color: var(--text-muted); line-height: 1.5;">
            <strong>How to setup:</strong><br/>
            1. Go to <a href="https://jsonbin.io" target="_blank" style="color:var(--admin-accent)">JSONBin.io</a> and register a free account.<br/>
            2. Copy your <strong>API Key (X-Master-Key)</strong> and paste it above.<br/>
            3. In Settings, click <strong>Export Data</strong> to download your current data JSON.<br/>
            4. On JSONBin, click <strong>"Create Bin"</strong>, paste the content of your exported JSON, and save.<br/>
            5. Copy the generated <strong>Bin ID</strong>, paste it above, and click <strong>Enable Cloud Sync</strong>.
          </div>
          <button type="submit" class="admin-btn admin-btn-primary" id="save-cloud-sync-btn">Enable Cloud Sync</button>
        </form>
      </div>

      <div class="glass-card settings-card settings-danger">
        <h3>⚠️ Danger Zone</h3>
        <p>Reset all data to defaults. This action cannot be undone!</p>
        <button class="admin-btn admin-btn-danger" id="reset-data-btn">🗑️ Reset All Data</button>
      </div>
    </div>
  `;

  // Calculate storage usage
  const totalLimit = 5 * 1024 * 1024; // 5MB limit
  let used = 0;
  try {
    const key = 'yuresh_portfolio_data';
    const val = localStorage.getItem(key) || '';
    used = val.length * 2; // ~2 bytes per character
  } catch (e) {}

  const percent = Math.min(100, Math.round((used / totalLimit) * 100));
  const usedMB = (used / (1024 * 1024)).toFixed(2);
  const totalMB = (totalLimit / (1024 * 1024)).toFixed(2);

  const usageText = document.getElementById('storage-usage-text');
  const usageBar = document.getElementById('storage-usage-bar');
  if (usageText) usageText.textContent = `${usedMB} MB / ${totalMB} MB (${percent}%)`;
  if (usageBar) {
    usageBar.style.width = `${percent}%`;
    if (percent > 85) {
      usageBar.style.background = 'var(--admin-red)';
    }
  }

  // Password form
  document.getElementById('password-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const current = fd.get('currentPassword');
    const newPw = fd.get('newPassword');
    const confirm = fd.get('confirmPassword');

    if (!DataManager.verifyPassword(current)) {
      showToast('Current password is incorrect', 'error');
      return;
    }
    if (newPw !== confirm) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (newPw.length < 4) {
      showToast('Password must be at least 4 characters', 'error');
      return;
    }

    DataManager.updatePassword(newPw);
    showToast('Password updated successfully!', 'success');
    e.target.reset();
  });

  // Export
  document.getElementById('settings-export-btn').addEventListener('click', () => {
    DataManager.exportData();
    showToast('Data exported!', 'success');
  });

  // Import
  document.getElementById('settings-import-btn').addEventListener('click', () => {
    document.getElementById('import-file-input').click();
  });

  // Reset
  document.getElementById('reset-data-btn').addEventListener('click', async () => {
    const confirmed = await showModal('Reset All Data', 'This will delete all your portfolio data and reset to defaults. This cannot be undone. Are you absolutely sure?');
    if (confirmed) {
      DataManager.resetData();
      showToast('All data has been reset to defaults', 'success');
      loadSection('personal');
    }
  });

  // Cloud sync form bindings
  const cloudConfig = DataManager.getCloudConfig();
  const cloudApiInput = document.getElementById('cloud-api-key');
  const cloudBinInput = document.getElementById('cloud-bin-id');
  const cloudForm = document.getElementById('cloud-sync-form');
  const cloudBtn = document.getElementById('save-cloud-sync-btn');

  if (cloudApiInput) cloudApiInput.value = cloudConfig.apiKey || '';
  if (cloudBinInput) cloudBinInput.value = cloudConfig.binId || '';
  if (cloudBtn && cloudConfig.apiKey && cloudConfig.binId) {
    cloudBtn.textContent = '🔄 Update Cloud Sync Settings';
  }

  if (cloudForm) {
    cloudForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(cloudForm);
      const apiKey = fd.get('apiKey').trim();
      const binId = fd.get('binId').trim();

      if (!apiKey || !binId) {
        // Clear sync settings if empty
        DataManager.saveCloudConfig('', '');
        showToast('Cloud sync disabled. Using browser local storage.', 'info');
        if (cloudBtn) cloudBtn.textContent = 'Enable Cloud Sync';
        return;
      }

      const success = DataManager.saveCloudConfig(apiKey, binId);
      if (success) {
        showToast('Cloud database settings saved! Syncing now...', 'success');
        if (cloudBtn) cloudBtn.textContent = '🔄 Update Cloud Sync Settings';
        
        // Trigger initial cloud push to upload current data to the bin
        const currentData = DataManager.loadData();
        DataManager.syncToCloud(currentData).then(() => {
          showToast('Data successfully pushed to cloud database!', 'success');
        }).catch((err) => {
          showToast('Failed to push data to cloud. Check API key/Bin ID.', 'error');
        });
      } else {
        showToast('Failed to save settings.', 'error');
      }
    });
  }
}

/* ========== UTILITY ========== */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/* ========== MESSAGES INBOX ========== */
function renderMessagesSection() {
  const list = document.getElementById('messages-list');
  if (!list) return;

  const messages = getMessages();

  // Update sidebar badge
  updateMsgBadge();

  if (!messages.length) {
    list.innerHTML = `
      <div class="item-empty">
        <span class="item-empty-icon">📭</span>
        <p>No messages yet. When someone fills out the contact form, their messages appear here.</p>
      </div>`;
    return;
  }

  list.innerHTML = messages.map((msg, idx) => `
    <div class="item-card msg-card${msg.read ? '' : ' msg-card--unread'}" data-msg-id="${msg.id}" style="flex-direction:column;align-items:stretch;gap:10px;">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
        <div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0;">
          ${!msg.read ? '<span style="width:8px;height:8px;border-radius:50%;background:var(--admin-accent);flex-shrink:0;box-shadow:0 0 6px var(--admin-accent)"></span>' : '<span style="width:8px;height:8px;flex-shrink:0"></span>'}
          <div style="min-width:0;flex:1">
            <div class="item-title" style="font-size:14px">${escapeHtml(msg.name)} <span style="color:var(--text-muted);font-weight:400;font-size:12px">&lt;${escapeHtml(msg.email)}&gt;</span></div>
            <div class="item-subtitle">${escapeHtml(msg.subject || '(No subject)')}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
          <span style="font-size:11px;color:var(--text-muted)">${formatMsgDate(msg.date)}</span>
          <button class="admin-btn admin-btn-icon" onclick="deleteSingleMessage(${msg.id})" title="Delete" style="color:var(--admin-red)">🗑</button>
        </div>
      </div>
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:12px;font-size:13.5px;color:var(--text-secondary);line-height:1.6;white-space:pre-wrap">${escapeHtml(msg.message)}</div>
    </div>
  `).join('');

  // Mark all as read
  const updated = messages.map(m => ({ ...m, read: true }));
  localStorage.setItem('portfolio_messages', JSON.stringify(updated));
  updateMsgBadge();
}

function getMessages() {
  try { return JSON.parse(localStorage.getItem('portfolio_messages') || '[]'); }
  catch { return []; }
}

function updateMsgBadge() {
  const badge = document.getElementById('sidebar-msg-badge');
  if (!badge) return;
  const unread = getMessages().filter(m => !m.read).length;
  if (unread > 0) {
    badge.textContent = unread;
    badge.style.display = 'inline';
  } else {
    badge.style.display = 'none';
  }
}

function formatMsgDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }) +
           ' ' + d.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' });
  } catch { return iso || ''; }
}

window.deleteSingleMessage = function(id) {
  const msgs = getMessages().filter(m => m.id !== id);
  localStorage.setItem('portfolio_messages', JSON.stringify(msgs));
  renderMessagesSection();
};

window.adminClearMessages = async function() {
  const confirmed = await showModal('Clear All Messages', 'This will permanently delete all received messages. Are you sure?');
  if (confirmed) {
    localStorage.removeItem('portfolio_messages');
    renderMessagesSection();
    showToast('All messages cleared', 'success');
  }
};

