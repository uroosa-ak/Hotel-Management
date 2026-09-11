// Client-side regex validation helpers

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PHONE_REGEX = /^\+?[0-9\s-]{10,16}$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const ROOM_NUMBER_REGEX = /^[A-Za-z0-9-]{1,10}$/;
export const CNIC_REGEX = /^[0-9]{5}-[0-9]{7}-[0-9]$/;

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!EMAIL_REGEX.test(email.trim())) return 'Please enter a valid email address';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!PASSWORD_REGEX.test(password)) {
    return 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special symbol';
  }
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return null; // optional
  if (!PHONE_REGEX.test(phone.trim())) return 'Please enter a valid phone number (10-15 digits)';
  return null;
};

export const validateRoomNumber = (roomNumber) => {
  if (!roomNumber) return 'Room number is required';
  if (!ROOM_NUMBER_REGEX.test(String(roomNumber).trim())) return 'Invalid room number format';
  return null;
};

export const validatePrice = (price) => {
  const num = Number(price);
  if (isNaN(num) || num <= 0) return 'Price must be a positive number';
  return null;
};
