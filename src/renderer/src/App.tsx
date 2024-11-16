import { PageTabs } from "./components/PageTab";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./routes/_layout";

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <div>Hello world!</div>,
      },
      {
        path: "/query-builder",
        element: <PageTabs />,
      },
      {
        path: "/models",
        element: <div>Models</div>,
      },
      {
        path: "/settings",
        element: <div>Settings</div>,
      },
    ],
  },
]);

function App(): JSX.Element {
  return (
    <RouterProvider router={router}>
      {/* <SidebarProvider>
        <AppSidebar />
        <main className="flex flex-col h-full w-full overflow-hidden">
          <div className="bg-gray-100">
            <SidebarTrigger />
          </div>
          <div className="p-2">
            <PageTabs />
          </div>
        </main>
      </SidebarProvider> */}
    </RouterProvider>
  );
}

export default App;
