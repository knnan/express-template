import { setTimeout } from "node:timers/promises";

/** @param {number} timeout */
export const delay = (timeout) => setTimeout(timeout, true);

/**
 * Calls a defined executor callback function on elements of an array in batches of size batchSize, and returns an objectthat contains the results and errors of these executions.
 * @param {Object} promiseBatchParams - Object containing parameters for executing an array of promises in batches.
 * @param {any[]} promiseBatchParams.items - array containing items on whom the executor function will be applied
 * @param {number} promiseBatchParams.batchSize - batchSize of items  to apply executor function on
 * @callback {function} promiseBatchParams.executor - executor callback function which takes a sigle items as its argument and returns a promise
 * @returns {{ results:Array<any>,errors:[Object] }} - an object containing two fields results and errros . where results is the collection of successful responses and errors is a collection of errors that occured
 * @example
 *
 *  const numbers = [1, 2, 3, 4, 5, 6];
 *  async function promisetest(number) {
 *		await delay(1000);
 *		if (number === 2) {
 *			throw new Error(`I dont like this number : ${number}`);
 *	    }
 *		return `I like this number : ${number}`;
 *  }
 *
 *  consst response =  await promiseBatch({ items: numbers, executor: promisetest, batchSize: 3 });
 *
 *   response =>
 * 	 {
 * 	  	results: [
 * 	  	  'I like this number : 1',
 * 	  	  'I like this number : 3',
 * 	  	  'I like this number : 4',
 * 	  	  'I like this number : 5',
 * 	  	  'I like this number : 6'
 * 	  	],
 * 	  	errors: [
 * 	  	  {
 * 	  	    item: 2,
 * 	  	    error: Error: I dont like this number: 2
 * 	  	        at promisetest (file:///home/fjalksj/appdir/src/prototyping.js:43:9)
 * 	  	        at runNextTicks (internal/process/task_queues.js:60:5)
 * 	  	        at listOnTimeout (internal/timers.js:526:9)
 * 	  	        at processTimers (internal/timers.js:500:7)
 * 	  	        at async Promise.all (index 1)
 * 	  	        at async promiseBatch (file:///home/fjalksj/appdir/src/helpers/promise.helpers.js:44:15)
 * 	  	        at async run (file:///home/fjalksj/appdir/src/prototyping.js:52:17)
 * 	  	        at async file:///home/fjalksj/appdir/src/prototyping.js:55:1
 * 	  	  }
 * 	  	]
 * 	}
 *
 */
export const promiseBatch = async ({ items, batchSize }, executor) => {
	let position = 0;
	let results = [];
	const errors = [];
	while (position < items.length) {
		const batch = items.slice(position, (position += batchSize));
		/* eslint-disable-next-line no-await-in-loop */
		const batchRes = await Promise.all(
			batch.map((item) =>
				executor(item).catch((error) => {
					errors.push({ item, error });
				})
			)
		);
		results = [...results, ...batchRes];
	}
	return { results: results.filter((item) => item !== undefined), errors };
};

/**
 * retry executing the task function  until the task is successful or for a max number of times specified in the retry option if the task is erroring out and throws a error after the max retries have been exhausted.
 * @param {function} task - A task function which needs to be retried.
 * @param {object} taskArgs - An Object containting the arguments to be passed to the task.
 * @param {Object} retryOptons - An Object containing parameters for specifying retry logic.
 * @param {number} retryOptons.retries - A Number  specifying the no of times we need to retry the task function.
 * @param {number} retryOptons.interval - A Number  specifying the time in seconds  we need to wait between each retry of the task function.
 * @param {number} retryOptons.backoff - A Number specifying the exponential backoff factor  which increases the interval by the backoff factor in a increasing exponential manner.
 * @param {function} retryOptons.errorFilter - A error callback function which will be applied.
 * @returns {Promise<?*>} - returns the result of the task function or null when result is undefined
 * @example
 *
 *  const retryTask = async ({ name, retryCount }) => {
 *  	logger.debug(`my name is ${name}`);
 *  	logger.debug("current retry attempt is ", retryCount);
 *
 *  	if (name === "fail" && retryCount !== 2) throw new Error("ill always error out");
 *  };
 *
 *  await retry( retryTask, { name: "knnan" }, { retries: 4, interval: 2 } );
 *
 *
 *  [ output ]
 *  (retryTask) my name is knnan
 *  (retryTask) current retry attempt is  0;
 *
 *  await retry( retryTask, { name: "fail" }, { retries: 4, interval: 2 } );
 *
 *  [ output ]
 *  (retryTask) my name is fail
 *  (retryTask) current retry attempt is  0
 *  (retryTask) my name is fail
 *  (retryTask) current retry attempt is  1
 *  (retryTask) my name is fail
 *  (retryTask) current retry attempt is  2
 *
 */
export async function retry(task, taskArgs, { retries = 3, interval = 0, backoff = 1, errorFilter = (err) => true }) {
	for (let retryCount = 0; retryCount < retries; retryCount += 1) {
		try {
			// eslint-disable-next-line no-await-in-loop
			const result = await task({ ...taskArgs, retryCount });
			return result || null;
		} catch (error) {
			if (!errorFilter(error) || retryCount === retries - 1) {
				throw error;
			}
			if (interval !== 0) {
				const backoffFactor = backoff ** retryCount;
				const delayInterval = interval * backoffFactor;
				// eslint-disable-next-line no-await-in-loop
				await delay(delayInterval);
			}
		}
	}
}
