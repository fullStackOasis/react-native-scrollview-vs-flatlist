/**
 * Nothing to say.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

export function SectionListItem({ title, height, active = false }) {
  return (
    <View key={title}
      style={{
        height,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <View
        style={{
          width: 18,
          height: 18,
          borderRadius: 9,
          backgroundColor: active ? '#0ea8ff' : 'transparent',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text
          style={{
            fontSize: 11,
            color: active ? 'white' : '#333',
            textAlign: 'center',
            fontWeight: 'bold'
          }}
        >
          {title}
        </Text>
      </View>
    </View>
  );
}

SectionListItem.propTypes = {
  title: PropTypes.string,
  height: PropTypes.number,
  active: PropTypes.bool
};
