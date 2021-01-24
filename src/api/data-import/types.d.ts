import { ICustomer } from '../customers/types'

export interface IBasicImportRequest {
    language: string
    items: IBasicImportItem[]
}

export interface IDetailedImportRequest {
    language: string
    items: IDetailedImportItem[]
}

export class IBasicImportItem {
    receivable_balance: number
    debt_balance: number
    customer: ICustomer
}

export interface IDetailedImportItem{
    customer: ICustomer
    receivable_balance: number
    debt_balance: number
}
