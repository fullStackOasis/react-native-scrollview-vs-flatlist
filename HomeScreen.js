import React, { Component } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { Dimensions, Platform } from 'react-native';
import loadLocalResource from 'react-native-local-resource';
import styled from 'styled-components/native';
// It's surprising how difficult it was to find how to read and import a local file!
// https://github.com/IgorBelyayev/React-Native-Local-Resource
//import myResource from './assets/yob2019A.txt';
import myResource from './assets/yob2019.txt';
import PButton from './PButton';
//import ProgressBar from 'react-native-progress/Bar';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const SMALL_OFFSET = windowHeight * 0.013;
const NAV_OFFSET = 0;
const OFFSET = 0;
const MAX = 2000;
const CHOICE1 = MAX;

const smallNumber = 200;
const getButtons = (me) => {
  const buttons = [
    {
      title: 'Read ' + CHOICE1 + ' Names in-app',
      onPress: () => {
        me.readData(CHOICE1);
      },
    },
    {
      title: `Fetch ${smallNumber} Names From Server`,
      onPress: () => {
        me.fetchNames(smallNumber);
      },
    },
    {
      title: `Read ${smallNumber} Names in-app`,
      onPress: () => {
        me.fetchNames(250);
      },
    },
    {
      title: 'Main Screen',
      onPress: () => {
        me.props.navigation.navigate('Main', {
          names: me.state.names,
          listNames: me.state.listNames,
          rework: false,
          showAlpha: true,
        });
      },
    },
    {
      title: 'Flat Main Screen',
      onPress: () => {
        me.props.navigation.navigate('FlatMain', {
          names: me.state.names,
          listNames: me.state.listNames,
          rework: true,
          mapNameIndexToLetterIndex: me.state.mapNameIndexToLetterIndex,
        });
      },
    },
    {
      title: 'Main Screen No Alpha',
      onPress: () => {
        me.props.navigation.navigate('Main', {
          names: me.state.names,
          listNames: me.state.listNames,
          rework: true,
          showAlpha: false,
          flatList: true,
          inverted: true,
        });
      },
    },
    {
      title: 'Main Screen INVERTED FlatList',
      onPress: () => {
        me.props.navigation.navigate('Main', {
          names: me.state.names,
          listNames: me.state.listNames,
          rework: true,
          showAlpha: false,
          flatList: true,
          inverted: true,
        });
      },
    },
    {
      // test loading more data into flatlist via scrolling
      title: 'Main Screen INVERTED FlatList loader',
      onPress: () => {
        me.props.navigation.navigate('Main', {
          names: me.state.names,
          listNames: me.state.listNames,
          rework: true,
          showAlpha: false,
          flatList: true,
          inverted: true,
          loader: true,
        });
      },
    },
  ];
  return buttons;
};

//const CHOICE1 = 60;
const ContentView = styled.View`
  height: ${(props) =>
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
  top: ${(props) =>
    props && props.size === 'small'
      ? SMALL_OFFSET + 'px'
      : props.size === 'large'
      ? OFFSET + 'px'
      : props.size === 'nav'
      ? NAV_OFFSET + 'px'
      : 'auto'};
  position: relative;
  padding-bottom: ${(props) =>
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
  backgroundcolor: transparent;
`;

const componentToHex = (color) => {
  var hex = color.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
};

const rgbToHex = (r, g, b) => {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

const getColor = (decimalColor) => {
  let rgb = [
    (decimalColor & 0xff0000) >> 16,
    (decimalColor & 0x00ff00) >> 8,
    decimalColor & 0x0000ff,
  ];
  const result = rgbToHex(rgb[0], rgb[1], rgb[2]);
  console.log(rgb);
  return result;
};

class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Testing FlatList and ScrollView Performance',
  };
  constructor(props) {
    super(props);
    this.state = {
      names: {},
      countNames: 0,
      mounted: false,
      mapNameIndexToLetterIndex: {},
    };
    this.readData = this.readData.bind(this);
    this.fetchNames = this.fetchNames.bind(this);
    this.processData = this.processData.bind(this);
  }

  async fetchNames(nNames) {
    let result = await fetch(
      'https://fullstackoasis.com/biglist/names/yob2019.txt'
    );
    try {
      let content = await result.text();
      console.log(typeof content);
      this.processData(nNames, content);
    } catch (e) {
      console.log(e);
      let content = '';
      console.log(typeof content);
      // TODO FIXME did not test for error condition
      this.processData(nNames, content);
    }
  }

  async readData(nNames) {
    let content = await loadLocalResource(myResource);
    this.processData(nNames, content);
  }

  processData(nNames, content) {
    console.log('Going to process ' + nNames + ' names');
    let names = content.split('\n');
    let values = {};
    let counts = {};
    let mapNameIndexToLetterIndex = {};
    let caps = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ];
    caps.forEach(function (el) {
      values[el] = []; // e.g. values["A"] is an empty array
      counts[el] = 0; // e.g. counts["A"] is an empty array
    });
    let countNames = 0;
    let deletes = {};
    caps.forEach(function (el) {
      deletes[el] = el;
    });
    // This part is just trying to make each item a different height
    for (let i = 0; i < nNames; i++) {
      let n = names[i];
      let splitarr = n.split(',');
      let letter = splitarr[0][0];
      //if (i % 2) {
      values[letter].push({ name: splitarr[0], description: splitarr[0] });
      //} else {
      //	values[letter].push({ name : splitarr[0], description : splitarr[0], detail : "" + splitarr[1] });
      //}
      delete deletes[letter]; // save for delete later.
    }
    // Sort within each letter of the alphabet.
    let sorter = function (a, b) {
      return a.name > b.name;
    };
    Object.values(values).forEach(function (el) {
      el.sort(sorter);
    });
    Object.keys(deletes).forEach(function (el) {
      delete values[el];
    });
    let ourLetters = Object.keys(values);
    let countLetters = 0;
    ourLetters.forEach(function (letter) {
      mapNameIndexToLetterIndex[countNames] = countLetters;
      countNames++;
      values[letter].forEach(function (v) {
        let id = counts[letter]++;
        mapNameIndexToLetterIndex[countNames] = countLetters;
        countNames++;
        v.id = id;
      });
      mapNameIndexToLetterIndex[countNames] = countLetters;
      countNames++;
      countLetters++;
    });

    // listValues is used for SectionList, https://reactnative.dev/docs/sectionlist
    // This is an attempt to make the app more efficient.
    let listValues = [];
    ourLetters.forEach(function (letter) {
      let obj = { title: letter, data: values[letter] };
      listValues.push(obj);
    });

    /*
		let trunc = {
			A: [ { id: 0, name : '1'} ],
			B: [{ id: 1, name : '2'}],
			C: [{ id: 2, name : '3'}]
		};*/
    /* For example, values may be -
			{"A":
				[ {"name":"Ava","description":"Ava","detail":"F","id":0} ],
			"E":
				[{"name":"Emma","description":"Emma","id":0}],
			"O":
				[{"name":"Olivia","description":"Olivia","detail":"F","id":0}]
			}
		*/
    this.setState({
      names: values,
      countNames: countNames,
      listNames: listValues,
      mapNameIndexToLetterIndex: mapNameIndexToLetterIndex,
    });
  }

  render() {
    /**
     * User pushes the read data button.
     * The first name in the list is displayed.
     */
    console.log('HomeScreen.render');
    //let text = "hello World";//(this.state.names && this.state.names.length) ? this.state.names[0] :'No names found';
    /*
		let progressBar = null;
		if (this.state.mounted) {
			progressBar = <ProgressBar progress={0.3} indeterminate={true} width={null} />
			{progressBar}

		}*/
    // Place titles, color, and onPress into array.
    const buttons = getButtons(this);
    const nButtons = buttons.length;
    console.log(nButtons);
    const buttonList = buttons.map((button, i) => {
      const color = getColor(nButtons * (i + 16));
      const obj = button;
      return (
        <PButton
          key={i}
          title={obj.title}
          color={color}
          onPress={obj.onPress}
          scrollHandler={obj.scrollHandler}
        />
      );
    });
    return (
      <HomeScreenWrapper>
        <View style={styles.title}>
          <Text style={styles.title}>
            There {this.state.countNames == 1 ? 'is' : 'are'}{' '}
            {this.state.countNames} name{this.state.countNames == 1 ? '' : 's'}{' '}
            in the list
          </Text>
        </View>
        {buttonList}
      </HomeScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    flex: 1,
    marginHorizontal: 16,
    fontSize: 24,
    marginTop: 10,
  },
});

export default HomeScreen;
