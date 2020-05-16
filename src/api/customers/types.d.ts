import { IPagedListQuery } from "../types";

export interface ICustomer {
    authorized_person_name: string
    id: number
    title: string,
    phone_number: string
    created_at_text: string
    remaining_balance: number,
    receivables_amount: number,
    debts_amount: number
}

export interface ICustomerQuery extends IPagedListQuery {
    authorized_person_name: string | null
    title: string | null
}