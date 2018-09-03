// @flow

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { inject, observer, } from 'mobx-react/native';
import CounterView from '../components/Counter';
import WecoraTop from '../components/WecoraTop';
import WecoraChat from '../components/WecoraChat';
import WecoraButton from '../components/WecoraButton';
import WecoraItem from '../components/WecoraItem';
import NavButtons from '../../global/NavButtons';
import NavBar from '../../global/NavBar';

import Constants from '../../global/Constants';
const stateObs = Constants.Global.state

import ElevatedView from 'react-native-elevated-view'



export default class WecoraList extends Component {
 
  _renderFooter = () => {
    const { listState, list } = this.props;
    if (listState == stateObs.LOADING){
      return (
        <View style={styles.loading}>
          <ActivityIndicator size={'large'} color={Constants.Colors.loginBackgroundColor} />
        </View>
      ) 
    }
    else return null
  };

  _keyExtractor = (item, index) => item.id ? item.id : item.name ;
  _renderItem = ({ item }) => {
    const {withIcon} = this.props
    return  (
    <WecoraItem
      icon={withIcon ? 'wecora_chatb' : undefined}
      badge={withIcon ? item.unread_count : undefined}
      onPress={() => { this.props.onPress(item)}}
      text={item.name}
      />
    )
  };

  render() {
    
    const { listState, list } = this.props
    const showCreate = listState == stateObs.DONE && list.length == 0
    return (
          <View style={styles.list}>
            <FlatList
              data={list.slice()}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
              ListFooterComponent={this._renderFooter}
            />
          </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.Colors.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  top: {
    flex: 2
  },
  list: {
    flex: 1,
    width: '100%',
    marginVertical: 10
  },
  loading: {
    paddingVertical: 20
  },
  fab: {
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 16,
    bottom: 16,
  }
});
