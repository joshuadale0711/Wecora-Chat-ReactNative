// @flow

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ImageBackground
} from 'react-native';


import Constants from '../../global/Constants';
const Icon = Constants.Images.Icon

export default class WecoraInitials extends Component {

    constructor(props) {
        super(props)
        this.state = { error: false}
    }
    renderCircle = () => {
        const { avatar, ellipse } = this.props
        const { initials, color = '#808080', textColor = "#fff" } = this.props
        if (avatar && !ellipse)
            return (this.state.error ? <View style={[styles.circle, { backgroundColor: color }]}>
                <Text style={[styles.text, { color: textColor }]}>{initials}</Text>
            </View> :
                <Image style={styles.circle} resizeMode={'cover'} source={{ uri: avatar }} 
                onError={() => this.setState({ error: true })} />)
        else if (avatar && ellipse)
            return (<ImageBackground style={styles.circle} resizeMode={'cover'} source={Constants.Images.EllIPSE}>
                <Image style={styles.minicircle} resizeMode={'cover'} source={{ uri: avatar }} />
                {/* <Text style={[styles.text, { color: textColor }]}>{initials}</Text> */}
            </ImageBackground>)
        else if (ellipse && !avatar)
            return (<ImageBackground style={styles.circle} resizeMode={'cover'} source={Constants.Images.EllIPSE}>
                <Text style={[styles.text, { color: textColor }]}>{initials}</Text>
            </ImageBackground>)
        else if (!avatar && !ellipse)
            return (<View style={[styles.circle, { backgroundColor: color }]}>
                <Text style={[styles.text, { color: textColor }]}>{initials}</Text>
            </View>)
    }

    render() {


        return (
            <View>
                <TouchableOpacity onPress={this.props.onPress}>
                    {this.renderCircle()}
                </TouchableOpacity>
            </View>

        );
    }


}

const styles = StyleSheet.create({

    circle: {
        marginLeft: 8,
        marginBottom: 8,
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        left: 0,
        top: 0,
    },
    minicircle: {
        position: 'absolute',
        width: 38,
        height: 38,
        borderRadius: 38 / 2,
    },
    text: {
        color: '#fff',
        fontWeight: 'bold'
    }
});
