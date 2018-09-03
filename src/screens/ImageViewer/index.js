// @flow

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button, Image, ScrollView, Platform
} from 'react-native';
import { inject, observer } from 'mobx-react/native';

import NavButtons from '../../global/NavButtons';
import NavBar from '../../global/NavBar';
import Constants from '../../global/Constants';
const stateObs = Constants.Global.state
import FastImage from 'react-native-fast-image'
import Screens from '../../global/Constants/Screens';

import IV from 'react-native-image-zoom-viewer';


export default class ImageViewer extends Component {

    static navigatorButtons = NavButtons.Login;
    static navigatorStyle = NavBar.Default;

    constructor(props: {}) {
        super(props);

        this.state = {
            imageUrl: [{url : props.image}]
        }
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }


    componentDidMount() {
        this.handleVisibilityOfNavButtons();
    }


    onNavigatorEvent = (event: { id: string }) => {
        const { withCancelButton, storeToObserve } = this.props;

        switch (event.id) {
            case 'cancel':
                this.dismiss();
                break;
            case 'backPress':
                if (withCancelButton) this.dismiss();
                break;
            default:
        }
    }

    handleVisibilityOfNavButtons = () => {
        const { navigator, withCancelButton, withAccountsButton } = this.props;

        if (!withCancelButton) {
            navigator.setButtons({ leftButtons: [] })
        }
    }

    dismiss = () => {
        const { navigator, SaveItem } = this.props;
        navigator.dismissModal();
    }



    render() {
    
        return (

            <View style={styles.container}>
                <IV imageUrls={this.state.imageUrl} />
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constants.Colors.backgroundColor,
    }

});
