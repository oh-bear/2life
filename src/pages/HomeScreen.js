import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import BottomTabs from '../common/BottomTabs';
import AgendaScreen from "./AgendaScreen";
import CalendarsList from "./CalendarsList";
import ProfileScreen from "./ProfileScreen";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return	<BottomTabs 
    	page1 = {
    		<AgendaScreen />
    	}
    	page2 = {
    		<ProfileScreen />
    	}
    />
  }
}

const styles = StyleSheet.create({
  
});