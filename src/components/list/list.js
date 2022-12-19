import React from 'react'
import { FlatList } from 'react-native';
import _ from "lodash";
import ListItem from './listItem'

export default class AnimatedFlatlist extends React.Component {
  render() {

    const {
      rowItem,
      inAnimation,
      outAnimation,
      duration,
      easing,      
      ...rest
    } = this.props
    return (
      <FlatList
        {...rest}
        renderItem={({item, index}) => {
          const component = rowItem({item, index})          
          return (
            <ListItem
              inAnimation={inAnimation}
              outAnimation={outAnimation}
              duration={duration}
              easing={easing}
              component={component}
              isDeleted={item._isDeleted}
              id={item.id}
              item={item}
            />
          )
        }}
      />
    )
  }
}