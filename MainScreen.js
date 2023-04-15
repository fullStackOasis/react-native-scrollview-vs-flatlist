import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import NamesList from './NamesList';
import FooterComponent from './FooterComponent';
import TextWrapper from './TextWrapper';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const SMALL_OFFSET = windowHeight * 0.013;
const NAV_OFFSET = 0;
const OFFSET = 0;
const MAX = 40;
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

const MainScreenWrapper = styled.View`
  flex: 1;
  backgroundcolor: transparent;
`;

class MainScreen extends Component {
  /** Lifecycle methods */
  constructor(props) {
    super(props);
    // props is expected to have data set in it.
    this.state = {
      names: {},
      progress: false,
      page: 0,
    };
    this.showProgressBar = this.showProgressBar.bind(this);
    this.hideProgressBar = this.hideProgressBar.bind(this);
    this.onLayout = this.onLayout.bind(this);
    this.onScrollHandler = this.onScrollHandler.bind(this);
    console.log(
      'MainScreen constructor has props.data.length: ' + props.data?.length
    );
  }

  /**
   * Note: You cannot trust that componentDidMount will get called when
   * screen is dismissed; react-navigation does not do that.
   */
  componentDidMount() {
    this.hideProgressBar('MainScreen componentDidMount');
  }

  /** End Lifecycle methods */

  showProgressBar(msg) {
    //return <ProgressBar progress={0.3} indeterminate={true} width={null} />;
    console.log('MainScreen showProgressBar ' + msg);
    this.setState({ progress: true });
  }

  hideProgressBar(msg) {
    //return <ProgressBar progress={0.3} indeterminate={true} width={null} />;
    console.log('MainScreen hideProgressBar ' + msg);
    this.setState({ progress: false });
  }

  onLayout() {
    this.hideProgressBar('MainScreen onLayout');
  }

  onScrollHandler() {
    const newPage = this.state.page + 1;
    this.setState({ page: newPage });
    console.log('MainScreen onScrollHandler page is ' + newPage);
  }

  render() {
    if (!this.props?.route?.params?.names) {
      return null;
    }
    let data = this.props.route.params.names;
    console.log('MainScreen.render');
    let showAlpha = this.props.route.params.showAlpha;
    let headerData = {
      A: [{ id: 11, name: 'Aaliyah', description: 'Aaliyah' }],
    };
    let progressBar = null;
    if (this.state.progress) {
      progressBar = <TextWrapper>Laying out views</TextWrapper>;
    } else {
      progressBar = <TextWrapper>Finished laying out views</TextWrapper>;
    }
    console.log('MainScreen rendering. page is ' + this.state.page);
    return (
      <MainScreenWrapper onLayout={this.onLayout}>
        {/**
			<NavigationEvents
			onDidFocus={() => {} } // noop
			onWillFocus={() => { this.showProgressBar('willFocus'); } }
			onWillBlur={() => { this.hideProgressBar('willBlur'); } }
			onDidBlur={() => { this.hideProgressBar('didBlur'); } }
			/> */}
        {progressBar}
        <ContentView
          size="small"
          tabs={true}
          isPadding={true}
          onLayout={(event) => {
            this.height = event.nativeEvent.layout.height;
          }}>
          <NamesList
            key="namesList"
            /*ref={ref => (this.contactList = ref)}*/
            data={data}
            showAlpha={Boolean(showAlpha)}
            inverted={Boolean(this.props.route.params.inverted)}
            flatList={Boolean(this.props.route.params.flatList)}
            loader={Boolean(this.props.route.params.loader)}
            headerData={headerData}
            insetPadding={true}
            page={this.state.page}
            onScrollHandler={
              this.props.route.params.loader ? this.onScrollHandler : () => {}
            }
            onSwipeablePress={this._handleSwipeableButton}
            containerHeight={this.height || windowHeight}></NamesList>
        </ContentView>
        <FooterComponent />
      </MainScreenWrapper>
    );
  }
}

export default MainScreen;
