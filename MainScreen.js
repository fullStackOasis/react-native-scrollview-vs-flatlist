import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import loadLocalResource from 'react-native-local-resource';
// It's surprising how difficult it was to find how to read and import a local file!
// https://github.com/IgorBelyayev/React-Native-Local-Resource
import myResource from './assets/yob2019.txt';


export default class MainScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			names : []
		};
		this.readData = this.readData.bind(this);
	}
	
	async readData() {
		let content  = await loadLocalResource(myResource);
		console.log("myResource was loaded!");
		let names = content.split("\r\n");
		console.log(names[0]);
		this.setState({names});
	}

	render() {
		/**
		 * User pushes the read data button.
		 * The first name in the list is displayed.
		 */
		let text = this.state.names ? this.state.names[0] :'';
		return (<View style={
			[{ justifyContent: 'center' },
			{
				flex: 1,
				flexDirection: 'column',
				justifyContent: 'space-around',
				padding: 10
			}]
			}>
			<Button title={'Read Data'} style={{flex: 1}} color='green' onPress={this.readData} />
			<Text style={{flex:1}}>{text}</Text>
		</View>);
	}
}
