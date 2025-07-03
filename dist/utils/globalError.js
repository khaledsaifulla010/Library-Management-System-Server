"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalError = void 0;
const globalError = (error) => {
    const err = error;
    // Mongoose validation error
    if ((err === null || err === void 0 ? void 0 : err.name) === "ValidationError") {
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
    if ((err === null || err === void 0 ? void 0 : err.name) === "CastError") {
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
exports.globalError = globalError;
