import React, {useEffect, useState} from 'react';
import LnTable from '../../components/ln_react_table'
import verSrv from '../../service/service'
import {EditFilled, DeleteFilled, ExclamationCircleOutlined, PlusOutlined} from '@ant-design/icons'
import {Button, Modal, Form, Input, Tree, Select, message, Pagination, Tooltip, Switch, InputNumber} from 'antd'
import {tableContext, fileContext} from '../../util/context'
import LnUploadFile from '../../components/ln_upload_chunk'
import './sort.scss'
// 设置btn 按钮
const layout = {
    labelCol: {span: 4},
    wrapperCol: {span: 18},
};
const {Option} = Select;
const {confirm} = Modal;
const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not validate email!',
        number: '${label} is not a validate number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};

let columns = [
    {
        title: '名字',
        dataIndex: 'name',
        key: 'name',
        render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    },
    {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 100,
    },
];
let parentIdList =[]
export default function Sort() {
    const [keys, setKeys] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    // 生命周期钩子
    useEffect(() => {
        initBrandTableList(0);
    }, [])

    // 初始化列表函数
    const initBrandTableList = (data) => {
        setLoading(true)
        verSrv.getSortTree(`pid=${data}`).then(val => {
            // 设置 操作按钮标签
            columns[1].render = (row) => {
                return {children: btnList(row)}
            }
            val.data.forEach((v, index) => {
                v.key = v.id;
                v.children = []
            })
            columns.forEach(v => {
                // 设置行省略过长的数据,
                v.ellipsis = {showTitle: false,}
            })
            // 设置不用加载动画
            setLoading(false)
            setData(val.data);
        })
    }

    // 新增点击函数
    const showAddModel = (e) => {
        if (e !== ''){
            getTreeList(e.parentId, () =>{
                setVisible(true)
            })
        }else {
            parentIdList = [{id: 0, name: '第一级'}];
            setVisible(true)
        }
    }
    // 获取父级id列表
   const getTreeList = (id, callback) => {
        verSrv.getSortTree(`pid=${id}`).then(val => {
            if (val.data){
                parentIdList = val.data;
                callback()
            }
        });
    }
    // 自定义编辑函数
    const editData = (e) => {
        verSrv.getSortInfoById(`ids=${e.id}`).then(val => {
            if (val.data) {
                form.setFieldsValue({
                    'id': val.data[0].id,
                    'name': val.data[0].name,
                    'parentId': val.data[0].parentId,
                    'isParent': val.data[0].isParent,
                    'sort': val.data[0].sort,
                })
            }
            if (val.data[0].parentId !== 0){
                verSrv.getSortTree(`pid=${val.data[0].parentId}`).then(val => {
                    console.log(val)
                    if (val.data){
                        parentIdList = val.data;
                    }
                });
            }else {
                parentIdList = [{id: 0, name: '第一级'}];
            }
            setVisible(true);

        })

    }
    // 自定义删除事件
    const delDataClick = (e) => {
        confirm({
            title: '删除提醒',
            icon: <ExclamationCircleOutlined/>,
            content: '确定要删除该数据吗？',
            cancelText: '取消',
            okText: '确认',
            onOk() {
                verSrv.delSort(e.id).then(val => {
                    if (val.code === 0) {
                        message.success('删除成功');
                        resetData();
                    } else {
                        message.error(val.errorMessage);
                    }
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    // 弹窗确认点击事件
    const handleCancel = () => {
        setVisible(false)
        resetData()
    }

    // 弹窗确认点击击事件
    const handleOk = () => {
        // 效验参数是否填写
        form.submit();
    }
    // 点击根节点查询子节点
    const getTreeValue = (row) => {
        let treeDatas = data;
        verSrv.getSortTree(`pid=${row.id}`).then(val => {
            if (Array.isArray(val.data) && val.data.length > 0) {
                row.children = val.data;
                row.children.forEach((v, index) => {
                    v.key = v.id;
                    v.children = []
                })
                treeDatas = setTreeDataFormat(treeDatas, row);
                console.log(setTreeDataFormat(treeDatas, row))
                // 重置数据
                setData([])
                setData(treeDatas)
            }
        });
    }
    const setTreeDataFormat = (data, value) => {
        if (data.some(v=> {return v.id === value.id})){
            data.forEach(res => {
                if (res.id === value.id){
                    console.log(data)
                    res.children = value.children;
                }
            })
            return data
        }else {
           for (let i=0;i<data.length;i++){
               if (data[i].children.length !== 0){
                   console.log(data[i])
                   setTreeDataFormat(data[i].children, value)
               }
           }
            return data
        }
    }
    // from 表单效验成功后回调的函数
    const onFinish = () => {
        const subSortData = JSON.parse(JSON.stringify(form.getFieldsValue()));
        subSortData.parentId = subSortData.parentId.toString();
        verSrv.addSort(subSortData).then(val => {
            if (val.code === 0) {
                message.success('操作成功');
                resetData()
            } else {
                message.error(val.errorMessage);
            }
        })

    }
    // 重置函数
    const resetData = () => {
        setVisible(false)
        form.resetFields();
        initBrandTableList(0);
    }
    const btnList = (e) => {
        return <div>
            {/* eslint-disable-next-line no-use-before-define */}
            <label onClick={() => {
                showAddModel(e)
            }}><PlusOutlined /></label>
            <label style={{margin: '4px 16px'}} onClick={() => {
                editData(e)
            }}><EditFilled/></label>
            <label onClick={() => {
                delDataClick(e)
            }}><DeleteFilled/></label>
        </div>
    }
    // 表单视图
    const formValue = <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}
                            validateMessages={validateMessages}>
        <Form.Item name={'id'} label="名称" rules={[{required: false}]} hidden={true}>
        </Form.Item>
        <Form.Item name={'name'} label="名称" rules={[{required: true}]}>
            <Input/>
        </Form.Item>
        <Form.Item name={'parentId'} label="父级名称" rules={[{required: true}]}>
            <Select  placeholder="请选择父级名称">
                {
                    parentIdList.map(v => {
                        return <Option key={v.id} value={v.id}>{v.name}</Option>
                    })
                }
            </Select>
        </Form.Item>
        <Form.Item name={'isParent'} label="是否为父级" rules={[{required: true}]} valuePropName={'checked'}
                   initialValue={true}>
            <Switch/>
        </Form.Item>
        <Form.Item name={'sort'} label="排序" rules={[{required: true}]}>
            <InputNumber min={0} max={9999} step={1} placeholder="请输入排序"/>
        </Form.Item>
    </Form>

    // 弹窗视图
    const Model = <Modal
        visible={visible}
        getContainer={false}
        mask={true}
        maskClosable={false}
        width={800}
        title="编辑"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
            <Button key="back" onClick={handleCancel}>
                取消
            </Button>,
            <Button type="primary" onClick={handleOk}>
                确认
            </Button>
        ]}
    >
        {/*form表单*/}
        <div>
            {formValue}
        </div>

    </Modal>

    // 返回视图
    return (
        <div className="brand">
            <div className="header">
                <Input placeholder={'请输入父级id'} onChange={(e) => {
                    setKeys(e.target.value);
                }} onPressEnter={() => {
                    initBrandTableList(keys);
                }} style={{width: 200}}/>
            </div>
            <div className="table-body">
                {/*父子传参*/}
                <tableContext.Provider value={{header: columns, value: data, loading: loading, isFooter: true}}>
                    <LnTable treeOnChnage={getTreeValue}  addTableClick={() => {showAddModel('')}}/>
                </tableContext.Provider>
            </div>
            <div>
                {Model}
            </div>

        </div>
    )
}
