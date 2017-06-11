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

import CommonNav from '../common/CommonNav';
import TextPingFang from '../common/TextPingFang';
import HttpUtils from '../util/HttpUtils';
import Platform from 'Platform';
import NotificationCell from '../common/NotificationCell';

const WIDTH = Dimensions.get("window").width;
const INNERWIDTH = WIDTH - 16;
const HEIGHT = Dimensions.get("window").height;

export default class NotificationsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
       loaded: false,
       dataSource: new ListView.DataSource({
           rowHasChanged: (row1, row2) => row1 !== row2
       })
    };

    (this: any).renderNotificationsList = this.renderNotificationsList.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    var notifications = [{title:"新城市开放啦！",content:"网格布局实验， 网格布局能够满足绝大多数的日常开发需求，所以只要满足网格布局的spec，那么就可以证明react的flex布局能够满足正常开发需求。"},
    {title:"圆桌谈，让你把话说完",content:"css 里边经常会做的事情是去讲一个文本或者图片水平垂直居中，如果使用过css 的flexbox当然知道使用alignItems 和 justifyContent . 那用react-native也来做一下实验。",image:"book.png"}];

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(notifications),
      loaded: true,
    });
  }

  render() {
      if (!this.state.loaded) {
        return this.renderLoadingView();
      }

      return (
        <View style={styles.container}>
          <CommonNav
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
    height: HEIGHT,
    width: WIDTH,
    alignItems: 'center',
    backgroundColor: "rgb(242,246,250)"
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  listView: {
    flex:1,
    width: WIDTH,
    backgroundColor: '#F5FCFF',
  },
});
