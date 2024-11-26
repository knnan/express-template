import * as luxon from "luxon";

export const currEpochSeconds = () => luxon.DateTime.now().toUnixInteger();
