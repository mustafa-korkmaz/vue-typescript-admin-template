export enum ResponseCode {
    InternalError = -3,
    ValidationError = -2,
    Fail = -1,
    Success = 0,
    Warning = 1
  }

export enum ParameterTypeId {
    TransactionType_Receivable = 1,
    TransactionType_Debt = 2
}
