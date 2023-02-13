const capitalized = (word: string): string => word.charAt(0).toUpperCase() + word.slice(1)

// 去除enum类型描述的干扰字符
const reg = /,|，|;|:|-|\.|\s/g

const isEnumLike = (data: IIntegerProperty): data is Required<IIntegerProperty> => {
    // 处理结果; 0 - 未知，1 - 待删除，2 已删除，3 - 等待好友通过，4 - 已重新成为好友
    // 时间类型：1-小时，2-天, 3 - 分钟， 4 - 秒
    // 类型，1客户推送，2群聊推送，3循环推送, 4 - 自动推送
    // 客服在线状态：1.在线，2.离线
    if (!data.description) return false
    return data.description.replace(reg, '').split(/\d+/).length > 1
}

export const getTypeDefine = (data: IObjectProperty, spaceName: string): string => {

    function getBoolDesc(data: IBoolProperty, name: string): string {
        // 返回boolean类型的声明
        return `// ${data.description}
        ${name}: boolean;`
    }

    function getNumberDesc(data: IIntegerProperty, name: string): string {
        if (isEnumLike(data)) {
            resStr = genEnum(data, name) + resStr
            return `// ${data.description}
        ${name}: ${capitalized(name) + 'Enum'};`
        } else {
            // 返回number类型的声明
            return `// ${data.description}
        ${name}: number;`
        }
    }

    function getStringDesc(data: IStringProperty, name: string): string {
        // 返回string类型的声明
        return `// ${data.description}
    ${name}: string;`
    }

    function getArrayDesc(data: IArrayProperty, name: string): string {
        // 根据数组生成IItem类型
        if (data.items.type === 'integer') {
            return getNumberDesc(data.items, name)
        } else if (data.items.type === 'string') {
            return getStringDesc(data.items, name)
        } else if (data.items.type === 'boolean') {
            return getBoolDesc(data.items, name)
        } else if (data.items.type === 'array') {
            throw new Error('暂未处理数组嵌数组的情况')
        } else {
            resStr = genInterface(data.items, name) + resStr
            // console.log('res', resStr)
            // 返回array类型的声明
            return `${name}: ${'I' + capitalized(name)}[]`
        }
    }

    function getObjectDesc(data: IObjectProperty, name: string): string {
        // 根据对象生成IName类型
        resStr = genInterface(data, name || spaceName) + resStr
        if (!name) return ''
        // 返回object类型的声明
        return `// ${data.description}
    ${name}: ${'I' + capitalized(name)}`
    }

    // 生成enum
    function genEnum(data: Required<IIntegerProperty>, name: string): string {
        const cleanStr = data.description.replace(reg, '')
        const enumValues = cleanStr.match(/\d+/g) as unknown as number[]
        const enumTextList = cleanStr.split(/\d+/).slice(-enumValues.length)
        let str = `export enum ${capitalized(name) + 'Enum'} `
        str += '{\n'
        for (let i = 0; i < enumValues.length; i++) {
            str += `${enumTextList[i]} = ${enumValues[i]},`
            str += '\n'
        }
        str += '}\n'
        return str
    }

    // 生成interface
    function genInterface(data: IObjectProperty, name: string): string {
        let str = `export interface ${'I' + capitalized(name)} `
        str += '{\n'
        for (const [key, value] of Object.entries(data.properties)) {
            str += getTypeDesc(value, key)
            str += '\n'
        }
        str += '}\n'
        // console.log(str)
        return str
    }

    function getTypeDesc(data: IProperty, name: string = ''): string {
        switch (data.type) {
            case 'boolean':
                return getBoolDesc(data, name)
            case 'integer':
                return getNumberDesc(data, name)
            case 'string':
                return getStringDesc(data, name)
            case 'array':
                return getArrayDesc(data, name)
            case 'object':
                return getObjectDesc(data, name)
        }
    }

    let resStr = ''
    const res = getTypeDesc(data)
    resStr += res
    return resStr
}