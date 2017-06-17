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
  ActivityIndicatorIOS,
  PushNotificationIOS
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { createAnimatableComponent} from 'react-native-animatable';

import NavigationBar from '../common/NavigationBar';
import TextPingFang from '../common/TextPingFang';
import HttpUtils from '../util/HttpUtils';
import Platform from 'Platform';
import NotificationCell from '../common/NotificationCell';
import RightButtonNav from '../common/RightButtonNav';

import {HOST} from '../util/config';

const WIDTH = Dimensions.get("window").width;
const INNERWIDTH = WIDTH - 16;
const HEIGHT = Dimensions.get("window").height;

const AnimatableListView = createAnimatableComponent(ListView);

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

  componentWillMount() {
    // Add listener for local notifications
    PushNotificationIOS.addEventListener('localNotification', this._onLocalNotification);
  }

  componentWillUnmount() {
    // Remove listener for local notifications
    PushNotificationIOS.removeEventListener('localNotification', this._onLocalNotification);
  }

  componentDidMount() {
    this._checkPermissions();
    this.fetchData();
  }

  _sendLocalNotification() {
    var notification = {"fireDate":new Date().getTime()+10000, "alertBody":"要在通知提示中显示的消息。", userInfo:{"extraInfo":"提供一个可选的object，可以在其中提供额外的数据。"},applicationIconBadgeNumber:1};
    PushNotificationIOS.scheduleLocalNotification(notification);

    // require('RCTDeviceEventEmitter').emit('localNotificationReceived', {
    //   aps: {
    //     alert: 'Sample local notification',
    //     badge: '+1',
    //     sound: 'default',
    //     category: 'REACT_NATIVE'
    //   },
    // });
  }

  _onLocalNotification(notification){
    AlertIOS.alert(
      'Local Notification Received',
      'Alert message: ' + notification.getMessage(),
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );
  }

  _checkPermissions() {
    PushNotificationIOS.checkPermissions((permissions) => {
      console.log('', permissions);

      if (!permissions.alert) {
        this._requestPermissions();
      }

    });
  }


  fetchData() {
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
      return (
        <View style={styles.container}>
          <NavigationBar
            title={"通知"}
            navigator={this.props.navigator}
          />

          {/* <NavigationBar
            title={"通知"}
            rightButton={
              <TouchableOpacity
                onPress={()=>{
                  this._sendLocalNotification();
                }}>
                <Text>发送</Text>
              </TouchableOpacity>
            }
          /> */}

          <AnimatableListView
            duration={1000}
            animation="bounceInUp"
            delay={50}
            dataSource={this.state.dataSource}
            renderRow={this.renderNotificationsList}
            removeClippedSubviews={false}
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
