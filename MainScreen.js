import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { Dimensions, Platform } from 'react-native';
import loadLocalResource from 'react-native-local-resource';
import styled from 'styled-components/native';
import NamesList from './NamesList';
// It's surprising how difficult it was to find how to read and import a local file!
// https://github.com/IgorBelyayev/React-Native-Local-Resource
import myResource from './assets/yob2019.txt';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const SMALL_OFFSET = windowHeight * 0.013;
const NAV_OFFSET = 0;
const OFFSET = 0;
const MAX = 40;
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

const MainScreenWrapper = styled.View`
  flex: 1;
  backgroundColor: transparent;
`;

class MainScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			names : {}
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
		let deletes = {};
		caps.forEach(function(el) {
			deletes[el] = el;
		});
		for (let i = 0; i < MAX; i++) {
			let n = names[i];
			let splitarr = n.split(",");
			let letter = splitarr[0][0];
			values[letter].push({ name : splitarr[0], description : splitarr[0] });
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
		this.setState({names : values});
	}

	render() {
		/**
		 * User pushes the read data button.
		 * The first name in the list is displayed.
		 */
		console.log("Going to render");
		//let text = "hello World";//(this.state.names && this.state.names.length) ? this.state.names[0] :'No names found';
		//let data = (this.state.names && this.state.names.length) ? this.state.names : ['No names found'];
		let headerData = 
			{"A":[{"id":11,"name":"Aaliyah","description":"Aaliyah"}]};
		let data = this.state.names;
		if (this.state.names) {
			console.log("Allo!! This is your list of names from render");
			console.log(this.state.names);
		}
		//console.log("Going to render with " + JSON.stringify(data));
		console.log("Going to render with this.height " + this.height);
		console.log("Going to render with windowHeight " + windowHeight);
		console.log("Going to render with containerHeight " + (this.height || windowHeight));
		return (
			<MainScreenWrapper>
			<Button title={'Read Data'} style={{flex: 1}} color='green' onPress={this.readData} />
			<ContentView
			  size="small"
			  tabs={true}
			  isPadding={true}
			  onLayout={event => { 
				  console.log("laid out " +this.height);
				  this.height = event.nativeEvent.layout.height;
				}}>
			<NamesList
				key="namesList"
				/*ref={ref => (this.contactList = ref)}*/
				data={data}
				headerData={headerData}
				insetPadding={true}
				onSwipeablePress={this._handleSwipeableButton}
				containerHeight={this.height || windowHeight}
			>
			</NamesList>
			</ContentView>
			</MainScreenWrapper>
		)
	}
}

export default MainScreen;