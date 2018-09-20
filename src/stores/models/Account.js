// @flow

import { observable, computed } from 'mobx';
import { persist } from 'mobx-persist';

class Account {
  @persist @observable username = 'username'
  @persist @observable password = 'password' // password encryption

  @persist @observable access_token= 'access_token'
  @persist @observable account_id = 'account_id'
  @persist @observable account_type = 'account_type'
  @persist @observable fcm_token = 'fcm_token'
}

export default Account;
