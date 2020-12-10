import React, { Component } from 'react';
import { StyleSheet, View, InteractionManager, Dimensions, SectionList, SafeAreaView, Text } from 'react-native';
import PropTypes from 'prop-types';
import { SectionHeader } from './SectionHeader';
import { AlphabetListView } from './AlphabetListView';
import { SectionListItem } from './SectionListItem';
const Constants = {
	statusBarHeight : 10

};
/**
 * See similar code in https://github.com/UseAllFive/react-native-alphabet-flat-list
 */
export default class SWAlphabetFlatListRework extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    renderItem: PropTypes.func.isRequired, // this.props.renderItem - DO NOT CONFUSE WITH this.renderItem!
    sectionItemComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    onSelect: PropTypes.func
  };

  static defaultProps = {
		sectionItemComponent: SectionListItem,
		sectionHeaderComponent: SectionHeader
  };

	componentDidMount() {
		if (this.props.onRef != null) {
			this.props.onRef(this)
		}
	}

  /**
   * @param data
   */
  refreshBaseData(data) {
	console.log("SW called setState A");
    const titles = Object.keys(data);
	this.setState({
      titles,
      selectAlphabet: titles[0]
    });
  };

	/**
	 * Get the height of the list area, used to calculate the display of the letter list
	 */
	onLayout = ({ nativeEvent: { layout } }) => {
		// Ensure that the position coordinates are obtained after the navigation animation is completed, otherwise it will be inaccurate
		InteractionManager.runAfterInteractions(() => {
			this.alphabet.measure((x, y, w, h, px, py) => {
			this.setState({
				pageY: py
			});
			});
		});

		this.setState({
			containerHeight: layout && layout.height
		});
	};

	/**
	 * Tap the letter to trigger scroll
	 */
	onSelect(index) {
		console.log("SWAlphabetFlatListRework.onSelect this.props.titles: " + this.props.titles);
		if (this.props.titles[index]) {
			// let title = this.props.titles[index]; // e.g. "T"
			// See API https://reactnative.dev/docs/sectionlist#scrolltolocation
			this.sectionList.scrollToLocation({ sectionIndex : index, itemIndex : 0});
		}
	};

  /**
   * Change the selected letter when the element in the visible range changes
   * @param viewableItems
   */
  onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems && viewableItems.length) {
      // The scroll triggered by clicking the letter does not respond within 3 seconds
      if (new Date().getTime() - this.touchedTime < 3000) {
        return;
      }
	  console.log("SW called setState E");
      this.setState({
        selectAlphabet: viewableItems[0].item
      });
    }
  };

	handleSectionHeaderLayout = (data) => {
		console.log("SWAlphabetFlatListRework.handleSectionHeaderLayout " + JSON.stringify(data));
	}

  /**
   * @param{String} item is the header for this section, like "A", "B", etc.
   */
	renderItem(item) {
		console.log("SW renderItem item = " + JSON.stringify(item));
		// this.props.data is something like {"A":[{"name":"Edith Abbott","id":1}, ...}
		return (<KeyedView key={item} item={item}
			sectionHeader={this.props.sectionHeaderComponent}
			data={this.props.data}
			handleSectionHeaderLayout={this.handleSectionHeaderLayout}
			renderItem={this.props.renderItem}
			handleChildLayout={this.handleChildLayout}
		/>);
	};

	constructor(props) {
		super(props);
		//this.renderEach = this.renderEach.bind(this);
		this.state = {
			dataSourceCoordinates : {},
			titles : [],
			selectAlphabet: undefined,
			initialNumToRender : 0
		}
		this.refreshBaseData = this.refreshBaseData.bind(this);
		this.onSelect = this.onSelect.bind(this);
		this.sectionList = null;
	}
	
	/**
	 * Example of what input data may look like:
	 * {"id":"C","width":411.4285583496094,"height":204.57142639160156,"x":0,"y":274.8571472167969}
	 * 
	 * TODO FIXME. This method gets called for every new letter that's laid out.
	 * If you've got 27 letters, then this method calls setState every single time it's called,
	 * and that triggers a re-render, even though this component is not ready to be re-rendered.
	 * 
	 * @param {data} Object with an id property that is a letter, like "C", a height, width, x, and y value
	 */
	handleChildLayout = (data) => {
		var obj = {};
		obj[data.id] = data;
		var newKey = "" + data.id;
		console.log("SW called setState F newKey = " + newKey);
		this.setState(prevState => {
			let z = { ...prevState.dataSourceCoordinates };
			//console.warn("SW Hello prevState ZZZ! " + JSON.stringify(z));
			z[newKey] = data;
			//console.warn("SW Hello new z! " + JSON.stringify(z));
			return {dataSourceCoordinates : z};
		});
		//console.warn("*** SW Hello handleChildLayout App handles data from child: obj " + JSON.stringify(obj));
		//this.setState(obj);
		//console.warn("*** SW Hello handleChildLayout App handles data from child: this.state " + JSON.stringify(this.state.newKey));
		//console.warn("SW Hello! handleChildLayout looks for renderEach " + (typeof this.renderEach));
	}

  render() {
	console.log("SWAlphabetFlatListRework.render: this.state.titles " + JSON.stringify(this.state.titles));
	console.log("SWAlphabetFlatListRework.render: this.props.sections " + JSON.stringify(this.props.sections));
	console.log("SWAlphabetFlatListRework.render: this.props.titles " + JSON.stringify(this.props.titles));
	// At this point, titles are obtained as props from the parent component.
    return (
		<SafeAreaView>
			<SectionList
				ref={input => this.sectionList = input}
				sections={this.props.sections}
				renderItem={(item) => <Item title={item["item"]["name"]} />}
				renderSectionHeader={({ section: { title } }) => (
					<Text style={styles.header}>{title}</Text>
				)}
				keyExtractor={(item, index) => item + index}
			>
			</SectionList>
			<AlphabetListView
				container={ref => (this.alphabet = ref)}
				pageY={this.state.pageY}
				onLayout={this.onLayout}
				contentHeight={this.state.containerHeight}
				item={this.props.sectionItemComponent}
				titles={this.props.titles}
				selectAlphabet={this.state.selectAlphabet}
				onSelect={this.onSelect}
			/>
	  </SafeAreaView>
    );
  }
}


/**
 * KeyedView is a View that has a unique id, it encloses each SectionHeader, and everything in the section under it.
 */
class KeyedView extends React.Component {
	constructor(props) {
		super(props);
		// this.props.item is expected to be a letter, like "T"
	}
	/**
	 * The onLayout method here is used to propagate properties, in particular y,
	 * to the container/parent, so scrolling to the section header can be done
	 * correctly.
	 */
	handleOnLayout = (e) => {
		let obj = {
			id: this.props.item, // e.g. "T"
			width: e.nativeEvent.layout.width,
			height: e.nativeEvent.layout.height,
			x: e.nativeEvent.layout.x,
			y: e.nativeEvent.layout.y // layout position of this SectionHeader. Hopefully! e.g. 160.57142639160156,
		}
		this.props.handleChildLayout(obj);
	}

	render () { 
		// TODO FIXME height is artificially set to 25.
		let h = 25;
		let item = this.props.item;
		let sectionId = item; // e.g. "T"
		const MSectionHeader = this.props.sectionHeader;
		// TODO FIXME
		// Getting an ERROR message "Warning: Each child in a list should have a unique "key" prop."
		// these do not help:
		//let viewKey = "swView" + item;
		//let sectionHeaderKey = "swSectionHeader" + item;
		// item is NOT {"item":{"name":"Alex Tabarrok","id":20},"index":0,"sectionId":"T","last":false}
		// item is "T" for example
		// data is {"A":[{"name":"Edith Abbott","id":1},
		//			{"name":"Kenneth Arrow","id":2}],
		//          "B":[{"name":"Robert Barro","id":3},...
		// Useful for debugging:
		// this.props.data[sectionId].map((itemValue, itemIndex, items) => console.warn(JSON.stringify(itemValue) + ", " + itemIndex + ", item " + item));
		return (<View onLayout={this.handleOnLayout}>
		<MSectionHeader height={h} h={h} title={item} handleSectionHeaderLayout={this.props.handleSectionHeaderLayout}/>
		{this.props.data[sectionId].map((itemValue, itemIndex, items) =>
			this.props.renderItem({
				item: itemValue,
				index: itemIndex,
				sectionId: item,
				last: itemIndex === items.length - 1
			})
		)}
		</View>);
	}
};

const Item = ({ title }) => (
	<View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
	</View>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: Constants.statusBarHeight,
		marginHorizontal: 16
	},
	item: {
		backgroundColor: "#f9c2ff",
		padding: 20,
		marginVertical: 8
	},
	header: {
		fontSize: 32,
		backgroundColor: "#fff"
	},
	title: {
		fontSize: 24
	}
});