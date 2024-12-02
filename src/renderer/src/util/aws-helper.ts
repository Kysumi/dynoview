import type { AccountRoleMapping, AWSAccount } from "@shared/aws-accounts";

export async function mapAccountsToRoles(accessToken: string): Promise<AccountRoleMapping> {
  try {
    const accounts = await window.electron.ipcRenderer.invoke("aws:list-accounts", accessToken);

    const accountPromises = accounts.map(async (account: AWSAccount) => {
      try {
        const roles = await window.electron.ipcRenderer.invoke("aws:list-roles", {
          accessToken,
          accountId: account.accountId,
        });

        return {
          ...account,
          roles: roles.map((role) => ({
            roleName: role.roleName,
            accountId: account.accountId,
          })),
        };
      } catch (error) {
        console.error(`Failed to fetch roles for account ${account.accountId}:`, error);
        return {
          ...account,
          roles: [],
        };
      }
    });

    const accountsWithRoles = await Promise.all(accountPromises);

    return {
      accounts: accountsWithRoles,
      isLoading: false,
    };
  } catch (error) {
    console.error("Failed to map accounts to roles:", error);
    return {
      accounts: [],
      isLoading: false,
      error: error instanceof Error ? error.message : "Failed to fetch accounts and roles",
    };
  }
}
