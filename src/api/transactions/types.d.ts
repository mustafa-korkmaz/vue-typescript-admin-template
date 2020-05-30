import { IPagedListQuery } from '../types'
import { ICustomer } from '../customers/types'
import { IParameter } from '../parameters/types'

export interface ITransaction {
    id: number
    customer: ICustomer
    customer_id: number | null
    type: IParameter
    type_id: number | null
    amount:  number | null
    description: string | null
    is_debt: boolean | null
    date: Date | null
    date_text: string | null
    created_at:  Date | null
    modified_at:  Date | null
}

export interface ITransactionQuery extends IPagedListQuery {
    customer_id: number | null
    type_id: number | null
    is_debt: boolean | null
}
