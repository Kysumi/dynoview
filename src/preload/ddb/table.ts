import { Table } from 'dynamodb-toolbox/table'
import { Entity } from 'dynamodb-toolbox/entity'



const region = "ap-southeast-2";
const tableName: undefined | string = undefined;

const DDBTable = new Table({
    name: 'DDBTable',
    partitionKey: {
        name: 'id',
        type: 'string'
    }
})