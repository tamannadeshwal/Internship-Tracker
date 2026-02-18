/* ============================================================
   STUDENT INTERNSHIP & PROBLEM TRACKING SYSTEM
   Shared Form Validation – validation.js
   ============================================================ */

'use strict';

// ── Utility Helpers ──────────────────────────────────────────

/**
 * Show an error message for a field.
 * @param {HTMLElement} field
 * @param {string} message
 */
function showError(field, message) {
  field.classList.add('error');
  field.classList.remove('success');
  const errEl = field.closest('.form-group')?.querySelector('.error-msg');
  if (errEl) {
    errEl.textContent = message;
    errEl.classList.add('visible');
  }
}

/**
 * Clear error state on a field.
 * @param {HTMLElement} field
 */
function clearError(field) {
  field.classList.remove('error');
  field.classList.add('success');
  const errEl = field.closest('.form-group')?.querySelector('.error-msg');
  if (errEl) errEl.classList.remove('visible');
}

/**
 * Reset all fields in a form to neutral state.
 * @param {HTMLFormElement} form
 */
function resetFormState(form) {
  form.querySelectorAll('.form-control').forEach(f => {
    f.classList.remove('error', 'success');
    const errEl = f.closest('.form-group')?.querySelector('.error-msg');
    if (errEl) errEl.classList.remove('visible');
  });
}

/**
 * Show an alert banner.
 * @param {string} alertId
 * @param {string} type  'success' | 'error' | 'info'
 * @param {string} message
 */
function showAlert(alertId, type, message) {
  const el = document.getElementById(alertId);
  if (!el) return;
  el.className = `alert alert-${type} visible`;
  el.innerHTML = `<span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span> ${message}`;
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  if (type === 'success') {
    setTimeout(() => el.classList.remove('visible'), 5000);
  }
}

// ── Validators ───────────────────────────────────────────────

const Validators = {
  required(value) {
    return value.trim().length > 0;
  },
  email(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  },
  minLength(value, min) {
    return value.trim().length >= min;
  },
  maxLength(value, max) {
    return value.trim().length <= max;
  },
  numeric(value) {
    return /^\d+(\.\d+)?$/.test(value.trim());
  },
  positiveNumber(value) {
    return Validators.numeric(value) && parseFloat(value) > 0;
  },
  passwordMatch(pass, confirm) {
    return pass === confirm;
  },
  dateRange(startVal, endVal) {
    if (!startVal || !endVal) return false;
    return new Date(endVal) >= new Date(startVal);
  },
  studentId(value) {
    // Alphanumeric, 4-20 chars
    return /^[A-Za-z0-9]{4,20}$/.test(value.trim());
  },
  phone(value) {
    return /^[\d\s\-\+\(\)]{7,15}$/.test(value.trim());
  }
};

// ── Real-time Validation Binding ─────────────────────────────

/**
 * Attach live validation to a field.
 * @param {HTMLElement} field
 * @param {Function} validateFn  Returns true if valid
 * @param {string} errorMsg
 */
function bindLiveValidation(field, validateFn, errorMsg) {
  const check = () => {
    if (validateFn(field.value)) {
      clearError(field);
    } else {
      showError(field, errorMsg);
    }
  };
  field.addEventListener('blur', check);
  field.addEventListener('input', () => {
    if (field.classList.contains('error')) check();
  });
}

// ── Registration Form Validation ─────────────────────────────

function validateRegistrationForm() {
  const form = document.getElementById('registrationForm');
  if (!form) return;

  const fields = {
    fullName:        form.querySelector('[name="fullName"]'),
    studentId:       form.querySelector('[name="studentId"]'),
    email:           form.querySelector('[name="email"]'),
    department:      form.querySelector('[name="department"]'),
    yearOfStudy:     form.querySelector('[name="yearOfStudy"]'),
    password:        form.querySelector('[name="password"]'),
    confirmPassword: form.querySelector('[name="confirmPassword"]'),
  };

  // Live validation
  if (fields.fullName)
    bindLiveValidation(fields.fullName, v => Validators.required(v) && Validators.minLength(v, 3), 'Full name must be at least 3 characters.');
  if (fields.studentId)
    bindLiveValidation(fields.studentId, v => Validators.studentId(v), 'Student ID must be 4–20 alphanumeric characters.');
  if (fields.email)
    bindLiveValidation(fields.email, v => Validators.email(v), 'Please enter a valid email address.');
  if (fields.department)
    bindLiveValidation(fields.department, v => Validators.required(v), 'Please select your department.');
  if (fields.yearOfStudy)
    bindLiveValidation(fields.yearOfStudy, v => Validators.required(v), 'Please select your year of study.');
  if (fields.password)
    bindLiveValidation(fields.password, v => Validators.minLength(v, 8), 'Password must be at least 8 characters.');
  if (fields.confirmPassword)
    bindLiveValidation(fields.confirmPassword, v => Validators.passwordMatch(fields.password?.value || '', v), 'Passwords do not match.');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    resetFormState(form);
    let valid = true;

    if (!fields.fullName || !Validators.required(fields.fullName.value) || !Validators.minLength(fields.fullName.value, 3)) {
      showError(fields.fullName, 'Full name must be at least 3 characters.'); valid = false;
    } else clearError(fields.fullName);

    if (!fields.studentId || !Validators.studentId(fields.studentId.value)) {
      showError(fields.studentId, 'Student ID must be 4–20 alphanumeric characters.'); valid = false;
    } else clearError(fields.studentId);

    if (!fields.email || !Validators.email(fields.email.value)) {
      showError(fields.email, 'Please enter a valid email address.'); valid = false;
    } else clearError(fields.email);

    if (!fields.department || !Validators.required(fields.department.value)) {
      showError(fields.department, 'Please select your department.'); valid = false;
    } else clearError(fields.department);

    if (!fields.yearOfStudy || !Validators.required(fields.yearOfStudy.value)) {
      showError(fields.yearOfStudy, 'Please select your year of study.'); valid = false;
    } else clearError(fields.yearOfStudy);

    if (!fields.password || !Validators.minLength(fields.password.value, 8)) {
      showError(fields.password, 'Password must be at least 8 characters.'); valid = false;
    } else clearError(fields.password);

    if (!fields.confirmPassword || !Validators.passwordMatch(fields.password?.value || '', fields.confirmPassword.value)) {
      showError(fields.confirmPassword, 'Passwords do not match.'); valid = false;
    } else clearError(fields.confirmPassword);

    if (valid) {
      showAlert('formAlert', 'success', 'Registration successful! Redirecting to login…');
      setTimeout(() => { window.location.href = 'login.html'; }, 2000);
    } else {
      showAlert('formAlert', 'error', 'Please fix the errors above before submitting.');
    }
  });
}

// ── Login Form Validation ────────────────────────────────────

function validateLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const identifier = form.querySelector('[name="identifier"]');
  const password   = form.querySelector('[name="password"]');

  if (identifier)
    bindLiveValidation(identifier, v => Validators.required(v), 'Please enter your email or student ID.');
  if (password)
    bindLiveValidation(password, v => Validators.required(v), 'Please enter your password.');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    resetFormState(form);
    let valid = true;

    if (!identifier || !Validators.required(identifier.value)) {
      showError(identifier, 'Please enter your email or student ID.'); valid = false;
    } else clearError(identifier);

    if (!password || !Validators.required(password.value)) {
      showError(password, 'Please enter your password.'); valid = false;
    } else clearError(password);

    if (valid) {
      const role = form.querySelector('[name="role"]:checked')?.value || 'student';
      showAlert('formAlert', 'success', 'Login successful! Redirecting to your dashboard…');
      setTimeout(() => {
        window.location.href = role === 'faculty' ? 'faculty-dashboard.html' : 'student-dashboard.html';
      }, 1500);
    } else {
      showAlert('formAlert', 'error', 'Please fill in all required fields.');
    }
  });
}

// ── Internship Form Validation ───────────────────────────────

function validateInternshipForm() {
  const form = document.getElementById('internshipForm');
  if (!form) return;

  const fields = {
    companyName:     form.querySelector('[name="companyName"]'),
    internshipType:  form.querySelector('[name="internshipType"]'),
    startDate:       form.querySelector('[name="startDate"]'),
    endDate:         form.querySelector('[name="endDate"]'),
    weeklyHours:     form.querySelector('[name="weeklyHours"]'),
    supervisorName:  form.querySelector('[name="supervisorName"]'),
    supervisorEmail: form.querySelector('[name="supervisorEmail"]'),
    description:     form.querySelector('[name="description"]'),
    status:          form.querySelector('[name="status"]'),
  };

  if (fields.companyName)
    bindLiveValidation(fields.companyName, v => Validators.required(v), 'Company name is required.');
  if (fields.internshipType)
    bindLiveValidation(fields.internshipType, v => Validators.required(v), 'Please select internship type.');
  if (fields.startDate)
    bindLiveValidation(fields.startDate, v => Validators.required(v), 'Start date is required.');
  if (fields.endDate)
    bindLiveValidation(fields.endDate, v => {
      if (!Validators.required(v)) return false;
      return Validators.dateRange(fields.startDate?.value, v);
    }, 'End date must be after start date.');
  if (fields.weeklyHours)
    bindLiveValidation(fields.weeklyHours, v => Validators.positiveNumber(v) && parseFloat(v) <= 80, 'Enter valid hours (1–80).');
  if (fields.supervisorName)
    bindLiveValidation(fields.supervisorName, v => Validators.required(v), 'Supervisor name is required.');
  if (fields.supervisorEmail)
    bindLiveValidation(fields.supervisorEmail, v => Validators.email(v), 'Enter a valid supervisor email.');
  if (fields.description)
    bindLiveValidation(fields.description, v => Validators.minLength(v, 20), 'Description must be at least 20 characters.');
  if (fields.status)
    bindLiveValidation(fields.status, v => Validators.required(v), 'Please select internship status.');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    resetFormState(form);
    let valid = true;

    const checks = [
      [fields.companyName,     v => Validators.required(v),                                                    'Company name is required.'],
      [fields.internshipType,  v => Validators.required(v),                                                    'Please select internship type.'],
      [fields.startDate,       v => Validators.required(v),                                                    'Start date is required.'],
      [fields.endDate,         v => Validators.required(v) && Validators.dateRange(fields.startDate?.value, v),'End date must be after start date.'],
      [fields.weeklyHours,     v => Validators.positiveNumber(v) && parseFloat(v) <= 80,                       'Enter valid hours (1–80).'],
      [fields.supervisorName,  v => Validators.required(v),                                                    'Supervisor name is required.'],
      [fields.supervisorEmail, v => Validators.email(v),                                                       'Enter a valid supervisor email.'],
      [fields.description,     v => Validators.minLength(v, 20),                                               'Description must be at least 20 characters.'],
      [fields.status,          v => Validators.required(v),                                                    'Please select internship status.'],
    ];

    checks.forEach(([field, fn, msg]) => {
      if (!field) return;
      if (!fn(field.value)) { showError(field, msg); valid = false; }
      else clearError(field);
    });

    if (valid) {
      showAlert('formAlert', 'success', 'Internship record submitted successfully!');
      setTimeout(() => { window.location.href = 'student-dashboard.html'; }, 2000);
    } else {
      showAlert('formAlert', 'error', 'Please fix the errors above before submitting.');
    }
  });
}

// ── Problem Report Form Validation ──────────────────────────

function validateProblemForm() {
  const form = document.getElementById('problemForm');
  if (!form) return;

  const fields = {
    studentId:          form.querySelector('[name="studentId"]'),
    companyName:        form.querySelector('[name="companyName"]'),
    problemCategory:    form.querySelector('[name="problemCategory"]'),
    priority:           form.querySelector('[name="priority"]'),
    problemTitle:       form.querySelector('[name="problemTitle"]'),
    problemDescription: form.querySelector('[name="problemDescription"]'),
  };

  if (fields.studentId)
    bindLiveValidation(fields.studentId, v => Validators.required(v), 'Student ID is required.');
  if (fields.companyName)
    bindLiveValidation(fields.companyName, v => Validators.required(v), 'Company name is required.');
  if (fields.problemCategory)
    bindLiveValidation(fields.problemCategory, v => Validators.required(v), 'Please select a category.');
  if (fields.priority)
    bindLiveValidation(fields.priority, v => Validators.required(v), 'Please select a priority level.');
  if (fields.problemTitle)
    bindLiveValidation(fields.problemTitle, v => Validators.minLength(v, 5), 'Title must be at least 5 characters.');
  if (fields.problemDescription)
    bindLiveValidation(fields.problemDescription, v => Validators.minLength(v, 30), 'Description must be at least 30 characters.');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    resetFormState(form);
    let valid = true;

    const checks = [
      [fields.studentId,          v => Validators.required(v),        'Student ID is required.'],
      [fields.companyName,        v => Validators.required(v),        'Company name is required.'],
      [fields.problemCategory,    v => Validators.required(v),        'Please select a category.'],
      [fields.priority,           v => Validators.required(v),        'Please select a priority level.'],
      [fields.problemTitle,       v => Validators.minLength(v, 5),    'Title must be at least 5 characters.'],
      [fields.problemDescription, v => Validators.minLength(v, 30),   'Description must be at least 30 characters.'],
    ];

    checks.forEach(([field, fn, msg]) => {
      if (!field) return;
      if (!fn(field.value)) { showError(field, msg); valid = false; }
      else clearError(field);
    });

    if (valid) {
      showAlert('formAlert', 'success', 'Problem report submitted! Our team will review it shortly.');
      setTimeout(() => { window.location.href = 'student-dashboard.html'; }, 2500);
    } else {
      showAlert('formAlert', 'error', 'Please fix the errors above before submitting.');
    }
  });
}

// ── Password Visibility Toggle ───────────────────────────────

function initPasswordToggles() {
  document.querySelectorAll('.input-toggle-btn[data-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.querySelector(btn.dataset.target);
      if (!input) return;
      const isText = input.type === 'text';
      input.type = isText ? 'password' : 'text';
      btn.textContent = isText ? '👁️' : '🙈';
    });
  });
}

// ── File Upload Label ────────────────────────────────────────

function initFileUploads() {
  document.querySelectorAll('.file-upload-area input[type="file"]').forEach(input => {
    input.addEventListener('change', () => {
      const label = input.closest('.file-upload-area')?.querySelector('.file-upload-text');
      if (label && input.files.length > 0) {
        label.textContent = `📎 ${input.files[0].name}`;
      }
    });
  });
}

// ── Table Search ─────────────────────────────────────────────

function initTableSearch(inputId, tableId) {
  const input = document.getElementById(inputId);
  const table = document.getElementById(tableId);
  if (!input || !table) return;

  input.addEventListener('input', () => {
    const query = input.value.toLowerCase();
    table.querySelectorAll('tbody tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(query) ? '' : 'none';
    });
  });
}

// ── Init on DOM Ready ────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  validateRegistrationForm();
  validateLoginForm();
  validateInternshipForm();
  validateProblemForm();
  initPasswordToggles();
  initFileUploads();
  initTableSearch('tableSearch', 'dataTable');
});
