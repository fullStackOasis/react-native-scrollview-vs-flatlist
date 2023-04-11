import React from 'react';
import { View, DeviceEventEmitter, Button } from 'react-native';
// import Button from 'react-native-button';
import styled from 'styled-components/native';

const ListItemView = styled.View`
  align-items: center;
  display: flex;
  border-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: rgba(255, 255, 255, 0.1);
  background-color: darkblue;
  justify-content: space-between;
  position: relative;
  flex-direction: row;
  z-index: 1;
  padding-left: 5px;
  padding-right: 5px;
`;

const ListItemViewContent = styled.View`
  padding-left: ${0}px;
  position: relative;
  flex: auto;
`;

const ListItemButton = styled(Button).attrs(props => ({
  containerStyle: {
    paddingTop: 0,
    paddingBottom:  0,
    width: '100%'
  }
}))``;

const ListItemTitle = styled.Text`
  color: #f1f1f1;
  font-size: 30px;
  margin: 5px 0;
`;

const ListItemHeader = styled.Text`
  color: blue;
  opacity: ${props => (props.blocked || props.banned ? 1 : 0.7)};
  text-transform: uppercase;
  max-width: 90%;
  font-size: 20px;
  font-weight: 500;
`;

const ListItemDetail = styled.Text`
  color: lightgreen;
  opacity: 0.7;
  max-width: 90%;
  font-size: 20px;
  font-weight: 500;
`;

/**
 * This sets the style for the name, e.g. Abigail, in SWAlphabetFlatList
 */
const ListItemDescription = styled.Text`
  color: #ffffff;
  opacity: ${props => (props.unread && !props.welcome ? 1 : 0.7)};
  max-width: 90%;
  font-weight: 500;
  font-size: 30px;
  ${props =>
    props.unread && !props.welcome && props.type === 'notification'
      ? 'font-family: gt-america-medium'
      : null}
`;

const ListItemSwipeableButton = styled(Button).attrs(props => ({
  containerStyle: {
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  }
}))`
  color: green;
  text-align: center;
`;

const ListItemSwipeout = styled(View).attrs(props => ({
  backgroundColor: 'transparent'
}))`
  border-width: 0px;
  width: 100%;
`;

export class ListItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      closeSwipe: false,
      blocked: props.blocked,
      banned: props.banned,
      unread: props.unread,
      date: false
    };
  }

  handleListItemPress = () => {
	console.log("Do nothing on press");
  };

  handleSwipeablePress = action => {
  };

  // Displays the differnt types of swipeable options based on prop type
  displaySwipeableOptions() {
    if (this.props.swipeable) {
      switch (this.props.swipeableType) {
        case 'notification':
          return [
            {
              component: (
                <ListItemSwipeableButton
                  onPress={() => this.handleSwipeablePress('read')}>
                  Remove
                </ListItemSwipeableButton>
              )
            }
          ];
        case 'bailiff':
          return [
            {
              component: (
                <ListItemSwipeableButton
                  onPress={() => this.handleSwipeablePress('report')}>
                  Report
                </ListItemSwipeableButton>
              )
            },
            {
              component: (
                <ListItemSwipeableButton
                  block={true}
                  onPress={() => {
                    this.handleSwipeablePress(
                      !this.state.blocked ? 'block' : 'unblock'
                    );
                  }}>
                  {!this.state.blocked ? 'Block' : 'Unblock'}
                </ListItemSwipeableButton>
              )
            },
            {
              component: (
                <ListItemSwipeableButton
                  ban={true}
                  onPress={() => {
                    this.handleSwipeablePress(
                      !this.state.banned ? 'ban' : 'unban'
                    );
                  }}>
                  {!this.state.banned ? 'Ban' : 'Unban'}
                </ListItemSwipeableButton>
              )
            }
          ];
        default:
          return [
            {
              component: (
                <ListItemSwipeableButton
                  onPress={() => this.handleSwipeablePress('report')}>
                  Report
                </ListItemSwipeableButton>
              )
            },
            {
              component: (
                <ListItemSwipeableButton
                  block={true}
                  onPress={() => {
                    this.handleSwipeablePress(
                      !this.state.blocked ? 'block' : 'unblock'
                    );
                  }}>
                  {!this.state.blocked ? 'Block' : 'Unblock'}
                </ListItemSwipeableButton>
              )
            }
          ];
      }
    }
  }

  _handleSwipeOpen(){
    this.setState({ closeSwipe: false });
    //console.log('_handleSwipeOpen');
  }

  render() {
    console.log("WHat are the props eh? " + JSON.stringify(this.props));
    return (
      <ListItemView
        pointerEvents="box-none"
        // padding={this.props.padding}
        border={this.props.border}
        highlighted={this.props.highlighted}
        blocked={this.props.blocked}
        onLayout={this.props.onLayoutUpdate}
        style={this.props.style}>
        <ListItemSwipeout
          disabled={this.props.disabled || !this.props.swipeable}
          type={this.props.swipeableType}
          scroll={event => DeviceEventEmitter.emit('swipe-list', event)}
          buttonWidth={this.props.swipeableType === 'notification' ? 130 : 90}
          autoClose={true}
          onOpen={() => (this._handleSwipeOpen())}
          close={this.state.closeSwipe}
          >
          <ListItemButton
            title={this.props.name}
            {...this.props}
            disabled={
              this.props.disabled ||
              (!this.props.button && !this.props.checkbox) ||
              this.props.toggle
            }
            onPress={this.handleListItemPress}>
            <ListItemViewContent icon={this.props.icon}>
              {(this.props.header ||
                this.state.blocked ||
                this.state.banned) && (
                <ListItemHeader
                  blocked={this.state.blocked}
                  banned={this.state.banned}
                  numberOfLines={1}>
                  {this.props.header
                    ? this.props.header
                    : this.state.blocked && this.state.banned
                    ? 'Blocked + Banned'
                    : this.state.blocked
                    ? 'Blocked'
                    : this.state.banned
                    ? 'Banned'
                    : ''}
                </ListItemHeader>
              )}
              {this.props.title && (
                <ListItemTitle
                  type={this.props.swipeableType}
                  unread={this.state.unread}
                  numberOfLines={ this.props.titleNumberOfLines ? this.props.titleNumberOfLines : 2 }
                  small={
                    (this.props.button &&
                      (this.props.icon || this.props.polygon) &&
                      this.props.size !== 'large') ||
                    this.props.size !== 'large'
                  }>
                  {this.props.title}
                </ListItemTitle>
              )}
              {this.props.detail && (
                <ListItemDetail numberOfLines={2}>
                  {this.props.detail}
                </ListItemDetail>
              )}
              {this.props.description && (
                <ListItemDescription
                  type={this.props.swipeableType}
                  unread={this.state.unread}
                  welcome={this.props.welcome}
                  numberOfLines={this.props.welcome ? null : 3}>
                  {this.props.description}
                </ListItemDescription>
              )}
            </ListItemViewContent>
          </ListItemButton>
        </ListItemSwipeout>
      </ListItemView>
    );

  }

}
