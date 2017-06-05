import React, {Component} from "React";
import {
  View,
  StyleSheet,
  Text,
  Navigator
} from "react-native";
import LoginPage from "./pages/LoginPage";
import HomeScreen from './pages/HomeScreen';

function setup() {
  // 进行一些初始化配置
  class Root extends Component {
    renderScene(route, navigator) {
      let Component = route.component;
      return <Component {...route.params} navigator={navigator}/>;
    }
    render() {
      return <Navigator
          initialRoute = {{component:HomeScreen}}
          renderScene = {(route, navigator)=>{
            let Component = route.component
            return <Component navigator={navigator} {...route.params}/>
          }}
          />
    }
  }
  
  return <Root/>
}

module.exports = setup;