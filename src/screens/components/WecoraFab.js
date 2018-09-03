import React, { Component } from 'react';

import {Text, View,
    StyleSheet, TouchableHighlight
} from "react-native";

import Constants from '../../global/Constants';
const Icon = Constants.Images.Icon

import ElevatedView from 'react-native-elevated-view'


export default class WecoraButton extends Component {
    constructor(props) {
       

    }

    button = () => {
        return (
            <TouchableHighlight
                style={{ backgroundColor: this.state.bgColor }}
                onPress={this.props.onPress}
                underlayColor={this.state.btn.pressedBgColor}>
                <View style={styles.buttonView}>
                    {this.props.iconName && <Icon name={this.props.iconName}
                        style={styles.iconText} />}
                </View>
            </TouchableHighlight>
        )
    }


    render() {

        return (
            
                    <ElevatedView elevation={2} >
                        {this.button()}
                    </ElevatedView>
                
        )
    }
}

const styles = StyleSheet.create({

    button: {
        borderWidth:1,
       borderColor:'rgba(0,0,0,0.2)',
       alignItems:'center',
       justifyContent:'center',
       width:100,
       height:100,
       backgroundColor:'#fff',
       borderRadius:100,
    },
    buttonText: {
        textAlign: 'center',
        color: '#00000064',
        fontSize: 16,
        marginHorizontal: 5
    },
    iconText: {
        textAlign: 'center',
        color: '#000000',
        fontSize: 22,
        marginHorizontal: 5
    },
    buttonView: {
        height: 56,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
