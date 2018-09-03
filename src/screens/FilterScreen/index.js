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
import WecoraList from '../components/WecoraList';
import WecoraItem from '../components/WecoraItem';
import NavButtons from '../../global/NavButtons';
import NavBar from '../../global/NavBar';

import Constants from '../../global/Constants';
const stateObs = Constants.Global.state
const itemType = Constants.Global.itemType

import ElevatedView from 'react-native-elevated-view'
import Boards from '../../stores/Boards';
import Labels from '../../stores/Labels';



@inject('Labels', 'Projects') @observer
export default class FilterScreen extends Component {
  static navigatorStyle = NavBar.Default;

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    }

  }

  componentWillMount = () => {
    const { Projects, item, selectedItemType } = this.props
    if(selectedItemType == itemType.LABEL){
      Labels.fetchList() //Labels
    }
    
  }

  

  render() {
    const { Labels, Projects, selectedItemType , select} = this.props;
    var { listState, list } = Projects;
    if(selectedItemType == itemType.LABEL){
      var { listState, list } = Labels;
    }
   
    return (
      <View style={styles.container}>
       
          <View style={styles.list}>
            <WecoraList
              list={list}
              listState={listState}
              onPress={(item) => {
                this.props.navigator.push({
                    ...Constants.Screens.FILTER_ITEMS_SCREEN,
                    title: 'Filter by: '+ item.name,
                    passProps: { item, itemType: selectedItemType, select }
                  });
              }}
            />
          </View>

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
  fab: {
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 16,
    bottom: 16,
  }
});


