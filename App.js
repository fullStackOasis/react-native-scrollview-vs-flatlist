import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import MainScreen from './MainScreen';
import FlatMainScreen from './FlatMainScreen';
import HomeScreen from './HomeScreen';

if (!__DEV__ || __DEV__) {
//if (!__DEV__) {
	console = {};
	console.log = () => {};
	console.error = () => {};
	console.assert = () => {};
}
const MainNavigator = createStackNavigator(
	{ Home: HomeScreen,
	Main: MainScreen,
	FlatMain : FlatMainScreen },
	{ initialRouteName: 'Home' }
);

const App = createAppContainer(MainNavigator);

export default App;