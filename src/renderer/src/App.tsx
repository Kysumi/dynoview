import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  const listTables = async () => {
    const tables = await window.api.listAvailableTables({ region: 'ap-southeast-2' })
    console.log(tables)
  }

  return (
    <>
      <button type='button' onClick={listTables}>Test?</button>
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
          <button type='button' onClick={ipcHandle}>
            Send IPC
          </button>
        </div>
      </div>
      <Versions />
    </>
  )
}

export default App
