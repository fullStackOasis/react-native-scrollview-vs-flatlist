import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

export default class PButton extends Component {
	render() {
		console.log(this.props);
		return (
			<View style={{flex : 1, padding: 10}}>
				<Button title={this.props.title} color='green' onPress={this.props.onPress}></Button>
			</View>
		);
	}
}