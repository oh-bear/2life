import React, {Component} from 'React'
import {
  Navigator
} from 'react-native'
import WelcomePage from './pages/WelcomePage'

function setup() {

  // 进行一些初始化配置
  class Root extends Component {

    renderScene(route, navigator) {
      let Component = route.component
      return <Component {...route.params} navigator={navigator}/>
    }

    configureScene = (route, routeStack) => {
      let configure = Navigator.SceneConfigs.PushFromRight
      switch (route.name) {
      case 'EditView':
        configure = Navigator.SceneConfigs.FloatFromBottom
        break
      default:
        configure = Navigator.SceneConfigs.PushFromRight
      }
      return {
        ...configure,
        gestures: {}
      }
    }

    render() {
      return <Navigator
        initialRoute={{component: WelcomePage}}
        renderScene={(route, navigator) => {
          let Component = route.component
          return <Component navigator={navigator} {...route.params}/>
        }}
        configureScene={this.configureScene}
      />
    }
  }

  return <Root/>
}

module.exports = setup