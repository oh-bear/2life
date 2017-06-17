import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Navigator,
  AsyncStorage,
  DeviceEventEmitter,
  TouchableWithoutFeedback
} from 'react-native';
import {Agenda} from 'react-native-calendars';
import * as Animatable from 'react-native-animatable';
import { createAnimatableComponent, View, Text } from 'react-native-animatable';

import ItemPage from './ItemPage';
import DairyPage from './DairyPage';
import CommonNav from '../common/CommonNav';
import NavigationBar from "../common/NavigationBar";
import TextPingFang from "../common/TextPingFang";
import {HOST} from '../util/config';
import HttpUtils from '../util/HttpUtils';

const WIDTH = Dimensions.get("window").width;
const INNERWIDTH = WIDTH - 16;
const HEIGHT = Dimensions.get("window").height;
const URL = HOST + 'notes/show';

export default class AgendaScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      show: false,
      user: this.props.user
    };
  }

  render() {
    var nowtimestamp = new Date().getTime();
    var nowtime = this.timeToString(nowtimestamp);
    return (
      <View style={styles.container} animation="fadeIn">
        <NavigationBar 
          title={"日记"}
          leftButton={
            <Image source={require('../../res/images/update_white.png')} />
          }
          rightButton={
            <TouchableOpacity
              onPress={()=>{
                this.state.items = {};
                this.loadData(this.state.user.uid, this.state.user.user_other_id);
              }}>
              <Image source={require('../../res/images/update_icon.png')}/>
            </TouchableOpacity>
          }
        />
        <Agenda
          items={this.state.items}
          loadItemsForMonth={this.loadItems.bind(this)}
          selected={nowtime}
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

  componentWillMount() {
    this.loadData(this.state.user.uid, this.state.user.user_other_id);
    this.subscription = DeviceEventEmitter.addListener('homepageDidChange',() => {
      console.log('通知');
      this.state.items = {};
      this.loadData(this.state.user.uid, this.state.user.user_other_id);
      this.setState({
        show: !this.state.show
      })
    })
  }

  componentWillUnmount() {
    this.subscription.remove();
  }   

  loadData(uid, user_id) {
    for (let i = -365; i < 365; i++) {
      const time = 1496707200000 + i * 24 * 60 * 60 * 1000;
      const strTime = this.timeToString(time);
      if (!this.state.items[strTime]) {
        this.state.items[strTime] = []
      }
    }
    HttpUtils.post(URL, {
        uid: uid,
        token: this.state.user.token,
        timestamp: this.state.user.timestamp,
        user_id: user_id,
        sex: this.state.user.user_sex
      }).then((res)=>{
        console.log(res);
        res.data.map((note)=>{
          console.log(note);
          var note_time = note.note_date;
          var note_date = this.timeToString(note_time);
          console.log(note_time);
          console.log(note_date);
          if (!this.state.items[note_date]) {
            this.state.items[note_date] = []
            this.state.items[note_date].push({
              title: note.note_title,
              content: note.note_content,
              hight: 70,
              male: note.male,
              note_id: note.note_id,
              note_time: note.note_date,
              me: note.me
            })
          } else {
            this.state.items[note_date].push({
              title: note.note_title,
              content: note.note_content,
              hight: 70,
              male: note.male,
              note_id: note.note_id,
              note_time: note.note_date,
              me: note.me
            })
          }
        })
        console.log(this.state.items);
        const newItems = {};
        Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
        this.setState({
          items: newItems
        });
      }).catch((error)=>{
        console.log(error);
      });
  }

  loadItems(day) {
    setTimeout(() => {
      // for (let i = 0; i < 365; i++) {
      //   const time = day.timestamp + i * 24 * 60 * 60 * 1000;
      //   const strTime = this.timeToString(time);
      //   console.log('time:' + time);
      //   if (!this.state.items[strTime]) {
      //     this.state.items[strTime] = [];
      //     for (let j = 0; j < 1; j++) {
      //       this.state.items[strTime].push({
      //         title: 'Item for ' + strTime,
      //         content: 'content',
      //         height: 70
      //       });
      //     }
      //   }
      // }
      // console.log(this.state.items);
      // const newItems = {};
      // Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
      // this.setState({
      //   items: newItems
      // });
    }, 1000);
    console.log(`Load Items for ${day.year}-${day.month}`);
  }

  onJump(page, params) {
    this.props.navigator.push({
      component: page,
      params: params
    })
  }

  renderItem(item) {
    return (
      <TouchableOpacity
        onPress={()=>{
          this.onJump(DairyPage, {
            note_id: item.note_id, 
            note_time: item.note_time, 
            me: item.me,
            title: item.title, 
            content: item.content,
            user: this.state.user
          });
        }}>
        <View 
          animation="bounceInRight"
          delay={100}
          style={[item.male=='male'?styles.item_male:styles.item_female, {height: item.height}]}>
          <TextPingFang style={item.male=='male'?styles.font_male_title:styles.font_female_title}>
            {item.title}
          </TextPingFang>
          <TextPingFang style={item.male=='male'?styles.font_male:styles.font_female}>
            {item.content}
          </TextPingFang>
        </View>
      </TouchableOpacity>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}><TextPingFang>今天没有写日记哦~</TextPingFang></View>
    );
  }

  rowHasChanged(r1, r2) {
    // return r1.name !== r2.name;
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
  item_male: {
    backgroundColor: '#45b0f9',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 5
  },
  item_female: {
    backgroundColor: 'pink',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 5
  },
  font_male: {
    color: 'white',
    height: 20
  },
  font_female: {
    color: 'white',
    height: 20
  },
  font_male_title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  font_female_title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyDate: {
    height: 15,
    flex:1,
    paddingTop: 30
  }
});
