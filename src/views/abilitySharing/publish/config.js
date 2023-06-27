const personManagementTable = ({ getType }) => ({
    columns: [
        {
            label: "API名称",
            prop: "apiName",
            // sortable: true,
        },
        {
            label: "所属分类",
            prop: "groupId",
            // sortable: true,
            type: "function",
            callback: (row, prop) => getType(row, prop),
        },
        {
            label: "HTTP方法",
            prop: "outputMethod",
            // sortable: true,
        },
        {
            label: "请求路径",
            prop: "outputPath",
            // sortable: true,
        },
        {
            label: "描述",
            prop: "describe",
            // sortable: true,
        },
        {
            label: "创建时间",
            prop: "createTime",
            // sortable: true,
        },
        {
            label: "发布状态",
            prop: "status",
            // sortable: true,
            type: 'customIcon',
            operateSlot: 'status'
        },
        {
            label: "操作",
            type: "operate",
            operateSlot: 'operate',
            width: 250
        },
    ],
    editPathname: "/addTask",
    listUrl: '/jxict-project-sso/share/info/page',

})
const apiEditConfig = [
    {
        title: '基本信息',
        icon: 'icon-cart',
        content: [
            {
                label: 'API名称',
                value: 'apiName',
                isModify: true
            },
            {
                label: '所属分组',
                value: 'groupName',
                isModify: true
            },
            {
                label: '描述信息',
                value: 'describe',
                isModify: true
            },
        ]
    },
    {
        title: 'API请求',
        icon: 'icon-login',
        content: [
            {
                label: '请求Path',
                value: 'outputPath',
                isModify: false
            },
            {
                label: 'HTTP Method',
                value: 'outputMethod',
                isModify: false
            },
        ]
    },
    {
        title: 'API后端服务',
        icon: 'icon-wallet',
        content: [
            {
                label: '后端服务协议',
                value: 'insideProtocol',
                isModify: true
            },
            {
                label: '后端服务地址',
                value: 'insideAddress',
                isModify: true
            },
            {
                label: '后端请求Path',
                value: 'insidePath',
                isModify: true
            },
            {
                label: '后端超时时间',
                value: 'timeout',
                isModify: true
            },
        ]
    },
    {
        title: '返回结果',
        icon: 'icon-check-circle',
        content: [
            {
                label: '返回结果示例',
                value: 'retSuccess',
                isModify: true,
                textarea: true
            },
            {
                label: '失败返回结果示例',
                value: 'retFail',
                isModify: true,
                textarea: true
            },
        ]
    }
]

const apiDetailBtnConfig = {
    1: ['next'],// 第1步    
    2: ['prev', 'next'],// 第2步
    3: ['prev', 'next'],// 第3步
    4: ['prev', 'submit'],// 第4步
}
export default { personManagementTable, apiEditConfig, apiDetailBtnConfig }