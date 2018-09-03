// @flow

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Platform,
  FlatList, Dimensions
} from 'react-native';

import Constants from '../../global/Constants';
import WecoraButton from './WecoraButton'
import WecoraItem from './WecoraItem'
const Icon = Constants.Images.Icon

import Masonry from 'react-native-masonry-layout';
import FastImage from 'react-native-fast-image'
//import Masonry from 'react-native-masonry';

import { inject, observer } from 'mobx-react/native';

import ElevatedView from 'react-native-elevated-view'

const numColumns = 2;



@inject('App', 'Items') @observer
export default class WecoraMasonary extends Component {

  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
    }
  }

  onPress = (item) => {
    const { Items, onItemPress } = this.props
    Items.setSelected(item)
    onItemPress(item)

  }

  _keyExtractor = (item, index) => item.id+"";
  _renderItem = ( item ) => (
    <View style={styles.itemContainer}>
      <WecoraItem
        onPress={() => { this.onPress(item) }}
        image={item.media && item.media.large ? item.media.large :  'https://source.unsplash.com/random'}
        text={item.name}
        style={styles.item} />
    </View>
  );

  componentDidMount= () => {
    const { Items } = this.props
    const items = Items.list.map((item) => {
      return {
        ...item,
        key: item.id+"abc",
      }
    })
    this.refs.masonry.clear();
    this.refs.masonry.addItems(
      items
    );
  }

  render() {
    const { Items } = this.props
    return (

      <Masonry
        ref="masonry" 
        style={styles.list}
        renderItem={this._renderItem}
      // keyExtractor={this._keyExtractor}
      />
    )

  }
}

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    margin: 4
  },
  item: {
    flex: 1,
    backgroundColor: 'lightblue',
  },
  list: {
    marginHorizontal: 12,
    flex: 1,
  }
});






     // renderFooter: (data) => {
    //     return (
    //       <View key='brick-header' style={{backgroundColor: 'white', padding: 5, paddingRight: 9, paddingLeft: 9}}>
    //         <Text style={{lineHeight: 20, fontSize: 14}}>{data.key}</Text>
    //       </View>
    //     )
    //   }