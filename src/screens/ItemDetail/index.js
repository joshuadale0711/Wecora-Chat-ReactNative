// @flow

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View, Linking, TouchableOpacity,
  Button, Image, ScrollView, ActivityIndicator
} from 'react-native';
import { inject, observer } from 'mobx-react/native';

import NavButtons from '../../global/NavButtons';
import NavBar from '../../global/NavBar';
import Constants from '../../global/Constants';
const Icon = Constants.Images.Icon
import FastImage from 'react-native-fast-image'

const modalPropsSave = {
  title: 'Edit Image',
}

@inject('Items', 'Chats', 'Boards', 'SaveItem', 'Account') @observer
export default class ItemDetail extends Component {

  static navigatorStyle = NavBar.Default;

  constructor(props: {}) {
    super(props);

    const { Account, Chats, navigator } = this.props
    navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    if (Account.current.account_id == Chats.parent.owner.account_id) {
      Icon.getImageSource('wecora_edit', 18).then((edit) => {
        navigator.setButtons({
          rightButtons: [
            { id: 'edit', icon: edit },
          ]
        });
      });
    }

  }

  componentWillUnmount = () => {
    this.props.Items.clearSelected()
  }

  onNavigatorEvent = (event: { id: string }) => {
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'edit') {
        this.showSaveModal()
      }
    }
  }

  showSaveModal = () => {
    const { Items, SaveItem, Chats, Boards, navigator } = this.props
    const { selectedItem } = Items
    //console.log(selectedItem)
    const { project, board, source, description, unit_cost, media, ideaId, 
      id, name,selling_price, quantity, unit_cost_currency, 
      selling_price_currency } = selectedItem

    SaveItem.setGrandParent(Boards.parent)
    SaveItem.setParent(Chats.parent)
    SaveItem.setSelected(media.large, undefined, name, source, ideaId,
      id, description, unit_cost, selling_price,
      unit_cost_currency, selling_price_currency, quantity)
    Constants.Global.openSaveModal(navigator, true,
      modalPropsSave.title, modalPropsSave)
  }

  renderDetail = (title, text) => {
    return (<View style={{ margin: 24, flex: 1 }}>
      <Text style={styles.title}>{title}</Text>
      {
        title == 'Source' &&
        <Text onPress={() => {
          Linking.openURL(text)
        }} style={[styles.text, { color: 'blue' }]}>{text}</Text>
      }
      {title != 'Source' &&
        <Text style={styles.text}>{text}</Text>
      }
    </View>)

  }

  render() {
    const { Items, navigator } = this.props;
    const { selectedItem } = Items
    if (!selectedItem)

      return (
        <View style={styles.container}>
          <ActivityIndicator size={'large'} style={{margin: 15}} color={Constants.Colors.loginBackgroundColor} />
        </View>
      )

    //console.log(selectedItem)
    const { project, board, source, name, description, unit_cost, media,
      selling_price, quantity, unit_cost_currency, selling_price_currency } = selectedItem
    navigator.setTitle({ title: name })
    return (
      <View style={styles.container}>

        <TouchableOpacity style={styles.image}
          onPress={() => Constants.Global.openImageModal(navigator, true,
            '', { image: media.large })}>
          <Image style={{ alignSelf: 'center' }} resizeMode={'cover'} source={require('../../../resources/images/wecora_icon_trans.png')} />
          <FastImage
            style={StyleSheet.absoluteFill}
            source={{
              uri: media.large
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
        <ScrollView>
          <View style={styles.details}>
            <View style={styles.rowShow}>
              {!!project && !!project.name && this.renderDetail('Project', project ? project.name ? project.name : project : '...')}
              {!!board && this.renderDetail('Board', board ? board : '...')}
            </View>
            {!!source && this.renderDetail('Source', source)}
            {!!description && this.renderDetail('Description', description ? description : '...')}
            <View style={styles.rowShow}>
              {!!unit_cost && this.renderDetail('Unit Cost', unit_cost ? unit_cost + ' ' + unit_cost_currency.toUpperCase(): '...')}
              {!!selling_price && this.renderDetail('Selling Price', selling_price ? selling_price + ' ' + selling_price_currency.toUpperCase() : '...')}
            </View>
            {!!quantity && this.renderDetail('Quantity', quantity ? quantity : '...')}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.Colors.backgroundColor
  },
  image: {
    width: '100%',
    height: 177
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

  }

});
