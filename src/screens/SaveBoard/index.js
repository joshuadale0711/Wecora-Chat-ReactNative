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

import WecoraListHeader from '../components/WecoraListHeader';

import Constants from '../../global/Constants';
const stateObs = Constants.Global.state

import ElevatedView from 'react-native-elevated-view'
import Boards from '../../stores/Boards';

const modalProps = {
  title: 'Create New Board',
  icon: 'wecora_project',
  inputLabel: 'Board name',
  buttonText: 'Create New Board',
  buttonIcon: 'plus',
  storeToObserve: 'Boards',
  startMessage: undefined,
  loadMessage: 'Creating Board',
  errorMessage: 'Something Went Wrong',
  successMessage: 'Board Created Sucessfully',
  actionSuccess: { text: undefined },
  actionFailed: { text: 'Try Again' }
}

const topParams = {
  icon: 'wecora_board',
  text: 'It looks like there aren\'t any boards in this project.',
  textDes: undefined,
  action: 'CREATE NEW BOARD',
}

@inject('SaveItem') @observer
export default class SaveBoard extends Component {
  static navigatorStyle = NavBar.Default;

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    }

  }

  componentWillMount = () => {
    const { SaveItem, item } = this.props
    SaveItem.fetchList(item)
  }

  

  render() {
    const { SaveItem, navigator } = this.props;
    const { listState, list, professional } = SaveItem;
    return (
      <View style={styles.container}>

       {
          professional &&
          <ElevatedView elevation={3} style={styles.header}>
            <WecoraListHeader
              title={professional.full_name}
              subTitle={professional.company_name}
              image={professional.pic.includes("missing") ? undefined : professional.pic}
            />
          </ElevatedView>
        }
        
          <View style={styles.list}>
            <WecoraList
              list={list}
              listState={listState}
              onPress={(item) => {
               SaveItem.setParent(item)
               navigator.pop()
               navigator.pop()
              }}
            />
          </View>
        
        
        {/* <View style={styles.fab}>
          <WecoraButton
            fab
            iconName={'plus'}
            dark
            isLarge
            onPress={() =>
              Constants.Global.openAddModal(this.props.navigator, true, modalProps.buttonText, modalProps)}
          />

        </View> */}

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
  header: {
    width: '100%',
    backgroundColor: '#fff'
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
