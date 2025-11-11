/**
 * API Response Types
 * Types untuk response dari API
 */

/**
 * Standard API Response structure
 */
export type ApiResponse<T = unknown> = {
	success: boolean;
	statusCode: number;
	message: string;
	data: T;
	meta: unknown;
	timestamp: string;
	requestId: string;
};

/**
 * Generic API Error Response
 */
export type ApiErrorResponse = {
	success: false;
	statusCode: number;
	message: string;
	error?: string;
	timestamp: string;
	requestId: string;
};
