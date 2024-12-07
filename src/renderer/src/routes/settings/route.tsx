import { Separator } from "@renderer/components/Separator";
import { useAWSStore } from "@renderer/store/aws-store";
import { AccountsTable } from "./components/AccountsTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@renderer/components/Card";
import { Button } from "@renderer/components/Button";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@renderer/components/Table/Table";
import { PlusCircle, Settings, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export const SettingsRoute = () => {
  const { awsConfig } = useAWSStore();

  return (
    <div>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">AWS SSO Integrations</CardTitle>
            <CardDescription>Manage your AWS Single Sign-On configurations</CardDescription>
          </div>
          {awsConfig.length > 0 && (
            <Button asChild>
              <Link to="./add-sso-config">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New SSO Config
              </Link>
            </Button>
          )}
        </CardHeader>

        <CardContent>
          {awsConfig.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {awsConfig.map((integration) => (
                  <TableRow key={integration.id}>
                    <TableCell className="font-medium">{integration.startUrl}</TableCell>
                    {/* <TableCell>{integration.accountId}</TableCell> */}
                    <TableCell>{integration.region}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/edit-sso-config/${integration.id}`}>
                          <Settings className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No SSO integrations configured yet.</p>
              <Button asChild className="mt-4">
                <Link to="./add-sso-config">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Your First SSO Config
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {awsConfig.map((config) => {
        return (
          <div key={config.id}>
            <AccountsTable configName={config.name ?? ""} accounts={config.accounts} />
          </div>
        );
      })}
    </div>
  );
};
