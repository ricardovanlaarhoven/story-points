import {getDatabase} from "firebase/database";

require('./firebase.ts');
export const realtimeDatabase = getDatabase();
