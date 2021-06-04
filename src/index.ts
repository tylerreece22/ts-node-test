import * as crypto from "crypto";

// High load process
const start = Date.now()
const key = crypto.pbkdf2Sync('secret', 'salt', 100000, 10000, 'sha512');
const end = Date.now()
console.log(`Generated hash in ${(end - start)/1000} seconds`)