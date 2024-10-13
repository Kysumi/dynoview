import LeftNav from "./components/LeftNav/LeftNav";
import useTableStore from "./store";
import { QueryBuilder } from "./components/QueryBuilder/QueryBuilder";

function App(): JSX.Element {
  const { activeTable } = useTableStore();

  return (
    <div>
      <div className="h-16 bg-gray-100">
        <LeftNav />
      </div>
      <div>{activeTable && <QueryBuilder />}</div>
    </div>
  );
}

export default App;
