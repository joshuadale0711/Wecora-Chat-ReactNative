import React, { Component } from 'react'
import ShareExtension from 'react-native-share-extension'

import Constants from './src/global/Constants';
import Stores         from './src/stores';

import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Linking,
} from 'react-native'

export default class Share extends Component {
  constructor(props, context) {
    Constants.Global.ISSHARED = true
    super(props, context)
    this.state = {
      isOpen: true,
      type: '',
      value: ''
    }
  }

  componentWillMount() {
    this.setState({
      type: " ",
      value: " "
    })
  }
  async componentDidMount() {
    try {
      const { type, value } = await ShareExtension.data()
      this.setState({
        type,
        value
      })
      Constants.Global.ISSHARED = false
      
      if (Constants.Global.ISAPPOPEN){
        if(type = "GOOGLE_MULTIPLE_IMAGES"){
          Stores.SaveItem.handleDeepLink({url: `app://wecoraShare/${value}`})
          setTimeout(() => {
            this.onClose()
          }, 100)
        }else {
          this.onClose()
          Linking.openURL(`app://wecoraShare/${value}`)
        }
      }
      else {
        this.onClose()
        Constants.Global.startSingleScreenApp(`app://wecoraShare/${value}`)
      }
        
        
      

    } catch (err) {
      this.setState({err})
      console.log('errrr', err)
    }
  }

  onClose() {
    ShareExtension.close()
  }

  closing = () => {
    this.setState({
      isOpen: false
    })
  }

  render() {
    return (
      <View style={{ backgroundColor: '#E55A4F', flex: 1, paddingTop: 15, justifyContent: 'center', alignItems: 'center' }}>
        {/* <Text>{this.state.err} : {this.state.value}</Text> */}
        {
          // this.state.err.message &&

          // <Image style={{ height: 200, width: 400, resizeMode: 'stretch', margin: 5, flex: 1 }} source={{ uri: this.state.err.message }} />
        }
      </View>
    )
  }
}