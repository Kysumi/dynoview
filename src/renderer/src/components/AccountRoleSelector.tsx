import type { AWSAccount } from "@shared/aws-accounts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";

interface AccountRoleSelectorProps {
  accounts: AWSAccount[];
  onSelect: (accountId: string, roleName: string) => void;
}

export const AccountRoleSelector = ({ accounts, onSelect }: AccountRoleSelectorProps) => {
  return (
    <div className="space-y-4">
      {accounts.map((account) => (
        <div key={account.accountId} className="space-y-2">
          <div className="font-medium">
            {account.accountName || account.accountId}
            {account.emailAddress && (
              <span className="text-sm text-muted-foreground ml-2">({account.emailAddress})</span>
            )}
          </div>

          <Select onValueChange={(roleName) => onSelect(account.accountId, roleName)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {account.roles?.map((role) => (
                <SelectItem key={role.roleName} value={role.roleName}>
                  {role.roleName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
};
