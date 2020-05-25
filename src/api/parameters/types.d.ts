import { IPagedListQuery } from '../types'
import { ParameterTypeId } from '@/utils/enums';

export interface IParameter {
    id: number
    name: string
    parameter_type_id: ParameterTypeId | null
    order: number
}

export interface IParameterQuery extends IPagedListQuery {
    name: string | null
}

