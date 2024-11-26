import fs from "node:fs";
import { pipeline as pipelineAsync } from "node:stream/promises";
import { GetObjectCommand, S3 } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl as getSignedUrlPromise } from "@aws-sdk/s3-request-presigner";
import { config } from "../../configs/config.js";
import { getMimeType, getFilesizeInMBytes } from "../../utils/file.utils.js";
import { logger } from "../../loggers/logger.js";
import { isEmpty } from "../../utils/empty.js";
import { ApiError } from "../../errors/errors.js";
import { Constants } from "../../constants/constants.js";

// TODO: use AWS credentialmanager to set creds
const s3 = new S3({
	region: config.aws.region,
	credentials: {
		accessKeyId: config.aws.accessKey,
		secretAccessKey: config.aws.secretKey
	}
});
export const s3Lib = {
	/**
	 * Uploads a small object to an S3 bucket.
	 *
	 * @param {Object} params - The parameters for the function.
	 * @param {string} params.bucket - The name of the S3 bucket.
	 * @param {string} params.s3KeyPath - The S3 key path where the object will be stored.
	 * @param {string | Buffer} params.localFilePath - The local file path of the object to be uploaded.
	 * @param {string} [params.contentType] - The content type of the object. If not provided, it will be inferred from the file extension or set to "application/octet-stream".
	 * @throws {ApiError} Throws an internal server error if the upload fails.
	 * @returns {Promise<void>} A promise that resolves when the upload is complete.
	 */
	async uploadSmallObject({ bucket, s3KeyPath, localFilePath, contentType }) {
		try {
			const data = Buffer.isBuffer(localFilePath) ? localFilePath : fs.createReadStream(localFilePath);
			const dataContentType = contentType ?? (getMimeType(localFilePath) || "application/octet-stream");

			await s3.putObject({
				Bucket: bucket,
				Key: s3KeyPath,
				Body: data,
				ContentType: dataContentType
			});
		} catch (err) {
			logger.error(err);
			throw ApiError.InternalServerError("Failed to Upload");
		}
	},

	/**
	 * Uploads a large object to an S3 bucket.
	 *
	 * @param {Object} params - The parameters for the function.
	 * @param {string} params.bucket - The name of the S3 bucket.
	 * @param {string} params.s3KeyPath - The S3 key path where the object will be stored.
	 * @param {string | Buffer} params.localFilePath - The local file path of the object to be uploaded.
	 * @param {string} [params.contentType] - The content type of the object. If not provided, it will be inferred from the file extension or set to "application/octet-stream".
	 * @throws {ApiError} Throws an internal server error if the upload fails.
	 * @returns {Promise<void>} A promise that resolves when the upload is complete.
	 */
	async uploadLargeObject({ bucket, s3KeyPath, localFilePath, contentType }) {
		try {
			const data = Buffer.isBuffer(localFilePath) ? localFilePath : fs.createReadStream(localFilePath);
			const dataContentType = contentType ?? (getMimeType(localFilePath) || "application/octet-stream");

			const upload = new Upload({
				client: s3,
				params: {
					Bucket: bucket,
					Key: s3KeyPath,
					Body: data,
					ContentType: dataContentType
				},
				// (optional) concurrency configuration
				queueSize: 5,
				// (optional) size of each part, in bytes, at least 5MB
				partSize: 1024 * 1024 * 5,
				/**
				 * (optional) when true, do not automatically call AbortMultipartUpload when
				 * a multipart upload fails to complete. You should then manually handle
				 * the leftover parts.
				 */
				leavePartsOnError: false
			});

			upload.on("httpUploadProgress", (progress) => {
				// logger.debug(progress)
			});

			await upload.done();
		} catch (err) {
			logger.error(err);
			throw ApiError.InternalServerError("Failed to upload.");
		}
	},

	/**
	 * Uploads a small object to an S3 bucket.
	 *
	 * @param {Object} params - The parameters for the function.
	 * @param {string} params.bucket - The name of the S3 bucket.
	 * @param {string} params.s3KeyPath - The S3 key path where the object will be stored.
	 * @param {string | Buffer} params.localFilePath - The local file path of the object to be uploaded.
	 * @param {string} [params.contentType] - The content type of the object. If not provided, it will be inferred from the file extension or set to "application/octet-stream".
	 * @throws {ApiError} Throws an internal server error if the upload fails.
	 * @returns {Promise<void>} A promise that resolves when the upload is complete.
	 */
	async uploadObject({ bucket, s3KeyPath, localFilePath, contentType }) {
		if (Buffer.isBuffer(localFilePath) || getFilesizeInMBytes(localFilePath) < Constants.FILE_SIZE_LIMIT_MB) {
			return await s3Lib.uploadSmallObject({ bucket, s3KeyPath, localFilePath, contentType });
		}
		return await s3Lib.uploadLargeObject({ bucket, s3KeyPath, localFilePath, contentType });
	},

	/**
	 * Checks if a file exists in an S3 bucket.
	 *
	 * @async
	 * @function hasFile
	 * @param {Object} params - The parameters object.
	 * @param {string} params.bucket - The name of the S3 bucket.
	 * @param {string} params.s3KeyPath - The key path of the file in the S3 bucket.
	 * @returns {Promise<boolean>} A promise that resolves to true if the file exists, otherwise false.
	 * @throws {ApiError} Throws an InternalServerError if something goes wrong during the S3 check.
	 */
	async hasFile({ bucket, s3KeyPath }) {
		try {
			await s3.headObject({ Bucket: bucket, Key: s3KeyPath });
			return true;
		} catch (err) {
			if (err.name?.includes("NotFound")) {
				return false;
			}
			logger.error(err);
			throw ApiError.InternalServerError("Failed to verify file existence.");
		}
	},

	/**
	 * Generates a signed URL for accessing an object in an S3 bucket.
	 *
	 * @param {Object} params - The parameters for the function.
	 * @param {string} params.bucket - The name of the S3 bucket.
	 * @param {string} params.s3KeyPath - The S3 key path of the object.
	 * @param {number} params.expire - The expiration time in seconds for the signed URL.
	 * @throws {ApiError} Throws an error if the file doesn't exist or if generating the signed URL fails.
	 * @returns {Promise<string>} A promise that resolves to the signed URL.
	 */
	async getSignedUrl({ bucket, s3KeyPath, expire }) {
		const isFilePresent = await s3Lib.hasFile({ bucket, s3KeyPath });
		if (isFilePresent) {
			const signedUrl = await getSignedUrlPromise(
				s3,
				new GetObjectCommand({
					Bucket: bucket,
					Key: s3KeyPath
				}),
				{
					expiresIn: expire
				}
			);
			return signedUrl;
		}
		throw ApiError.BadRequest("File doesn't exist.");
	},

	/**
	 * Downloads a file from an S3 bucket to a local file path.
	 *
	 * @param {Object} params - The parameters for the function.
	 * @param {string} params.bucket - The name of the S3 bucket.
	 * @param {string} params.s3KeyPath - The S3 key path of the file to be downloaded.
	 * @param {string} params.localFilePath - The local file path where the file will be saved.
	 * @throws {ApiError} Throws an error if the file doesn't exist or if the download fails.
	 * @returns {Promise<string>} A promise that resolves to the local file path when the download is complete.
	 */
	async downloadFile({ bucket, s3KeyPath, localFilePath }) {
		const isFilePresent = await s3Lib.hasFile({ bucket, s3KeyPath });
		if (isFilePresent) {
			const data = await s3.getObject({ Bucket: bucket, Key: s3KeyPath });
			if (data.Body !== undefined) {
				const readStream = data.Body;
				const writeStream = fs.createWriteStream(localFilePath);
				await pipelineAsync(readStream, writeStream);
				return localFilePath;
			}
		}
		throw ApiError.BadRequest("File doesn't exist.");
	},

	async deleteObject({ bucket, s3KeyPath }) {
		const isFilePresent = await s3Lib.hasFile({ bucket, s3KeyPath });
		if (isFilePresent) {
			await s3.deleteObject({ Bucket: bucket, Key: s3KeyPath });
		}
	},
	async listAllObjects({ bucket, prefix }) {
		try {
			let isTruncated = true;
			let nextToken;
			const s3Objects = [];

			while (isTruncated) {
				/** @type {import("@aws-sdk/client-s3").ListObjectsV2CommandOutput} */
				const listObjectsRes = await s3.listObjectsV2({
					Bucket: bucket,
					Prefix: prefix,
					...(nextToken && { ContinuationToken: nextToken })
				});

				if (listObjectsRes?.Contents) {
					const itemKeyList = listObjectsRes.Contents.map((item) => item.Key).filter((key) => key);
					s3Objects.push(...itemKeyList);
					isTruncated = listObjectsRes.IsTruncated ? isTruncated : false;
					nextToken = listObjectsRes.NextContinuationToken;
				} else {
					break;
				}
			}
			return s3Objects;
		} catch (err) {
			logger.error(err);
			throw err;
		}
	},
	async deleteObjects({ bucket, s3KeyPathArr }) {
		const fileObjects = s3KeyPathArr.map((keyPath) => ({ Key: keyPath }));
		const params = {
			Bucket: bucket,
			Delete: {
				Objects: fileObjects,
				Quiet: true
			}
		};

		/*
		The "Quiet" option enables the following
		The action supports two modes for the response: verbose and quiet. By default, the action uses verbose mode in which the response includes the result of deletion of each key in your request. In quiet mode the response includes only keys where the delete action encountered an error. For a successful deletion, the action does not return any information about the delete in the response body

		returns { Deleted: [], Errors: [{ Key:"", Code:null, VersionId:"" Message:"" }] }
	    */
		const failedObjects = await s3.deleteObjects(params);
		if (!isEmpty(failedObjects.Errors)) logger.warn("Failed to delete s3 files ", failedObjects.Errors);
		return failedObjects;
	}
};
