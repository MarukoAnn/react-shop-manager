import React, {useEffect, useState} from 'react';
import LnTable from '../../components/ln_react_table'
import verSrv from '../../service/service'
import {EditFilled} from '@ant-design/icons'
import {Button, Modal, Form, Input, message, Select, Row, Col, Switch, Tooltip} from 'antd'
import {tableContext, fileContext} from '../../util/context'
import LnUploadFile from '../../components/ln_upload_chunk'
import './brand.scss'
// 设置btn 按钮
const layout = {
	labelCol: { span: 4 },
	wrapperCol: { span: 18 },
};
const { Option } = Select;
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

export default function Brand(){

	const [columns, setColumns] = useState([]);
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [visible, setVisible] = useState(false);
	const [gameList, setGameList] = useState([]);
	const [gameType, setGameType] = useState('')
	const [iconUrl, setIconUrl] = useState('')
	const [resFlag, setResFlag] = useState('add')
	const [form] = Form.useForm();
	// 生命周期钩子
	useEffect(() => {
		initBrandTableList();
	}, [])

	// 初始化列表函数
	const  initBrandTableList = () => {
		setLoading(true)
		verSrv.getBrandList(`key=o&page=1&rows=9999&sortBy=id&desc=false`).then(val => {
			console.log(val);
			const header = [{
				title: 'id',
				key: 'id',
				fixed: 'right',
			},{
				title: '名称',
				key: 'name',
				fixed: 'right',
			},{
				title: '图片地址',
				key: 'image',
				fixed: 'right',
			},{
				title: '字母',
				key: 'letter',
				fixed: 'right',
			}];
			val.data.header.forEach(val => {
				header.push({title: val.name, dataIndex: val.id});
			})
			header.forEach(v => {
				// 设置行省略过长的数据,
				v.ellipsis = {showTitle: false,}
				// 使用 tooltip 显示省略的数据
				v.render = (row) => {
					return   <Tooltip placement="topLeft" title={row}>
						{row}
					</Tooltip>
				}
			})
			header.push(
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
			setColumns(header)
			setLoading(false)
			setData(val.data.items.map((val, index) => {
				val.key = index + 1
				return val
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
	const  handleCancel = () => {
		console.log('取消');
		setVisible(false)
		resetData()
	}
	// 弹窗确认点击击事件
	const  handleOk = () => {
		// 效验参数是否填写
		form.submit();
	}
	// from 表单效验成功后回调的函数
	const onFinish = () => {
		const subIconData = JSON.parse(JSON.stringify(form.getFieldsValue()));
		gameList.forEach(val => {
			if (val.game_id === subIconData.game_id){
				subIconData.game_name = val.game_name
			}
		})
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
		initBrandTableList(gameType);
		setResFlag('add')
	}

	// 列表的操作按钮视图
	const btnList = (e) => {
		return <div>
			{/* eslint-disable-next-line no-use-before-define */}
			<label style={{margin: '4px 16px'}} onClick={() => {editData(e)}}><EditFilled /></label>
			{/*<label onClick={() => {delDataClick(e)}}><DeleteFilled /></label>*/}
		</div>
	}


	// 表单视图
	const formValue =  <Form {...layout} form={form} name="control-hooks" onFinish={onFinish} validateMessages={validateMessages}>
		<Form.Item name={'game_id'} label="游戏" rules={[{ required: true }]}>
			<Select  placeholder="请选择游戏">
				{
					gameList.map(v => {
						return <Option key={v.game_id} value={v.game_id}>{v.game_name}</Option>
					})
				}
			</Select>
		</Form.Item>
		<Form.Item name={'subtitle'} label="副标题" rules={[{ required: true }]}>
			<Input />
		</Form.Item>
		<Form.Item name={'icon_link'} label="ICON链接" rules={[{ required: true }]}>
			<Row>
				<Col span={19}>
					<Input  disabled={true} value={iconUrl}/>
				</Col>
				<Col span={5}>
					<fileContext.Provider value={'img'}>
						<LnUploadFile changeUrl={(url) => {setIconUrl(url);form.setFieldsValue({
							icon_link: url})}}/>
					</fileContext.Provider>

				</Col>
			</Row>
		</Form.Item>
		<Form.Item name={'website_url'} label="官网地址" rules={[{ required: false }]}>
			<Input />
		</Form.Item>
		<Form.Item name={'game_sign'} label="游戏标识符" rules={[{ required: false }]}>
			<Input />
		</Form.Item>
	</Form>

	// 弹窗视图
	const Model =  <Modal
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
			<div>
				<Select  placeholder="请选择游戏" style={{width: '12%',marginRight: '10px'}}  onChange={(e) => {console.log(e);setGameType(e)}}>
					{
						gameList.map(v => {
							return <Option key={v.game_id} value={v.game_id}>{v.game_name}</Option>
						})
					}
				</Select>
				<Button onClick={() => {initBrandTableList(gameType)}} style={{background: '#27904C',color: '#fff',border: '1px solid #27904C'}}>搜索</Button>
			</div>
			<div className="btn-list">
				<Button type="primary" onClick={showAddModel}>新增</Button>
				{/*<Button type="primary" onClick={() => {console.log(url)}}>获取url</Button>*/}
			</div>
			<div className="table-body">
				{/*父子传参*/}
				<tableContext.Provider value={{header: columns, value: data, loading: loading}}>
					<LnTable  />
				</tableContext.Provider>
			</div>
			<div>
				{Model}
			</div>

		</div>
	)
}
