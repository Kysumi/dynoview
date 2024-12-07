import { useAWSStore } from "@renderer/store/aws-store";
import { AccountsTable } from "./components/AccountsTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@renderer/components/Card";
import { Button } from "@renderer/components/Button";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@renderer/components/Table/Table";
import { PlusCircle, Settings, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { DeleteConfirmationDialog } from "@renderer/components/DeleteConfirmationDialog";
import { toast } from "@renderer/hooks/use-toast";

export const SettingsRoute = () => {
  const { awsConfig, removeConfig } = useAWSStore();
  const [configToDelete, setConfigToDelete] = useState<string | null>(null);

  return (
    <div>
      <Card className="w-full max-w-4xl mx-auto mb-2">
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
                  <TableHead>URL</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {awsConfig.map((integration) => (
                  <TableRow key={integration.id}>
                    <TableCell className="font-medium">{integration.name}</TableCell>
                    <TableCell>{integration.startUrl}</TableCell>
                    <TableCell>{integration.region}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`./edit-sso-config/${integration.id}`}>
                          <Settings className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => setConfigToDelete(integration.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                      <DeleteConfirmationDialog
                        open={!!configToDelete}
                        onOpenChange={(open) => !open && setConfigToDelete(null)}
                        onConfirm={() => {
                          if (configToDelete) {
                            removeConfig(configToDelete);
                            toast({
                              title: "Deleted",
                              description: "SSO configuration has been removed",
                            });
                            setConfigToDelete(null);
                          }
                        }}
                        title="Delete SSO Configuration"
                        description="This will permanently delete this SSO configuration. This action cannot be undone."
                      />
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
