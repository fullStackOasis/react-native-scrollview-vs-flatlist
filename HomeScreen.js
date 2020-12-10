import React, { Component } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { Dimensions, Platform } from 'react-native';
import loadLocalResource from 'react-native-local-resource';
import styled from 'styled-components/native';
// It's surprising how difficult it was to find how to read and import a local file!
// https://github.com/IgorBelyayev/React-Native-Local-Resource
import myResource from './assets/yob2019.txt';
import PButton from './PButton';
//import ProgressBar from 'react-native-progress/Bar';
import {NavigationEvents} from 'react-navigation';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const SMALL_OFFSET = windowHeight * 0.013;
const NAV_OFFSET = 0;
const OFFSET = 0;
const MAX = 250;
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
			countNames : 0,
			mounted : false
		};
		this.readData = this.readData.bind(this);
		this.fetchNames = this.fetchNames.bind(this);
		this.processData = this.processData.bind(this);
	};

	async fetchNames() {
		let result = await fetch('https://fullstackoasis.com/biglist/names/yob2019.txt');
		try {
			let content = await result.text();
			console.log((typeof content));
			this.processData(content);
		} catch (e) {
			console.log(e);
			let content = [];
			console.log(typeof content);
			this.processData(content);
		}
	};

	async readData() {
		let content  = await loadLocalResource(myResource);
		this.processData(content);
	}

	processData(content) {
		console.log("myResource was loaded! " + content);
		let names = content.split("\r\n");
		console.log(names[0]);
		let values = {};
		let counts = {};
		let caps = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
		caps.forEach(function(el) {
			values[el] = []; // e.g. values["A"] is an empty array
			counts[el] = 0; // e.g. counts["A"] is an empty array
		})
		let countNames = 0;
		let deletes = {};
		caps.forEach(function(el) {
			deletes[el] = el;
		});
		// This part is just trying to make each item a different height
		for (let i = 0; i < MAX; i++) {
			let n = names[i];
			let splitarr = n.split(",");
			let letter = splitarr[0][0];
			if (i % 2) {
				values[letter].push({ name : splitarr[0], description : splitarr[0] });
			} else {
				values[letter].push({ name : splitarr[0], description : splitarr[0], detail : "" + splitarr[1] });
			}
			delete deletes[letter]; // save for delete later.
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
		let ourLetters = Object.keys(values);
		console.log(ourLetters);
		ourLetters.forEach(function(letter) {
			values[letter].forEach(function(v) {
				id = counts[letter]++;
				countNames++;
				v.id = id;
			})
		});
		console.log(JSON.stringify(values));

		// listValues is used for SectionList, https://reactnative.dev/docs/sectionlist
		// This is an attempt to make the app more efficient.
		let listValues = [];
		ourLetters.forEach(function(letter) {
			let obj = { title : letter, data : values[letter] };
			console.log(obj);
			listValues.push(obj);
		});
		console.log("listValues "+ JSON.stringify(listValues));

		/*
		let trunc = {
			A: [ { id: 0, name : '1'} ],
			B: [{ id: 1, name : '2'}],
			C: [{ id: 2, name : '3'}]
		};*/
		//this.setState({names});
		console.log("Calling setState after readData " + JSON.stringify(values));
		/* For example, values may be -
			{"A":
				[ {"name":"Ava","description":"Ava","detail":"F","id":0} ],
			"E":
				[{"name":"Emma","description":"Emma","id":0}],
			"O":
				[{"name":"Olivia","description":"Olivia","detail":"F","id":0}]
			}
		*/
		this.setState({names : values, countNames : countNames, listNames : listValues});
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
		/*
		let progressBar = null;
		if (this.state.mounted) {
			progressBar = <ProgressBar progress={0.3} indeterminate={true} width={null} />
			{progressBar}

		}*/
		return (
			<HomeScreenWrapper>
				
			<NavigationEvents onDidFocus={() => console.log('I am triggered')} />				
			<View style={styles.title}>
				<Text style={styles.title}>There {this.state.countNames == 1 ? 'is' : 'are'} {this.state.countNames} name{this.state.countNames == 1 ? '' : 's'} in the list</Text>
			</View>

			<PButton title={'Read Data'} color='green' onPress={this.readData} />
			<PButton title={'Fetch Data From Server'} color='green' onPress={this.fetchNames} />
			<PButton title={'Main Screen'}
				onPress={() => this.props.navigation.navigate('Main',
					{ names : this.state.names, listNames : this.state.listNames, rework : false })} />
			<PButton title={'Flat Main Screen'}
				onPress={() => this.props.navigation.navigate('FlatMain',
					{ names : this.state.names, listNames : this.state.listNames, rework : true })} />
			</HomeScreenWrapper>
		)
	}
}

const styles = StyleSheet.create({
	title: {
		flex: 1,
		marginHorizontal: 16,
		fontSize: 24,
		marginTop: 10
	}
});

export default HomeScreen;