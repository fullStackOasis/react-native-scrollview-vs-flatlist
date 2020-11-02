import React from 'react';
import styled from 'styled-components/native';
import Button from 'react-native-button';

const ListHeaderView = styled.View`
  background-color: ${props =>
    props.background ? props.background : 'green'};
  align-items: center;
  display: flex;
  border-style: solid;
  border-bottom-width: ${props => (props.border !== false ? 1 : 0)}px;
  border-bottom-color: rgba(255, 255, 255, 0.1);
  padding-right: 10px;
  padding-left: 10px;
  padding-bottom: 3px;
  justify-content: space-between;
  flex-direction: row;
`;

const ListHeaderText = styled.Text`
  color: ${props => 'white'};
  opacity: 0.7;
`;

const ListHeaderButton = styled(Button)`
  color: gray;
  position: relative;
  z-index: 99;
`;

export class ListHeader extends React.Component {
  state = {
    editing: false
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ListHeaderView
        pointerEvents="box-none"
        background={this.props.background}
        border={this.props.border}
        // // padding={this.props.padding}
        // paddingTop={this.props.paddingTop}
        // paddingBottom={this.props.paddingBottom}
        style={this.props.style}>
        <ListHeaderText>{this.props.children}</ListHeaderText>
        {this.props.editButton ? (
          <ListHeaderButton
            hitSlop={{ top: 15, left: 30, bottom: 15, right: 30 }}
            active={this.state.editing}
            onPress={() => {
              this.setState({ editing: !this.state.editing ? true : false });
              this.props.onEditPress ? this.props.onEditPress() : null;
            }}>
            Edit
          </ListHeaderButton>
        ) : null}
      </ListHeaderView>
    );
  }
}