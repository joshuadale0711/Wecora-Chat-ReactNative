// @flow

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View, Modal, TouchableWithoutFeedback, Linking,
    Button, Image, ScrollView, Platform, Keyboard
} from 'react-native';
import { inject, observer } from 'mobx-react/native';

import NavButtons from '../../global/NavButtons';
import NavBar from '../../global/NavBar';
import Constants from '../../global/Constants';
const stateObs = Constants.Global.state
const currList = Constants.Global.CurrencyList
import FastImage from 'react-native-fast-image'
import Screens from '../../global/Constants/Screens';

import WecoraInput from '../components/WecoraInput';
import WecoraButton from '../components/WecoraButton';
import WecoraTop from '../components/WecoraTop';
import WecoraList from '../components/WecoraList';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import url from 'url'
import KeyboardSpacer from 'react-native-keyboard-spacer';

@inject('Items', 'SaveItem') @observer
export default class SaveItem extends Component {

    static navigatorButtons = NavButtons.Login;
    static navigatorStyle = NavBar.Default;

    constructor(props: {}) {
        super(props);
        const { ideaId, id, name, selectedURL, description, unit_cost, selling_price,
            unit_cost_currency, selling_price_currency, quantity } = props.SaveItem
        this.state = {
            id: id ? id : '',
            name: name ? name : '',
            source: selectedURL ? selectedURL : '',
            description: description ? description : '',
            unit_cost: unit_cost ? unit_cost : '',
            selling_price: selling_price ? selling_price : '',
            unit_cost_currency: unit_cost_currency ? unit_cost_currency : 'USD',
            selling_price_currency: selling_price_currency ? selling_price_currency : 'USD',
            quantity: quantity ? quantity : '1',
            modalVisible: false,
            isEdit: props.title == 'Edit Image',
            ideaId: ideaId ? ideaId : ''
        }
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
        //console.log(this.state.isEdit)
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
        SaveItem.reset()
        navigator.dismissModal();
    }

    componentWillUpdate = (nextProps) => {

        if (nextProps.SaveItem.createState == stateObs.DONE) {
            setTimeout(() => {
                nextProps.SaveItem.reset()
                nextProps.navigator.dismissModal()
            }, 1200);

            if (Platform.OS == 'ios' && this.state.source) {
                setTimeout(() => {
                    let urla = this.state.source
                    urla = urla + '#X3Rp-ddo-8Pk6iAT'
                    Linking.openURL(urla)
                }, 2000)
            }
        }
    }

    setPositveOnly = (field, number, change) => {
        number = number.replace(/[^0-9.]/g, '')
        if(number == '') number = 0
        number = parseFloat(number)
        if (change) number = number + change
        let obj = {}
        obj[field] = number >= 0 ? number : 0
        this.setState({
            ...obj
        })
    }
    // componentWillMount = () => {
    //     const { SaveItem } = this.props
    //     //SaveItem.setParent(item)

    // }

    setModalVisible(visible, field, item) {
        if (visible)
            this.setState({ modalVisible: visible, [field]: undefined });
        else {
            if (!this.state.unit_cost_currency) {
                field = 'unit_cost_currency'
            }
            if (!this.state.selling_price_currency) {
                field = 'selling_price_currency'
            }
            this.setState({ modalVisible: visible, [field]: item.name });
        }
    }

    getFullForm = () => {
        const { SaveItem, navigator } = this.props
        return (

            <View style={styles.fullForm}>

                <View style={styles.image}>
                    <Image style={{ alignSelf: 'center' }} resizeMode={'cover'} source={require('../../../resources/images/wecora_icon_trans.png')} />
                    <FastImage
                        style={StyleSheet.absoluteFill}
                        source={{
                            uri: SaveItem.selectedItem
                        }}
                        onLoad={(e) => {
                            // let source = SaveItem.selectedItem.source ? SaveItem.selectedItem.source  : ''
                            // this.setState({source})
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                </View>

                <View style={styles.wecoraInputContainer}>
                    <View style={styles.input}>
                        <WecoraInput label={'Item Name'} hidden={false}
                            defaultColor='#FFFFFF'
                            pressedColor='#EBEBEB'
                            labelColor='#000'
                            inputColor='#000'
                            returnKeyType='next'
                            onSubmitEditing={() => {
                                this.sourceInput.focus()
                            }}
                            value={this.state.name}
                            onChangeText={(text) => this.setState({
                                name: text
                            })} />
                    </View>
                </View>

                <View style={styles.wecoraInputContainer}>
                    <View style={styles.input}>
                        <WecoraInput label={'Source'} hidden={false}
                            defaultColor='#FFFFFF'
                            pressedColor='#EBEBEB'
                            labelColor='#000'
                            inputColor='#000'
                            ref={(input) => this.sourceInput = input}
                            returnKeyType='next'
                            onSubmitEditing={() => {
                                this.descriptionInput.focus()
                                // this.setState({
                                //     description: 'a'
                                // })
                                // this.setState({
                                //     description: ''
                                // })
                            }}
                            value={this.state.source}
                            onChangeText={(text) => this.setState({
                                source: text
                            })} />
                    </View>
                </View>

                <View style={styles.wecoraInputContainer}>
                    <View style={styles.input}>
                        <WecoraInput label={'Description'} hidden={false}
                            defaultColor='#FFFFFF'
                            pressedColor='#EBEBEB'
                            labelColor='#000'
                            inputColor='#000'
                            returnKeyType='next'
                            ref={(input) => this.descriptionInput = input}
                            value={this.state.description}
                            onSubmitEditing={() => {
                                this.unitCostInput.focus()
                                this.setPositveOnly('unit_cost', '1')
                                this.setPositveOnly('unit_cost', '')
                            }}
                            onChangeText={(text) => this.setState({
                                description: text
                            })} />
                    </View>
                </View>

                <View style={{ flexDirection: 'row' }}>

                    <View style={styles.wecoraInputContainer}>
                        <View style={styles.input}>
                            <WecoraInput label={'Unit Cost'} hidden={false}
                                defaultColor='#FFFFFF'
                                pressedColor='#EBEBEB'
                                labelColor='#000'
                                inputColor='#000'
                                returnKeyType='next'
                                ref={(input) => this.unitCostInput = input}
                                onSubmitEditing={() => {
                                    this.sellingPriceInput.focus()
                                    this.setPositveOnly('selling_price', '1')
                                    this.setPositveOnly('selling_price', '')
                                }}
                                value={this.state.unit_cost + ''}
                                keyboardType={'numeric'}
                                onChangeText={(text) => this.setPositveOnly('unit_cost', text)} />
                        </View>
                    </View>

                    <View style={styles.wecoraInputContainer}>
                        <TouchableWithoutFeedback onPress={() => this.setModalVisible(true, 'unit_cost_currency')}>
                            <View style={styles.currencyBox}>
                                <Text style={styles.inputLabelText}>Currency</Text>
                                <Text style={styles.inputStyle}>{this.state.unit_cost_currency ? this.state.unit_cost_currency.toUpperCase() + '' : ''}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>

                </View>


                <View style={{ flexDirection: 'row' }}>

                    <View style={styles.wecoraInputContainer}>
                        <View style={styles.input}>
                            <WecoraInput label={'Selling Price'} hidden={false}
                                defaultColor='#FFFFFF'
                                pressedColor='#EBEBEB'
                                labelColor='#000'
                                inputColor='#000'
                                returnKeyType='next'
                                ref={(input) => this.sellingPriceInput = input}
                                onSubmitEditing={() => {
                                    this.quantityInput.focus()
                                    this.setPositveOnly('quantity', '0')
                                    this.setPositveOnly('quantity', '1')
                                }}
                                keyboardType={'numeric'}
                                value={this.state.selling_price + ''}
                                onChangeText={(text) => this.setPositveOnly('selling_price', text)} />
                        </View>
                    </View>

                    <View style={styles.wecoraInputContainer}>
                        <TouchableWithoutFeedback onPress={() => this.setModalVisible(true, 'selling_price_currency')}>
                            <View style={styles.currencyBox}>
                                <Text style={styles.inputLabelText}>Currency</Text>
                                <Text style={styles.inputStyle}>{this.state.selling_price_currency ? this.state.selling_price_currency.toUpperCase() + '' : ''}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>

                </View>


                <View style={{ flexDirection: 'row' }}>

                    <View style={styles.wecoraInputContainer}>
                        <View style={styles.input}>
                            <WecoraInput label={'Quantity'} hidden={false}
                                defaultColor='#FFFFFF'
                                pressedColor='#EBEBEB'
                                keyboardType={'numeric'}
                                labelColor='#000'
                                inputColor='#000'
                                returnKeyType='done'
                                ref={(input) => this.quantityInput = input}
                                onSubmitEditing={() => Keyboard.dismiss()}
                                value={this.state.quantity + ''}
                                onChangeText={(text) => this.setPositveOnly('quantity', text)} />
                        </View>
                    </View>

                    <View style={styles.wecoraInputContainer}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <WecoraButton
                                fab
                                iconName={'minus'}
                                dark
                                onPress={() => this.setPositveOnly('quantity', this.state.quantity + '', -1)}
                            />
                            <WecoraButton
                                fab
                                iconName={'plus'}
                                dark
                                onPress={() => this.setPositveOnly('quantity', this.state.quantity + '', 1)}
                            />
                        </View>
                    </View>

                </View>


            </View >
        )
    }

    getForm = () => {
        const { SaveItem, navigator } = this.props

        //console.log(this.props)
        return (

            <View style={styles.form}>

                <View style={styles.wecoraInputContainer}>
                    <View style={styles.input}>
                        <WecoraInput label={'Item Name'} hidden={false}
                            defaultColor='#FFFFFF'
                            pressedColor='#EBEBEB'
                            labelColor='#000'
                            inputColor='#000'
                            onChangeText={(text) => this.setState({
                                name: text
                            })} />
                    </View>
                </View>

                <View style={styles.image}>
                    <Image style={{ alignSelf: 'center' }} resizeMode={'cover'} source={require('../../../resources/images/wecora_icon_trans.png')} />
                    <FastImage
                        style={StyleSheet.absoluteFill}
                        source={{
                            uri: SaveItem.selectedItem
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                </View>

            </View>
        )
    }

    getModal = () => {
        return (<Modal
            animationType="slide"
            transparent={false}
            onRequestClose={() => { }}
            visible={this.state.modalVisible}>
            <View style={styles.modalList}>
                <WecoraList
                    list={currList}
                    listState={stateObs.DONE}
                    onPress={(item) => {
                        this.setModalVisible(false, '', item)
                    }}
                />
            </View>
        </Modal>)
    }

    getState = () => {


        switch (this.props.SaveItem.createState) {
            case stateObs.START:
                return {
                    icon: undefined,
                    text: '',
                    action: undefined
                }
            case stateObs.LOADING:
                return {
                    icon: 'spin6',
                    text: 'Saving...',
                    action: undefined
                }
            case stateObs.DONE:
                return {
                    icon: 'wecora_good',
                    text: 'Saved',
                    action: undefined
                }
            case stateObs.ERROR:
                return {
                    icon: 'wecora_error',
                    text: 'Something Went Wrong',
                    action: {
                        text: 'Try Again',
                        onPress: () => this.props.SaveItem.reset()
                    }
                }
            default:
                return {
                    icon: '',
                    text: '',
                    action: ''
                }

        }

    }

    getMainRender = () => {
        const { SaveItem, navigator } = this.props
        const screenState = this.getState()
        const progress = screenState.icon
        return (
            <View>
                {progress ?
                    <View style={styles.icon_container}>
                        <WecoraTop icon={screenState.icon} text={screenState.text} action={screenState.action} />
                    </View> :
                    <View style={{ flexDirection: 'row', margin: 5 }}>
                        <View style={{ flex: 8 }}>
                            <Text style={styles.projectName}> {SaveItem.grandParent ? SaveItem.grandParent.name : ''} </Text>
                            <Text style={styles.boardName}> {SaveItem.parent ? SaveItem.parent.name : ''} </Text>
                        </View>
                        {!this.state.isEdit &&
                            <WecoraButton
                                style={{ flex: 2 }}
                                iconName={'wecora_edit'}
                                transparent
                                onPress={() => {
                                    navigator.push({
                                        ...Constants.Screens.SAVE_SCREEN,
                                        title: 'Projects',
                                        passProps: {}
                                    })
                                }}
                            />
                        }

                    </View>
                }

                {!progress ? this.getFullForm() : <View style={styles.holder} />}
            </View>)
    }

    render() {
        const { SaveItem, navigator } = this.props
        const screenState = this.getState()
        const progress = screenState.icon
        return (

            <View style={styles.container}>

                {this.getModal()}
                {
                    Platform.OS == 'ios' ? <ScrollView>
                        {this.getMainRender()}
                    </ScrollView> : <KeyboardAwareScrollView
                        enableOnAndroid
                        enableAutomaticScroll
                        keyboardOpeningTime={0}
                        extraHeight={Platform.select({ android: 200 })}>
                            {this.getMainRender()}
                        </KeyboardAwareScrollView>
                }

                {
                    !progress &&
                    <View style={styles.button}>
                        <WecoraButton
                            text={'SAVE IMAGE TO BOARD'}
                            iconName={'wecora_save'}
                            dark
                            isLarge
                            onPress={this.state.isEdit ? () => this.props.SaveItem.edit({ ...this.state })
                                : () => this.props.SaveItem.create({ ...this.state })}
                        />
                    </View>
                }
                {Platform.OS == 'ios' && <KeyboardSpacer />}
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constants.Colors.backgroundColor,
    },
    image: {
        width: '100%',
        height: 177
    },
    modalList: {
        flex: 1,
        width: '100%',
        marginVertical: 10
    },
    details: {
        flex: 1
    },
    rowShow: {
        flexDirection: 'row',
    },
    title: {
        fontSize: 14,
        opacity: Constants.Colors.textOpacity,
        marginBottom: 2
    },
    text: {
        fontSize: 16,
    },
    projectName: {
        fontSize: 14,
        marginHorizontal: 14,
        marginTop: 8
    },
    boardName: {
        fontSize: 22,
        marginHorizontal: 14,
        marginTop: 8
    },
    form: {
        margin: 14
    },
    fullForm: {
        margin: 0
    },
    wecoraInputContainer: {
        margin: 8,
        flex: 1
    },
    input: {
        flex: 1
    },
    currencyBox: {
        flex: 1,
        flexDirection: 'column',
        height: 50,
        justifyContent: 'center',
        marginBottom: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 2,
        backgroundColor: '#fff'
    },
    inputLabelText: {
        alignSelf: 'flex-start',
        fontSize: 11,
        opacity: Constants.Colors.textOpacity
    },
    inputStyle: {
        fontSize: 13,
        height: 45,
        flex: 1,
        paddingBottom: 0
    }

});
