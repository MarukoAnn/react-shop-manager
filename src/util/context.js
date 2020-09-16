import {createContext} from 'react'
// 创建 context
const tableContext  = createContext(null)
const fileContext = createContext(null)

// // 设置 loading
// const loadingIsContext = createContext(false)
// // 设置 redux
// const IS_SHOW = 'is_show';
//
// // const changeLoadingAction = () => (
// // 	{
// // 		type: IS_SHOW
// // 	}
// // );
// const defaultState = {
// 	loading: true,
// };
// const reducer = (state = defaultState, action) =>{
// 	if (action.type === IS_SHOW){
// 		let newState = JSON.parse(JSON.stringify(state));
// 		newState.loading = !newState.loading;
// 		return newState;
// 	}
// 	return state
// }
export {tableContext, fileContext}
