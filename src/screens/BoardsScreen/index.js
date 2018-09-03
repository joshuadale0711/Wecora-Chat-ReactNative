// @flow

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  ActivityIndicator, ToastAndroid,
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
  showAction: false
}

@inject('Boards', 'Projects', 'Account') @observer
export default class BoardsScreen extends Component {
  static navigatorStyle = NavBar.Default;

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    }
    topParams.showAction = props.Account.isProfessional
  }

  componentWillMount = () => {
    const { Boards, item, navigator } = this.props
    Boards.fetchList(item)
  }

  render() {
    const { Boards, Projects, navigator } = this.props;
    const { listState, list } = Boards;
    const showCreate = listState == stateObs.DONE && list.length == 0
    // SaveItem.selectedItem ?
    //   navigator.setTitle({ title: "Select Board" }) 
    //   : navigator.setTitle({ title: "Boards" }) 
    
    // ToastAndroid.show(list
    //   .map(todo => todo.unread_count)
    //   .join(", "), ToastAndroid.LONG);
    return (
      <View style={styles.container}>
        {showCreate &&
          <View style={styles.top}>
            <WecoraTop icon={topParams.icon}
              text={topParams.text}
              textDes={topParams.textDes}
              showAction={topParams.showAction}
              action={topParams.action ? {
                text: topParams.action,
                onPress: () => Constants.Global.openAddModal(this.props.navigator, true, modalProps.title, modalProps)
              } : undefined} />
          </View>
        }

        <View style={styles.list}>
          <WecoraList
            withIcon
            list={list.slice()}
            listState={listState}
            onPress={(item) => {
              this.props.navigator.push({
                ...Constants.Screens.CHATS_SCREEN,
                title: item.name,
                passProps: { item }
              });
            }}
          />
        </View>

        {topParams.showAction &&
          <View style={styles.fab}>
            <WecoraButton
              fab
              iconName={'plus'}
              dark
              isLarge
              onPress={() =>
                Constants.Global.openAddModal(this.props.navigator, true, modalProps.buttonText, modalProps)}
            />

          </View>
        }


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
