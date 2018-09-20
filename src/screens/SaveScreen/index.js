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
}




@inject('Boards', 'Projects', 'Account', 'Chats', 'SaveItem') @observer
export default class SaveScreen extends Component {
   
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
        
    }


    render() {
        const { Projects, Account, SaveItem, navigator } = this.props;
        const { listState, list, myProjects, mySectionedProjects } = Projects;
        const showCreate = listState == stateObs.DONE && list.length == 0
        const showHint = listState == stateObs.DONE && list.length > 0 && !Account.dismissed

        return (
            <View style={styles.container}>



                <View style={styles.list}>
                    <WecoraList
                        list={myProjects}
                        listState={listState}
                        sectionedList={mySectionedProjects}
                        onPress={(item) => {
                            SaveItem.setGrandParent(item)
                            navigator.push({
                                ...Constants.Screens.SAVE_BOARD,
                                title: item.name,
                                passProps: { item }
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
        marginVertical: 20
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
