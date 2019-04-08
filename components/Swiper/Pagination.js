import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Dimensions, StyleSheet, TouchableOpacity, View, ViewPropTypes} from 'react-native';


export default class Pagination extends PureComponent {
  static propTypes = {
    scrollToIndex: PropTypes.func.isRequired,
    data: PropTypes.array,
    paginationIndex: PropTypes.number,
    paginationActiveColor: PropTypes.string,
    paginationDefaultColor: PropTypes.string,
    paginationStyle: ViewPropTypes.style,
    paginationStyleItem: ViewPropTypes.style,
  };

  static defaultProps = {
    data: [],
    paginationIndex: 0,
    paginationActiveColor: '#fff',
    paginationDefaultColor: '#555',
    paginationStyle: {},
    paginationStyleItem: {},
  };

  render() {
    const {
      data,
      paginationIndex,
      scrollToIndex,
      paginationDefaultColor,
      paginationActiveColor,
      paginationStyle,
      paginationStyleItem,
    } = this.props;
    return (
      <View style={[styles.container, paginationStyle]}>
        {data.map((_, index) => (
          <TouchableOpacity
            style={[
              styles.pagination,
              paginationStyleItem,
              paginationIndex === index
                ? styles.sliderActiveDot
                : styles.sliderDot,
            ]}
            key={index}
            onPress={() => scrollToIndex(index)}
          />
        ))}
      </View>
    );
  }
}

const {width, height} = Dimensions.get('window');

const vertical = {
  xxSmall: height * 0.0125,
  xSmall: height * 0.025,
  small: height * 0.0375,
  medium: height * 0.05,
  normal: height * 0.065,
  large: height * 0.075,
};

const horizontal = {
  xxSmall: width * 0.0125,
  xSmall: width * 0.025,
  small: width * 0.0375,
  medium: width * 0.05,
  large: width * 0.075,
};

const styles = StyleSheet.create({

  sliderDot: {
    backgroundColor: 'transparent',
    borderColor: '#0C21E2',
    borderWidth: 1,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 4,
    marginRight: 4,
    // marginBottom: -20
  },
  sliderActiveDot: {
    backgroundColor: '#0C21E2',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 4,
    marginRight: 4,
    // marginBottom: -20
  },


  container: {
    position: 'absolute',
    flexDirection: 'row',
    marginVertical: vertical.xxSmall,
    justifyContent: 'center',
    bottom: 0,
    left: width * 0.25,
    right: width * 0.25,
  },
  pagination: {
    width: horizontal.small,
    height: horizontal.small,
    borderRadius: 25,
    marginHorizontal: horizontal.xSmall,
  },
});

