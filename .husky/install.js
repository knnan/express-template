// Skip Husky install in production and CI
if (process.env.NODE_ENV === "production" || process.env.CI === "true") {
	console.log("QUITTING EARLY");
	process.exit(0);
}
const installHusky = (await import("husky")).default;
const huskyInstallStatus = installHusky();
console.log(huskyInstallStatus);
if (huskyInstallStatus == "") {
	console.log("Git hooks installed");
}
