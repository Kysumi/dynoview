import { zodResolver } from "@hookform/resolvers/zod";
import { BackButton, Button } from "@renderer/components/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@renderer/components/Card";
import { ComboBox } from "@renderer/components/ComboBox";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@renderer/components/Form";
import { Input } from "@renderer/components/Input";
import { useAWSStore } from "@renderer/store/aws-store";
import { mapAccountsToRoles } from "@renderer/util/aws-helper";
import { id } from "@renderer/util/id";
import { regions } from "@shared/available-regions";
import type { AWSAccount } from "@shared/aws-accounts";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AccountsTable } from "../components/AccountsTable";
import { toast } from "@renderer/hooks/use-toast";

const ssoSchema = z.object({
  startUrl: z.string().url("Please enter a valid URL"),
  region: z.string(),
});

type SSOFormValues = z.infer<typeof ssoSchema>;

export const AddSSOConfig = () => {
  const { addConfig } = useAWSStore();
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState<AWSAccount[]>([]);

  const form = useForm<SSOFormValues>({
    resolver: zodResolver(ssoSchema),
  });

  const onSubmit = async (values: SSOFormValues) => {
    setIsLoading(true);

    try {
      // Initialize SSO
      await window.electron.ipcRenderer.invoke("aws:init-sso", {
        startUrl: values.startUrl,
        region: values.region,
      });

      // Start SSO flow and get token
      const { accessToken } = await window.electron.ipcRenderer.invoke("aws:start-sso");

      // Get accounts with their roles
      // We can likely move this to within the node process
      const { accounts, error } = await mapAccountsToRoles(accessToken);

      if (error) {
        throw new Error(error);
      }
      setAccounts(accounts);

      addConfig({
        id: id(),
        startUrl: values.startUrl,
        region: values.region,
        accounts,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({ title: "Error", description: `Failed to setup SSO: ${errorMessage}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <BackButton to="/settings" text="Back to Settings" />
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">AWS SSO Setup</CardTitle>
          <CardDescription>Enter your AWS SSO portal URL to begin.</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="startUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SSO Start URL</FormLabel>
                    <Input placeholder="https://my-sso-portal.awsapps.com/start" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SSO Region</FormLabel>
                    <ComboBox
                      placeHolder="Select Region"
                      selectedOption={field.value}
                      options={regions.map((region) => ({
                        value: region,
                        label: region,
                      }))}
                      onChange={(option) => field.onChange(option.value)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connecting..." : "Start AWS SSO"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {accounts.length > 0 && (
        <Card className="w-full max-w-4xl mx-auto mt-4">
          <CardContent>
            <AccountsTable accounts={accounts} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
