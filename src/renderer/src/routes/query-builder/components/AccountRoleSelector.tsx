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
    keywords: [account.accountName ?? account.accountId],
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
              filter={(value, search) => {
                // Find the corresponding option to get the label
                const option = accountOptions.find((opt) => opt.value === value);
                if (!option) {
                  return 0;
                }

                // If no search term, show all options
                if (!search) return 1;

                // Convert both strings to lowercase for case-insensitive comparison
                const searchLower = search.toLowerCase();
                const labelLower = option.label.toLowerCase();

                // Exact match gets highest priority
                if (labelLower === searchLower) {
                  return 1;
                }

                // Starts with search term gets second priority
                if (labelLower.startsWith(searchLower)) {
                  return 0.8;
                }

                // Contains search term gets third priority
                if (labelLower.includes(searchLower)) {
                  return 0.6;
                }

                // Words that contain parts of the search term get fourth priority
                const searchParts = searchLower.split(/\s+/);
                const matchesAllParts = searchParts.every((part) => labelLower.includes(part));
                if (matchesAllParts) {
                  return 0.4;
                }

                // No match
                return 0;
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
