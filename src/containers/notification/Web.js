import React, { Component } from 'react'
import {
	View,
	StyleSheet,
	WebView
} from 'react-native'

import {
	WIDTH,
} from '../../common/styles'

import Container from '../../components/Container'
import CommonNav from '../../components/CommonNav'

export default class Web extends Component {

	render() {
		return (
			<Container>
				<CommonNav/>
				<WebView
					style={styles.web_container}
					source={{ uri: this.props.url }}
				/>
			</Container>
		)
	}
}

const styles = StyleSheet.create({
	web_container: {
		width: WIDTH
	}
})
