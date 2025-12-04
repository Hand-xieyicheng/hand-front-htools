// 首页数据默认配置
const DEFAULT_HOME_CONFIG = {
    // 导航栏标题
    navTitle: 'Hand Tools导航',
    // 导航栏副标题
    navSubTitle: '一站式访问你常用的网站和工具',
    // 默认搜索引擎
    defaultSearchEngine: 'baidu',
    // 分类导航数据
    navData: [{
        id: '1',
        name: '分类导航',
        styleId: 'category-nav',
        isQuickLink: false, // 是否快捷链接
        sort: 1, // 排序
        iconName: 'category',
        enabled: true,
        // 子导航数据
        children: [
            {
                id: '1-1',
                webSiteId: '1001', // 关联的webSite信息
                name: 'Figma',
                description: 'HiFAi design',
                url: 'https://www.figma.com/',
                imgUrl: 'https://files.codelife.cc/icons/figma.svg',
                bgColor: '#499effff',
                enabled: true,
                category: ['设计', '分享', '问答'],
                sort: 1, // 排序
                rate: 4.5, // 评分
                width: 32, // 图标宽度
                height: 32, // 图标高度
            }, {
                id: '1-2',
                webSiteId: '1001', // 关联的webSite信息
                name: '稀土掘金',
                description: '稀土掘金是一个专业的技术社区，专注于分享最新的技术文章、项目案例、工具推荐等。',
                url: 'https://juejin.cn/',
                imgUrl: 'https://files.codelife.cc/icons/juejin.svg',
                bgColor: '#307fffff',
                enabled: true,
                category: ['设计', '分享', '问答'],
                sort: 2, // 排序
                rate: 4.5, // 评分
                width: 32, // 图标宽度
                height: 32, // 图标高度
            }, {
                id: '1-3',
                webSiteId: '1001', // 关联的webSite信息
                name: '扣子',
                description: '扣子是一个专业的技术社区，专注于分享最新的技术文章、项目案例、工具推荐等。',
                url: 'https://www.coze.cn/',
                imgUrl: 'https://files.codelife.cc/icons/coze.cn.svg',
                bgColor: '#4d54e9',
                enabled: true,
                category: ['设计', '分享', '问答'],
                sort: 2, // 排序
                rate: 4.5, // 评分
                width: 32, // 图标宽度
                height: 32, // 图标高度
            }, {
                id: '1-4',
                webSiteId: '1001', // 关联的webSite信息
                name: 'Hand门户',
                description: 'Hand门户',
                url: 'https://www.hand-portal.com/',
                imgUrl: 'https://file-manager.hand-china.com/hand-hskp-login/4/HAND/d4c717af957a49849c523b4f5141e246@HAND logo(带slogan).png',
                bgColor: '#ffffff',
                enabled: true,
                category: ['设计', '分享', '问答'],
                sort: 2, // 排序
                rate: 4.5, // 评分
                width: 100, // 图标宽度
                height: 32, // 图标高度
            }, {
                id: '1-4',
                webSiteId: '1001', // 关联的webSite信息
                name: 'Hand邮箱',
                description: '汉得邮箱',
                url: 'https://mailhz.qiye.163.com/qiyeimage/logo/479335063/1546504112119.png',
                imgUrl: 'http://mailhz.qiye.163.com/qiyeimage/logo/479335063/1546504112119.png',
                bgColor: '#d6e3ffff',
                enabled: true,
                category: ['设计', '分享', '问答'],
                sort: 2, // 排序
                rate: 4.5, // 评分
                width: 100, // 图标宽度
                height: 32, // 图标高度
            },
        ]
    }, {
        id: '2',
        name: '热门推荐',
        styleId: 'recomanded-nav',
        isQuickLink: false, // 是否快捷链接
        sort: 2, // 排序
        iconName: 'category',
        enabled: true,
        // 子导航数据
        children: [
            {
                id: '2-1',
                webSiteId: '1001', // 关联的webSite信息
                name: 'Figma',
                description: 'HiFAi design',
                url: 'https://www.figma.com/',
                imgUrl: 'https://files.codelife.cc/icons/figma.svg',
                bgColor: '#4F46E5',
                enabled: true,
                category: ['设计', '分享', '问答'],
                sort: 1, // 排序
                rate: 4.5, // 评分
                width: 99, // 图标宽度
                height: 99, // 图标高度
            }, {
                id: '1-4',
                webSiteId: '1001', // 关联的webSite信息
                name: 'Hand邮箱',
                description: '汉得邮箱',
                url: 'https://mailhz.qiye.163.com/qiyeimage/logo/479335063/1546504112119.png',
                imgUrl: 'http://mailhz.qiye.163.com/qiyeimage/logo/479335063/1546504112119.png',
                bgColor: '#d6e3ffff',
                enabled: true,
                category: ['设计', '分享', '问答'],
                sort: 2, // 排序
                rate: 4.5, // 评分
                width: 100, // 图标宽度
                height: 32, // 图标高度
            }, {
                id: '1-4',
                webSiteId: '1001', // 关联的webSite信息
                name: 'Hand门户',
                description: 'Hand门户',
                url: 'https://www.hand-portal.com/',
                imgUrl: 'https://file-manager.hand-china.com/hand-hskp-login/4/HAND/d4c717af957a49849c523b4f5141e246@HAND logo(带slogan).png',
                bgColor: '#9cccffff',
                enabled: true,
                category: ['问答'],
                sort: 2, // 排序
                rate: 4.2, // 评分
                width: 100, // 图标宽度
                height: 32, // 图标高度
            }
        ]
    }],
}

// style样式种类定义
const STYLE_ENUM = [
    { id: 'category-nav', name: '分类导航' },
    { id: 'recomanded-nav', name: '热门推荐' },
    { id: 'hot-search', name: '热门搜索' },
]

// 搜索引擎枚举
const SEARCH_ENGINE_ENUM = [
    { id: 'google', name: '谷歌', iconClass: 'fa-google', url: 'https://www.google.com/search?q=' },
    { id: 'baidu', name: '百度', iconClass: 'fa-baidu', url: 'https://www.baidu.com/s?wd=' },
    { id: 'bing', name: '必应', iconClass: 'fa-bing', url: 'https://www.bing.com/search?q=' },
    { id: 'sogou', name: '搜狗', iconClass: 'fa-sogou', url: 'https://www.sogou.com/web?query=' }
]
// 多语言模块数据字段类型定义
const FILED_TYPE_ENUM = [
    { value: 1, label: '公共字段' },
    { value: 2, label: '新字段' },
    { value: 3, label: '已存在字段', },
]
export { DEFAULT_HOME_CONFIG, SEARCH_ENGINE_ENUM, FILED_TYPE_ENUM };
