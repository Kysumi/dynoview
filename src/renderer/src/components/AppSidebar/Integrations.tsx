import { Database, PlusCircle } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../SideBar";
import useTableStore, { Integration } from "@renderer/store";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../Dialog";
import { Form, FormProvider, useForm } from "react-hook-form";
import { Input } from "../Input";
import { Button } from "../Button";
import { SSOIntegration, SSOIntegrationSchema } from "@shared/sso-intefration";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormItem, FormLabel } from "../Form";

export const Integrations = () => {
  const { integrations } = useTableStore();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Integrations (SSO)</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {integrations.map((integration) => {
            return (
              <SidebarMenuItem key={integration.alias}>
                <SidebarMenuButton>
                  <Database />
                  <div>{integration.alias}</div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
          <SidebarMenuItem>
            <SidebarMenuButton>
              <AddIntegration />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export const AddIntegration = () => {
  return (
    <Dialog>
      <DialogTrigger className="flex items-center gap-2">
        <PlusCircle />
        <span>Add integration</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Add integration</DialogHeader>
        <AddIntegrationForm />
      </DialogContent>
    </Dialog>
  );
};

const AddIntegrationForm = () => {
  const form = useForm<SSOIntegration>({
    resolver: zodResolver(SSOIntegrationSchema),
    mode: "onTouched",
    defaultValues: {
      alias: "",
      portalUrl: "",
      awsRegion: "ap-southeast-2",
    },
  });
  const { register } = form;

  const onSubmit = (data: SSOIntegration) => {
    console.log(data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <FormItem>
            <FormLabel>Alias</FormLabel>
            <Input {...register("alias")} placeholder="Alias" />
          </FormItem>
          <FormItem>
            <FormLabel>Portal URL</FormLabel>
            <Input {...register("portalUrl")} placeholder="Portal URL" />
          </FormItem>
          <FormItem>
            <FormLabel>AWS Region</FormLabel>
            <Input {...register("awsRegion")} placeholder="AWS Region" />
          </FormItem>
          <Button type="submit">Add</Button>
        </div>
      </form>
    </FormProvider>
  );
};
