export const globalError = (error: unknown) => {
  const err = error as any;

  // Duplicate key (e.g., unique ISBN)
  if (err?.code === 11000) {
    const fields = Object.keys(err.keyValue || {});
    return {
      success: false,
      message: `Duplicate value for ${fields.join(", ")}`,
      error: { name: "MongoServerError", code: 11000, keyValue: err.keyValue },
      statusCode: 409,
    };
  }

  // Mongoose validation error
  if (err?.name === "ValidationError") {
    return {
      success: false,
      message: "Validation failed",
      error: { name: err.name, errors: err.errors },
      statusCode: 400,
    };
  }

  // CastError
  if (err?.name === "CastError") {
    return {
      success: false,
      message: "Invalid ID format",
      error: {
        name: err.name,
        path: err.path,
        value: err.value,
        kind: err.kind,
      },
      statusCode: 400,
    };
  }

  // Not enough copies (domain errors)
  if (
    typeof err?.message === "string" &&
    /not enough copies/i.test(err.message)
  ) {
    return {
      success: false,
      message: "Not enough copies available",
      error: { name: "BusinessRuleError" },
      statusCode: 400,
    };
  }

  // Default generic error
  return {
    success: false,
    message: err?.message || "Internal server error",
    error: err,
    statusCode: 500,
  };
};
