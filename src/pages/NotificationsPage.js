import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Navigator,
  Dimensions,
  TouchableOpacity,
  AlertIOS,
  Alert,
  AsyncStorage,
  ListView,
  ActivityIndicatorIOS
} from 'react-native';

import NavigationBar from '../common/NavigationBar';
import TextPingFang from '../common/TextPingFang';
import HttpUtils from '../util/HttpUtils';
import Platform from 'Platform';
import NotificationCell from '../common/NotificationCell';
import {HOST} from '../util/config';

const WIDTH = Dimensions.get("window").width;
const INNERWIDTH = WIDTH - 16;
const HEIGHT = Dimensions.get("window").height;

const URL = HOST + 'users/show_notification';

export default class NotificationsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      user: this.props.user,
      partner: this.props.partner
    };

    (this: any).renderNotificationsList = this.renderNotificationsList.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    // var notifications = [
    // { title:"圆桌谈，让你把话说完",
    //   content:"css 里边经常会做的事情是去讲一个文本或者图片水平垂直居中，如果使用过css 的flexbox当然知道使用alignItems 和 justifyContent . 那用react-native也来做一下实验。",
    //   type:1,
    //   image:"https://airing.ursb.me/image/twolife/walker.png",
    //   time:1497151997694,
    //   url:"https://github.com"
    // },
    // { title:"新城市开放啦！",
    //   content:"网格布局实验， 网格布局能够满足绝大多数的日常开发足正常开发需求。",
    //   type:0,
    //   time:1497151997694,
    //   url:"https://github.com/airingursb"
    // },];
    // this.setState({
    //   dataSource: this.state.dataSource.cloneWithRows(notifications),
    //   loaded: true,
    // });

    HttpUtils.post(URL, {
      uid: this.state.user.id,
      token: this.state.user.token,
      timestamp: this.state.user.timestamp
    }).then((res)=>{
      if (res.status == 0) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(res.data),
          loaded: true,
        });
      }
    })
  }

  render() {
      // if (!this.state.loaded) {
      //   return this.renderLoadingView();
      // }
      return (
        <View style={styles.container}>
          <NavigationBar
            title={"通知"}
            navigator={this.props.navigator}
          />
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderNotificationsList}
            style={styles.listView}
          />
        </View>
      );
  }

  renderNotificationsList(notification) {
    return (
      <NotificationCell
        notification={notification}
        navigator={this.props.navigator}
      />
    );
  }

  renderLoadingView() {
    return (
      <View style={styles.loading}>
        <Text>
          Loading notifications...
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: HEIGHT - 50 / 667 * HEIGHT,
    width: WIDTH,
    alignItems: 'center',
    backgroundColor: "#F3F4F6",
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  listView: {
    flex:1,
    width: WIDTH,
    backgroundColor: '#F3F4F6',
  },
});
