// @flow

import { observable, action, flow, configure, runInAction, computed } from 'mobx';
import { persist } from 'mobx-persist';
import {Platform} from 'react-native'
import firebase from 'react-native-firebase';
import Models from './models';
import GeneralApi  from '../services'
import Constants from '../global/Constants'

import Toast from 'react-native-simple-toast';

const stateObs = Constants.Global.state

configure({ enforceActions: true });

class Store {
  @persist('object', Models.Account) @observable current = new Models.Account
  @persist @observable authorized = false;
  @persist @observable dismissed = false;
  @observable state = stateObs.START
  @observable createState = stateObs.START

  @action
  login = async (username: string, password: string) => {
    if (username && password) {

      this.state = stateObs.LOADING
      try {
        const res = await GeneralApi.login({ username, password })
        const access_token = res.data.access_token
        const account_id = res.data.account_id
        const account_type = res.data.account_type
        var b  = res.data.access_token.charAt(0)
        const fcm_token = await firebase.messaging().getToken();
        if(fcm_token){
          //console.log(fcm_token)
          //Toast.show(fcm_token)
          await GeneralApi.device(fcm_token, Platform.OS, access_token)
        } else {
          //console.log("foomed")
          //Toast.show('Unable To fetch token, Please try again!')
        }
          
        // after await, modifying state again, needs an actions:
        runInAction(() => {
          this.state = stateObs.DONE
          this.authorized = true;
          this.current = { username, password, access_token, account_id, account_type, fcm_token };
        })
        //console.log(res)
        return this.state
      } catch (error) {
        runInAction(() => {
          this.state = stateObs.ERROR
        })
        console.log(error)
        throw new Error(error)
      }
    } else {
      runInAction(() => {
        this.state = stateObs.ERROR
      })
      console.log(error)
      throw new Error(error)
    }
  }

  create = flow(function* (email) {
    this.createState = stateObs.LOADING
    try {
        const resp = yield GeneralApi.createPassword(email)
        this.createState = stateObs.DONE

        //console.log(resp.data)
        //this.list.replace([resp.data, ...this.list])
    } catch (error) {
        this.createState = stateObs.ERROR
        //console.log(error.message)
    }
})

@action reset() {
  this.createState = stateObs.START
}

@action dismiss() {
  this.dismissed = true
}

@computed get isProfessional() {
  if(this.current && this.current.account_type)
    return this.current.account_type == 'Professional'
  return false 
}

  // login = flow(function* (username: string, password: string) { // <- note the star, this a generator function!
  //   if (username && password) {
  //     this.state = "pending"
  //     try {
  //       const res = yield login({ username, password })
  //       this.state = "done"
  //       this.authorized = true;
  //       this.current = { username, password };
  //       //console.log(this.state)
  //     } catch (error) {
  //       this.state = "error"
  //       //console.log(error)
  //     }
  //   }

  // })

  // @action login = (username: string, password: string) => {
  // return new Promise((resolve, reject) => {
  //   if (username && password) {
  //     this.authorized = true;
  //     this.current = { username, password };
  //     resolve({ message: 'success' });
  //   } else {
  //     reject({ message: 'Something is wrong with input data :(' });
  //   }
  // });
  //}

  @action logout = () => {
    return new Promise((resolve, reject) => {
      GeneralApi.delToken(this.current.fcm_token)
      this.authorized = false;
      this.dismissed = false;
      this.current = {};
      resolve();
    });
  }
}

export default new Store();
