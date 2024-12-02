import type { AWSAccount } from "@shared/aws-accounts";
import { ComboBox } from "./ComboBox";
import { FormItem, FormLabel } from "./Form";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import type { TSSOuser } from "@shared/table-query";

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
    <div className="flex gap-2">
      <FormItem>
        <FormLabel className="block">Account</FormLabel>
        <Controller
          control={control}
          name="accountId"
          rules={{ required: true }}
          defaultValue={selectedAccountId}
          render={({ field }) => (
            <ComboBox
              placeHolder="Select Account"
              selectedOption={selectedAccountId}
              options={accountOptions}
              onChange={(option) => {
                const account = accounts.find((a) => a.accountId === option.value);
                if (account && account.roles?.[0]) {
                  // onSelect(account, account.roles[0].roleName);
                  field.onChange(account.accountId);
                }
              }}
            />
          )}
        />
      </FormItem>

      <FormItem>
        <FormLabel className="block">Role</FormLabel>
        <Controller
          control={control}
          name="roleName"
          rules={{ required: true }}
          defaultValue={selectedRoleName}
          render={({ field }) => (
            <ComboBox
              placeHolder="Select Role"
              selectedOption={selectedRoleName}
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
      </FormItem>
    </div>
  );
};
