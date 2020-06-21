import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import elementVariables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'
import { IUserSettings } from '@/api/user/types'

export interface ISettingsState {
  theme: string
  fixedHeader: boolean
  showSettings: boolean
  showTagsView: boolean
  showSidebarLogo: boolean
  sidebarTextTheme: boolean
}

@Module({ dynamic: true, store, name: 'settings' })
class Settings extends VuexModule implements ISettingsState {
  public theme = elementVariables.theme
  public fixedHeader = defaultSettings.fixedHeader
  public showSettings = defaultSettings.showSettings
  public showTagsView = defaultSettings.showTagsView
  public showSidebarLogo = defaultSettings.showSidebarLogo
  public sidebarTextTheme = defaultSettings.sidebarTextTheme
  public paginationAlign = defaultSettings.paginationAlign

  @Mutation
  private CHANGE_SETTING(payload: { key: string, value: any }) {
    const { key, value } = payload
    if (Object.prototype.hasOwnProperty.call(this, key)) {
      (this as any)[key] = value
    }
  }

  @Action
  public ChangeSetting(payload: { key: string, value: any }) {
    this.CHANGE_SETTING(payload)
  }

  @Action
  public ChangeUserSettings(userSettings: IUserSettings) {
    this.CHANGE_SETTING({ key: 'showTagsView', value: userSettings.open_tags_view })
    this.CHANGE_SETTING({ key: 'fixedHeader', value: userSettings.fixed_header })
    this.CHANGE_SETTING({ key: 'theme', value: userSettings.theme_color })
    this.CHANGE_SETTING({ key: 'paginationAlign', value: userSettings.pagination_align })
  }
}

export const SettingsModule = getModule(Settings)
