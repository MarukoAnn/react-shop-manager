import React, {useState, useEffect, useContext} from "react";
import { Table, Radio, Divider } from 'antd';
import {tableContext} from '../util/context'
function lnTable(){
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const data = useContext(tableContext)
	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(() => {
	}, [])

	const rowSelection = {
	 onChange: (selectedRowKeys, selectedRows) => {
		 console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
	 },
	 getCheckboxProps: record => ({
		 // disabled: record.name === 'Disabled User',
		 // Column configuration not to be checked
		 name: record.name,
	 }),
	};


	return(
		<div>
			<Divider />
			<Table
				rowSelection={{
					type: 'checkbox',
					...rowSelection,
				}}
				loading={data.loading}

				columns={data.header}
				dataSource={data.value}
				scroll={{ x: 1000, y: 540 }}
				pagination={false}
			/>
		</div>
	)
}





export default lnTable
