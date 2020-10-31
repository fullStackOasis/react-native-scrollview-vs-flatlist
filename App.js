import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import MainScreen from './MainScreen';

const MainNavigator = createStackNavigator({
	MainScreen: { screen: MainScreen },
});

const App = createAppContainer(MainNavigator);

export default App;