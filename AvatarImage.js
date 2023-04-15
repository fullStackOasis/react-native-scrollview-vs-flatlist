import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';

const LazyImageView = styled.View`
  width: 100%;
  position: relative;
  overflow: hidden;
  height: ${(props) => (props.height ? props.height : '100%')};
`;

const LazyImageElement = styled(FastImage)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

export default function AvatarImage({ uri, style, ...rest }) {
  return (
    <LazyImageView style={style} {...rest}>
      <Image uri={uri} style={style} />
    </LazyImageView>
  );
}

const Image = ({ uri, style }) => {
  const [imageUri, setImageUri] = useState();

  useEffect(() => {
    if (!uri) {
      return setImageUri('');
    }
    setImageUri(uri);
  }, [uri]);

  if (imageUri === undefined) {
    return <></>;
  }

  if (imageUri) {
    // Other uri for testing: https://unsplash.it/400/400?image=1
    console.log('URI: ' + uri);
    return (
      <LazyImageElement
        style={style}
        source={{
          uri: imageUri,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />
    );
  }
  return <></>;
};
