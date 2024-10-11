import { contextBridge } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { listAvailableTables } from "./ddb/operations/list-available-tables";
import { getTableInformation } from "./ddb/operations/get-table-information";

// Custom APIs for renderer
const api = {
  listAvailableTables,
  getTableInformation,
};

export type Api = typeof api;

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
