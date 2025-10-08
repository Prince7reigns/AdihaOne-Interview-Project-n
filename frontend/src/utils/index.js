export function validateUserInput({ username, fullName, email, password }) {
  // Username validation
  if (!username || typeof username !== "string" || username.trim().length < 3) {
    return "Invalid username. Must be at least 3 characters.";
  }
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return "Username can only contain letters, numbers, and underscores.";
  }

  // Full name validation
  if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
    return "Invalid full name. Must be at least 2 characters.";
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return "Invalid email format.";
  }

  // Password validation
  if (!password || typeof password !== "string" || password.length < 6) {
    return "Password must be at least 6 characters long.";
  }
  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
  if (!strongPassword.test(password)) {
    return "Password must include at least one uppercase letter, one lowercase letter, and one number.";
  }

  return null; // ✅ All fields valid
}

export function validateUserUpdateInput({  fullName, email }) {
  // Full name validation
  if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
    return "Invalid full name. Must be at least 2 characters.";
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return "Invalid email format.";
  }

  return null; // ✅ All fields valid
}

export function validateUserPasswordInput({ oldPassowrd,newPassword }) {

   // Password validation
  if (!oldPassowrd || typeof oldPassowrd !== "string" || oldPassowrd.length < 6) {
    return "oldPassowrd must be at least 6 characters long.";
  }
  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
  if (!strongPassword.test(oldPassowrd)) {
    return "Password must include at least one uppercase letter, one lowercase letter, and one number.";
  }

   // Password validation
  if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
    return "newPassword must be at least 6 characters long.";
  }

  if (!strongPassword.test(newPassword)) {
    return "Password must include at least one uppercase letter, one lowercase letter, and one number.";
  }

  return null; // ✅ All fields valid
}


export function validateUserLoginInput({email, password }) {
      // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return "Invalid email format.";
  }

  // Password validation
  if (!password || typeof password !== "string" || password.length < 6) {
    return "Password must be at least 6 characters long.";
  }
  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
  if (!strongPassword.test(password)) {
    return "Password must include at least one uppercase letter, one lowercase letter, and one number.";
  }

  return null; // ✅ All fields valid
}

export function validateTaskInput({ title, description, dueDate }) {
  // Validate title
  if (!title || typeof title !== "string" || title.trim().length < 3) {
    return "Invalid title. Must be at least 3 characters.";
  }

  // Validate description
  if (!description || typeof description !== "string" || description.trim().length === 0) {
    return "Description is required.";
  }

  // Validate dueDate
  if (!dueDate || isNaN(Date.parse(dueDate))) {
    return "Invalid due date. Must be a valid date string.";
  }

  // Optional: due date cannot be in the past
  const now = new Date();
  const due = new Date(dueDate);
  if (due < now) {
    return "Due date cannot be in the past.";
  }

  return null; // Valid
}

