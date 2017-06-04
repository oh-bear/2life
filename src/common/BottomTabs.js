import React, {Component} from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
} from "react-native";
import TabNavigator from "react-native-tab-navigator";

const styles = StyleSheet.create({
	container: {
		flex:1,
		backgroundColor:"white"
	},
	page1: {
		flex:1,
		backgroundColor:"yellow"
	},
	page2: {
		flex:1,
		backgroundColor:"blue"
	},
	image: {
		tintColor:"#929292"
	},
	active: {
		tintColor:"#607D8B"
	}
});


export default class BottomTabs extends Component {
	static defaultProps = {
	   page1: (<View style={styles.page1}></View>),
	   page2: (<View style={styles.page2}></View>),
	}
	constructor(props) {
		super(props);
		this.state = {
			selectedTab: 'home'
		};
	}
	render() {
		return (
			<View style={styles.container}>
		    <TabNavigator>
	        <TabNavigator.Item
            selected={this.state.selectedTab === 'home'}
            title="首页"
            renderIcon={() => <Image style={styles.image} source={require("../../res/images/home.png")} />}
            renderSelectedIcon={() => <Image  source={require("../../res/images/home1.png")} />}
            onPress={() => this.setState({ selectedTab: 'home' })}>
        	{this.props.page1}
	        </TabNavigator.Item>
	        <TabNavigator.Item
	        	selected={this.state.selectedTab === 'profile'}
	        	title="我的"
	        	renderIcon={() => <Image style={styles.image} source={require("../../res/images/profile.png")} />}
	        	renderSelectedIcon={() => <Image  source={require("../../res/images/profile1.png")} />}
	        	onPress={() => this.setState({ selectedTab: 'profile' })}>
	        	{this.props.page2}
	        </TabNavigator.Item>
			</TabNavigator>
		</View>);

	}
}



