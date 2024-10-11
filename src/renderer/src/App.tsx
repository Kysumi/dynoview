import Versions from "./components/Versions";
import electronLogo from "./assets/electron.svg";
import { useState, useEffect } from "react";

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send("ping");

  const listTables = async () => {
    const tables = await window.api.listAvailableTables({ region: "ap-southeast-2" });
    return tables;
  };

  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    if (tables.length === 0) {
      listTables().then((tables) => setTables(tables));
    }
  }, [tables]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const table = event.currentTarget.table.value;
    const info = await window.api.getTableInformation({ tableName: table, region: "ap-southeast-2" });
    console.log(info);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <select name="table" id="table">
          {tables.map((table) => (
            <option key={table} value={table}>
              {table}
            </option>
          ))}
        </select>
        <button type="submit" onClick={listTables}>
          Test?
        </button>
      </form>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <button type="button" onClick={ipcHandle}>
            Send IPC
          </button>
        </div>
      </div>
      <Versions />
    </>
  );
}

export default App;
