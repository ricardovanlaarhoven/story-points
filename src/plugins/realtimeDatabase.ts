import { getDatabase, connectDatabaseEmulator } from "firebase/database";

require("./firebase.ts");
const db = getDatabase();
if (location.hostname === "localhost") {
  // Point to the RTDB emulator running on localhost.
  connectDatabaseEmulator(db, "localhost", 9000);
}
export const realtimeDatabase = db;
