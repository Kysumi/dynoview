import type { AWSAccount } from "@shared/aws-accounts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@renderer/components/Table/Table";
import { Separator } from "@renderer/components/Separator";

export const AccountsTable = ({ accounts }: { accounts: AWSAccount[] }) => {
  const accountRolePairs = accounts.flatMap(
    (account) =>
      account.roles?.map((role) => ({
        accountId: account.accountId,
        accountName: account.accountName,
        accountEmail: account.emailAddress,
        roleName: role.roleName,
      })) ?? [],
  );

  return (
    <section className="space-y-4">
      <Separator />

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Available Accounts and Roles</h2>
        <p className="text-muted-foreground">These are the AWS accounts and roles available to you through SSO.</p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account Name</TableHead>
              <TableHead>Account ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accountRolePairs.map((pair) => (
              <TableRow key={`${pair.accountId}-${pair.roleName}`}>
                <TableCell>{pair.accountName || "-"}</TableCell>
                <TableCell>{pair.accountId}</TableCell>
                <TableCell>{pair.accountEmail || "-"}</TableCell>
                <TableCell>{pair.roleName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};
