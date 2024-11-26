import cron from "node-schedule";
import { jobs } from "./jobs.js";
// import { config } from "../configs/config.js";

/*

 # ┌────────────── second (optional)
 # │ ┌──────────── minute
 # │ │ ┌────────── hour
 # │ │ │ ┌──────── day of month
 # │ │ │ │ ┌────── month
 # │ │ │ │ │ ┌──── day of week
 # │ │ │ │ │ │
 # │ │ │ │ │ │
 # * * * * * *

*/

// sample durations
//  *	*	*	*	*	*  -> every second
//  	*	*	*	*	*  -> every minute
//  *	1	*	*	*	*  -> every second of first minite of every hours
//  	*	1	*	*	*  -> every minute of first hour
//  	*/5	*	*	*	*  -> every 5 minute

// cron.scheduleJob("* * * * *", jobs.logEveryMinute);
