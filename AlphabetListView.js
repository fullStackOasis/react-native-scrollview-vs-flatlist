/**
 */
import React from 'react';
import PropTypes from 'prop-types';
import { PanResponder, View } from 'react-native';
import Toast from 'react-native-root-toast';

let toast = null;

export function AlphabetListView({ onLayout, container, contentHeight, pageY, titles, onSelect, selectAlphabet, item }) {
  const itemHeight = contentHeight / titles.length;

  const onTouchChange = (evt, type) => {
    const event = evt.nativeEvent || {};
    const index = Math.floor((event.pageY - pageY) / itemHeight);

    if (index >= 0 && titles[index]) {
      if (toast) {
        setTimeout(() => {
          toast && Toast.hide(toast);
          toast = null;
        }, 100);
      }
      if (type === 'Move') {
        toast = Toast.show(`${titles[index]}`, {
          position: Toast.positions.CENTER,
          duration: 1000,
          shadow: false,
          opacity: 1,
          containerStyle: {
            height: 70,
            width: 70,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'black'
          },
          textStyle: {
            color: 'white',
            fontSize: 35,
            fontWeight: 'bold'
          }
        });
      }
      onSelect && onSelect(index);
    }
  };

  const responder = PanResponder.create({
    // Request to be a responder：
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponderCapture: () => { },
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => { },
    onPanResponderTerminationRequest: () => true,
    onPanResponderGrant: evt => onTouchChange(evt, 'Grant'),
    // onPanResponderStart: evt => onTouchChange(evt, 'Start'),
    onPanResponderMove: evt => onTouchChange(evt, 'Move')
    // onPanResponderEnd: evt => onTouchChange(evt, 'End'),
    // onPanResponderRelease: evt => onTouchChange(evt, 'Release')
  });

  return (
    <View
      ref={ref => container(ref)}
      onLayout={onLayout}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 5,
        zIndex: 10
      }}
      {...responder.panHandlers}>
      {titles.map((title, index) => item({ title, active: selectAlphabet === title }))}
    </View>
  );
}

AlphabetListView.propTypes = {
  prop: PropTypes.any
};
