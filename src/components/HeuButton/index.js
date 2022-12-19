import React from 'react';
import PropTypes from 'prop-types';
import normalize from './utils/normalizeSizes';
import withPressAnimation from './utils/withPressAnimation';
import {View, Text} from 'react-native'
/**
 * HeuButton component
 */
const HeuButton = ({
  children,
  loading,
  ...props
}) => (
  <View {...props} onPress={() => this.props.onPress}>
    {loading || children}
  </View>
);

HeuButton.propTypes = {
  /**
   * Textual content which will be passed to component
  */
  children: PropTypes.object,
  /**
   * Text for loading state (e.g. during form submission)
  */
  loading: PropTypes.string,
};

HeuButton.defaultProps = {
  children: null,
  loading: null,
};

export default withPressAnimation(HeuButton);