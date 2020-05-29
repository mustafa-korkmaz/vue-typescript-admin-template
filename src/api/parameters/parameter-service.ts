import httpService from '@/utils/http'
import { IApiResponse, IPagedList } from '../types'
import { IParameter, IParameterQuery } from './types'

export const defaultParameter: IParameter = {
  id: null,
  name: '',
  order: 0,
  parameter_type_id: null
}

export const defaultParameterQuery: IParameterQuery = {
  offset: 0,
  limit: 10,
  name: null,
  include_records_total: true,
  sort_by: null,
  sort_type: null
}

export function getParameters(params: IParameterQuery) {
  return httpService.request<IParameterQuery, IApiResponse<IPagedList<IParameter>>>({
    url: 'parameters',
    params,
    method: 'get'
  })
}

export function createParameter(parameter: IParameter) {
  const data = {
    name: parameter.name,
    parameter_type_id: parameter.parameter_type_id,
    order: parameter.order
  }
  return httpService.request<any, IApiResponse<number>>({
    url: 'parameters',
    data,
    method: 'post'
  })
}

export function updateParameter(parameter: IParameter) {
  const data = {
    name: parameter.name,
    parameter_type_id: parameter.parameter_type_id,
    order: parameter.order
  }
  return httpService.request<any, IApiResponse<any>>({
    url: `parameters/${parameter.id}`,
    data,
    method: 'put'
  })
}

export function deleteParameter(id: number) {
  return httpService.request<any, IApiResponse<any>>({
    url: `parameters/${id}`,
    method: 'delete'
  })
}
