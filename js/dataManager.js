// js/dataManager.js
// Centralised CRUD layer that persists portfolio data in localStorage.

import { defaultPortfolioData } from './data.js';

const STORAGE_KEY = 'yuresh_portfolio_data';

/* ------------------------------------------------------------------ */
/*  Internal helpers                                                   */
/* ------------------------------------------------------------------ */

/**
 * Deep-merge `source` into `target`.
 * Arrays are replaced wholesale (no element-level merge).
 * Plain objects are merged recursively so new default keys are picked up
 * without overwriting user-edited values.
 */
function deepMerge(target, source) {
  const output = { ...target };

  for (const key of Object.keys(source)) {
    const srcVal = source[key];
    const tgtVal = target[key];

    if (Array.isArray(srcVal)) {
      // For arrays: if the target array is empty (or missing), fall back to source defaults
      // This ensures default data shows when localStorage has empty arrays
      if (!Array.isArray(tgtVal) || tgtVal.length === 0) {
        output[key] = srcVal;
      }
      // else: keep the user's non-empty array as-is
    } else if (
      srcVal !== null &&
      typeof srcVal === 'object' &&
      tgtVal !== null &&
      typeof tgtVal === 'object' &&
      !Array.isArray(tgtVal)
    ) {
      output[key] = deepMerge(tgtVal, srcVal);
    } else if (!(key in target)) {
      // Only add keys from source (defaults) that are missing in target
      output[key] = srcVal;
    }
  }

  return output;
}

/**
 * Return a deep clone of a value using structuredClone (modern browsers)
 * with a JSON round-trip fallback.
 */
function clone(value) {
  try {
    return structuredClone(value);
  } catch {
    return JSON.parse(JSON.stringify(value));
  }
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export const DataManager = {

  /* ---------- Core load / save ------------------------------------ */

  /**
   * Load data from localStorage, deep-merging with defaults so that
   * newly-added schema keys are always present.
   */
  loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return clone(defaultPortfolioData);
      }
      let parsed = JSON.parse(stored);
      let migrated = false;

      // Auto-migrate from old placeholder path to the new profile picture
      if (parsed.personal && (
        parsed.personal.profileImage === 'assets/images/profile-placeholder.png' ||
        parsed.personal.profileImage === '/assets/images/profile-placeholder.png' ||
        parsed.personal.profileImage === 'assets/images/profile-placeholder.jpeg'
      )) {
        parsed.personal.profileImage = 'assets/images/profile.png';
        migrated = true;
      }

      // Remove placeholder qualification items from stored data
      const isPlaceholder = (item) =>
        item.title && (
          item.title.toLowerCase().includes('add your') ||
          item.title.toLowerCase().includes('placeholder')
        );

      if (Array.isArray(parsed.professionalQualifications)) {
        const filtered = parsed.professionalQualifications.filter(q => !isPlaceholder(q));
        if (filtered.length !== parsed.professionalQualifications.length) {
          parsed.professionalQualifications = filtered;
          migrated = true;
        }
      }

      if (Array.isArray(parsed.vocationalQualifications)) {
        const filtered = parsed.vocationalQualifications.filter(q => !isPlaceholder(q));
        if (filtered.length !== parsed.vocationalQualifications.length) {
          parsed.vocationalQualifications = filtered;
          migrated = true;
        }
      }

      // Auto-migrate Poya Congestion Analysis project to Mathematics category
      if (Array.isArray(parsed.projects)) {
        const proj2 = parsed.projects.find(p => p.id === 'proj-2');
        if (proj2 && proj2.category === 'Data Science') {
          proj2.category = 'Mathematics';
          migrated = true;
        }
      }

      if (migrated) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }

      // Merge stored data onto defaults – stored values win, but any new
      // default keys that don't exist in stored data will appear.
      return deepMerge(parsed, defaultPortfolioData);
    } catch (err) {
      console.error('[DataManager] Failed to load data, returning defaults:', err);
      return clone(defaultPortfolioData);
    }
  },

  saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      this.syncToCloud(data);
      return true;
    } catch (err) {
      console.error('[DataManager] Failed to save data:', err);
      return false;
    }
  },

  getCloudConfig() {
    try {
      const stored = localStorage.getItem('yuresh_portfolio_cloud_keys');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return { apiKey: '', binId: '' };
  },

  saveCloudConfig(apiKey, binId) {
    try {
      localStorage.setItem('yuresh_portfolio_cloud_keys', JSON.stringify({ apiKey, binId }));
      return true;
    } catch (e) {
      return false;
    }
  },

  async initCloud() {
    const config = this.getCloudConfig();
    if (!config.apiKey || !config.binId) {
      console.log('[DataManager] Cloud sync not configured. Using local storage.');
      return false;
    }

    try {
      console.log('[DataManager] Initializing cloud sync from JSONBin...');
      const response = await fetch(`https://api.jsonbin.io/v3/b/${config.binId}/latest?meta=false`, {
        method: 'GET',
        headers: {
          'X-Master-Key': config.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Cloud API returned status ${response.status}`);
      }

      const cloudData = await response.json();
      if (cloudData && typeof cloudData === 'object') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
        console.log('[DataManager] Cloud sync successfully cached locally.');
        return true;
      }
    } catch (err) {
      console.error('[DataManager] Failed to fetch data from cloud, using cached local data:', err);
    }
    return false;
  },

  async syncToCloud(data) {
    const config = this.getCloudConfig();
    if (!config.apiKey || !config.binId) return;

    try {
      console.log('[DataManager] Syncing changes to JSONBin...');
      const response = await fetch(`https://api.jsonbin.io/v3/b/${config.binId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': config.apiKey
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Cloud API returned status ${response.status}`);
      }
      console.log('[DataManager] Successfully synced changes to cloud.');
    } catch (err) {
      console.error('[DataManager] Failed to sync changes to cloud:', err);
    }
  },

  /* ---------- Section-level access -------------------------------- */

  /**
   * Return a cloned copy of a top-level section.
   * Supports dot-notation for nested keys, e.g. "goals.smart".
   */
  getSection(sectionKey) {
    const data = this.loadData();
    const keys = sectionKey.split('.');
    let result = data;
    for (const k of keys) {
      if (result == null || typeof result !== 'object') return undefined;
      result = result[k];
    }
    return clone(result);
  },

  /**
   * Replace an entire section and persist.
   * Supports dot-notation for nested keys.
   */
  updateSection(sectionKey, sectionData) {
    const data = this.loadData();
    const keys = sectionKey.split('.');
    let target = data;
    for (let i = 0; i < keys.length - 1; i++) {
      if (target[keys[i]] == null || typeof target[keys[i]] !== 'object') {
        target[keys[i]] = {};
      }
      target = target[keys[i]];
    }
    target[keys[keys.length - 1]] = sectionData;
    this.saveData(data);
    return data;
  },

  /* ---------- Item-level CRUD (array sections) -------------------- */

  /**
   * Push a new item into an array section.
   * Returns the updated array.
   */
  addItem(sectionKey, item) {
    const data = this.loadData();
    const keys = sectionKey.split('.');
    let target = data;
    for (const k of keys) {
      target = target[k];
    }
    if (!Array.isArray(target)) {
      console.error(`[DataManager] Section "${sectionKey}" is not an array.`);
      return null;
    }
    target.push(item);
    this.saveData(data);
    return clone(target);
  },

  /**
   * Update an existing item inside an array section, matched by `id`.
   */
  updateItem(sectionKey, itemId, updatedFields) {
    const data = this.loadData();
    const keys = sectionKey.split('.');
    let target = data;
    for (const k of keys) {
      target = target[k];
    }
    if (!Array.isArray(target)) {
      console.error(`[DataManager] Section "${sectionKey}" is not an array.`);
      return null;
    }
    const index = target.findIndex((item) => item.id === itemId);
    if (index === -1) {
      console.warn(`[DataManager] Item "${itemId}" not found in "${sectionKey}".`);
      return null;
    }
    target[index] = { ...target[index], ...updatedFields };
    this.saveData(data);
    return clone(target[index]);
  },

  /**
   * Remove an item from an array section by `id`.
   */
  deleteItem(sectionKey, itemId) {
    const data = this.loadData();
    const keys = sectionKey.split('.');
    let target = data;
    let parent = data;
    let lastKey = keys[0];

    for (let i = 0; i < keys.length; i++) {
      if (i === keys.length - 1) {
        lastKey = keys[i];
      } else {
        parent = parent[keys[i]];
      }
      target = i === 0 ? data[keys[i]] : target[keys[i - (keys.length - 1 - i >= 0 ? 0 : 0)]];
    }

    // Re-traverse cleanly
    target = data;
    parent = null;
    for (let i = 0; i < keys.length; i++) {
      parent = target;
      target = target[keys[i]];
      lastKey = keys[i];
    }

    if (!Array.isArray(target)) {
      console.error(`[DataManager] Section "${sectionKey}" is not an array.`);
      return false;
    }
    const lengthBefore = target.length;
    const filtered = target.filter((item) => item.id !== itemId);
    if (filtered.length === lengthBefore) {
      console.warn(`[DataManager] Item "${itemId}" not found in "${sectionKey}".`);
      return false;
    }
    parent[lastKey] = filtered;
    this.saveData(data);
    return true;
  },

  /* ---------- ID generation --------------------------------------- */

  /**
   * Generate a unique ID with the given prefix, e.g. "sk-17a3b".
   */
  generateId(prefix = 'item') {
    const random = Math.random().toString(36).substring(2, 9);
    const timestamp = Date.now().toString(36);
    return `${prefix}-${timestamp}${random}`;
  },

  /* ---------- Import / Export ------------------------------------- */

  /**
   * Download the current data as a timestamped JSON file.
   */
  exportData() {
    const data = this.loadData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const now = new Date();
    const stamp = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
      String(now.getHours()).padStart(2, '0'),
      String(now.getMinutes()).padStart(2, '0'),
    ].join('');

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `portfolio-data-${stamp}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  },

  /**
   * Import data from a JSON File object.
   * Returns a Promise that resolves with the imported data or rejects on error.
   */
  importData(file) {
    return new Promise((resolve, reject) => {
      if (!file || !(file instanceof File)) {
        reject(new Error('Invalid file provided.'));
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);

          // Basic validation — must be an object with at least a "personal" key
          if (typeof imported !== 'object' || imported === null || !imported.personal) {
            reject(new Error('Invalid portfolio data format.'));
            return;
          }

          // Merge with defaults so missing keys are filled in
          const merged = deepMerge(imported, defaultPortfolioData);
          this.saveData(merged);
          resolve(merged);
        } catch (err) {
          reject(new Error('Failed to parse JSON: ' + err.message));
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file.'));
      reader.readAsText(file);
    });
  },

  /* ---------- Proof management ------------------------------------ */

  /**
   * Add a proof object to an item within an array section, or to a
   * plain-object section that has a `proofs` array (e.g. personality).
   *
   * proof shape: { type: 'image'|'pdf'|'video'|'youtube', url: string, name: string, thumbnail?: string }
   */
  addProof(sectionKey, itemId, proof) {
    const data = this.loadData();
    const keys = sectionKey.split('.');
    let section = data;
    for (const k of keys) {
      section = section[k];
    }

    // If section is an array, find item by id
    if (Array.isArray(section)) {
      const item = section.find((i) => i.id === itemId);
      if (!item) {
        console.warn(`[DataManager] Item "${itemId}" not found in "${sectionKey}".`);
        return false;
      }
      if (!Array.isArray(item.proofs)) {
        item.proofs = [];
      }
      item.proofs.push(proof);
    } else if (section && typeof section === 'object') {
      // Plain object section (e.g. personality)
      if (!Array.isArray(section.proofs)) {
        section.proofs = [];
      }
      section.proofs.push(proof);
    } else {
      console.error(`[DataManager] Cannot add proof to "${sectionKey}".`);
      return false;
    }

    return this.saveData(data);
  },

  /**
   * Remove a proof by index from an item or plain-object section.
   */
  removeProof(sectionKey, itemId, proofIndex) {
    const data = this.loadData();
    const keys = sectionKey.split('.');
    let section = data;
    for (const k of keys) {
      section = section[k];
    }

    let proofs = null;

    if (Array.isArray(section)) {
      const item = section.find((i) => i.id === itemId);
      if (!item) {
        console.warn(`[DataManager] Item "${itemId}" not found in "${sectionKey}".`);
        return false;
      }
      proofs = item.proofs;
    } else if (section && typeof section === 'object') {
      proofs = section.proofs;
    }

    if (!Array.isArray(proofs) || proofIndex < 0 || proofIndex >= proofs.length) {
      console.warn('[DataManager] Invalid proof index.');
      return false;
    }

    proofs.splice(proofIndex, 1);
    return this.saveData(data);
  },

  /* ---------- Reset ----------------------------------------------- */

  /**
   * Reset all data back to defaults.
   */
  resetData() {
    const defaults = clone(defaultPortfolioData);
    this.saveData(defaults);
    return defaults;
  },

  /* ---------- Authentication -------------------------------------- */

  /**
   * Verify a password against the stored admin password.
   */
  verifyPassword(password) {
    const data = this.loadData();
    return data.adminPassword === password;
  },

  /**
   * Update the admin password.
   */
  updatePassword(newPassword) {
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 4) {
      console.warn('[DataManager] Password must be at least 4 characters.');
      return false;
    }
    const data = this.loadData();
    data.adminPassword = newPassword;
    this.saveData(data);
    return true;
  },
};
