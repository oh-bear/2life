import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'

import Container from '../../components/Container'
import TextPingFang from '../../components/TextPingFang'

import {
  WIDTH,
  HEIGHT,
  getResponsiveWidth,
  getResponsiveHeight
} from '../../common/styles'

import {
  SCENE_PROFILE_EDIT,
  SCENE_PROFILE_MODE,
  SCENE_PROFILE_BADGE,
  SCENE_PROFILE_MATCH,
  SCENE_PROFILE_SYNC,
  SCENE_PROFILE_REWARD,
  SCENE_MATCH_RESULT
} from '../../constants/scene'

function mapStateToProps(state) {
  return {
    user: state.user,
    partner: state.partner
  }
}

@connect(mapStateToProps)
export default class Profile extends Component {

  state = {
    is_scroll: true
  }

  componentDidMount() {
    // 低于iPhone6机型，则滚动屏幕
    // if (HEIGHT < 650) {
    //   this.setState({is_scroll: false})
    // }
  }

  renderPartner() {
    if (!this.props.partner.id) return
    return (
      <View>
        <View
          style={styles.head_container}
        >
          <View style={styles.head_left}>
            <View style={styles.head_left_top}>
              <TextPingFang style={styles.text_name}>{this.props.partner.name}</TextPingFang>
            </View>
            <View style={styles.head_left_bottom}>
              <Image source={require('../../../res/images/profile/icon_link.png')}/>
              <TextPingFang style={styles.text_link}>你的匹配对象</TextPingFang>
            </View>
          </View>
          <View style={styles.head_right}>
            <Image style={styles.img_head} source={{ uri: this.props.partner.face }}/>
            {
              (() => {
                if (this.props.partner.sex === 0) {
                  return <Image
                    style={styles.img_gender}
                    source={require('../../../res/images/profile/icon_male.png')}/>
                } else {
                  return <Image
                    style={styles.img_gender}
                    source={require('../../../res/images/profile/icon_female.png')}/>
                }
              })()
            }
          </View>
        </View>

        <TouchableOpacity style={styles.row} activeOpacity={1}>
          {
            (() => {
              if (this.props.partner.sex === 0) {
                return <Image source={require('../../../res/images/profile/icon_mode_male.png')}/>
              } else {
                return <Image source={require('../../../res/images/profile/icon_mode_female.png')}/>
              }
            })()
          }
          <TextPingFang
            style={styles.text_row_left}>{this.props.partner.mode ? this.props.partner.mode : '暂无'}</TextPingFang>
          <TextPingFang style={styles.text_row_desc}>平均情绪值</TextPingFang>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.row]} activeOpacity={1}>
          {
            (() => {
              if (this.props.partner.sex === 0) {
                return <Image source={require('../../../res/images/profile/icon_diary_male.png')}/>
              } else {
                return <Image source={require('../../../res/images/profile/icon_diary_female.png')}/>
              }
            })()
          }
          <TextPingFang
            style={styles.text_row_left}>{this.props.partner.total_notes ? this.props.partner.total_notes : 0}</TextPingFang>
          <TextPingFang style={styles.text_row_desc}>日记数量</TextPingFang>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <Container>
        <View>
          <TextPingFang style={styles.title}>关于我</TextPingFang>
          <ScrollView scrollEnabled={this.state.is_scroll} contentContainerStyle={styles.profile_container}>
            <View
              style={styles.head_container}>
              <TouchableOpacity
                style={styles.head_left}
                activeOpacity={1}
                onPress={() => Actions.jump(SCENE_PROFILE_EDIT, { user: this.props.user })}>
                <View style={styles.head_left_top}>
                  <TextPingFang style={styles.text_name}>{this.props.user.name}</TextPingFang>
                </View>
                <View style={styles.head_left_bottom}>
                  <TextPingFang style={styles.text_check}>查看资料</TextPingFang>
                </View>
              </TouchableOpacity>
              <View style={styles.head_right}>
                <Image style={styles.img_head} source={{ uri: this.props.user.face }}/>
                {
                  (() => {
                    if (this.props.user.sex === 0) {
                      return <Image
                        style={styles.img_gender}
                        source={require('../../../res/images/profile/icon_male.png')}/>
                    } else {
                      return <Image
                        style={styles.img_gender}
                        source={require('../../../res/images/profile/icon_female.png')}/>
                    }
                  })()
                }
              </View>
            </View>

            <TouchableOpacity
              style={styles.row}
              onPress={() => Actions.jump(SCENE_PROFILE_MODE)}
            >
              {
                (() => {
                  if (this.props.user.sex === 0) {
                    return <Image source={require('../../../res/images/profile/icon_mode_male.png')}/>
                  } else {
                    return <Image source={require('../../../res/images/profile/icon_mode_female.png')}/>
                  }
                })()
              }
              <TextPingFang
                style={styles.text_row_left}>{this.props.user.mode ? this.props.user.mode : '暂无'}</TextPingFang>
              <TextPingFang style={styles.text_row_desc}>平均情绪值</TextPingFang>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.row}
            >
              {
                (() => {
                  if (this.props.user.sex === 0) {
                    return <Image source={require('../../../res/images/profile/icon_diary_male.png')}/>
                  } else {
                    return <Image source={require('../../../res/images/profile/icon_diary_female.png')}/>
                  }
                })()
              }
              <TextPingFang
                style={styles.text_row_left}>{this.props.user.total_notes ? this.props.user.total_notes : 0}</TextPingFang>
              <TextPingFang style={styles.text_row_desc}>日记数量</TextPingFang>
            </TouchableOpacity>

            {/* <TouchableOpacity
             style={[styles.row, styles.row_border_bottom]}
             onPress={() => Actions.jump(SCENE_PROFILE_BADGE, {user: this.props.user})}
             >
             {
             (() => {
             if (this.props.user.sex === 0) {
             return <Image source={require('../../../res/images/profile/icon_badge_male.png')}/>
             } else {
             return <Image source={require('../../../res/images/profile/icon_badge_female.png')}/>
             }
             })()
             }
             <TextPingFang
             style={styles.text_row_left}>{this.props.user.mode ? this.props.user.mode : '暂无'}</TextPingFang>
             <TextPingFang style={styles.text_row_desc}>我的徽章</TextPingFang>
             <Image style={styles.row_indicator} source={require('../../../res/images/common/icon_indicator.png')}/>
             </TouchableOpacity> */}

            {this.renderPartner()}

            {/* <TouchableOpacity
             style={styles.row_match}
             onPress={() => Actions.jump(SCENE_PROFILE_MATCH, { user: this.props.user })}
             >
             <View style={styles.row_match_top}>
             <Image source={require('../../../res/images/profile/icon_match.png')}/>
             <TextPingFang style={styles.text_match_left}>匹配</TextPingFang>
             </View>
             <View style={styles.row_match_bottom}>
             <TextPingFang style={styles.text_match_desc}>来匹配一个日记伴侣吧～</TextPingFang>
             <Image style={styles.row_indicator} source={require('../../../res/images/common/icon_indicator.png')}/>
             </View>
             </TouchableOpacity> */}

            {/* <TouchableOpacity
             style={[styles.row, styles.row_border_bottom]}
             onPress={() => Actions.jump(SCENE_PROFILE_SYNC)}
             >
             <Image source={require('../../../res/images/profile/icon_sync.png')}/>
             <TextPingFang style={styles.text_row_left}>同步</TextPingFang>
             <TextPingFang style={styles.text_row_right}>10分钟前</TextPingFang>
             <Image style={styles.row_indicator} source={require('../../../res/images/common/icon_indicator.png')}/>
             </TouchableOpacity> */}

            <TouchableOpacity
              style={[styles.row, styles.row_top, styles.row_border_bottom]}
              onPress={() => {
                if (this.props.user.status !== 1000) {
                  Actions.jump(SCENE_PROFILE_MATCH, { user: this.props.user })
                } else {
                  Actions.jump(SCENE_MATCH_RESULT, { user: this.props.user })
                }
              }}
            >
              <Image source={require('../../../res/images/profile/icon_match.png')}/>
              <TextPingFang style={styles.text_row_left}>匹配</TextPingFang>
              <Image style={styles.row_indicator} source={require('../../../res/images/common/icon_indicator.png')}/>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.row, styles.row_border_bottom]}
              onPress={() => Actions.jump(SCENE_PROFILE_REWARD)}
            >
              <Image source={require('../../../res/images/profile/icon_reward.png')}/>
              <TextPingFang style={styles.text_row_left}>打赏</TextPingFang>
              <Image style={styles.row_indicator} source={require('../../../res/images/common/icon_indicator.png')}/>
            </TouchableOpacity>

          </ScrollView>

        </View>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    width: WIDTH,
    paddingLeft: getResponsiveWidth(70),
    ...ifIphoneX({
      paddingTop: getResponsiveHeight(4),
    }, {
      paddingTop: getResponsiveHeight(28),
    }),
    color: '#444',
    fontSize: 34,
    fontWeight: '500',
  },
  profile_container: {
    paddingLeft: getResponsiveWidth(24),
    paddingRight: getResponsiveWidth(24),
    ...ifIphoneX({
      paddingBottom: 84,
    }, {
      paddingBottom: 50,
    }),
  },
  head_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: getResponsiveWidth(24),
    marginTop: getResponsiveHeight(24),
    marginBottom: getResponsiveHeight(24),
  },
  head_left: {
    paddingLeft: getResponsiveWidth(24),
  },
  head_left_top: {},
  text_name: {
    color: '#444',
    fontSize: 24,
  },
  head_left_bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text_check: {
    color: '#aaa',
    fontSize: 12,
  },
  head_right: {
    justifyContent: 'center',
  },
  img_head: {
    width: getResponsiveWidth(48),
    height: getResponsiveWidth(48),
    borderRadius: getResponsiveWidth(24)
  },
  img_gender: {
    position: 'absolute',
    right: 0,
    bottom: 0
  },
  row_top: {
    marginTop: getResponsiveHeight(20),
  },
  row: {
    height: getResponsiveHeight(44),
    flexDirection: 'row',
    alignItems: 'center',
  },
  row_border_bottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1'
  },
  text_row_left: {
    marginLeft: getResponsiveWidth(24),
    color: '#444',
    fontSize: 16,
    fontWeight: '500'
  },
  text_row_desc: {
    position: 'absolute',
    left: getResponsiveWidth(100),
    color: '#aaa',
    fontSize: 16
  },
  row_indicator: {
    position: 'absolute',
    right: 0
  },
  row_match: {
    height: getResponsiveHeight(100),
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1'
  },
  row_match_top: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text_match_left: {
    marginLeft: getResponsiveWidth(24),
    color: '#000',
    fontSize: 20,
    fontWeight: '400'
  },
  row_match_bottom: {
    height: getResponsiveWidth(44),
    flexDirection: 'row',
    alignItems: 'center',
  },
  text_match_desc: {
    marginLeft: getResponsiveWidth(48),
    color: '#aaa',
    fontSize: 12,
    fontWeight: '500'
  },
  text_row_right: {
    position: 'absolute',
    right: getResponsiveWidth(16),
    color: '#000',
    fontSize: 16,
  },
  text_link: {
    marginLeft: getResponsiveWidth(8),
    color: '#000',
    fontSize: 12
  }
})
