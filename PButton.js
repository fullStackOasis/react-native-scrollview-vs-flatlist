import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

export default class PButton extends Component {
	render() {
		console.log("this.props.title " + this.props.title + " " + (typeof this.props.title));
		return (
			<View style={{flex : 1, padding: 10}}>
				<Button title={this.props.title} color={this.props.color||'green'} onPress={this.props.onPress}>
				</Button>
			</View>
		);
	}
}