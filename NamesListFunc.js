import React, { useState, useEffect } from 'react';
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

/*
console.log('NamesList.render. data = ' + this.props.data?.length);
let rework = this.props.rework;
let noalpha = this.props.noalpha;
let data = this.props.data || ['No Names Found'];
let sections = this.props.sections || null;
let mapNameIndexToLetterIndex = this.props.mapNameIndexToLetterIndex || {};
// titles is a list like ["A", "B", "D",...]
let titles = Object.keys(data);
let headerHeight = this.state ? this.state.headerHeight : 0;
*/
const NamesListFunc = ({
  headerData,
  rework,
  loader,
  showAlpha,
  flatList,
  inverted,
  data,
  sections,
  mapNameIndexToLetterIndex,
  onScrollHandler,
  page,
}) => {
  const [headerHeight, setHeaderHeight] = useState(0);

  const renderHeader = () => {
    let z = { ...headerData };
    console.log('NamesList.renderHeader: ' + JSON.stringify(z));
    let x = { id: 11, name: 'Aaliyah', description: 'Aaliyah' };
    return headerData ? (
      <React.Fragment>
        <View onLayout={onHeaderLayout}>
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
  };

  /**
   *
   */
  const onHeaderLayout = ({ nativeEvent: { layout } }) => {
    console.log('NamesList.onHeaderLayout, height is ' + layout.height);
    if (layout && layout.height != headerHeight) {
      console.log('NamesListFunc setting headerHeight to ' + layout.height);
      setHeaderHeight(layout.header);
    }
  };

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
  const renderItem = ({ item, index, sectionId }) => {
    // Use for debugging.
    //console.log('NamesList renderItem ' + JSON.stringify(item));
    /*return <ListItem
	{...item}
	key={index}
	selected={item.selected}
	style={{ height : ITEM_HEIGHT, color: 'white', backgroundColor : 'navy'}}
	/>*/
    const side = index % 3 == 0 ? 50 : 93;
    return (
      <View
        key={item.id}
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
            style={{ width: side, height: side, borderRadius: 10, margin: 10 }}
            uri={'http://loremflickr.com/g/50/50/paris'}></AvatarImage>
          {item.name}
        </Text>
      </View>
    );
  };

  const sectionItemComponent = ({ title, active }) => {
    console.log('title ZZZZ ' + title);
    // title is for example "A" or "J". active is not in use.
    return <ListFilterItem key={title} title={title} active={active} />;
  };

  const respondToSelect = () => {
    console.log('You selected something');
    return null;
  };

  if (rework) {
    console.log('NamesList.render rework');
    const titles = Object.keys(data);
    return (
      <React.Fragment>
        <SWAlphabetFlatListRework
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
          renderHeader={renderHeader}
          renderItem={renderItem}
          onSelect={respondToSelect}
          headerHeight={headerHeight}
          sectionItemComponent={sectionItemComponent}
          sectionHeaderComponent={() => (
            <ListHeader border={false} padding={true}>
              ABC DOES NOTHING??
            </ListHeader>
          )}
          ListHeaderComponent={renderHeader}
          style={{
            flex: 1,
          }}
        />
      </React.Fragment>
    );
  }

  // This case mimics a data source that starts with some limited, small
  // amount, and keeps growing as the user scrolls.
  if (loader) {
    const processedData = getFlatListData(data);
    // Start with nItemsInit items rendered.
    // When onEndReachedThreshold is triggered, get nItems more items.
    // The algorithm is linear.
    // When x-axis (page) is 0, then y-axis (nItems) is 1*nItemsInit, (30).
    // When x-axis is 1, then y-axis is 2*nItemsInit (60).
    // slope is (2*nItemsInit - 1*nItemsInit) = nItemsInit.
    // y-intercept = nItemsInit
    // So the line's formula is:
    // nItems = nItemsInit * page + nItemsInit = (page +1)*nItemsInit
    const nItemsInit = 30;
    const nItems = ((page || 0) + 1) * nItemsInit;
    //const n = !page || page < 1 ? 2 * nItemsInit : page * 3 * nItemsInit;

    console.log(
      'NamesList.render flatList with loader, page is ' +
        page +
        ' processedData length is ' +
        processedData.length +
        ' nItems is ' +
        nItems
    );
    const pagedData = processedData.splice(0, nItems);
    console.log('NamesList finished processing input data, n = ' + nItems);
    // data was not properly formatted for display in a FlatList.
    return (
      <React.Fragment>
        <FlatList
          initialNumToRender={nItemsInit}
          onEndReachedThreshold={2.5}
          onEndReached={() => {
            console.log('onEndReached');
            onScrollHandler();
          }}
          inverted={inverted}
          data={pagedData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}></FlatList>
      </React.Fragment>
    );
  }

  if (flatList) {
    console.log('NamesList.render flatList');
    const processedData = getFlatListData(data);
    console.log('NamesList finished processing input data');
    // data was not properly formatted for display in a FlatList.
    return (
      <React.Fragment>
        <FlatList
          inverted={inverted}
          data={processedData}
          keyExtractor={(item) => item.id}
          renderItem={(item) => {
            return renderItem(item);
          }}
          onScroll={onScrollHandler}></FlatList>
      </React.Fragment>
    );
  }

  console.log('NamesList.render default');
  const titles = Object.keys(data);
  return (
    <React.Fragment>
      <SWAlphabetFlatList
        data={data}
        showAlpha={showAlpha}
        titles={titles}
        itemHeight={ITEM_HEIGHT}
        enableEmptySections={false}
        removeClippedSubviews={false}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        sectionHeaderHeight={ITEM_HEIGHT}
        stickyHeaderIndices={[0]}
        renderHeader={renderHeader}
        renderItem={renderItem}
        onSelect={respondToSelect}
        headerHeight={headerHeight}
        sectionItemComponent={sectionItemComponent}
        // sectionHeaderComponent is used by SWAlphabetFlatList
        // It is not used by SWAlphabetFlatListRework
        sectionHeaderComponent={({ title }) => {
          return (
            <ListHeader border={false} padding={true}>
              {title}
            </ListHeader>
          );
        }}
        ListHeaderComponent={renderHeader}
        style={{
          flex: 1,
        }}
      />
    </React.Fragment>
  );
};

export default NamesListFunc;
