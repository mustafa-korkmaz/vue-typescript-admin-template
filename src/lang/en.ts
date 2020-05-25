export default {
  route: {
    dashboard: 'Dashboard',
    documentation: 'Documentation',
    guide: 'Guide',
    permission: 'Permission',
    pagePermission: 'Page Permission',
    rolePermission: 'Role Permission',
    directivePermission: 'Directive Permission',
    icons: 'Icons',
    components: 'Components',
    tinymce: 'Tinymce',
    markdown: 'Markdown',
    jsonEditor: 'JSON Editor',
    splitPane: 'SplitPane',
    avatarUpload: 'Avatar Upload',
    dropzone: 'Dropzone',
    sticky: 'Sticky',
    countTo: 'Count To',
    componentMixin: 'Mixin',
    backToTop: 'Back To Top',
    draggableDialog: 'Draggable Dialog',
    draggableKanban: 'Draggable Kanban',
    draggableList: 'Draggable List',
    draggableSelect: 'Draggable Select',
    charts: 'Charts',
    barChart: 'Bar Chart',
    lineChart: 'Line Chart',
    mixedChart: 'Mixed Chart',
    example: 'Example',
    nested: 'Nested Routes',
    menu1: 'Menu 1',
    'menu1-1': 'Menu 1-1',
    'menu1-2': 'Menu 1-2',
    'menu1-2-1': 'Menu 1-2-1',
    'menu1-2-2': 'Menu 1-2-2',
    'menu1-3': 'Menu 1-3',
    menu2: 'Menu 2',
    table: 'Table',
    dynamicTable: 'Dynamic Table',
    draggableTable: 'Draggable Table',
    inlineEditTable: 'Inline Edit Table',
    complexTable: 'Complex Table',
    tab: 'Tab',
    form: 'Form',
    createArticle: 'Create Article',
    editArticle: 'Edit Article',
    articleList: 'Article List',
    errorPages: 'Error Pages',
    page401: '401',
    page404: '404',
    errorLog: 'Error Log',
    excel: 'Excel',
    exportExcel: 'Export Excel',
    selectExcel: 'Export Selected',
    mergeHeader: 'Merge Header',
    uploadExcel: 'Upload Excel',
    zip: 'Zip',
    pdf: 'PDF',
    exportZip: 'Export Zip',
    theme: 'Theme',
    clipboard: 'Clipboard',
    i18n: 'I18n',
    externalLink: 'External Link',
    profile: 'Profile',
    // mute
    adminSettings: 'Admin Settings',
    customers: 'Customers',
    transactions: 'Transactions',
    settings: 'Settings',
    transactionTypes: 'Transaction Types'
  },
  navbar: {
    logOut: 'Log Out',
    dashboard: 'Dashboard',
    github: 'Github',
    theme: 'Theme',
    size: 'Global Size',
    profile: 'Profile',
    language: 'Language'
  },
  login: {
    title: 'Login Form',
    logIn: 'Login',
    username: 'Username',
    password: 'Password',
    any: 'any',
    thirdparty: 'Or connect with',
    thirdpartyTips: 'Can not be simulated on local, so please combine you own business simulation! ! !'
  },
  documentation: {
    documentation: 'Documentation',
    github: 'Github Repository'
  },
  permission: {
    createRole: 'New Role',
    editPermission: 'Edit',
    roles: 'Your roles',
    switchRoles: 'Switch roles',
    tips: 'In some cases, using v-permission will have no effect. For example: Element-UI  el-tab or el-table-column and other scenes that dynamically render dom. You can only do this with v-if.',
    delete: 'Delete',
    confirm: 'Confirm',
    cancel: 'Cancel'
  },
  guide: {
    description: 'The guide page is useful for some people who entered the project for the first time. You can briefly introduce the features of the project. Demo is based on ',
    button: 'Show Guide'
  },
  components: {
    documentation: 'Documentation',
    tinymceTips: 'Rich text is a core feature of the management backend, but at the same time it is a place with lots of pits. In the process of selecting rich texts, I also took a lot of detours. The common rich texts on the market have been basically used, and I finally chose Tinymce. See the more detailed rich text comparison and introduction.',
    stickyTips: 'when the page is scrolled to the preset position will be sticky on the top.',
    backToTopTips1: 'When the page is scrolled to the specified position, the Back to Top button appears in the lower right corner',
    backToTopTips2: 'You can customize the style of the button, show / hide, height of appearance, height of the return. If you need a text prompt, you can use element-ui el-tooltip elements externally',
    imageUploadTips: 'Since I was using only the vue@1 version, and it is not compatible with mockjs at the moment, I modified it myself, and if you are going to use it, it is better to use official version.',
    changeLanguageTips: 'Switch Language Success'
  },
  table: {
    dynamicTips1: 'Fixed header, sorted by header order',
    dynamicTips2: 'Not fixed header, sorted by click order',
    dragTips1: 'The default order',
    dragTips2: 'The after dragging order',
    title: 'Title',
    importance: 'Importance',
    type: 'Type',
    remark: 'Remark',
    search: 'Search',
    add: 'Add',
    export: 'Export',
    reviewer: 'Reviewer',
    id: 'ID',
    date: 'Date',
    author: 'Author',
    readings: 'Readings',
    status: 'Status',
    actions: 'Actions',
    edit: 'Edit',
    publish: 'Publish',
    draft: 'Draft',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm',
    createdAt: 'Created at',
    createdAtTooltip: 'Created date',
    modifiedAt: 'Modified at',
    modifiedAtTooltip: 'Last modified date',
    selectColumns:'Select columns',
    menu: 'Table menu',
    showColumnSelectionOptions:'Show column selector',
    hideColumnSelectionOptions:'Hide column selector',
    exportToExcel:'Export to Excel'
  },
  example: {
    warning: 'Creating and editing pages cannot be cached by keep-alive because keep-alive\'s \'include\' currently does not support caching based on routes, so now it\'s cached based on component name. If you want to achieve a similar caching effect, you can use a browser caching scheme such as localStorage. Or don\'t use keep-alive\'s \'include\' to cache all pages directly. See details'
  },
  errorLog: {
    tips: 'Please click the bug icon in the upper right corner',
    description: 'Now the management system are basically the form of the spa, it enhances the user experience, but it also increases the possibility of page problems, a small negligence may lead to the entire page deadlock. Fortunately Vue provides a way to catch handling exceptions, where you can handle errors or report exceptions.',
    documentation: 'Document introduction'
  },
  excel: {
    export: 'Export',
    selectedExport: 'Export Selected Items',
    placeholder: 'Please enter the file name (default excel-list)'
  },
  zip: {
    export: 'Export',
    placeholder: 'Please enter the file name (default file)'
  },
  pdf: {
    tips: 'Here we use window.print() to implement the feature of downloading PDF.'
  },
  theme: {
    change: 'Change Theme',
    documentation: 'Theme documentation',
    tips: 'Tips: It is different from the theme-pick on the navbar is two different skinning methods, each with different application scenarios. Refer to the documentation for details.'
  },
  tagsView: {
    refresh: 'Refresh',
    close: 'Close',
    closeOthers: 'Close Others',
    closeAll: 'Close All'
  },
  settings: {
    title: 'Page style setting',
    theme: 'Theme Color',
    showTagsView: 'Open Tags-View',
    showSidebarLogo: 'Sidebar Logo',
    fixedHeader: 'Fixed Header',
    sidebarTextTheme: 'Sidebar Text Theme'
  },
  messages: {
    languageModified: 'Language is set to English',
    success: 'Success',
    confirm: 'Do you want to continue?',
    saved: 'Saved successfully',
    deleted: 'Record has been deleted.'
  },
  form: {
    search: 'Search',
    save: 'Save',
    cancel: 'Cancel',
    approve: 'Approve',
    create: 'Create',
    delete: 'Delete',
    select: 'Select'
  },
  tableActions: {
    name: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
  },
  customersView: {
    title: 'Title',
    authorizedPersonName: 'Authorized person',
    phoneNumber: 'Phone',
    receivablesAmount: 'Receivables',
    debtsAmount: 'Debts',
    remainingBalance: 'Balance',
    createdAt: 'Created at',
    modifiedAt: 'Modified at',
    goToTransactions: 'Go to transactions',
    createCustomer: 'Create customer',
    updateCustomer: 'Edit customer',
    titleRequired: 'Title field is required',
    deleteCustomerWarning: 'Customer information and transactions will be deleted permanantly',
    titlePlaceholder: 'Owner or company name'
  },
  transactionTypesView: {
    name: 'Name',
    namePlaceholder: 'Invoice, bill, etc.',
    debtOrReceivable: 'D/R?',
    debtOrReceivableTooltip: 'Debt/Receivable',
    order: 'Display order',
    orderLabelTooltip: 'Pass 0 if you want alphabetically',
    actions: 'Actions',
    nameRequired: 'Name field is required',
    debtOrReceivableRequired: 'Debt/Receivable field is required',
    orderRequired: 'Display order field is required',
    deleteParameterWarning: 'Transaction type will be deleted permanantly',
    updateTransactionType: 'Edit transaction type',
    createTransactionType: 'Create transaction type',
    receivable: 'Receivable',
    debt: 'Debt'
  },
  transactionsView: {
    customer: 'Customer',
    type: 'Type',
    amount: 'Amount',
    dateText: 'Date',
    description: 'Description',
    dateTextTooltip: 'Transaction date'
  },
  errorMessages: {
    sessionTimeOut: 'Your session has expired. You are being redirected to login page.',
    USER_NOT_FOUND: 'User not found',
    PHONE_NUMBER_FIELD_SHOULD_BE_MIN_10_MAX_12_CHARS: 'Phone number should contain between 10 and 12 chars',
    AUTHORIZED_PERSON_NAME_FIELD_SHOULD_BE_MIN_3_MAX_50_CHARS: 'Authorized person name should contain between 3 and 50 chars',
    UNEXPECTED_ERROR: 'Something went wrong, please try again later',
    PARAMETER_NAME_FIELD_SHOULD_BE_MIN_3_MAX_100_CHARS: 'Name should be min 3 max 100 chars',
    PARAMETER_NAME_FIELD_IS_REQUIRED: 'Name field is required'
  }
}
