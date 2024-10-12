import { Table } from "dynamodb-toolbox/table";
import { Entity } from "dynamodb-toolbox/entity";
import { list } from "dynamodb-toolbox";

let region = "ap-southeast-2";
let tableName: undefined | string = undefined;

const DDBTable = new Table({
  name: "DDBTable",
  partitionKey: {
    name: "id",
    type: "string",
  },
});
