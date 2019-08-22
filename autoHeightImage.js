/**
 * @since 2017-04-11 19:10:08
 * @author vivaxy
 */

import React, { useState, useEffect } from 'react';
import Image from 'react-native-android-image-polyfill';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { getImageSizeFitWidth, getImageSizeFitWidthFromCache } from './cache';
import { NOOP, DEFAULT_HEIGHT } from './helpers';

// remove `resizeMode` props from `Image.propTypes`
const { resizeMode, ...ImagePropTypes } = Image.propTypes;

const AutoHeightImage = (props) => {
  const { source, style, width, onHeightChange, ...restProps } = props;

  let updateSequence = 0;
  let hasMounted = false;
  let styles = {};

  const [prevProps, setPrevProps] = useState(props);
  const [height, setHeight] = useState(0);

  const updateImageHeight = () => {
    if (
      height === DEFAULT_HEIGHT ||
      prevProps.width !== props.width ||
      prevProps.source !== props.source
    ) {
      // image height could not be `0`
      try {
        const localUpdateSequence = ++updateSequence;
        const { height } = await getImageSizeFitWidth(source, width);
        if (localUpdateSequence !== updateSequence) {
          return;
        }

        styles = StyleSheet.create({ image: { width, height } });
        if (hasMounted) {
          // guard `this.setState` to be valid
          setHeight(height);
          onHeightChange(height);
        }
      } catch (ex) {
        if (props.onError) {
          props.onError(ex);
        }
      }
    }

  const setInitialImageHeight = () => {
    const { height = DEFAULT_HEIGHT } = getImageSizeFitWidthFromCache(
      source,
      width
    );
    setHeight(height);
    styles = StyleSheet.create({ image: { width, height } });
    onHeightChange(height);
  };

  useEffect(() => {
    setInitialImageHeight();
    return () => {
      hasMounted = false;
      updateSequence = null;
    }
  }, []);

  useEffect(() => {
    hasMounted = true;
    updateImageHeight();
  }, [props]);

  return (
    <Image
      source={source}
      style={[styles.image, style]}
      {...restProps}
    />
  );

}

AutoHeightImage.propTypes = {
  ...ImagePropTypes,
  width: PropTypes.number.isRequired,
  onHeightChange: PropTypes.func
}

AutoHeightImage.defaultProps = {
  onHeightChange: NOOP
};

export default class AutoHeightImage extends PureComponent {


  render() {
    // remove `width` prop from `restProps`
    
  }
}
