import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { Form, FormField, FormItem, FormLabel } from "@components/Form";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FormMessage } from "@components/Form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ComboBox } from "@components/ComboBox";
import { regions } from "@shared/available-regions";
import { useAWSStore } from "@renderer/store/aws-store";

const ssoSchema = z.object({
  startUrl: z.string().url("Please enter a valid URL"),
  region: z.string(),
});

type SSOFormValues = z.infer<typeof ssoSchema>;

export const SettingsRoute = () => {
  const { startUrl, region, setIsAuthenticated, setStartUrl, isAuthenticated } = useAWSStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SSOFormValues>({
    resolver: zodResolver(ssoSchema),
    defaultValues: {
      startUrl,
      region: region ?? "ap-southeast-2",
    },
  });

  const onSubmit = async (values: SSOFormValues) => {
    setIsLoading(true);
    setStartUrl(values.startUrl, values.region);

    try {
      // Initialize SSO
      await window.electron.ipcRenderer.invoke("aws:init-sso", {
        startUrl: values.startUrl,
        region: values.region,
      });

      // Start SSO flow and get token
      const { accessToken, expiresIn } = await window.electron.ipcRenderer.invoke("aws:start-sso");

      // Get available accounts
      const accounts = await window.electron.ipcRenderer.invoke("aws:list-accounts", accessToken);
      console.log(accounts);

      if (accounts.length > 0) {
        // Get roles for first account
        const roles = await window.electron.ipcRenderer.invoke("aws:list-roles", {
          accessToken,
          accountId: accounts[0].accountId,
        });

        console.log(roles);

        if (roles.length > 0) {
          // Get credentials for first role
          const credentials = await window.electron.ipcRenderer.invoke("aws:get-credentials", {
            accessToken,
            accountId: accounts[0].accountId,
            roleName: roles[0].roleName,
          });

          console.log(credentials);

          // Store credentials securely
          // Update authentication state
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error("Failed to setup SSO:", error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        <h2 className="text-xl font-semibold">Is AUTHED: {isAuthenticated ? "YES" : "NO"}</h2>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 p-4">
        <h2 className="text-xl font-semibold">AWS SSO Setup</h2>
        <p className="text-muted-foreground text-center">Enter your AWS SSO portal URL to begin.</p>
      </div>

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
    </div>
  );
};
