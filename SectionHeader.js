import { Text, View } from 'react-native';
import React from 'react';

/**
 * Each SectionHeader must know its y position and its index.
 * These are passed down as props.
 */
export class SectionHeader extends React.Component {
	constructor(props) {
    super(props);
	}
  render() {
		let h = this.props.h;
		let title = this.props.title;
		return (
    <View
      style={{
        height: 25,
        justifyContent: 'center',
        backgroundColor: '#F4F4F4',
        paddingLeft: 15
			}}
    >
			<Text
				style={{
					color: '#888',
					fontSize: 14
				}}
			>
        {title}
      </Text>
    </View>
  );
	};
}
