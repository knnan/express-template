import path from "node:path";
import { v4 as uuidv4 } from "uuid";

/**
 *
 */
const s3Helper = {
	// please follow the same structure for all filename

	/**
	 * @param {string} originalname - the original filename
	 * @return {string} filename - the new filename generated pattern
	 */
	uuid_filename(originalname) {
		// originalname will be like hello.txt
		const filename = `${uuidv4()}_${originalname}`;
		return filename;
	},

	/**
	 * @param {string} originalname - the original filename
	 * @return {string} filename - the new filename generated pattern
	 */
	uuid_fileExtension(originalname) {
		const filename = `${uuidv4()}${path.extname(originalname)}`;
		return filename;
	}
};

export { s3Helper };
