import path from "node:path";
import fs from "node:fs";
import { app, safeStorage } from "electron";

export class SecureLocalStore {
  private path: string;

  constructor(filename: string) {
    this.path = path.join(app.getPath("userData"), `${filename}.encrypted`);
  }

  get(key: string): any {
    try {
      // Read encrypted data from file
      const encryptedData = fs.readFileSync(this.path);

      // Decrypt the data
      const decrypted = safeStorage.decryptString(encryptedData);

      // Parse the decrypted JSON string
      const data = JSON.parse(decrypted);
      return data[key];
    } catch {
      return undefined;
    }
  }

  set(key: string, value: any): void {
    let data = {};
    try {
      // Try to read and decrypt existing data
      const encryptedData = fs.readFileSync(this.path);
      const decrypted = safeStorage.decryptString(encryptedData);
      data = JSON.parse(decrypted);
    } catch {
      // File doesn't exist yet, that's ok
    }

    // Merge new data
    data = { ...data, [key]: value };

    // Convert to JSON string and encrypt
    const jsonString = JSON.stringify(data);
    const encrypted = safeStorage.encryptString(jsonString);

    // Write encrypted data to file
    fs.writeFileSync(this.path, encrypted);
  }
}
