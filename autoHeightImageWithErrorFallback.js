import React, { useState } from 'react';

import AutoHeightImage from './autoHeightImage';

const ErrorableImage = (props) => {
  const [error, setError] = useState(false);
  const { source, fallbackSource, onError, ...restProps } = props;

  const shouldUseFallbackSource = error && fallbackSource;

  return (
    <AutoHeightImage
      source={shouldUseFallbackSource ? fallbackSource : source}
      onError={(e) => {
        // if an error hasn't already been seen, try to load the error image
        // instead
        if (!error) {
          setError(true)
        }

        // also propagate to error handler if it is specified
        if (onError) {
          onError(e);
        }
      }}
      {...restProps}
    />
  );
}

ErrorableImage.propTypes = {
  ...AutoHeightImage.propTypes,
  fallbackSource: AutoHeightImage.propTypes.source
};


export default ErrorableImage;