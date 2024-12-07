import type { AWSAccount } from "@shared/aws-accounts";
import { ComboBox } from "./ComboBox";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import type { TSSOuser } from "@shared/table-query";
import { Popover, PopoverContent, PopoverTrigger } from "./PopOver";
import { Users, ChevronsUpDown } from "lucide-react";
import { Button } from "./Button";
import { Label } from "./Label";

interface AccountRoleSelectorProps {
  accounts: AWSAccount[];
}

export const AccountRoleSelector = ({ accounts }: AccountRoleSelectorProps) => {
  const { control } = useFormContext<TSSOuser>();

  const selectedAccountId = useWatch({
    control,
    name: "accountId",
  });

  const selectedRoleName = useWatch({
    control,
    name: "roleName",
  });

  const selectedAccount = accounts.find((account) => account.accountId === selectedAccountId);

  const accountOptions = accounts.map((account) => ({
    value: account.accountId,
    label: account.accountName || account.accountId,
  }));

  const roleOptions =
    selectedAccount?.roles?.map((role) => ({
      value: role.roleName,
      label: role.roleName,
    })) ?? [];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"}>
          <Users />
          <span className="truncate">
            {selectedAccount
              ? `${selectedAccount.accountName || selectedAccount.accountId} / ${selectedRoleName}`
              : "Select Account & Role"}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col w-80 gap-2">
        <Label>Account</Label>
        <Controller
          control={control}
          name="accountId"
          rules={{ required: true }}
          render={({ field }) => (
            <ComboBox
              placeHolder="Select Account"
              selectedOption={field.value}
              options={accountOptions}
              onChange={(option) => {
                const account = accounts.find((a) => a.accountId === option.value);
                if (account?.roles?.[0]) {
                  field.onChange(account.accountId);
                }
              }}
            />
          )}
        />

        <Label>Role</Label>
        <Controller
          control={control}
          name="roleName"
          rules={{ required: true }}
          render={({ field }) => (
            <ComboBox
              placeHolder="Select Role"
              selectedOption={field.value}
              options={roleOptions}
              onChange={(option) => {
                if (selectedAccount) {
                  field.onChange(option.value);
                }
              }}
              disabled={!selectedAccount}
            />
          )}
        />
      </PopoverContent>
    </Popover>
  );
};
