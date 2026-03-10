/* ============================================================
   Living Word Ministry – Men's Ministry Membership Form
   Frontend Logic & Validation
   ============================================================ */

const BACKEND_URL = 'http://localhost:5000/submit'; // ← change to your deployed URL

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  // Default signature date to today
  const sigDateEl = document.getElementById('signature_date');
  if (sigDateEl) {
    sigDateEl.value = new Date().toISOString().split('T')[0];
  }

  // Attach live validation listeners
  Object.keys(RULES).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur',  () => validateField(id));
    el.addEventListener('input', () => {
      if (el.classList.contains('invalid')) validateField(id);
    });
  });

  // Form submit
  const form = document.getElementById('memberForm');
  if (form) form.addEventListener('submit', handleSubmit);
});

/* ── VALIDATION RULES ── */
const RULES = {
  full_name:        v => v.trim().length >= 2,
  dob:              v => /^\d{1,2}\s*[\/\-]\s*\d{1,2}$/.test(v.trim()),
  marital_status:   v => v !== '',
  phone:            v => /^[+\d\s\-]{7,}$/.test(v.trim()),
  email:            v => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  address:          v => v.trim().length >= 5,
  date_joined:      v => v !== '',
  emergency_name:   v => v.trim().length >= 2,
  emergency_number: v => /^[+\d\s\-]{7,}$/.test(v.trim()),
  member_signature: v => v.trim().length >= 2,
};

/**
 * Validate a single field by id.
 * @param {string} id
 * @returns {boolean} true if valid
 */
function validateField(id) {
  const el  = document.getElementById(id);
  const err = document.getElementById('err_' + id);
  if (!el || !RULES[id]) return true;

  const ok = RULES[id](el.value);
  el.classList.toggle('invalid', !ok);
  if (err) err.classList.toggle('show', !ok);
  return ok;
}

/**
 * Validate all fields and return overall validity.
 * @returns {boolean}
 */
function validateAll() {
  let valid = true;
  Object.keys(RULES).forEach(id => {
    if (!validateField(id)) valid = false;
  });
  return valid;
}

/* ── FORM SUBMIT ── */
async function handleSubmit(e) {
  e.preventDefault();

  if (!validateAll()) {
    showToast('Please correct the highlighted fields.', 'error');
    document.querySelector('.invalid')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Collect field values
  const fields = [
    'full_name', 'dob', 'marital_status', 'phone', 'email', 'address',
    'occupation', 'department', 'date_joined', 'emergency_name', 'emergency_number',
    'member_signature', 'signature_date', 'approved_by', 'approver_signature',
  ];
  const data = {};
  fields.forEach(k => {
    const el = document.getElementById(k);
    data[k] = el ? el.value : '';
  });

  // Loading state
  const btn     = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  btn.disabled = true;
  btn.classList.add('loading');
  btnText.textContent = 'Submitting…';

  try {
    const res  = await fetch(BACKEND_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    });
    const json = await res.json();

    if (res.ok && json.success) {
      document.getElementById('successOverlay').classList.add('show');
    } else {
      showToast(json.message || 'Submission failed. Please try again.', 'error');
    }
  } catch (err) {
    console.error('Submit error:', err);
    showToast('Network error. Please check your connection and try again.', 'error');
  } finally {
    btn.disabled = false;
    btn.classList.remove('loading');
    btnText.textContent = 'Submit Application';
  }
}

/* ── RESET FORM ── */
function resetForm() {
  const form = document.getElementById('memberForm');
  if (form) form.reset();

  // Restore today's date
  const sigDateEl = document.getElementById('signature_date');
  if (sigDateEl) sigDateEl.value = new Date().toISOString().split('T')[0];

  // Clear validation states
  document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
  document.querySelectorAll('.err.show').forEach(el => el.classList.remove('show'));
}

/* ── NEW FORM (after success) ── */
function newForm() {
  document.getElementById('successOverlay').classList.remove('show');
  resetForm();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── TOAST ── */
/**
 * Show a toast notification.
 * @param {string} msg
 * @param {'success'|'error'} type
 */
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className   = 'toast ' + type;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4500);
}
