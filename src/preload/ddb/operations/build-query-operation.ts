interface KeyCondition {
  expression: string;
  values: Record<string, string>;
}

export enum DynamoOperatorsEnum {
  equals = "=",
  less_than = "<",
  less_than_equals = "<=",
  greater_than = ">",
  greater_than_equals = ">=",
  between = "between",
  begins_with = "begins_with",
}

type OperatorHandler = (key: string, value: string) => KeyCondition;

const operatorHandlers: Record<DynamoOperatorsEnum, OperatorHandler> = {
  [DynamoOperatorsEnum.equals]: (key, value) => ({
    expression: `${key} = :${key}`,
    values: { [`:${key}`]: value },
  }),

  [DynamoOperatorsEnum.less_than]: (key, value) => ({
    expression: `${key} < :${key}`,
    values: { [`:${key}`]: value },
  }),

  [DynamoOperatorsEnum.less_than_equals]: (key, value) => ({
    expression: `${key} <= :${key}`,
    values: { [`:${key}`]: value },
  }),

  [DynamoOperatorsEnum.greater_than]: (key, value) => ({
    expression: `${key} > :${key}`,
    values: { [`:${key}`]: value },
  }),

  [DynamoOperatorsEnum.greater_than_equals]: (key, value) => ({
    expression: `${key} >= :${key}`,
    values: { [`:${key}`]: value },
  }),

  [DynamoOperatorsEnum.between]: (key, value) => {
    const [start, end] = value.split(",").map((v) => v.trim());
    return {
      expression: `${key} BETWEEN :${key}Start AND :${key}End`,
      values: {
        [`:${key}Start`]: start,
        [`:${key}End`]: end,
      },
    };
  },

  [DynamoOperatorsEnum.begins_with]: (key, value) => ({
    expression: `begins_with(${key}, :${key})`,
    values: { [`:${key}`]: value },
  }),
};

export const buildQueryOperation = (key: string, value: string, operator: DynamoOperatorsEnum): KeyCondition => {
  const handler = operatorHandlers[operator];
  if (!handler) {
    throw new Error(`Unsupported operator: ${operator}`);
  }
  return handler(key, value);
};
