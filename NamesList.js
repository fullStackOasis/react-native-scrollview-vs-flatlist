import React from 'react';
import { DeviceEventEmitter, Text, View, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { ListItem } from './ListItem';
import { ListHeader } from './ListHeader';
import { ListFilterItem } from './ListFilterItem';
//import SWAlphabetFlatList from '@yoonzm/react-native-alphabet-flat-list';
import SWAlphabetFlatList from './SWAlphabetFlatList';
import SWAlphabetFlatListRework from './SWAlphabetFlatListRework';
const ITEM_HEIGHT = 70;
import AvatarImage from './AvatarImage';

/**
 * Takes input data used by SectionList and returns array of data for use by FlatList.
 * SectionList data is an Object with keys mapped to arrays, like:
 * {"A":{item...}, "B":{item...}} etc.
 * Whereas FlatList just wants [{item..},{item..}].
 *
 * @param {*} data an input array intended for consumption by SectionList
 * @returns Array of data for consumption by FlatList
 */
const getFlatListData = (data) => {
  const result = [];
  const values = Object.values(data);
  values.forEach((val) => {
    if (val instanceof Array) {
      // recursively call this function to get items from array
      let newData = getFlatListData(val);
      result.push(...newData);
    } else {
      val.id = val.name;
      result.push(val);
    }
  });
  return result;
};

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
    // props is expected to have page, the number of pages of data, in case where loader is true
    super(props);
    console.log(
      'XXXX this.props.onScrollHandler ' + this.props.onScrollHandler
    );
    console.log('XXXX headerData ' + this.props.headerData);
    console.log(
      'XXXX this.props.onSwipeablePress ' + this.props.onSwipeablePress
    );
    console.log('XXXX this.props.page ' + this.props.page);

    this.state = {
      items: {},
      searching: false,
      header: this.props.headerData || {},
      selected: [],
      scrollEnabled: false,
      headerHeight: 0,
      nItems: 0,
    };
    console.log('NamesList constructor ' + JSON.stringify(this.state.header));
    this.renderHeader = this.renderHeader.bind(this);
    this.onHeaderLayout = this.onHeaderLayout.bind(this);
    this.onScrollHandler = this.props.onScrollHandler.bind(this);
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

  resetScroll() {
    if (this.listView && this.listView.list && this.state.items.length > 0) {
      this.listView.list.scrollToIndex({
        animated: true,
        index: 0,
      });
    }
  }

  handleScroll = (isScrolling) => {
    console.log('NamesList called setState 2');
    this.setState({ scrollEnabled: isScrolling });
  };

  renderHeader() {
    //console.log("NamesList.renderHeader this.props.headerData " + JSON.stringify(this.props.headerData));
    //console.log("NamesList.renderHeader this.props.data " + JSON.stringify(this.props.data));
    let z = { ...this.props.headerData };
    console.log('NamesList.renderHeader: ' + JSON.stringify(z));
    let x = { id: 11, name: 'Aaliyah', description: 'Aaliyah' };
    return this.props.headerData ? (
      <React.Fragment>
        <View onLayout={this.onHeaderLayout}>
          <ListHeader border={false} padding={true} paddingBottom={false}>
            Top Name
          </ListHeader>
          <ListItem
            {...x}
            style={{ backgroundColor: 'black', color: 'red', height: 50 }}
          />
        </View>
      </React.Fragment>
    ) : null;
  }

  /**
   *
   */
  onHeaderLayout({ nativeEvent: { layout } }) {
    console.log('NamesList.onHeaderLayout, height is ' + layout.height);
    /*
    InteractionManager.runAfterInteractions(() => {
      this.alphabet.measure((x, y, w, h, px, py) => {
        this.setState({
          pageY: py
        });
      });
	});
	*/
    if (layout && this.state && layout.height != this.state.headerHeight) {
      console.log('NamesList called setState 3');
      this.setState({
        headerHeight: layout.height,
      });
    }
  }

  /**
   * Render an item in the list of items. Each of the items is in a section for the
   * letter that it starts with. For example, an item with the name "Ruby" will appear
   * in the section under "R".
   *
   * This method is called many times; like 25 times, for every
   * name in the list. See notes in SWAlphabetFlatList.handleChildLayout
   *
   * @param {Object} item is for example, {"name":"Ruby","description":"Ruby","id":4}
   * @param {Number} index index within each section, a number between 0 and n,
   * can be repeated for different sections of the alphabet, but only one index per
   * item within each section
   */
  renderItem({ item, index, sectionId }) {
    // Use for debugging.
    //console.log('NamesList renderItem ' + JSON.stringify(item));
    /*return <ListItem
	{...item}
	key={index}
	selected={item.selected}
	style={{ height : ITEM_HEIGHT, color: 'white', backgroundColor : 'navy'}}
	/>*/
    return (
      <View
        style={{
          marginHorizontal: 4,
          flex: 1,
          backgroundColor: 'navy',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        {/*
        http://loremflickr.com/g/50/50/paris
         */}
        <Text
          key={index}
          selected={item.selected}
          style={{
            margin: 1,
            textAlign: 'center',
            color: 'white',
            backgroundColor: 'navy',
          }}>
          <AvatarImage
            style={{ width: 50, height: 50, borderRadius: 10, margin: 10 }}
            uri={'http://loremflickr.com/g/50/50/paris'}></AvatarImage>
          {item.name}
        </Text>
      </View>
    );
  }

  sectionItemComponent({ title, active }) {
    console.log('title ZZZZ ' + title);
    // title is for example "A" or "J". active is not in use.
    return <ListFilterItem key={title} title={title} active={active} />;
  }

  respondToSelect() {
    console.log('You selected something');
    return null;
  }

  render() {
    console.log('NamesList.render. data = ' + this.props.data?.length);
    let rework = this.props.rework;
    let noalpha = this.props.noalpha;
    let data = this.props.data || ['No Names Found'];
    let sections = this.props.sections || null;
    let mapNameIndexToLetterIndex = this.props.mapNameIndexToLetterIndex || {};
    // titles is a list like ["A", "B", "D",...]
    let titles = Object.keys(data);
    let headerHeight = this.state ? this.state.headerHeight : 0;
    if (this.props.rework) {
      console.log('NamesList.render rework');
      return (
        <React.Fragment>
          <SWAlphabetFlatListRework
            ref={(ref) => (this.listView = ref)}
            data={data}
            mapNameIndexToLetterIndex={mapNameIndexToLetterIndex}
            sections={sections}
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
            sectionHeaderComponent={() => (
              <ListHeader border={false} padding={true}>
                ABC DOES NOTHING??
              </ListHeader>
            )}
            ListHeaderComponent={this.renderHeader}
            style={{
              flex: 1,
            }}
          />
        </React.Fragment>
      );
    }
    // This case mimics a data source that starts with some limited, small
    // amount, and keeps growing as the user scrolls.
    if (this.props.loader) {
      const processedData = getFlatListData(data);
      const initNum = 30;
      const n =
        !this.props.page || this.props.page < 1
          ? 2 * initNum
          : this.props.page * 3 * initNum;
      console.log(
        'NamesList.render flatList with loader, page is ' +
          this.props.page +
          ' processedData length is ' +
          processedData.length +
          ' n is ' +
          n
      );
      const pagedData = processedData.splice(0, n);
      console.log('NamesList finished processing input data, n = ' + n);
      // data was not properly formatted for display in a FlatList.
      return (
        <React.Fragment>
          <FlatList
            initialNumToRender={initNum - 1}
            onEndReachedThreshold={2.5}
            onEndReached={() => {
              console.log('onEndReached');
              this.props.onScrollHandler();
            }}
            inverted={this.props.inverted}
            data={pagedData}
            keyExtractor={(item) => item.id}
            renderItem={this.renderItem}
            onScroll={() => {
              //
            }}></FlatList>
        </React.Fragment>
      );
    }
    if (this.props.flatList) {
      console.log('NamesList.render flatList');
      const processedData = getFlatListData(data);
      console.log('NamesList finished processing input data');
      // data was not properly formatted for display in a FlatList.
      return (
        <React.Fragment>
          <FlatList
            inverted={this.props.inverted}
            data={processedData}
            keyExtractor={(item) => item.id}
            renderItem={this.renderItem}
            onScroll={this.onScrollHandler}></FlatList>
        </React.Fragment>
      );
    }
    console.log('NamesList.render default');
    return (
      <React.Fragment>
        <SWAlphabetFlatList
          ref={(ref) => (this.listView = ref)}
          data={data}
          showAlpha={this.props.showAlpha}
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
          // sectionHeaderComponent is used by SWAlphabetFlatList
          // It is not used by SWAlphabetFlatListRework
          sectionHeaderComponent={({ title }) => {
            return (
              <ListHeader border={false} padding={true}>
                {title}
              </ListHeader>
            );
          }}
          ListHeaderComponent={this.renderHeader}
          style={{
            flex: 1,
          }}
        />
      </React.Fragment>
    );
  }
}
