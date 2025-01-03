import { createHashRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./routes/_layout";
import { SettingsRoute } from "./routes/settings/route";
import { QueryBuilderRoute } from "./routes/query-builder/route";
import { HomeRoute } from "./routes/home/routes";
import { AddSSOConfig } from "./routes/settings/add-sso-config/route";
import { ErrorElement } from "./components/ErrorElement";
import { EditSSOConfigRoute } from "./routes/settings/edit-sso-config/route";
import { ThemeProvider } from "./components/ThemeProvider";

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
      {
        path: "/settings/edit-sso-config/:id",
        element: <EditSSOConfigRoute />,
      },
    ],
  },
]);

function App(): JSX.Element {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
