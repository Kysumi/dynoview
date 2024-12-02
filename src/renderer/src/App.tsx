import { createHashRouter, Link, RouterProvider } from "react-router-dom";
import { Layout } from "./routes/_layout";
import { SettingsRoute } from "./routes/settings/route";
import { QueryBuilderRoute } from "./routes/query-builder/route";
import { HomeRoute } from "./routes/home/routes";
import { Button } from "./components/Button";
import { AddSSOConfig } from "./routes/settings/add-sso-config/route";
import { ErrorElement } from "./components/ErrorElement";

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorElement />,
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
      {
        path: "/settings/add-sso-config",
        element: <AddSSOConfig />,
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
