import React, {useEffect, useState} from 'react';
import LnTable from '../../components/ln_react_table'
import verSrv from '../../service/service'
import {EditFilled} from '@ant-design/icons'
import {Button, Modal, Form, Input, message, Select, Row, Col, Pagination, Tooltip} from 'antd'
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
let columns = [];
let page = 1;
let rows = 10;
export default function Brand() {
    const [keys, setKeys] = useState('');
    const [totalItem, setTotalItem] = useState(1);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [iconUrl, setIconUrl] = useState('')
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

        // setVisible(true)

    }

    // 自定义编辑函数
    const editData = (e) => {
        //

    }
    // 自定义删除事件
    const delDataClick = () => {
        console.log('删除');
    }
    // 弹窗确认点击事件
    const handleCancel = () => {
        console.log('取消');
        setVisible(false)
        resetData()
    }
    // 弹窗确认点击击事件
    const handleOk = () => {
        // 效验参数是否填写
        form.submit();
    }
    // from 表单效验成功后回调的函数
    const onFinish = () => {

        // if (resFlag === 'add') {
        // 	verSrv.addIconInfo(subIconData).then(val => {
        // 		if (val.code === 0){
        // 			resetData()
        // 		}else {
        // 			message.error(val.msg)
        // 		}
        // 	})
        // }else {
        // 	verSrv.updateIconInfo(subIconData).then(val => {
        // 		if (val.code === 0){
        // 			resetData()
        // 		}else {
        // 			message.error(val.msg)
        // 		}
        // 	})
        // }

    }
    // 重置函数
    const resetData = () => {
        setVisible(false)
        form.resetFields();
        setIconUrl('')
        initBrandTableList();
        setResFlag('add')
    }
    // 列表的操作按钮视图
    const btnList = (e) => {
        return <div>
            {/* eslint-disable-next-line no-use-before-define */}
            <label style={{margin: '4px 16px'}} onClick={() => {
                editData(e)
            }}><EditFilled/></label>
            {/*<label onClick={() => {delDataClick(e)}}><DeleteFilled /></label>*/}
        </div>
    }


    // 表单视图
    const formValue = <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}
                            validateMessages={validateMessages}>

        <Form.Item name={'subtitle'} label="副标题" rules={[{required: true}]}>
            <Input/>
        </Form.Item>
        <Form.Item name={'icon_link'} label="ICON链接" rules={[{required: true}]}>
            <Row>
                <Col span={19}>
                    <Input disabled={true} value={iconUrl}/>
                </Col>
                <Col span={5}>
                    <fileContext.Provider value={'img'}>
                        <LnUploadFile changeUrl={(url) => {
                            setIconUrl(url);
                            form.setFieldsValue({
                                icon_link: url
                            })
                        }}/>
                    </fileContext.Provider>

                </Col>
            </Row>
        </Form.Item>
        <Form.Item name={'website_url'} label="官网地址" rules={[{required: false}]}>
            <Input/>
        </Form.Item>
        <Form.Item name={'game_sign'} label="游戏标识符" rules={[{required: false}]}>
            <Input/>
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
            <div className="btn-list">
                <Button type="primary" onClick={showAddModel}>新增</Button>
                {/*<Button type="primary" onClick={() => {console.log(url)}}>获取url</Button>*/}
            </div>
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
            </div>

        </div>
    )
}
