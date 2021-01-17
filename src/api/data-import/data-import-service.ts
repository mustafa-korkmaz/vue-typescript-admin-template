import httpService from '@/utils/http'

export function downloadTemplate(name: string) {
  return httpService.request<any, any>({
    url: `templates/${name}`,
    method: 'get',
    responseType: 'blob',
  })
}
