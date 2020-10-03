import React, {useState, useEffect, useContext,} from "react";
import { Table, Radio, Divider } from 'antd';
import {tableContext} from '../util/context'
import {PlusOutlined} from '@ant-design/icons'
import './table.css'
function lnTable(props){
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const tabledata = useContext(tableContext)
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [key, setKey] = useState('')
	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(() => {
		console.log(tabledata.value)
	}, [])

	const rowSelection = {
	 onChange: (selectedRowKeys, selectedRows) => {
		 console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
	 },
	 getCheckboxProps: record => ({
		 name: record.name,
	 }),
	};
	const onExpands = (e, row) => {
		setKey(row.key)
		props.treeOnChnage(row)
		console.log(row.key)
	}


	return(
		<div>
			<Divider />
			<Table
				rowSelection={{
					type: 'checkbox',
					...rowSelection,
				}}
				loading={tabledata.loading}
				columns={tabledata.header}
				dataSource={tabledata.value}
				scroll={{ x: 1000, y: 540 }}
				pagination={false}
				defaultExpandedRowKeys={key}
				onExpand={onExpands}
				footer={tabledata.isFooter? () => <div onClick={props.addTableClick}><span style={{'margin': '10px'}}>新增节点</span><PlusOutlined /></div>: false}
			/>
		</div>
	)
}





export default lnTable
