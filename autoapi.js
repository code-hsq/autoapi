import axios from 'axios';
import { transformFromAstSync } from '@babel/core';
import parser from '@babel/parser';
// const autoPlugin = require('./plugin/auto-document-plugin');
import fs from 'fs';
import autoPlugin from './autoPlugin.js';
axios.get('http://localhost:3000/api/swagger-ui-init.js').then(async (res) => {
  //   console.log(typeof res.data);
  const ast = parser.parse(res.data, {
    sourceType: 'unambiguous',
  });

  const { code } = transformFromAstSync(ast, res.data, {
    plugins: [[autoPlugin]],
  });
  fs.writeFileSync('./code.js', code);
  const data = await import('./code.js');
  const list = transformSwaggerToCustomFormat(data.default.swaggerDoc);
  fs.writeFileSync('./list.json', JSON.stringify(list));
});

function transformSwaggerToCustomFormat(swaggerDoc) {
  const result = [];
  const groupedPaths = {};

  // 获取所有路径
  const paths = swaggerDoc.paths;

  // 遍历每个路径
  for (const path in paths) {
    // 跳过根路径"/"
    if (path === '/') continue;

    // 提取路径前缀（第一个"/"后的部分）
    const pathPrefix = path.split('/')[1];
    const prefixKey = `/${pathPrefix}`;

    const operations = paths[path];
    const pathItem = {
      path,
      list: [],
    };

    // 遍历该路径下的所有HTTP方法
    for (const method in operations) {
      const operation = operations[method];
      const operationItem = {
        path,
        method: method.toUpperCase(),
      };

      // 处理参数
      if (operation.parameters && operation.parameters.length > 0) {
        const queryParams = [];
        const pathParams = [];

        operation.parameters.forEach((param) => {
          if (param.in === 'query') {
            queryParams.push(param.name);
          } else if (param.in === 'path') {
            pathParams.push(param.name);
          }
        });

        if (queryParams.length > 0) {
          operationItem.query = queryParams;
        }

        if (pathParams.length > 0) {
          operationItem.pathParams = pathParams;
        }
      }

      pathItem.list.push(operationItem);
    }

    // 将路径项添加到对应的前缀组中
    if (!groupedPaths[prefixKey]) {
      groupedPaths[prefixKey] = [];
    }
    groupedPaths[prefixKey].push(pathItem);
  }

  // 将分组转换为结果数组
  for (const prefix in groupedPaths) {
    result.push({
      path: prefix,
      list: groupedPaths[prefix],
    });
  }

  return result;
}
