import micromatch from "micromatch";

/*  This code snippet is used to remove eslint warnings when eslint is run on files that are ignored by eslinignore
	import { ESLint } from "eslint";
	const removeIgnoredFiles = async (files) => {
		try {
			const eslint = new ESLint();
			const isIgnored = await Promise.all(
				files.map((file) => {
					try {
						const isIgnored = eslint.isPathIgnored(file);
						return isIgnored;
					} catch (error) {
						console.log(error);
					}
				})
			);
			const filteredFiles = files.filter((_, i) => !isIgnored[i]);
			return filteredFiles;
		} catch (error) {
			console.log(error);
		}
	};
*/
export default {
	"*": (allFiles) => {
		const srcCodeFiles = micromatch(allFiles, ["**/src/**/*.{js,jsx,ts,tsx}"]);
		const allCodeFiles = micromatch(allFiles, ["**/*.{js,jsx,ts,tsx,json,css,yaml}"], {
			dot: true
		});
		const filesToLint = srcCodeFiles.join(" ");
		const filesToFormat = allCodeFiles.join(" ");

		return [`eslint --fix  ${filesToLint}`, `prettier --ignore-unknown --write ${filesToFormat}`];
	}
};
