// const { declare } = require('');
import { declare } from '@babel/helper-plugin-utils';
import { types as t } from '@babel/core';
const autoPlugin = declare((api, options, dirname) => {
  api.assertVersion(7);

  return {
    visitor: {
      ExpressionStatement: {
        enter(path, state) {
          path.traverse({
            VariableDeclarator(path) {
              if (path.node.id.name == 'options') {
                state.neeNode = path.parentPath.node;
              }
            },
          });
          if (state.neeNode) {
            path.replaceWith(state.neeNode);
            path.insertAfter(
              t.exportDefaultDeclaration(t.identifier('options'))
            );
          }
        },
      },
    },
  };
});

export default autoPlugin;
