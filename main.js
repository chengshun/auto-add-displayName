module.exports = function({ types: t }) {
	return {
		name: 'add-displayName', 
		pre() {
			this.classDeclarationNames = [];
		},
		visitor: {
			ClassDeclaration(path) {
				const name = path.node.id.name;
				const container = path.container;
				//找出class外层的expressionStatement
				const filterExpression = container.filter((node) => {return t.isExpressionStatement(node);});
				
				let displayNameArr = [];
				//遍历查询是否有设置displayName
				filterExpression.forEach((expression) => {
					const exp = expression.expression;
					if (exp.operator === '=') {
						const { left, right } = exp;
						if (left.property.name === 'displayName') {
							if (this.classDeclarationNames.indexOf(left.object.name) === -1){
								this.classDeclarationNames.push(left.object.name);
							}
						}
					}
				});
	
				//如果没有设置displayName，就用class的名字
				if (this.classDeclarationNames.indexOf(name) === -1) {
					const name = path.node.id.name;
					const displayNameExp = t.expressionStatement(
						t.AssignmentExpression(
							'=',
							t.MemberExpression(
								t.Identifier(name),
								t.Identifier('displayName')
							),
							t.StringLiteral(name)
						)
					);
					//container.push(displayNameExp);
					path.insertAfter(displayNameExp);
				}
			}
		}
	}
};