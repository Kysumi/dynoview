export interface Indexes {
  primary: {
    name: string;
    partitionKey: {
      name: string;
    };
    searchKey: {
      name: string;
    };
  };
  gsiIndexes: {
    name: string;
    partitionKey: {
      name: string;
    };
    searchKey: {
      name: string;
    };
  }[];
}

export interface TableInfo {
  tableName: string;
  indexes: Indexes;
}
