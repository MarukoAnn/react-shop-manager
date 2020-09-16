const {override, fixBabelImports} = require('customize-cra');
// import { matchRoutes, renderRoutes } from "react-router-config";
const path = require('path')
module.exports = override(
   fixBabelImports('antd', {
   	   libraryBirctory: 'es',
	   style: 'css'
   }), (config => {
   	// 暴露webpack的配置config, env
   	const paths = require('react-scripts/config/paths')
	// 配置打包目录输出到dist/front中
    paths.appBuild = path.join(path.dirname(paths.appBuild), 'dist/shop');
   	config.output.path = paths.appBuild;

   	//配置访问路径的目录 /web/
	// paths.publicUrlPath = /
	return config
   })
)
