
export function handleAxiosError(error) {
  const response = error.response;


  console.log(error,response);
  
  // Default error object
  const errors = {
    fieldErrors: {}, // for input-specific errors
    general: "Something went wrong. Please try again.",
    status: response?.status || 500,
  };

  if (!response) {
    // No response (network error)
    errors.general = "Network error. Please check your connection.";
    return errors;
  }

   const message = response.data?.message || response.statusText ;
console.log(message);

  switch (response.status) {
    case 400: // Bad Request - validation error
      errors.general = message || "Invalid input data.";
      break;
    case 401: // Unauthorized
      errors.general = message || "You are not authorized.";
      break;
    case 403: // Forbidden
      errors.general = message || "Access denied.";
      break;
    case 404: // Not Found
      errors.general = message || "Resource not found.";
      break;
    case 409: // Conflict (e.g., username/email exists)
      if (message.includes("Username")) {
        console.log(message)
        errors.fieldErrors.username = message;
      } else if (message.includes("Email")) {
        errors.fieldErrors.email = message;
      } else {
        errors.general = message;
      }
      break;
    case 422: // Unprocessable Entity
      errors.general = message || "Validation failed.";
      break;
    case 500: // Server Error
      errors.general = message || "Internal server error.";
      break;
    default:
      errors.general = message || "Unknown error occurred.";
  }

  return errors;
}
