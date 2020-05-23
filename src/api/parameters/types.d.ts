import { IPagedListQuery } from '../types'

export interface IParameter {
    id: number
    name: string
    parameter_type_id: number
    order: number
}

export interface IParameterQuery extends IPagedListQuery {
    name: string | null
}
