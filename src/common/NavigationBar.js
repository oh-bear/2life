import React, {Component,PropTypes} from "react";
import {
	View, 
	Text,
	Image,
	StyleSheet,
	StatusBar,
	TouchableOpacity,
    Dimensions
}from "react-native";
const WIDTH = Dimensions.get("window").width;
const NAVBAR_HEIGHT = 44;
const STATUS_BAR_HEIGHT = 20;
const StatusBarShape = {
	backgroundColor:PropTypes.string,
	barStyle:PropTypes.oneOf(["default","light-content","dark-content"]),
	hidden:PropTypes.bool
}

export default class Navigator extends Component {
    static propTypes = {
    	style:View.propTypes.style,
    	title:PropTypes.string,
    	titleView:PropTypes.element,
    	hide:PropTypes.bool,
    	leftButton:PropTypes.element,
    	rightButton:PropTypes.element,
    	statusBar:PropTypes.shape(StatusBarShape)
    }
    static defaultProps = {
    	statusBar:{
    		// barStyle:"light-content",
    		hidden:false
    	}
    }
    constructor(props) {
    	super(props);
    	this.state = {
    		title: "",
    		hide:false,
    	}
    }
    render() {
    	let status = <View style={styles.statusBar}>
    		<StatusBar {...this.props.statusBar}/>
    	</View>;
    	let titleView = this.props.titleView?this.props.titleView:
    	    <Text style={styles.title}>{this.props.title}</Text>
    	let content = <View style={[styles.navBar,this.props.navBarStyle]}>
    		{this.props.leftButton}
    		<View style={[styles.titleViewContainer,this.props.titleStyle]}>
    			{titleView}
    		</View> 
    		{this.props.rightButton}
    	</View>
    	return ( 
    	    <View style={[styles.container,this.props.navStyle]}>
    	        {status}
    	        {content}
    	    </View>
    	)
    }
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
        justifyContent:"center",
        alignItems:"center"
	},
	navBar: {
		// justifyContent: "center",
		alignItems:"center",
		height:NAVBAR_HEIGHT,
		backgroundColor:"white",
		flexDirection:"row",
        width:WIDTH,
        justifyContent:"center"
	},
	titleViewContainer: {
		justifyContent: "center",
		alignItems:"center",
        width:WIDTH-100
		// position:"absolute",
		// left:20,
		// right:20,
		// top:0,
		// bottom:0
	},
	title: {
		fontSize:17,
		color:"black",
        alignItems:"center"
	},
	statusBar: {
		height:STATUS_BAR_HEIGHT,
	}
});