import Versions from "./components/Versions";
import LeftNav from "./components/LeftNav/LeftNav";
import useTableStore from "./store";

function App(): JSX.Element {
  const { activeTable } = useTableStore();

  return (
    <div>
      <div className="h-16 bg-gray-100">
        <LeftNav />
      </div>
      <div>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">{activeTable?.tableName}</h3>
          <pre className="text-sm">{JSON.stringify(activeTable?.indexes, null, 2)}</pre>
        </div>
        <Versions />
      </div>
    </div>
  );
}

export default App;
