import { useAWSStore } from "@renderer/store/aws-store";
import { AccountRoleSelector } from "./AccountRoleSelector";
import { DatabaseSelector } from "./DatabaseSelector";

export const AccountAndDatabaseBar = () => {
  const { awsConfig } = useAWSStore();

  const first = awsConfig[0];
  return (
    <div className="flex gap-2">
      <AccountRoleSelector accounts={first.accounts} />
      <DatabaseSelector />
    </div>
  );
};
