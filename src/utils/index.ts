// Parse the time to string
export const parseTime = (
  time?: object | string | number | null,
  cFormat?: string
): string | null => {
  if (time === undefined || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date: Date
  if (typeof time === 'object') {
    date = time as Date
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: { [key: string]: number } = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return timeStr
}

// Format and filter json data using filterKeys array
export const formatJson = (filterKeys: any, jsonData: any) =>
  jsonData.map((data: any) => filterKeys.map((key: string) => {
    if (key === 'timestamp') {
      return parseTime(data[key])
    } else {
      return data[key]
    }
  }))

// Check if an element has a class
export const hasClass = (ele: HTMLElement, className: string) => {
  return !!ele.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

// Add class to element
export const addClass = (ele: HTMLElement, className: string) => {
  if (!hasClass(ele, className)) ele.className += ' ' + className
}

// Remove class from element
export const removeClass = (ele: HTMLElement, className: string) => {
  if (hasClass(ele, className)) {
    const reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

// Toggle class for the selected element
export const toggleClass = (ele: HTMLElement, className: string) => {
  if (!ele || !className) {
    return
  }
  let classString = ele.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  ele.className = classString
}

export const getPriceText = (price: number) => {
  if (!price) {
    return '0.00'
  }

  const number = price.toFixed(2)

  return number.replace(',', '.')
}

export const getDateFormat = (lang: string) => {
  // tr: 14.01.2006 else: 2006-01-14 (ISO)
  if (lang === 'tr') {
    return 'dd.MM.yyyy'
  }
  return 'yyyy-MM-dd'
}

export const getDateStr = (date: Date | null, lang: string) => {
  let monthText = ''
  let dayText = ''

  if (date === null) {
    console.error('date cannot be null')
    return null
  }

  const _date = new Date(date)

  const day = _date.getDate()
  const month = _date.getMonth() + 1
  const yearText = _date.getFullYear().toString()

  if (day < 10) {
    dayText = '0' + day.toString()
  } else {
    dayText = day.toString()
  }

  if (month < 10) {
    monthText = '0' + month.toString()
  } else {
    monthText = month.toString()
  }

  if (lang === 'tr') {
    return dayText + '.' + monthText + '.' + yearText
  }

  return yearText + '-' + monthText + '-' + dayText
}

export const getDatetimeStr = (date: Date | null, lang: string) => {
  let monthText = ''
  let dayText = ''
  let minText = ''
  let result = ''

  if (date === null) {
    console.error('date cannot be null')
    return null
  }

  const _date = new Date(date)

  const day = _date.getDate()
  const month = _date.getMonth() + 1
  const yearText = _date.getFullYear().toString()
  const hours = _date.getHours()
  const mins = _date.getMinutes()

  if (day < 10) {
    dayText = '0' + day.toString()
  } else {
    dayText = day.toString()
  }

  if (month < 10) {
    monthText = '0' + month.toString()
  } else {
    monthText = month.toString()
  }

  if (mins < 10) {
    minText = '0' + mins.toString()
  } else {
    minText = mins.toString()
  }

  if (lang === 'tr') {
    result = dayText + '.' + monthText + '.' + yearText
  } else {
    result = yearText + '-' + monthText + '-' + dayText

  }
  return result + ' ' + hours + ':' + minText
}

export const getDate = (dateText: string, lang: string) => {
  // tr: 14.01.2006 else: 2006-01-14 (ISO)
  let monthText = ''
  let dayText = ''
  let yearText = ''

  if (lang === 'tr') {
    dayText = dateText.toString().substr(0, 2)
    monthText = dateText.toString().substr(3, 2)
    yearText = dateText.toString().substr(6, 4)
  }
  else {
    yearText = dateText.toString().substr(0, 4)
    monthText = dateText.toString().substr(5, 2)
    dayText = dateText.toString().substr(8, 2)
  }

  return new Date(yearText + '-' + monthText + '-' + dayText)
}

/** api desired format for date parameters */
export const getApiDateStr = (date: Date | null) => {
  // tr: 14.01.2006 else: 2006-01-14 (ISO)

  if (date === null) {
    console.error('dateText cannot be null')
    return null
  }

  let monthText = ''
  let dayText = ''

  if (date === null) {
    console.error('date cannot be null')
    return null
  }

  const _date = new Date(date)

  const day = _date.getDate()
  const month = _date.getMonth() + 1
  const yearText = _date.getFullYear().toString()

  if (day < 10) {
    dayText = '0' + day.toString()
  } else {
    dayText = day.toString()
  }

  if (month < 10) {
    monthText = '0' + month.toString()
  } else {
    monthText = month.toString()
  }

  return dayText + '.' + monthText + '.' + yearText
}