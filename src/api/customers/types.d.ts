import { IPagedListQuery } from '../types'

export interface ICustomer {
    id: number | null
    authorized_person_name: string
    title: string
    phone_number: string
    created_at: Date | null
    receivable_balance: number
    debt_balance: number
    remaining_balance: number
    receivables_amount: number
    debts_amount: number
}

export interface ICustomerQuery extends IPagedListQuery {
    authorized_person_name: string | null
    title: string | null
}
