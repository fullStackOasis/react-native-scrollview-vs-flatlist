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

const FlatMainScreenWrapper = styled.View`
  flex: 1;
  backgroundColor: transparent;
`;

class FlatMainScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			names : {}
		};
	}

	render() {
		const { navigation } = this.props;
		let data = navigation.getParam('names');
		let listData = navigation.getParam('listNames');
		let rework = navigation.getParam('rework');
		console.log("FFFF sending listData as sections = " + JSON.stringify(listData));
		let headerData = {"A":[{"id":11,"name":"Aaliyah","description":"Aaliyah"}]};
		return (
			<FlatMainScreenWrapper>
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
				rework={rework}
				data={data}
				sections={listData}
				headerData={headerData}
				insetPadding={true}
				onSwipeablePress={this._handleSwipeableButton}
				containerHeight={this.height || windowHeight}
			>
			</NamesList>
			</ContentView>
			</FlatMainScreenWrapper>
		)
	}
}

export default FlatMainScreen;