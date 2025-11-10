/**
 * BAK Files Types
 * Types untuk halaman dan operasi BAK files
 */

/**
 * BAK File item structure
 */
export type BakFile = {
	bak: string;
	isZipExist: boolean;
};

/**
 * Streaming event untuk progress conversion
 */
export type StreamEvent = {
	type?: string;
	percent?: number;
	message?: string;
};

/**
 * Request body untuk convert file
 */
export type ConvertFileRequest = {
	filename: string;
};

/**
 * Request body untuk convert file stream
 */
export type ConvertFileStreamRequest = {
	filename: string;
};
