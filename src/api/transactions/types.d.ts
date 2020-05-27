import { IPagedListQuery } from '../types'
import { ICustomer } from '../customers/types'
import { IParameter } from '../parameters/types'

export interface ITransaction {
    id: number
    customer: ICustomer
    type: IParameter
    amount: number
    description: string | null
    is_debt: boolean | null
    date_text: string | null
    created_at_text: string | null
    modified_at_text: string | null
}

export interface ITransactionQuery extends IPagedListQuery {
    customer_id: number | null
    type_id: number | null
    is_debt: boolean | null
}
