import React from 'react';
import { DeviceEventEmitter, Text, View } from 'react-native';
import styled from 'styled-components/native';
import { ListItem } from './ListItem';
import { ListHeader } from './ListHeader';
import { ListFilterItem } from './ListFilterItem';
//import SWAlphabetFlatList from '@yoonzm/react-native-alphabet-flat-list';
import { SWAlphabetFlatList } from './SWAlphabetFlatList';
const ITEM_HEIGHT = 50;

export default class NamesList extends React.Component {
  state = {
    items: {},
    header: {},
  };

  height = 0;
  hasSearched = false;
  renderHeader;
  eventListener;

  constructor(props) {
	super(props);
    this.state = {
		items: {},
		searching: false,
		header: this.props.headerData || {},
		selected: [],
		scrollEnabled: false,
		headerHeight: 0,

	  };
	console.log("NamesList constructor " + JSON.stringify(this.state.header));
	this.renderHeader = this.renderHeader.bind(this);
	this.onHeaderLayout = this.onHeaderLayout.bind(this);
  }

  componentDidMount() {
    this.eventListener = DeviceEventEmitter.addListener(
      'swipe-list',
      this.handleScroll
    );
}

  componentWillUnmount() {
    if (this.eventListener) {
      this.eventListener.remove();
    }
  }

  filterList(search, props) {
	  console.log("NamesList.filterList");
    const { data, sortFields, headerData } = props
      ? props
      : this.props;
    let items = {};

    if (data) {
      items = data
        .sort((a, b) => {
          return a[sortFields[0]] < b[sortFields[0]]
            ? -1
            : a[sortFields[0]] > b[sortFields[0]]
            ? 1
            : 0;
        })
        .reduce((r, e) => {
          // Check if number
          if (e[sortFields[0]]) {
            let key =
              e[sortFields[0]] && isNaN(e[sortFields[0]][0])
                ? e[sortFields[0]][0]
                : '#';
            if (!r[key]) r[key] = [e];
            else r[key].push(e);
          }

          return r;
        }, {});
    }

    this.setState({ items, header: headerData, hosts: hosts  }, () => {
      this.resetScroll();
    });
  }

  // Reset the list when nothing is entered or clearing
  resetList(event) {
	  console.log("NamesList.resetList");
    if (event.nativeEvent.selection.end === 0) {
      this.filterList();
    }
  }

  resetScroll() {
    if (this.listView && this.listView.list && this.state.items.length > 0) {
      this.listView.list.scrollToIndex({
        animated: true,
        index: 0
      });
    }
  }

  handleScroll = isScrolling => {
    this.setState({ scrollEnabled: isScrolling });
  };

  renderHeader() {
	//console.log("NamesList.renderHeader this.props.headerData " + JSON.stringify(this.props.headerData));
	  //console.log("NamesList.renderHeader this.props.data " + JSON.stringify(this.props.data));
	let z = {...this.props.headerData};
	console.log("NamesList.renderHeader: " + JSON.stringify(z));
	let x = {"id":11,"name":"Aaliyah","description":"Aaliyah"};
    return this.props.headerData ? (
      <React.Fragment>
	  	<View onLayout={this.onHeaderLayout}>
        <ListHeader border={false} padding={true} paddingBottom={false}>
          Top Name
        </ListHeader>
        <ListItem
          {...x}
          style={{ backgroundColor: 'black', color: 'red', height : 50 }}
        />
		</View>
      </React.Fragment>
    ) : null;
  };

  /**
   * 
   */
  onHeaderLayout({ nativeEvent: { layout } }) {
	  console.log("NamesList.onHeaderLayout, height is " + layout.height);
	  /*
    InteractionManager.runAfterInteractions(() => {
      this.alphabet.measure((x, y, w, h, px, py) => {
        this.setState({
          pageY: py
        });
      });
	});
	*/
	if (layout && this.state && (layout.height != this.state.headerHeight)) {
		console.log("NamesList.onHeaderLayout, height is SET TO STATE " + layout.height);
		this.setState({
			headerHeight: layout.height
		});
	}
  };


  /**
   * Render an item in the list of items. Each of the items is in a section for the
   * letter that it starts with. For example, an item with the name "Ruby" will appear
   * in the section under "R".
   * @param {Object} item is for example, {"name":"Ruby","description":"Ruby","id":4}
   * @param {Number} index index within each section, a number between 0 and n,
   * can be repeated for different sections of the alphabet, but only one index per
   * item within each section
   */
  renderItem({ item, index, sectionId }) {
	  console.log("NamesList renderItem " + JSON.stringify({...item}));
	return <ListItem
	{...item}
	key={index}
	selected={item.selected}
	style={{ height : ITEM_HEIGHT, color: 'white', backgroundColor : 'gray' }}
	/>
  }

	sectionItemComponent({ title, active }) {
		console.log("title ZZZZ " + title);
		// title is for example "A" or "J". active is not in use.
		return <ListFilterItem key={title} title={title} active={active} />
	}

	respondToSelect() {
		console.log("You selected something");
		return null;
	}

  render() {
	  console.log("NamesList render Item Height: " + ITEM_HEIGHT);
	  console.log("NamesList render, props: " + JSON.stringify(this.props));
	  console.log("NamesList render, this.props.headerData: " + JSON.stringify(this.props.headerData));
	  let data = this.props.data || ['No Names Found'];
	  let titles = Object.keys(data);
	  console.log("NamesList render Titles were: " + JSON.stringify(titles));
	  let headerHeight = this.state ? this.state.headerHeight : 0;
    return (
      <React.Fragment>
		<SWAlphabetFlatList
		ref={ref => (this.listView = ref)}
		data={data}
		titles={titles}
		itemHeight={ITEM_HEIGHT}
		enableEmptySections={false}
		removeClippedSubviews={false}
		scrollEnabled={true}
		showsVerticalScrollIndicator={false}
		sectionHeaderHeight={ITEM_HEIGHT}
		stickyHeaderIndices={[0]}
		renderHeader={this.renderHeader}
		renderItem={this.renderItem}
		onSelect={this.respondToSelect}
		headerHeight={headerHeight}
		sectionItemComponent={this.sectionItemComponent}
		sectionHeaderComponent={({ title }) => (
			<ListHeader border={false} padding={true}>
			{title}
			</ListHeader>
        )}
		ListHeaderComponent={this.renderHeader}
		style={{
			flex: 1
		}}
		/>
      </React.Fragment>
    );
  }
}
