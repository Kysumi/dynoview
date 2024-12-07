import { zodResolver } from "@hookform/resolvers/zod";
import { BackButton, Button } from "@renderer/components/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@renderer/components/Card";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@renderer/components/Form";
import { Input } from "@renderer/components/Input";
import { useAWSStore } from "@renderer/store/aws-store";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AccountsTable } from "../components/AccountsTable";
import { toast } from "@renderer/hooks/use-toast";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteConfirmationDialog } from "@renderer/components/DeleteConfirmationDialog";

const ssoSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type SSOFormValues = z.infer<typeof ssoSchema>;

export const EditSSOConfigRoute = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { awsConfig, updateConfig, removeConfig } = useAWSStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const config = awsConfig.find((config) => config.id === id);

  if (!config) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Configuration Not Found</CardTitle>
          <CardDescription>The SSO configuration you're trying to edit doesn't exist.</CardDescription>
        </CardHeader>
        <CardContent>
          <BackButton to="/settings" text="Back to Settings" />
        </CardContent>
      </Card>
    );
  }

  const form = useForm<SSOFormValues>({
    resolver: zodResolver(ssoSchema),
    defaultValues: {
      name: config.name,
    },
  });

  const onSubmit = async (values: SSOFormValues) => {
    try {
      updateConfig({
        ...config,
        name: values.name,
      });

      toast({
        title: "Success",
        description: "SSO configuration name updated successfully",
      });

      navigate("/settings");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update SSO config name",
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    if (id) {
      removeConfig(id);
      toast({
        title: "Deleted",
        description: "SSO configuration has been removed",
      });
      navigate("/settings");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <BackButton to="/settings" text="Back to Settings" />
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Edit AWS SSO Configuration</CardTitle>
            <CardDescription>Modify your AWS SSO configuration name.</CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Configuration Name</FormLabel>
                    <Input placeholder="My AWS SSO" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit">Update Name</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {config.accounts.length > 0 && (
        <Card className="w-full max-w-4xl mx-auto mt-4">
          <CardContent>
            <AccountsTable configName={config.name} accounts={config.accounts} />
          </CardContent>
        </Card>
      )}

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete SSO Configuration"
        description="This will permanently delete this SSO configuration. This action cannot be undone."
      />
    </div>
  );
};
