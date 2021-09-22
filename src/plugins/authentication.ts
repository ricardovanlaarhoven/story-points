import { getAuth } from "firebase/auth";

require('./firebase.ts');
export const authentication = getAuth();
