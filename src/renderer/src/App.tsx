import { createHashRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./routes/_layout";
import { SettingsRoute } from "./routes/settings/route";
import { QueryBuilderRoute } from "./routes/query-builder/route";
import { HomeRoute } from "./routes/home/routes";

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <HomeRoute />,
      },
      {
        path: "/query-builder",
        element: <QueryBuilderRoute />,
      },
      {
        path: "/models",
        element: <div>Models</div>,
      },
      {
        path: "/settings",
        element: <SettingsRoute />,
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
