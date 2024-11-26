export const jobMutex = {
	SAMPLE_JOB: 0,
	acquire(jobId) {
		// Todo: Throw an error if job id is not defined
		// if (jobMutex[jobId] === undefined || null) {
		// 	throw new Error("Job is not defined");
		// }
		if (jobMutex[jobId] === 0) {
			jobMutex[jobId] = 1;
			return true;
		}
		return false;
	},
	release(jobId) {
		jobMutex[jobId] = 0;
		return true;
	}
};
