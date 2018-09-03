import React, { Component } from 'react'
import ShareExtension from 'react-native-share-extension'

import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Linking,
} from 'react-native'

export default class Share extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      isOpen: true,
      type: '',
      value: ''
    }
  }

  async componentDidMount() {
    try {
      const { type, value } = await ShareExtension.data()
      this.setState({
        type,
        value
      })
     
       this.onClose()
       Linking.openURL(`app://wecoraShare/${value}`)
      
    } catch(e) {
      console.log('errrr', e)
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
           <View style={{backgroundColor: '#E55A4F', flex: 1}}/>
    )
  }
}