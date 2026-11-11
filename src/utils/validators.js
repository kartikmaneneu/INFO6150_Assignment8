function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

function isValidFullName(fullName) {
  return /^[A-Za-z\s]+$/.test(String(fullName || '').trim());
}

function isStrongPassword(password) {
  const value = String(password || '');
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value);
}

module.exports = {
  isValidEmail,
  isValidFullName,
  isStrongPassword,
};
