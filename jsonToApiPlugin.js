import { declare } from '@babel/helper-plugin-utils';
import { types as t } from '@babel/core';

const autoPlugin = declare((api, options, dirname) => {
  api.assertVersion(7);

  const { data = [] } = options;

  // 确保 data 是数组类型
  if (!Array.isArray(data)) {
    console.error('Error: options.data must be an array');
    return { visitor: {} };
  }

  // 生成导入语句 import request from '.';
  const importDeclaration = t.importDeclaration(
    [t.importDefaultSpecifier(t.identifier('request'))],
    t.stringLiteral('.')
  );

  // 处理路径参数，提取出 {param} 格式的参数
  function extractPathParams(path) {
    const paramRegex = /\{([^}]+)\}/g;
    const params = [];
    let match;

    while ((match = paramRegex.exec(path)) !== null) {
      params.push(match[1]);
    }

    return params;
  }

  // 使用 map + flat 替代 flatMap
  const exportDeclarations = data
    .map((group) => {
      const safeList = Array.isArray(group.list) ? group.list : [];

      return safeList.map((item) => {
        // 提取路径中的参数，如 /user/{id} -> ["id"]
        const pathParams = extractPathParams(item.path);

        // 生成函数名，处理多级路径
        const methodName = generateMethodName(item, pathParams);

        // 生成函数参数：路径参数 + 查询参数
        const paramIdentifiers = [
          ...pathParams.map((param) => t.identifier(param)),
          item.method === 'GET' ? t.identifier('params') : t.identifier('data'),
        ];

        // 构建带参数的路径，如 `/user/${id}`
        const pathSegments = item.path.split(/(\{[^}]+\})/);
        const pathQuasis = [];
        const pathExpressions = [];

        pathSegments.forEach((segment) => {
          if (segment.startsWith('{') && segment.endsWith('}')) {
            const paramName = segment.slice(1, -1);
            pathExpressions.push(t.identifier(paramName));
            if (pathQuasis.length === 0) {
              pathQuasis.push(t.templateElement({ raw: '', cooked: '' }));
            }
            pathQuasis.push(t.templateElement({ raw: '', cooked: '' }));
          } else {
            if (pathQuasis.length === 0) {
              pathQuasis.push(
                t.templateElement({ raw: segment, cooked: segment })
              );
            } else {
              const lastQuasi = pathQuasis[pathQuasis.length - 1];
              pathQuasis[pathQuasis.length - 1] = t.templateElement({
                raw: lastQuasi.value.raw + segment,
                cooked: lastQuasi.value.cooked + segment,
              });
            }
          }
        });

        const pathTemplateLiteral = t.templateLiteral(
          pathQuasis,
          pathExpressions
        );

        // 生成请求参数
        const requestArgs = [
          pathTemplateLiteral,
          item.method === 'GET'
            ? t.objectExpression([
                t.objectProperty(
                  t.identifier('params'),
                  t.identifier('params')
                ),
              ])
            : t.identifier('data'),
        ];

        // 生成请求调用
        const requestCall = t.callExpression(
          t.memberExpression(
            t.identifier('request'),
            t.identifier(item.method.toLowerCase())
          ),
          requestArgs
        );

        // 生成函数体
        const functionBody = t.blockStatement([t.returnStatement(requestCall)]);

        // 生成函数声明
        const functionDeclaration = t.functionDeclaration(
          t.identifier(methodName),
          paramIdentifiers,
          functionBody
        );

        // 生成导出声明
        return t.exportNamedDeclaration(functionDeclaration, []);
      });
    })
    .flat();

  return {
    visitor: {
      Program(path) {
        path.unshiftContainer('body', importDeclaration);
        exportDeclarations.forEach((declaration) => {
          path.pushContainer('body', declaration);
        });
      },
    },
  };
});

// 根据路径和方法生成函数名，处理多级路径
function generateMethodName(item, pathParams) {
  if (
    !item ||
    typeof item.path !== 'string' ||
    typeof item.method !== 'string'
  ) {
    console.error('Error: Invalid item structure', item);
    return 'invalidMethod';
  }
  // 移除路径中的参数标记，例如 /user/{id} -> /user/
  function removePathParams(path) {
    return path.replace(/{[^}]+}/g, '');
  }
  // 移除路径中的参数标记，如 /user/{id} -> /user/
  const cleanPath = removePathParams(item.path);
  const pathParts = cleanPath.split('/').filter((part) => part);

  let prefix;
  switch (item.method) {
    case 'GET':
      console.log('item.method', pathParts);
      prefix = 'get';
      break;
    case 'POST':
      //   console.log('item.method', pathParts);
      prefix = pathParts.length > 1 ? '' : 'create';
      //   prefix = 'create';
      break;
    case 'PUT':
      prefix = 'update';
      break;
    case 'PATCH':
      prefix = 'update';
      break;
    case 'DELETE':
      prefix = 'delete';
      break;
    default:
      prefix = item.method.toLowerCase();
  }

  // 拼接多级路径部分，如 user + test -> UserTest
  let pathName = pathParts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  if (!prefix) {
    pathName = pathName.charAt(0).toLowerCase() + pathName.slice(1);
  }

  // 如果有路径参数，添加 By{Param} 后缀
  const paramSuffix =
    pathParams.length > 0
      ? 'By' +
        pathParams
          .map((param) => param.charAt(0).toUpperCase() + param.slice(1))
          .join('And')
      : '';

  // 驼峰命名，拼接前缀和路径部分
  const methodName = prefix + pathName + paramSuffix;
  return methodName;
}

export default autoPlugin;
