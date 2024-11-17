import { Database, Delete, Edit, MoreHorizontal, MoreVertical, PlusCircle, Trash } from "lucide-react";
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
import { type SSOIntegration, SSOIntegrationSchema, AWSRegions } from "@shared/sso-integration";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormItem, FormLabel } from "../Form";
import { ComboBox } from "../ComboBox";
import { useState } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../PopOver";

export const IntegrationItem = ({ integration }: { integration: SSOIntegration }) => {
  const { setIntegrations, integrations } = useTableStore();

  const handleDelete = () => {
    setIntegrations(integrations.filter((i) => i.alias !== integration.alias));
  };

  return (
    <div className="flex flex-row justify-between w-full">
      <div className="flex flex-row items-center gap-2">
        <Database />
        {integration.alias}
      </div>
      <Popover>
        <PopoverTrigger>
          <MoreVertical className="cursor-pointer text-xs h-4" />
        </PopoverTrigger>
        <PopoverContent className="w-fit p-0 flex flex-col gap-1">
          <Button variant="ghost" className="w-full">
            <Edit />
            Edit
          </Button>
          <Button variant="ghost" className="w-full" onClick={handleDelete}>
            <Trash />
            Delete
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

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
                  <IntegrationItem integration={integration} />
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
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="flex items-center gap-2">
        <PlusCircle />
        <span>Add integration</span>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="sr-only">Add integration</DialogTitle>
        <DialogHeader>Add integration</DialogHeader>
        <AddIntegrationForm close={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

const AddIntegrationForm = ({ close }: { close: () => void }) => {
  const { setIntegrations, integrations } = useTableStore();
  const form = useForm<SSOIntegration>({
    resolver: zodResolver(SSOIntegrationSchema),
    mode: "onTouched",
    defaultValues: {
      alias: "",
      portalUrl: "",
      awsRegion: "ap-southeast-2",
      integrationType: "AWS",
      method: "browser",
    },
  });
  const { register } = form;

  const onSubmit = (data: SSOIntegration) => {
    //for now store with zustand
    if (integrations.find((integration) => integration.alias === data.alias)) {
      form.setError("alias", { message: "Alias already exists" });
      return;
    }
    setIntegrations([...integrations, data]);
    close();
  };

  console.log(form.formState.errors);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <FormItem>
            <FormLabel>Alias</FormLabel>
            <Input {...register("alias")} placeholder="Alias" />
          </FormItem>
          <div className="text-red-500 text-xs">{form.formState.errors.alias?.message}</div>
          <FormItem>
            <FormLabel>Portal URL</FormLabel>
            <Input {...register("portalUrl")} placeholder="Portal URL" />
          </FormItem>
          <div className="text-red-500 text-xs">{form.formState.errors.portalUrl?.message}</div>
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
