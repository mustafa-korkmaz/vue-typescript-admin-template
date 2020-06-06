import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login, getDemoAccount, register } from '@/api/user/account-service'
import { getToken, setToken, removeToken } from '@/utils/cookies'
import router, { resetRouter } from '@/router'
import { PermissionModule } from './permission'
import { TagsViewModule } from './tags-view'
import store from '@/store'

export interface IUserState {
  token: string
  name: string
  avatar: string
  introduction: string
  roles: string[]
  email: string
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || ''
  public name = ''
  public avatar = ''
  public introduction = ''
  public roles: string[] = []
  public email = ''

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_AVATAR(avatar: string) {
    this.avatar = avatar
  }

  @Mutation
  private SET_INTRODUCTION(introduction: string) {
    this.introduction = introduction
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }

  @Mutation
  private SET_EMAIL(email: string) {
    this.email = email
  }

  @Action
  public async Login(userInfo: { email: string, password: string }) {
    let { email, password } = userInfo
    email = email.trim()
    const resp = await login(email, password)
    setToken(resp.data.access_token)
    this.SET_TOKEN(resp.data.access_token)
    this.SET_ROLES(resp.data.roles)
    this.SET_NAME(name)
    this.SET_AVATAR('https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
    //this.SET_INTRODUCTION(introduction)
    this.SET_EMAIL(email)

    // Generate dynamic accessible routes based on roles
    PermissionModule.GenerateRoutes(this.roles)
    // Add generated routes
    router.addRoutes(PermissionModule.dynamicRoutes)
    // Reset visited views and cached views
    TagsViewModule.delAllViews()
  }

  @Action
  public async DemoLogin(lang: string) {

    const password = '12345678'
    const resp = await getDemoAccount(lang, password)

    const username = resp.data
    const loginResp = await login(username, password)
    setToken(loginResp.data.access_token)
    this.SET_TOKEN(loginResp.data.access_token)
  }

  @Action
  public async Register(payload: { email: string, password: string, lang: string }) {

    let { email, password, lang } = payload
    email = email.trim()

    await register(email, password, lang)

    await this.Login({email, password})
  }

  @Action
  public ResetToken() {
    removeToken()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }

  @Action
  public async LogOut() {
    if (this.token === '') {
      throw Error('LogOut: token is undefined!')
    }
    removeToken()
    resetRouter()

    // Reset visited views and cached views
    TagsViewModule.delAllViews()
    this.SET_TOKEN('')
    this.SET_ROLES([])

    router.push('/login')
  }

  @Action
  public async ChangeRoles(role: string) {
    // Dynamically modify permissions
    const token = role + '-token'
    this.SET_TOKEN(token)
    setToken(token)
    //await this.GetUserInfo()

    const roles:string[]=[]
    roles.push('admin') 
    roles.push('editor')
    this.SET_ROLES(roles)

    resetRouter()
    // Generate dynamic accessible routes based on roles
    PermissionModule.GenerateRoutes(this.roles)
    // Add generated routes
    router.addRoutes(PermissionModule.dynamicRoutes)
    // Reset visited views and cached views
    TagsViewModule.delAllViews()
  }
}

export const UserModule = getModule(User)
