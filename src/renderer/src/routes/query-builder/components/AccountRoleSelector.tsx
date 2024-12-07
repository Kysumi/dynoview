import type { AWSAccount } from "@shared/aws-accounts";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import type { TSSOuser } from "@shared/table-query";
import { Users, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@renderer/components/PopOver";
import { Button } from "@renderer/components/Button";
import { ComboBox } from "@renderer/components/ComboBox";
import { Label } from "@renderer/components/Label";

interface AccountRoleSelectorProps {
  accounts: AWSAccount[];
}

export const AccountRoleSelector = ({ accounts }: AccountRoleSelectorProps) => {
  const { control, setValue } = useFormContext<TSSOuser>();

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
                  setValue("roleName", account.roles[0].roleName);
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
