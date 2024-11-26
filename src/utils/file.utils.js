import fs from "node:fs";
import path from "node:path";
import { pipeline as pipelineAsync } from "node:stream/promises";
import extract from "extract-zip";
import { nanoid, customAlphabet } from "nanoid";
import axios from "axios";
import mime from "mime-types";

/** @param {fs.PathLike} pathToCheck Path to dir or file. */
export async function pathExists(pathToCheck) {
	return await fs.promises
		.access(pathToCheck, fs.constants.F_OK)
		.then(() => true)
		.catch(() => false);
}

/** @param {fs.PathLike} filePath - The file path to delete. */
export async function deleteFile(filePath) {
	await fs.promises.unlink(filePath);
}

/**
 *
 * @param {fs.PathLike & string} dirPath - The dir path to create.
 * @param {Object} options - mkdirP options.
 * @param {fs.Mode} [options.mode=0o777] - The permission (in octal number ex: 0o777) to set on created dirs.
 */
export async function mkdirP(dirPath, { mode = 0o777 } = {}) {
	try {
		const dirExist = await pathExists(dirPath);
		if (dirExist === false) {
			await fs.promises.mkdir(dirPath, { mode, recursive: true });
		} else {
			await fs.promises.access(dirPath, fs.constants.R_OK | fs.constants.W_OK | fs.constants.X_OK);
		}
	} catch (err) {
		if (err.code === "EACCES" && err.syscall === "access") {
			await chmodDir(dirPath, { mode });
		} else {
			throw err;
		}
	}
}

/**
 *
 * @param {fs.PathLike & string} dirPath
 * @param {Object} options
 * @param {fs.Mode} [options.mode=0o777]
 * @param {boolean} [options.recursive=true]
 */
export async function chmodDir(dirPath, { mode = 0o777, recursive = true } = {}) {
	/* 0o755 => rwx:rx:rx */
	/* r=4 w=2 x=1 */
	const stats = await fs.promises.stat(dirPath);

	if (stats.isDirectory() && recursive) {
		const files = await fs.promises.readdir(dirPath);
		for (const file of files) {
			const filePath = path.join(dirPath, file);
			/* eslint-disable-next-line no-await-in-loop */
			await chmodDir(filePath, { mode });
		}
	}
	await fs.promises.chmod(dirPath, mode);
}

/**
 *
 * @param {{dirs:string[],batchSize:number}} param
 */
export async function removeDirs({ dirs, batchSize = 10 }) {
	let position = 0;
	let results = [];
	while (position < dirs.length) {
		const dirBatch = dirs.slice(position, position + batchSize);
		const dirBatchItems = dirBatch.map((dir) =>
			fs.promises
				.rm(dir, {
					recursive: true,
					force: true
				})
				.catch((error) => ({ dir, error }))
		);
		/* eslint-disable-next-line no-await-in-loop */
		const dirResponse = await Promise.all(dirBatchItems);
		results = [...results, ...dirResponse];
		position += batchSize;
	}
	const failedItems = results.filter((item) => item !== undefined);
	return failedItems;
}

/**
 *
 * @param {string} zipFilePath
 * @param {string} destination
 * @returns
 */
export async function unzip(zipFilePath, destination) {
	try {
		await extract(zipFilePath, { dir: destination });
		return destination;
	} catch (err) {
		throw err;
	}
}

/**
 * @param {{ srcUrl: string, localDestFilePath: string }} param
 */
export async function downloadFileFromUrl({ srcUrl, localDestFilePath }) {
	const { data: requestReadStream } = await axios.get(srcUrl, {
		responseType: "stream"
	});
	const writeStream = fs.createWriteStream(localDestFilePath);
	await pipelineAsync(requestReadStream, writeStream);
	return localDestFilePath;
}

/** @param {fs.PathLike & string} filename */
export function getFilesizeInMBytes(filename) {
	const stats = Buffer.isBuffer(filename) ? { size: Buffer.byteLength(filename) } : fs.statSync(filename);
	const fileSizeInBytes = stats.size;
	const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
	return fileSizeInMegabytes;
}

export function genNanoId({ size = 21, allowSpecialChars = true } = {}) {
	const alphaNumericChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	const nanoIdGen = allowSpecialChars === false ? customAlphabet(alphaNumericChars, 21) : nanoid;
	return size ? nanoIdGen(size) : nanoIdGen();
}

/** @param {fs.PathLike & string} filename */
export function getMimeType(filePath) {
	return mime.lookup(filePath);
}
