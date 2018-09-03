// @flow

import { create } from 'mobx-persist';
import { AsyncStorage } from 'react-native';

import App     from './App';
import Account from './Account';
import Counter from './Counter';
import Projects from './Projects';
import Boards from './Boards';
import Chats from './Chats';
import Items from './Items';
import Labels from './Labels';
import SaveItem from './SaveItem';

const hydrate = create({ storage: AsyncStorage });

const stores = {
  App,
  Account,
  Counter,
  Projects,
  Boards,
  Chats,
  Items,
  Labels,
  SaveItem,
}

// you can hydrate stores here with mobx-persist
hydrate('Account', stores.Account);

export default {
  ...stores
};
