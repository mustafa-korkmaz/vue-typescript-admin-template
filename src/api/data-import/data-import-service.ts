import httpService from '@/utils/http'
import { IApiResponse } from '../types'
import { IBasicImportRequest, IDetailedImportItem, IDetailedImportRequest } from './types'

export function downloadTemplate(name: string) {
  return httpService.request<any, any>({
    url: `Templates/${name}`,
    method: 'get',
    responseType: 'blob'
  })
}

export function importBasic(basicImportRequest: IBasicImportRequest) {
  const data = {
    language: basicImportRequest.language,
    items: basicImportRequest.items
  }
  return httpService.request<any, IApiResponse<number>>({
    url: 'imports/basic',
    data,
    method: 'post'
  })
}

export function importDetailed(detailedImportRequest: IDetailedImportRequest) {
  const data = {
    language: detailedImportRequest.language,
    items: detailedImportRequest.items
  }
  return httpService.request<any, IApiResponse<number>>({
    url: 'imports/detailed',
    data,
    method: 'post'
  })
}
