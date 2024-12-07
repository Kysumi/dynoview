export interface AWSRole {
  roleName: string;
  accountId: string;
}

export interface AWSAccount {
  accountId: string;
  accountName?: string;
  emailAddress?: string;
  roles?: AWSRole[];
}

export interface AccountRoleMapping {
  accounts: AWSAccount[];
  isLoading: boolean;
  error?: string;
}
