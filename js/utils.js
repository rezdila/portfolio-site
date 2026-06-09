// js/utils.js
// Shared utility functions used across the portfolio site.

/* ================================================================== */
/*  Timing helpers                                                     */
/* ================================================================== */

/**
 * Standard debounce — delays invoking `fn` until `delay` ms have elapsed
 * since the last call.
 */
export function debounce(fn, delay = 300) {
  let timerId = null;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Standard throttle — ensures `fn` fires at most once per `limit` ms.
 */
export function throttle(fn, limit = 200) {
  let inThrottle = false;
  let lastArgs = null;
  let lastContext = null;

  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          fn.apply(lastContext, lastArgs);
          lastArgs = null;
          lastContext = null;
        }
      }, limit);
    } else {
      lastArgs = args;
      lastContext = this;
    }
  };
}

/* ================================================================== */
/*  YouTube helpers                                                    */
/* ================================================================== */

/**
 * Extract a YouTube video ID from various URL formats:
 *   - https://www.youtube.com/watch?v=VIDEO_ID
 *   - https://youtu.be/VIDEO_ID
 *   - https://www.youtube.com/embed/VIDEO_ID
 *   - https://www.youtube.com/v/VIDEO_ID
 *   - https://www.youtube.com/shorts/VIDEO_ID
 *
 * Returns the video ID string or null.
 */
export function parseYouTubeUrl(url) {
  if (!url || typeof url !== 'string') return null;

  const patterns = [
    /(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }

  return null;
}

/**
 * Create an iframe DOM element that embeds the given YouTube video.
 */
export function createYouTubeEmbed(videoId) {
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  iframe.width = '100%';
  iframe.height = '100%';
  iframe.frameBorder = '0';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  iframe.style.borderRadius = '12px';
  return iframe;
}

/* ================================================================== */
/*  Formatting helpers                                                 */
/* ================================================================== */

/**
 * Format a date string into a human-friendly representation.
 * Accepts ISO strings, "YYYY", "YYYY-MM", or anything Date can parse.
 */
export function formatDate(dateString) {
  if (!dateString) return '';

  // If it looks like just a year, return as-is
  if (/^\d{4}$/.test(dateString.trim())) return dateString.trim();

  // Year-month only
  if (/^\d{4}-\d{2}$/.test(dateString.trim())) {
    const [y, m] = dateString.trim().split('-');
    const d = new Date(Number(y), Number(m) - 1);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // unparseable — return raw
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Create a URL-safe slug from arbitrary text.
 */
export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncate text to `maxLength` characters, appending an ellipsis if truncated.
 */
export function truncateText(text, maxLength = 120) {
  if (!text || text.length <= maxLength) return text || '';
  return text.slice(0, maxLength).trimEnd() + '…';
}

/* ================================================================== */
/*  Animation helpers                                                  */
/* ================================================================== */

/**
 * Animate a numeric counter inside `element` from `start` to `end`
 * over `duration` ms using requestAnimationFrame.
 */
export function animateCounter(element, start, end, duration = 1500) {
  if (!element) return;

  const range = end - start;
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + range * eased);
    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

/* ================================================================== */
/*  Viewport / scroll                                                  */
/* ================================================================== */

/**
 * Returns `true` if `element` is currently within the visible viewport.
 * An optional `threshold` (0–1) controls how much of the element must
 * be visible (0 = any part, 1 = fully visible).
 */
export function isInViewport(element, threshold = 0) {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
  const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0);

  if (threshold === 0) {
    return visibleHeight > 0 && visibleWidth > 0;
  }

  const elementArea = rect.width * rect.height;
  if (elementArea === 0) return false;
  const visibleArea = Math.max(0, visibleHeight) * Math.max(0, visibleWidth);
  return visibleArea / elementArea >= threshold;
}

/**
 * Smoothly scroll the page so the element with `elementId` is in view.
 */
export function smoothScrollTo(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ================================================================== */
/*  Toast notifications                                                */
/* ================================================================== */

let toastContainer = null;

function ensureToastContainer() {
  if (toastContainer && document.body.contains(toastContainer)) return;

  toastContainer = document.createElement('div');
  toastContainer.id = 'toast-container';
  Object.assign(toastContainer.style, {
    position: 'fixed',
    top: '24px',
    right: '24px',
    zIndex: '10000',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    pointerEvents: 'none',
  });
  document.body.appendChild(toastContainer);
}

const TOAST_COLORS = {
  success: { bg: 'rgba(52,211,153,0.15)', border: '#34d399', icon: '✓' },
  error:   { bg: 'rgba(248,113,113,0.15)', border: '#f87171', icon: '✕' },
  info:    { bg: 'rgba(0,212,255,0.15)',    border: '#00d4ff', icon: 'ℹ' },
  warning: { bg: 'rgba(251,191,36,0.15)',   border: '#fbbf24', icon: '⚠' },
};

/**
 * Show a toast notification.
 * @param {string} message  – text to display
 * @param {'success'|'error'|'info'|'warning'} type
 * @param {number} duration – auto-dismiss time in ms (default 3500)
 */
export function showToast(message, type = 'info', duration = 3500) {
  ensureToastContainer();

  const colors = TOAST_COLORS[type] || TOAST_COLORS.info;

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  Object.assign(toast.style, {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 22px',
    borderRadius: '12px',
    background: colors.bg,
    border: `1px solid ${colors.border}`,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    color: '#e2e8f0',
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    lineHeight: '1.4',
    pointerEvents: 'auto',
    opacity: '0',
    transform: 'translateX(40px)',
    transition: 'opacity 0.35s ease, transform 0.35s ease',
    maxWidth: '380px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  });

  const iconSpan = document.createElement('span');
  iconSpan.textContent = colors.icon;
  Object.assign(iconSpan.style, {
    fontSize: '16px',
    fontWeight: '700',
    color: colors.border,
    flexShrink: '0',
  });

  const textSpan = document.createElement('span');
  textSpan.textContent = message;

  toast.appendChild(iconSpan);
  toast.appendChild(textSpan);
  toastContainer.appendChild(toast);

  // Trigger enter animation
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  });

  // Auto-dismiss
  const dismiss = () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    setTimeout(() => toast.remove(), 350);
  };

  const timer = setTimeout(dismiss, duration);

  // Click to dismiss early
  toast.addEventListener('click', () => {
    clearTimeout(timer);
    dismiss();
  });
  toast.style.cursor = 'pointer';
}

/* ================================================================== */
/*  Lightbox                                                           */
/* ================================================================== */

let activeLightbox = null;

/**
 * Create and display a lightbox overlay for images, PDFs, videos, or
 * YouTube embeds.
 *
 * @param {string} content – URL or YouTube video ID
 * @param {'image'|'pdf'|'video'|'youtube'} type
 */
export function createLightbox(content, type = 'image') {
  // Close any existing lightbox first
  closeLightbox();

  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  Object.assign(overlay.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '9999',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(5, 7, 20, 0.88)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    opacity: '0',
    transition: 'opacity 0.3s ease',
    cursor: 'zoom-out',
  });

  const inner = document.createElement('div');
  Object.assign(inner.style, {
    position: 'relative',
    maxWidth: '90vw',
    maxHeight: '90vh',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
    transform: 'scale(0.92)',
    transition: 'transform 0.3s ease',
  });

  // Build the appropriate media element
  let mediaEl;

  switch (type) {
    case 'image': {
      mediaEl = document.createElement('img');
      mediaEl.src = content;
      mediaEl.alt = 'Lightbox image';
      Object.assign(mediaEl.style, {
        display: 'block',
        maxWidth: '90vw',
        maxHeight: '85vh',
        objectFit: 'contain',
        borderRadius: '12px',
      });
      break;
    }
    case 'pdf': {
      mediaEl = document.createElement('iframe');
      let pdfUrl = content;
      if (content.startsWith('data:')) {
        try {
          const blob = dataURLtoBlob(content);
          pdfUrl = URL.createObjectURL(blob);
          overlay.dataset.pdfBlobUrl = pdfUrl;
        } catch (e) {
          console.error('[Lightbox] Failed to convert data URL to blob URL:', e);
        }
      }
      mediaEl.src = pdfUrl;
      Object.assign(mediaEl.style, {
        width: '80vw',
        height: '85vh',
        border: 'none',
        borderRadius: '12px',
        background: '#fff',
      });
      break;
    }
    case 'video': {
      mediaEl = document.createElement('video');
      mediaEl.src = content;
      mediaEl.controls = true;
      mediaEl.autoplay = true;
      Object.assign(mediaEl.style, {
        maxWidth: '85vw',
        maxHeight: '80vh',
        borderRadius: '12px',
        outline: 'none',
      });
      break;
    }
    case 'youtube': {
      const videoId = content.length === 11 ? content : parseYouTubeUrl(content);
      if (videoId) {
        mediaEl = createYouTubeEmbed(videoId);
        Object.assign(mediaEl.style, {
          width: '80vw',
          height: '45vw',
          maxHeight: '80vh',
          borderRadius: '12px',
        });
      }
      break;
    }
    default:
      break;
  }

  if (mediaEl) {
    inner.appendChild(mediaEl);
  }

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.setAttribute('aria-label', 'Close lightbox');
  Object.assign(closeBtn.style, {
    position: 'absolute',
    top: '12px',
    right: '16px',
    background: 'rgba(0,0,0,0.5)',
    border: 'none',
    color: '#fff',
    fontSize: '28px',
    lineHeight: '1',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
    zIndex: '1',
  });
  closeBtn.addEventListener('mouseenter', () => (closeBtn.style.background = 'rgba(0,0,0,0.8)'));
  closeBtn.addEventListener('mouseleave', () => (closeBtn.style.background = 'rgba(0,0,0,0.5)'));
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });
  inner.appendChild(closeBtn);

  overlay.appendChild(inner);
  document.body.appendChild(overlay);
  activeLightbox = overlay;

  // Prevent body scroll
  document.body.style.overflow = 'hidden';

  // Animate in
  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
    inner.style.transform = 'scale(1)';
  });

  // Click overlay background to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });

  // Escape key to close
  const onKey = (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      document.removeEventListener('keydown', onKey);
    }
  };
  document.addEventListener('keydown', onKey);
}

/**
 * Close the currently active lightbox, if any.
 */
export function closeLightbox() {
  if (!activeLightbox) return;
  const lb = activeLightbox;
  activeLightbox = null;
  lb.style.opacity = '0';
  document.body.style.overflow = '';

  if (lb.dataset.pdfBlobUrl) {
    try {
      URL.revokeObjectURL(lb.dataset.pdfBlobUrl);
    } catch (e) {
      console.warn('[Lightbox] Failed to revoke blob URL:', e);
    }
  }

  setTimeout(() => lb.remove(), 300);
}

/* ================================================================== */
/*  File helpers                                                       */
/* ================================================================== */

/**
 * Read a File object and return its content as a base64 data URL.
 * Returns a Promise<string>.
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file || !(file instanceof File || file instanceof Blob)) {
      reject(new Error('Invalid file.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Determine a friendly file-type category from a filename or extension.
 * Returns 'image' | 'pdf' | 'video' | 'document' | 'unknown'.
 */
export function getFileType(filename) {
  if (!filename || typeof filename !== 'string') return 'unknown';

  const ext = filename.split('.').pop().toLowerCase();

  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'avif'];
  const videoExts = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];
  const docExts = ['doc', 'docx', 'txt', 'rtf', 'odt', 'xls', 'xlsx', 'ppt', 'pptx'];

  if (imageExts.includes(ext)) return 'image';
  if (ext === 'pdf') return 'pdf';
  if (videoExts.includes(ext)) return 'video';
  if (docExts.includes(ext)) return 'document';
  return 'unknown';
}

/* ================================================================== */
/*  Background decoration                                              */
/* ================================================================== */

/**
 * Generate small "star" elements and append them to `container`.
 * Stars are absolutely-positioned tiny circles with random placement
 * and a gentle twinkle animation class.
 */
export function generateStars(count, container) {
  if (!container) return;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'bg-star';

    const size = Math.random() * 2.5 + 0.5; // 0.5 – 3px
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = Math.random() * 3 + 2; // 2 – 5s
    const opacity = Math.random() * 0.6 + 0.15; // 0.15 – 0.75

    Object.assign(star.style, {
      position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
      left: `${x}%`,
      top: `${y}%`,
      borderRadius: '50%',
      background: '#fff',
      opacity: String(opacity),
      animation: `twinkle ${duration}s ${delay}s ease-in-out infinite alternate`,
      pointerEvents: 'none',
    });

    fragment.appendChild(star);
  }

  container.appendChild(fragment);
}

/**
 * Compress an image file using HTML5 Canvas.
 * Returns a Promise<string> containing the compressed base64 data URL (JPEG format).
 * @param {File|Blob} file
 * @param {number} maxWidth
 * @param {number} quality
 * @returns {Promise<string>}
 */
export function compressImage(file, maxWidth = 1200, quality = 0.75) {
  return new Promise((resolve, reject) => {
    if (!file || !(file instanceof File || file instanceof Blob)) {
      reject(new Error('Invalid file.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to base64 jpeg with quality compression
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image.'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Convert a base64 data URL to a Blob object.
 * @param {string} dataUrl
 * @returns {Blob}
 */
export function dataURLtoBlob(dataUrl) {
  const parts = dataUrl.split(',');
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
