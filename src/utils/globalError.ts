export const globalError = (error: unknown) => {
  const err = error as any;

  // Mongoose validation error
  if (err?.name === "ValidationError") {
    return {
      message: "Validation failed",
      success: false,
      error: {
        name: err.name,
        errors: err.errors,
      },
    };
  }

  // CastError
  if (err?.name === "CastError") {
    return {
      message: "Invalid ID format",
      success: false,
      error: {
        name: err.name,
        path: err.path,
        value: err.value,
        kind: err.kind,
      },
    };
  }

  // Default generic error
  return {
    message: err.message || "Internal server error",
    success: false,
    error: err,
  };
};
