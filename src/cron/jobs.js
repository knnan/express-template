import { logger } from "../loggers/logger.js";
import { jobMutex } from "./job-mutex.js";

const jobs = {
	logEveryMinute() {
		const jobId = "SAMPLE_JOB";
		let mutexAcquired = false;
		try {
			mutexAcquired = jobMutex.acquire(jobId);
			if (!mutexAcquired) {
				logger.info("Skipping `IDLE_TIMEOUT_JOB` JOB since it is already running");
				return;
			}
			// DO SOME WORK HERE
			logger.info("im doing some work here like im logging every minute");
		} catch (error) {
			logger.error(error);
		} finally {
			if (mutexAcquired) jobMutex.release(jobId);
		}
	}
};

export { jobs };
