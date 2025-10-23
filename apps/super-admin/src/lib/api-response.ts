import { NextResponse } from "next/server";

/**
 * ✅ Standard success response wrapper
 */
export function successResponse<T>(
  data: T,
  message = "Success",
  status = 200
) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

/**
 * ❌ Standard error response wrapper
 */
export function errorResponse(
  message = "An unexpected error occurred",
  status = 500,
  error?: unknown
) {
  console.error("🚨 API Error:", message, error);

  return NextResponse.json(
    {
      success: false,
      message,
      error:
        process.env.NODE_ENV === "development"
          ? String(error)
          : undefined,
    },
    { status }
  );
}
