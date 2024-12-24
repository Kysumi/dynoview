import path from "node:path";
import fs from "node:fs";
import type { TokenStore } from "./sso";
import { app, safeStorage } from "electron";

export class SecureStore implements TokenStore {
  private path: string;

  constructor(filename: string) {
    this.path = path.join(app.getPath("userData"), `${filename}.encrypted`);
  }

  get<ReturnType extends Record<string, unknown>>(key: string): ReturnType | undefined {
    try {
      const encryptedData = fs.readFileSync(this.path);
      const decrypted = safeStorage.decryptString(encryptedData);

      const data = JSON.parse(decrypted);
      return data[key];
    } catch {
      return undefined;
    }
  }

  set(key: string, value: Record<string, unknown>): void {
    let data = {};
    try {
      const encryptedData = fs.readFileSync(this.path);
      const decrypted = safeStorage.decryptString(encryptedData);
      data = JSON.parse(decrypted);
    } catch {
      // File doesn't exist yet, that's ok
    }

    // Upsert the key value pair
    data = { ...data, [key]: value };

    const jsonString = JSON.stringify(data);
    const encrypted = safeStorage.encryptString(jsonString);

    fs.writeFileSync(this.path, encrypted);
  }
}
