import React, { Component } from 'react'
import {
  StyleSheet,
  Keyboard,
  Animated,
  Platform,
  FlatList,
  View,
  Image,
  TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types'

import { WIDTH, getResponsiveWidth } from '../common/styles'
import { formatDate } from '../common/util'
import TextPingFang from './TextPingFang'

export default class CommentList extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    onPressItem: PropTypes.func,
  }

  static defaultProps = {
    onPressItem: () => {}
  }

  renderItem = ({item}) => {
    return (
      <View style={styles.comment_item}>
        {
          item.reply.id === item.user.id ?
          <Image style={styles.item_img} source={{ uri: item.reply.face }} />:
          <Image style={styles.item_img} source={{ uri: item.user.face }} />
        }
        <View style={styles.item_right}>
          <View style={styles.item_right_top}>
            {
              item.reply.id === item.user.id ?
              <TextPingFang style={styles.text_item_reply}>{item.reply.name}</TextPingFang>
              :
              <TextPingFang style={styles.text_item_user}>
                <TextPingFang style={styles.text_item_reply}>{item.user.name}</TextPingFang>
                <TextPingFang style={styles.text_const_reply}> 回复了 </TextPingFang>
                {item.reply.name}
              </TextPingFang>
            }
            <TextPingFang style={styles.text_item_time}>{formatDate(item.created_at, 'm月dd日 hh:ii')}</TextPingFang>
          </View>
          <TouchableOpacity onPress={this.props.onPressItem.bind(this, item)} activeOpacity={1}>
            <TextPingFang style={styles.text_item_content}>{item.content}</TextPingFang>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderHeader = () => {
    return (
      <View style={styles.header_container}>
        <TextPingFang style={styles.text_header}>日记留言</TextPingFang>
      </View>
    )
  }
  
  renderEmpty = () => {
    return (
      <View style={styles.empty_container}>
        <TextPingFang style={styles.text_empty}>还没有人留言~</TextPingFang>
      </View>
    )
  }

  render() {
    return (
      <FlatList
        style={styles.container}
        data={this.props.data}
        keyExtractor={item => item.id.toString()}
        renderItem={this.renderItem}
        ListHeaderComponent={this.renderHeader}
        ListEmptyComponent={this.renderEmpty}
      />
    )
  }
}

const getWidth = getResponsiveWidth
const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: getWidth(24),
    paddingBottom: getWidth(24)
  },
  header_container: {
    marginTop: getWidth(24),
  },
  text_header: {
    color: '#444',
    fontSize: 14,
    fontWeight: 'bold'
  },
  empty_container: {
    marginTop: getWidth(12),
  },
  text_empty: {
    color: '#aaa',
    fontSize: 14,
  },
  comment_item: {
    flexDirection: 'row',
    marginTop: getWidth(24),
  },
  item_img: {
    width: getWidth(32),
    height: getWidth(32),
    marginRight: getWidth(12),
    borderRadius: getWidth(16),
  },
  item_right: {
    flex: 1,
  },
  item_right_top: {
    flexDirection: 'row',
    marginBottom: getWidth(8),
  },
  text_item_reply: {
    color: '#333',
    fontSize: 12,
  },
  text_const_reply: {
    color: '#444',
    fontSize: 12,
  },
  text_item_user: {
    color: '#2DC3A6',
    fontSize: 12,
  },
  text_item_time: {
    marginLeft: getWidth(4),
    color: '#aaa',
    fontSize: 12,
  },
  text_item_content: {
    color: '#444',
    fontSize: 14,
  },
})
