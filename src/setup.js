import React, {Component} from "React";
import {
  View,
  StyleSheet,
  Text,
  Navigator
} from "react-native";
import LoginPage from "./pages/LoginPage";
import WelcomePage from "./pages/WelcomePage";
import DairyPage from "./pages/DairyPage";
import HomeScreen from './pages/HomeScreen';

function setup() {

  // 进行一些初始化配置
  class Root extends Component {

    renderScene(route, navigator) {
      let Component = route.component;
      return <Component {...route.params} navigator={navigator}/>;
    }
    configureScene = (route, routeStack) => {
      let configure = Navigator.SceneConfigs.PushFromRight;
      switch (route.name){
        case 'EditView':
          configure = Navigator.SceneConfigs.FloatFromBottom;
        default:
          configure =  Navigator.SceneConfigs.PushFromRight;
      };
      return {
        ...configure,
        gestures:{}
      };
    }
    render() {
      return <Navigator
          initialRoute = {{component: WelcomePage}}
          renderScene = {(route, navigator)=>{
            let Component = route.component
            return <Component navigator={navigator} {...route.params}/>
          }}
          configureScene={this.configureScene}
        />
    }
  }
  
  return <Root/>
}

module.exports = setup;