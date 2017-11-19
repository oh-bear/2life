import React, {Component} from 'react'
import BottomTabs from '../common/BottomTabs'
import AgendaScreen from './AgendaScreen'
import ProfileScreen from './ProfileScreen'
import NotificationsPage from './NotificationsPage'

export default class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      homeCount: 0,
      profileCount: 0
    }
  }

  render() {
    return <BottomTabs
      page1={
        <AgendaScreen
          user={this.props.user}
          partner={this.props.partner}
          navigator={this.props.navigator}
          count={this.state.homeCount}/>
      }
      page2={
        <NotificationsPage
          user={this.props.user}
          partner={this.props.partner}
          navigator={this.props.navigator}/>
      }
      page3={
        <ProfileScreen
          user={this.props.user}
          partner={this.props.partner}
          navigator={this.props.navigator}/>
      }
    />
  }
}