import { Database, PlusCircle } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../SideBar";
import useTableStore from "@renderer/store";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../Dialog";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Input } from "../Input";
import { Button } from "../Button";
import { SSOIntegration, SSOIntegrationSchema, AWSRegions } from "@shared/sso-integration";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormItem, FormLabel } from "../Form";
import { ComboBox } from "../ComboBox";

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
    mode: "onBlur",
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
          <div className="text-red-500 text-xs col-start-2 pl-[22%]">{form.formState.errors.alias?.message}</div>
          <FormItem>
            <FormLabel>Portal URL</FormLabel>
            <Input {...register("portalUrl")} placeholder="Portal URL" />
          </FormItem>
          <div className="text-red-500 text-xs col-start-2 pl-[22%]">{form.formState.errors.portalUrl?.message}</div>
          <FormItem className="min-w-40 flex flex-col gap-1.5">
            <FormLabel>AWS Region</FormLabel>
            <Controller
              control={form.control}
              name="awsRegion"
              render={({ field }) => (
                <ComboBox
                  options={AWSRegions.map(({ region }) => ({ value: region, label: region }))}
                  onChange={(option) => field.onChange(option.value)}
                  selectedOption={field.value}
                  placeHolder="Select AWS Region"
                />
              )}
            />
          </FormItem>
          <Button type="submit">Add</Button>
        </div>
      </form>
    </FormProvider>
  );
};
