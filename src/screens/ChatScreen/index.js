// @flow

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Button,
    FlatList,
    ActivityIndicator,
    TextInput, Image,
    Platform, Keyboard, TouchableOpacity
} from 'react-native';
import { inject, observer, } from 'mobx-react/native';
import FastImage from 'react-native-fast-image'
import CounterView from '../components/Counter';
import WecoraTop from '../components/WecoraTop';
import WecoraChat from '../components/WecoraChat';
import WecoraButton from '../components/WecoraButton';
import ActionSheet from '../components/ActionSheet';
import WecoraItem from '../components/WecoraItem';
import NavButtons from '../../global/NavButtons';
import NavBar from '../../global/NavBar';
import ImagePicker from 'react-native-image-picker';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import Constants from '../../global/Constants';
const stateObs = Constants.Global.state
const Icon = Constants.Images.Icon
import ElevatedView from 'react-native-elevated-view'
import Boards from '../../stores/Boards';
import SaveItem from '../../stores/SaveItem';

import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

const modalPropsSave = {
    title: 'Save Image',
}

const modalProps = {
    title: 'Share Board',
    icon: 'wecora_message',
    inputLabel: 'Client email address',
    buttonText: 'Send Invite',
    buttonIcon: 'wecora_send',
    storeToObserve: 'Chats',
    startMessage: undefined,
    loadMessage: 'Sending invite',
    errorMessage: 'Something Went Wrong',
    successMessage: 'Invitation has been sent to',
    actionSuccess: { text: 'Send another invite' },
    actionFailed: { text: 'Try Again' },
    email: true
}

const topParams = {
    icon: 'wecora_msg',
    text: 'There are no clients in this project to chat with',
    textDes: undefined,
    action: 'INVITE A CLIENT',
    showAction: true
}

@inject('Boards', 'Projects', 'Chats', 'Items', 'SaveItem', 'Account') @observer
export default class ChatScreen extends Component {
    static navigatorStyle = NavBar.Default;

    constructor(props) {
        super(props);

        this.state = {
            message: '',
            selectedImageSource: undefined,
            //height: 56+56+5
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
        if (event.id == 'didAppear') {

            setTimeout(() => {
                if (this.props.Items.selectedItem) {

                    let source = { uri: this.props.Items.selectedItem.media.large };
                    this.setState({
                        ...this.state,
                        selectedImageSource: source
                    });
                    this.props.Items.clearSelected()
                }
            }, 800)

        }
        if (event.type == 'NavBarButtonPress') {
            if (event.id == 'menu') {
                this.ActionSheet.showActionSheet()
            }
        }
    }



    componentDidMount() {
        const { SaveItem, Account } = this.props
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        if (SaveItem.selectedItem) {
            if (Account.isProfessional)
                this.showSaveModal()
            else {
                let source = { uri: SaveItem.selectedItem };
                this.setState({
                    ...this.state,
                    selectedImageSource: source
                });
                SaveItem.clearSelected()
            }
        }

    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.props.Chats.observeChatScreen(false)

    }

    _keyboardDidShow = () => {
        // setTimeout(() => {
        //     this.listview.scrollToEnd({ animated: true })
        // }, 50);

    }


    componentWillMount = () => {
        const { Chats, Boards, item } = this.props
        Chats.fetchList(item)
        Boards.setCount(item.id)
        Chats.observeChatScreen(true)
    }




    _renderFooter = () => {
        const { Chats } = this.props;

        if (Chats.listState == stateObs.LOADING || Chats.listState == stateObs.LOADINGPAGE) {
            return (
                <View style={styles.loading}>
                    <ActivityIndicator size={'large'} color={Constants.Colors.loginBackgroundColor} />
                </View>
            )
        }
        else {
            return null
        }
    };

    imageResult = (resp) => {

        if (resp.didCancel) {
            //console.log('User cancelled image picker');
        }
        else if (resp.error) {
            //console.log('ImagePicker Error: ', resp.error);
        }
        else {

            //let source = { uri: 'data:image/jpeg;base64,' + resp.data };
            
            this.setState({
                ...this.state,
                selectedImageSource: resp
            });

        }

    }

    shouldBtnDisable = () => {
        if (this.state.selectedImageSource == undefined) {
            if (this.state.message.length < 1)
                return true
            else return false
        } else return false
    }

    showSaveModal = () => {
        const { SaveItem, Chats, Boards, navigator } = this.props
        SaveItem.setGrandParent(Boards.parent)
        SaveItem.setParent(Chats.parent)
        Constants.Global.openSaveModal(navigator, true,
            modalPropsSave.title, modalPropsSave)
    }

    resetState = () => {
        this.setState({
            message: '',
            selectedImageSource: undefined,
        })
    }
    _keyExtractor = (item, index) => item.id + "";
    _renderItem = ({ item }) => {
        const { SaveItem, Chats, Boards, navigator, Items } = this.props
        return (<WecoraChat
            comment={item}
            onMenuPress={(image) => {
                if (image.idea_id) {
                    Items.fetchIdea(image.idea_id)
                    navigator.push({
                        ...Constants.Screens.ITEM_DETAIL
                    });
                } else {
                    console.log(image)
                    SaveItem.setSelected(image.large)
                    this.saveActionSheet.showActionSheet()
                }
            }}
            onImagePress={(image) => {
                Constants.Global.openImageModal(navigator, true,
                    '', { image })
            }}
            style={styles.item} />)
    }

    render() {
        const { Boards, Chats, navigator, SaveItem } = this.props;
        const { selectedImageSource, message } = this.state

        var options = {
            title: 'Select Image',
            mediaType: 'photo',
            quality: 0.6,
            noData: true,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        return (
            <View style={styles.container}>
                {Chats.listState == stateObs.DONE &&
                    Chats.list.length == 0 &&
                    <View style={styles.top}>
                        <WecoraTop icon={topParams.icon}
                            text={topParams.text}
                            textDes={topParams.textDes}
                            showAction={topParams.showAction}
                            action={topParams.action ? {
                                text: topParams.action.toUpperCase(),
                                onPress: () => Constants.Global.openAddModal(this.props.navigator, true, modalProps.title, modalProps)
                            } : undefined} />
                    </View>
                }


                <View style={styles.list}>
                    <FlatList
                        inverted
                        data={Chats.list.slice()}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        ref={list => { this.listview = list }}
                        onContentSizeChange={() => {
                            // if (Chats.list.length > 0)
                            //this.listview.scrollToIndex({ animated: true, index: 0 })
                        }}
                        onEndReached={() => {
                            if (Chats.listState != stateObs.LOADING && Chats.listState != stateObs.LOADINGPAGE)
                                Chats.fetchPage()
                        }}
                        ListFooterComponent={this._renderFooter}
                    //ListHeaderComponent={this._renderHeader}
                    />
                </View>
                <View>
                    <View style={[styles.inputBar]}>
                        <AutoGrowingTextInput
                            placeholder={'Type a message'}
                            underlineColorAndroid='transparent'
                            //onChangeText={(message) => { this.setState({ message }) }}
                            onChange={(event) => { this.setState({ message: event.nativeEvent.text || '' }) }}
                            value={message}
                            multiline={true}
                            blurOnSubmit={false}
                            autoFocus={false}
                            minHeight={Platform.OS == 'ios' ? 40 : 56}
                            ref={input => { this.textInput = input }}
                            style={[styles.input, { marginTop: Platform.OS == 'ios' ? 10 : 0 }]}
                        />
                        <View style={styles.inputButtons}>
                            <TouchableOpacity
                                onPress={() => this.imageActionSheet.showActionSheet()}>
                                <Icon style={styles.inputIconCam} name={'wecora_camera'} />
                            </TouchableOpacity>

                            <WecoraButton
                                style={styles.inputSend}
                                fab
                                iconName={'wecora_send'}
                                dark
                                disable={this.shouldBtnDisable()}
                                onPress={() => {
                                    Chats.createComment(message, selectedImageSource)
                                    this.resetState()

                                }} />
                        </View>
                    </View>
                    {selectedImageSource &&
                        <View style={styles.selectedImage}>
                            <FastImage
                                style={{height: 160,
                                    width: '100%'}}
                                source={selectedImageSource}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            <View style={styles.bin}>
                                <WecoraButton
                                    fab
                                    iconName={'wecora_bin'}
                                    transparent
                                    dark
                                    onPress={() => {
                                        this.resetState()
                                    }} />
                            </View>
                        </View>
                    }
                </View>

                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    options={topParams.showAction ?
                        ['VIEW BOARD ITEMS', 'SHARE'] : ['VIEW BOARD ITEMS']}
                    onPress={(index) => {
                        if (index == 1) {
                            navigator.push({
                                ...Constants.Screens.ITEMS_SCREEN,
                                title: "Boards",
                            });
                        }
                        if (index == 2) {
                            setTimeout(() => {
                                Constants.Global.openAddModal(navigator, true,
                                    modalProps.title, modalProps)
                            }, 500);

                        }
                    }} />

                <ActionSheet
                    ref={o => this.imageActionSheet = o}
                    options={topParams.showAction ? ['ADD FROM PHOTO LIBRARY',
                        'ADD FROM CAMERA', 'ADD FROM WECORA ITEM LIBRARY',]
                        : ['ADD FROM PHOTO LIBRARY', 'ADD FROM CAMERA']}
                    onPress={(index) => {
                        setTimeout(() => {
                            switch (index) {
                                case 1:
                                    ImagePicker.launchImageLibrary(options, (resp) => {
                                        this.imageResult(resp)
                                    })
                                    break;
                                case 2:
                                    ImagePicker.launchCamera(options, (resp) => {
                                        this.imageResult(resp)
                                    })
                                    break;
                                case 3:
                                    Constants.Global.openSearchModal(navigator, true,
                                        'ADD FROM ITEM LIBRARY', {})
                                    break;
                                default:
                                    break;
                            }
                        }, 500);
                    }} />

                <ActionSheet
                    ref={o => this.saveActionSheet = o}
                    options={['SAVE TO ITEM LIBRARY']}
                    onPress={(index) => {
                        if (index == 1) {
                            setTimeout(() => {
                                this.showSaveModal()
                            }, 500);

                        }
                    }} />
                {Platform.OS == 'ios' && <KeyboardSpacer />}
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
    selectedImage: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    list: {
        flex: 1,
        width: '100%',
        marginVertical: 10
    },
    item: {
        width: '100%'
    },
    loading: {
    },
    fab: {
        alignSelf: 'flex-end',
        position: 'absolute',
        right: 16,
        bottom: 16,
    },
    inputButtons: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    inputBar: {
        width: '100%',
        backgroundColor: '#fff',
        flexDirection: 'row',
        paddingHorizontal: 16,
    },
    input: {
        flex: 5,
        height: 56,
        fontSize: 16,
        alignSelf: 'center',
    },
    inputIconCam: {
        fontSize: 22
    },
    inputSend: {
    },
    bin: {
        position: 'absolute',
        alignSelf: 'center',
        width: 56,
        height: 56,
        borderRadius: 56 / 2,
        backgroundColor: '#000',
        opacity: 0.54,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
