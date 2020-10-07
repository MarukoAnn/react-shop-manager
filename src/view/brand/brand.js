import React, {useEffect, useState} from 'react';
import LnTable from '../../components/ln_react_table'
import verSrv from '../../service/service'
import {EditFilled, PlusOutlined, DeleteFilled, ExclamationCircleOutlined} from '@ant-design/icons'
import {Button, Modal, Form, Input, message, Tree, Select, Row, Col, Pagination, Tooltip} from 'antd'
import {tableContext, fileContext} from '../../util/context'
import LnUploadFile from '../../components/ln_upload_chunk'
import './brand.scss'
// 设置btn 按钮
const layout = {
    labelCol: {span: 4},
    wrapperCol: {span: 18},
};
const {Option} = Select;
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
const {confirm} = Modal;
let columns = [];
let page = 1;
let rows = 10;
let treeData;
let checkKeys = [];
export default function Brand() {
    const [keys, setKeys] = useState('');
    const [totalItem, setTotalItem] = useState(1);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [iconUrl, setIconUrl] = useState(false)
    const [treesVisible, setTreesVisible] = useState('')
    const [treesCheckData, setTreesCheckData] = useState('')
    const [resFlag, setResFlag] = useState('add')
    const [form] = Form.useForm();
    // 生命周期钩子
    useEffect(() => {
        initBrandTableList();
    }, [])

    // 初始化列表函数
    const initBrandTableList = () => {
        setLoading(true)
        verSrv.getBrandList(`key=${keys}&page=${page}&rows=${rows}&sortBy='id'&desc=false`).then(val => {
            setTotalItem(val.data.total);
            columns = [
                {
                    title: '编号',
                    dataIndex: 'id',
                    key: 'id',
                    sorter: (a, b) => a.id - b.id,
                    render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                },
                {
                    title: '名字',
                    dataIndex: 'name',
                    key: 'name',
                    render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                },
                {
                    title: '图片',
                    dataIndex: 'image',
                    key: 'image',
                    render: text => <img src={text} alt=""/>
                },
                {
                    title: '字母',
                    dataIndex: 'letter',
                    key: 'letter',
                    sorter: (a, b) => a.letter.localeCompare(b.letter),
                    render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                },
            ]
            columns.forEach(v => {
                // 设置行省略过长的数据,
                v.ellipsis = {showTitle: false}
            })
            columns.push(
                {
                    title: '操作',
                    key: 'operation',
                    fixed: 'right',
                    width: 100,
                    render: (row) => {
                        return {children: btnList(row)}
                    },
                },
            )
            setLoading(false)
            val.data.items.forEach((v, index) => {
                v.key = index + 1
            })
            setData(val.data.items.map(v => {
                return v
            }));
        })
    }

    // 新增点击函数
    const showAddModel = () => {
        setVisible(true)
        verSrv.getSortTrees(`id=0`).then(value => {
            // console.log(value);
            treeData = initTreeTranform(value.data)
        })
    }

    // 自定义编辑函数
    const editData = (e) => {
        console.log(e);
        verSrv.getSortTrees(`id=0`).then(value => {
            //
            treeData = initTreeTranform(value.data)
            verSrv.getSortById(`id=${e.id}`).then(val => {
                console.log(val)
                setTreesCheckData(val.data.map(v =>  {return {id: v.id, name: v.name}}))
                let ids = val.data.map(v =>  {return v.id})
                let names = val.data.map(v =>  {return v.name})
                form.setFieldsValue({
                    'id': e.id,
                    'name': e.name,
                    'image': e.image,
                    'letter': e.letter,
                    'cids': names.join(','),
                })
                initTreeChecks(treeData, ids);
                setResFlag('update')
                setIconUrl(e.image)
                setVisible(true)

            })
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
                setKeys(e.parentId)
                verSrv.delBrandInfo(e.id).then(val => {
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
    // 查找已选择的树节点
    const initTreeChecks = (data, list) => {
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                if (list.indexOf(data[i].id) !== -1){
                    checkKeys.push(data[i].key)
                }
                if (data[i].children.length > 0) {
                    initTreeChecks(data[i].children, list)
                }
            }
        }
        return data
    }
    // 树结构选择
    const onCheck = (keys, e) => {
        checkKeys= keys;
        let ids = e.checkedNodes.map(v => {
            return {id: v.id, name: v.name}
        })
        setTreesCheckData(ids);
        let name = ids.map(v => {return v.name})
        form.setFieldsValue({cids: name.join(',')})
    }
    // 显示树结构
    const showTreeModal = () => {
        setTreesVisible(true);
        console.log(checkKeys)
    }
    // 设置树结构数据
    const initTreeTranform = (data) => {
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                data[i].title = data[i].name
                if (data[i].children.length > 0) {
                    initTreeTranform(data[i].children)
                }
            }
        }
        return data
    }

    // 树结构弹窗确认
    const handleTreeOk = () => {
        setTreesVisible(false)
    }
    // 树结构弹窗取消
    const handleTreeCancel = () => {
        setTreesVisible(false)
    }
    // from 表单效验成功后回调的函数
    const onFinish = () => {
        const subBrand = JSON.parse(JSON.stringify(form.getFieldsValue()))
        console.log(subBrand)
        subBrand.cids = treesCheckData.map(v => {return v.id});
        if (resFlag === 'add') {
        	verSrv.addBrandInfo(subBrand).then(val => {
        		if (val.code === 0){
                    message.success('操作成功');
        			resetData()
        		}else {
        			message.error(val.errorMessage)
        		}
        	})
        }else {
        	verSrv.updateBrandInfo(subBrand).then(val => {
        		if (val.code === 0){
                    message.success('操作成功');
                    resetData()
        		}else {
        			message.error(val.errorMessage)
        		}
        	})
        }

    }
    // 重置函数
    const resetData = () => {
        setVisible(false)
        form.resetFields();
        setIconUrl('')
        checkKeys = [];
        initBrandTableList();
        setResFlag('add')
    }
    // 列表的操作按钮视图
    const btnList = (e) => {
        return <div>
            {/* eslint-disable-next-line no-use-before-define */}
            <label onClick={() => {
                showAddModel(e)
            }}><PlusOutlined/></label>
            <label style={{margin: '4px 10px'}} onClick={() => {
                editData(e)
            }}><EditFilled/></label>
            <label onClick={() => {delDataClick(e)}}><DeleteFilled /></label>
        </div>
    }


    // 表单视图
    const formValue = <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}
                            validateMessages={validateMessages}>

        <Form.Item name={'id'} label="id" rules={[{required: false}]} hidden={true}>
        </Form.Item>
        <Form.Item name={'name'} label="品牌名称" rules={[{required: true}]}>
            <Input/>
        </Form.Item>
        <Form.Item name={'letter'} label="首字母" rules={[{required: true}]}>
            <Input/>
        </Form.Item>
        <Form.Item name={'cids'} label="所属分类" rules={[{required: true}]}>
            <Input onClick={showTreeModal}/>
        </Form.Item>
        <Form.Item name={'image'} label="品牌logo" rules={[{required: true}]}>
            <img src={iconUrl} alt="" width={140} height={140} style={{'margin-bottom': '10px'}}/>
            <Row>
                <Col span={6}>
                    <fileContext.Provider value={'img'} style={{'width': '100px'}}>
                        <LnUploadFile changeUrl={(url) => {
                            setIconUrl(url);
                            form.setFieldsValue({
                                image: url
                            })
                        }}/>
                    </fileContext.Provider>
                </Col>
            </Row>
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
        {/*下拉框*/}
        <div>
            {formValue}
        </div>

    </Modal>

    // 返回视图
    return (
        <div className="brand">
            <div className="header">
                <Input placeholder={'请输入关键字'} onChange={(e) => {
                    setKeys(e.target.value);
                }} onPressEnter={() => {
                    page = 1;
                    initBrandTableList();
                }} style={{width: 200}}/>
                {/*<Button onClick={() => { }} style={{background: '#27904C',color: '#fff',border: '1px solid #27904C'}}>搜索</Button>*/}
            </div>
            {/*<div className="btn-list">*/}
            {/*    <Button type="primary" onClick={showAddModel}>新增</Button>*/}
            {/*    /!*<Button type="primary" onClick={() => {console.log(url)}}>获取url</Button>*!/*/}
            {/*</div>*/}
            <div className="table-body">
                {/*父子传参*/}
                <tableContext.Provider value={{header: columns, value: data, loading: loading}}>
                    <LnTable/>
                </tableContext.Provider>
            </div>
            <div className="pagation">
                <Pagination
                    total={totalItem}
                    showSizeChanger
                    hideOnSinglePage
                    onChange={(e) => {
                        page = e;
                        initBrandTableList()
                    }}
                    onShowSizeChange={(current, size) => {
                        rows = size;
                        initBrandTableList()
                    }}
                    showTotal={total => `总共 ${total}条`}
                />
            </div>
            <div>
                {Model}
                {/*    树结构弹窗*/}
                <Modal
                    visible={treesVisible}
                    getContainer={false}
                    mask={true}
                    maskClosable={false}
                    width={400}
                    title=""
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleTreeCancel}>
                            取消
                        </Button>,
                        <Button type="primary" onClick={handleTreeOk}>
                            确认
                        </Button>
                    ]}
                >
                    {/*树结构*/}
                    <div>
                        <Tree
                            checkable
                            checkedKeys={checkKeys}
                            onCheck={onCheck}
                            treeData={treeData}
                        />
                    </div>

                </Modal>
            </div>

        </div>
    )
}
