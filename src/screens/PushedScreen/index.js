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
import WecoraItem from '../components/WecoraItem';
import WecoraButton from '../components/WecoraButton';
import WecoraList from '../components/WecoraList';
import ActionSheet from '../components/ActionSheet';

import NavButtons from '../../global/NavButtons';
import NavBar from '../../global/NavBar';

import Constants from '../../global/Constants';
const Icon = Constants.Images.Icon
const stateObs = Constants.Global.state


import ElevatedView from 'react-native-elevated-view'
import Account from '../../stores/Account';
import SaveItem from '../../stores/SaveItem';

const modalProps = {
  title: 'Create New Project',
  icon: 'wecora_project',
  inputLabel: 'Project name',
  buttonText: 'Create New Project',
  buttonIcon: 'plus',
  storeToObserve: 'Projects',
  startMessage: undefined,
  loadMessage: 'Creating Project',
  errorMessage: 'Something Went Wrong',
  successMessage: 'Project Created Sucessfully',
  actionSuccess: { text: undefined },
  actionFailed: { text: 'Try Again' }
}

const topParams = {
  icon: 'wecora_msg',
  text: 'Client conversations happen within a project\'s Boards',
  textDes: 'It looks like you don\'t have any active Projects',
  action: 'CREATE NEW PROJECT',
  showAction: false
}




@inject('Boards', 'Projects', 'Account', 'Chats', 'SaveItem') @observer
export default class PushedScreen extends Component {
  static navigatorStyle = NavBar.Default;

  // static navigatorButtons = {
  //   rightButtons: [
  //     {
  //       icon: require('../../../resources/images/menu.png'),
  //       id: 'menu',
  //     }
  //   ]
  // };



  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    }

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    Icon.getImageSource('dot-3', 18).then((menu) => {
      this.props.navigator.setButtons({
        rightButtons: [
          { id: 'menu', icon: menu },
        ]
      });
    });

    topParams.showAction = props.Account.isProfessional

  }

  onNavigatorEvent = (event: { id: string }) => {
    if (event.id == 'willAppear') {
      const { Projects, navigator } = this.props
      Projects.fetchSectionedList()
      if (SaveItem.selectedItem) {
        navigator.setTitle({ title: "Select Project" })
      } else { navigator.setTitle({ title: "Projects" }) }
    }
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'menu') {
        this.ActionSheet.showActionSheet()
      }
    }
  }


  render() {
    const { Counter, Projects, Account, navigator, SaveItem } = this.props;
    var { listState, list, sectionedList, myProjects, mySectionedProjects } = Projects;
    if (Account.isProfessional && SaveItem.shared){
      list = myProjects
      sectionedList = mySectionedProjects
    }
    const showCreate = listState == stateObs.DONE && list.length == 0
    const showHint = listState == stateObs.DONE && list.length > 0 && !Account.dismissed

    return (
      <View style={styles.container}>
        {
          showCreate &&
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
        {
          showHint &&
          <View style={styles.top}>
            <WecoraTop icon={topParams.icon}
              text={topParams.text}
              showAction={true}
              action={{
                text: 'DISMISS',
                onPress: () => { Account.dismiss() }
              }} />
          </View>
        }
        {!showCreate &&
          <View style={styles.list}>
            <WecoraList
              withIcon
              list={list.slice()}
              listState={listState}
              sectionedList={sectionedList}
              onPress={(item) => {
                this.props.navigator.push({
                  ...Constants.Screens.BOARDS_SCREEN,
                  title: item.name,
                  passProps: { item }
                });
              }}
            />
          </View>
        }

        {showCreate &&
          <View style={styles.holder}>
          </View>
        }

        {topParams.showAction &&
          <View style={styles.fab}>
            <WecoraButton
              fab
              iconName={'plus'}
              dark
              isLarge
              onPress={() =>
                Constants.Global.openAddModal(navigator, true, modalProps.buttonText, modalProps)}
            />

          </View>
        }


        <ActionSheet
          ref={o => this.ActionSheet = o}
          options={['LOGOUT']}
          onPress={async (index) => {
            if (index == 1) {
              setTimeout(() => {
                Account.logout().then((s) => navigator.resetTo({ ...Constants.Screens.SIGNIN_SCREEN }),
                  (e) => navigator.resetTo({ ...Constants.Screens.SIGNIN_SCREEN }))
              }, 1000)

            }
          }}
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
    flex: 3
  },
  list: {
    flex: 2,
    width: '100%',
  },
  item: {
    width: '100%'
  },
  loading: {
    paddingVertical: 20
  },
  fab: {
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  holder: {
    flex: 1
  }
});
