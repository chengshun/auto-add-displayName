var babel = require('babel-core');
var plugin = require('../main');
var classPlugin = require('babel-plugin-transform-class-properties');
var env = require('babel-preset-env');
var react = require('babel-preset-react');

var test1 = `
	class App extends Component {

	}
`;

var test2 = `
	class App extends Component {

	}

	class Test extends Component {

	}
`;

var test3 = `
	class App extends Component {
		static displayName = 'NoNeddAddDisplayName';
	}
`;

it('对单个class添加diaplayName', () => {
	const { code } = babel.transform(test1, {
		plugins: [classPlugin, plugin],
		presets: [react, env] 
	});

	expect(code).toMatchSnapshot();
});

it('对多个class添加diaplayName', () => {
	const { code } = babel.transform(test2, {
		plugins: [classPlugin, plugin],
		presets: [react, env] 
	});

	expect(code).toMatchSnapshot();
});

it('已有diaplayName，不需要添加', () => {
	const { code } = babel.transform(test3, {
		plugins: [classPlugin, plugin],
		presets: [react, env] 
	});

	expect(code).toMatchSnapshot();
});
