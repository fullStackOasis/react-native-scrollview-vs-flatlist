import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { Dimensions, Platform } from 'react-native';
import loadLocalResource from 'react-native-local-resource';
import styled from 'styled-components/native';
import NamesList from './NamesList';
// It's surprising how difficult it was to find how to read and import a local file!
// https://github.com/IgorBelyayev/React-Native-Local-Resource
import myResource from './assets/yob2019.txt';
import PButton from './PButton';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const SMALL_OFFSET = windowHeight * 0.013;
const NAV_OFFSET = 0;
const OFFSET = 0;
const MAX = 140;
const ContentView = styled.View`
  height: ${props =>
    windowHeight -
    (props && props.size === 'small'
      ? SMALL_OFFSET
      : props.size === 'large'
      ? OFFSET
      : props.size === 'nav'
      ? NAV_OFFSET
      : 0)}px;
  border-top-left-radius: ${0};
  border-top-right-radius: ${0};
  top: ${props =>
    props && props.size === 'small'
      ? SMALL_OFFSET + 'px'
      : props.size === 'large'
      ? OFFSET + 'px'
      : props.size === 'nav'
      ? NAV_OFFSET + 'px'
      : 'auto'};
  position: relative;
  padding-bottom: ${props =>
    props.size === 'small'
      ? SMALL_OFFSET
      : props.size === 'large'
      ? OFFSET
      : props.size === 'nav'
      ? NAV_OFFSET
      : 0}px;
  overflow: hidden;
  flex: 1;
`;

const HomeScreenWrapper = styled.View`
  flex: 1;
  backgroundColor: transparent;
`;

class HomeScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			names : {},
			countNames : 0
		};
		this.readData = this.readData.bind(this);
	}

	async readData() {
		let content  = await loadLocalResource(myResource);
		console.log("myResource was loaded!");
		let names = content.split("\r\n");
		console.log(names[0]);
		let values = {};
		let counts = {};
		let caps = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
		caps.forEach(function(el) {
			values[el] = [];
			counts[el] = 0;
		})
		let countNames = 0;
		let deletes = {};
		caps.forEach(function(el) {
			deletes[el] = el;
		});
		for (let i = 0; i < MAX; i++) {
			let n = names[i];
			let splitarr = n.split(",");
			let letter = splitarr[0][0];
			if (i % 2) {
				values[letter].push({ name : splitarr[0], description : splitarr[0] });
			} else {
				values[letter].push({ name : splitarr[0], description : splitarr[0], detail : "" + splitarr[1] });
			}
			delete deletes[letter];
		}
		console.log(JSON.stringify(deletes));
		// Sort within each letter of the alphabet.
		let sorter = function(a, b) { return a.name > b.name; }
		Object.values(values).forEach(function(el) {
			el.sort(sorter);
		});
		Object.keys(deletes).forEach(function(el) {
			delete values[el];
		});
		Object.keys(values).forEach(function(letter) {
			
			values[letter].forEach(function(v) {
				id = counts[letter]++;
				countNames++;
				v.id = id;
			})
		});
		console.log(JSON.stringify(values));
		/*
		let trunc = {
			A: [ { id: 0, name : '1'} ],
			B: [{ id: 1, name : '2'}],
			C: [{ id: 2, name : '3'}]
		};*/
		//this.setState({names});
		console.log("Calling setState after readData");
		this.setState({names : values, countNames : countNames});
	}

	render() {
		/**
		 * User pushes the read data button.
		 * The first name in the list is displayed.
		 */
		console.log("Going to render");
		console.log("Going to render HOMESCREEN " + JSON.stringify(this.state.names));
		console.log("Going to render HOMESCREEN this.state.names.length " + JSON.stringify(this.state.countNames));
		//let text = "hello World";//(this.state.names && this.state.names.length) ? this.state.names[0] :'No names found';
		return (
			<HomeScreenWrapper>
			<View style={{flex: 1}}>
				<Text>There {this.state.countNames == 1 ? 'is' : 'are'} {this.state.countNames} name{this.state.countNames == 1 ? '' : 's'} in the list</Text>
			</View>
			<PButton title={'Read Data'} color='green' onPress={this.readData} />
			<PButton title={'Main Screen'} onPress={() => this.props.navigation.navigate('Main', { names : this.state.names })} />
			<PButton title={'Flat Main Screen'} onPress={() => this.props.navigation.navigate('FlatMain', { names : this.state.names })} />
			</HomeScreenWrapper>
		)
	}
}

export default HomeScreen;