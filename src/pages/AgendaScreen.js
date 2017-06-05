import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Navigator
} from 'react-native';
import {Agenda} from 'react-native-calendars';
import ItemPage from './ItemPage';
import CommonNav from '../common/CommonNav';
import NavigationBar from "../common/NavigationBar";
import TextPingFang from "../common/TextPingFang";
import {HOST} from '../util/config';

const WIDTH = Dimensions.get("window").width;
const INNERWIDTH = WIDTH - 16;
const HEIGHT = Dimensions.get("window").height;

export default class AgendaScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {}
    };
  }

  render() {
    return (
        <View style={styles.container}>
        <NavigationBar 
          title={"日记"}
        />
        <Agenda
          items={this.state.items}
          loadItemsForMonth={this.loadItems.bind(this)}
          selected={'2012-05-16'}
          renderItem={this.renderItem.bind(this)}
          renderEmptyDate={this.renderEmptyDate.bind(this)}
          rowHasChanged={this.rowHasChanged.bind(this)}
          theme={{
            backgroundColor: "rgb(242,246,250)"
          }}
          //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
        />
        </View>
    );
  }

  loadItems(day) {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
          const numItems = Math.floor(Math.random() * 5);
          for (let j = 0; j < numItems; j++) {
            this.state.items[strTime].push({
              name: 'Item for ' + strTime,
              height: 70
            });
          }
        }
      }
      //console.log(this.state.items);
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
      this.setState({
        items: newItems
      });
    }, 1000);
    // console.log(`Load Items for ${day.year}-${day.month}`);
  }

  onJump(page) {
    console.log(page)
    this.props.navigator.push({
      component:page
    })
  }

  renderItem(item) {
    return (
      <TouchableOpacity
        onPress={()=>{
          this.onJump(ItemPage)
        }}>
        <View style={[styles.item, {height: item.height}]}><TextPingFang>{item.name}</TextPingFang></View>
      </TouchableOpacity>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}><TextPingFang>今天没有写日记哦~</TextPingFang></View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
}

const styles = StyleSheet.create({
  container:{
    height:HEIGHT,
    backgroundColor:"rgb(242,246,250)"
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 5
  },
  emptyDate: {
    height: 15,
    flex:1,
    paddingTop: 30
  }
});
