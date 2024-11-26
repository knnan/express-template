import { sampleDao } from "./sample.dao.js";

const sampleService = {
	getAllSampleUsers() {
		sampleDao.getSampleUser({ name: "knnan" });
		const users = { name: "user1" };
		return users;
	}
};

export { sampleService };
