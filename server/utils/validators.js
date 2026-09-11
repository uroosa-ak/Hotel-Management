// Centralized validation utilities using Regular Expressions

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^\+?[0-9\s-]{10,16}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const ROOM_NUMBER_REGEX = /^[A-Za-z0-9-]{1,10}$/;
const CNIC_REGEX = /^[0-9]{5}-[0-9]{7}-[0-9]$/;

function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim());
}

function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  return PHONE_REGEX.test(phone.trim());
}

function validatePassword(password) {
  if (!password || typeof password !== 'string') return false;
  return PASSWORD_REGEX.test(password);
}

function validateRoomNumber(roomNumber) {
  if (!roomNumber) return false;
  return ROOM_NUMBER_REGEX.test(String(roomNumber).trim());
}

function validatePrice(price) {
  const num = Number(price);
  return !isNaN(num) && num > 0;
}

function validateCNIC(cnic) {
  if (!cnic) return true; // Optional field
  return CNIC_REGEX.test(cnic.trim());
}

module.exports = {
  EMAIL_REGEX,
  PHONE_REGEX,
  PASSWORD_REGEX,
  ROOM_NUMBER_REGEX,
  CNIC_REGEX,
  validateEmail,
  validatePhone,
  validatePassword,
  validateRoomNumber,
  validatePrice,
  validateCNIC
};
