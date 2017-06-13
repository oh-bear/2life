import React, {Component} from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  AsyncStorage,
  Alert,
  DeviceEventEmitter,
  TouchableOpacity,
  Image
} from "react-native";
import ImagePicker from 'react-native-image-picker';
import RightButtonNav from "../common/RightButtonNav";
import HttpUtils from "../util/HttpUtils";
import {HOST} from '../util/config';
import AlertBox from '../common/AlertBox';

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const INNERWIDTH =  WIDTH - 16;

const URL = HOST + "notes/save";

export default class FeedBackPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title:"",
      content:"",
      isDialogVisible: false,
      avatarSource: ''
    }
  }
  showDialog(){
    this.setState({isDialogVisible:true});
  }
  onPost() {
    if(!this.state.title.trim()) {
      Alert.alert("小提示","请输入日记的标题哦~");
      return ;
    }
    if(!this.state.content.trim()) {
      Alert.alert("小提示","请输入日记的内容哦~");
      return ;
    }
    HttpUtils.post(URL,{
      token: this.props.user.token,
      uid: this.props.user.uid,
      timestamp: this.props.timestamp,
      note_title: this.state.title,
      note_content: this.state.content,
      note_date: new Date().getTime()
    }).then((response)=>{
      if(response.status== 0) {
        this.showDialog()
      }
    }).catch((error)=>{
        Alert.alert("小提示", '网络故障:(');
    }) 
  }
  render() {
    var options = {
      title: 'Select Avatar',
      customButtons: [
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    return <View style={styles.container}>
      <RightButtonNav
        title={"创建日记"}
        rightOnPress={()=>{
          this.onPost();
        }}
				navigator={
					this.props.navigator
				}/>
      <AlertBox
        _dialogVisible={this.state.isDialogVisible}
        _dialogRightBtnAction={()=>{this.hideDialog()}}
        _dialogContent={'日记创建成功'}
        _dialogLeftBtnAction={()=>{
          DeviceEventEmitter.emit('homepageDidChange', 'update');
          this.props.navigator.pop();
        }}
        />
      <Image source={this.state.avatarSource} style={styles.uploadAvatar} />
      <TouchableOpacity
        onPress={()=>{
          ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
              console.log('User cancelled image picker');
            }
            else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            }
            else {
              let source = { uri: response.uri };

              // You can also display the image using data:
              // let source = { uri: 'data:image/jpeg;base64,' + response.data };

              this.setState({
                avatarSource: source
              });
            }
          });
        }}>
        <Text>上传图片</Text>
      </TouchableOpacity>
      <TextInput
        underlineColorAndroid='transparent'
        placeholder={"请输入日记标题"}
        placeholderTextColor={"#999999"}
        style={styles.textInput_title}
        maxLength={10}
        onChangeText={(text)=>{
           this.setState({title:text})
        }}
        />
      <TextInput
        underlineColorAndroid='transparent'
        placeholder={"描述一下你今天的心情吧～"}
        placeholderTextColor={"#999999"}
        multiline={true}
        style={[styles.textInput_title,styles.textInput_content]}
        onChangeText={(text)=>{
           this.setState({content:text})
        }}
        />

    </View>
  }
}

const styles = StyleSheet.create({
  container:{ 
    backgroundColor:"rgb(242,246,250)",
    width: WIDTH,
    height: HEIGHT
  },
  textInput_title: {
    fontFamily:"PingFang SC",
    fontSize:14,
    width:INNERWIDTH,
    height:48,
    alignItems:"center",
    backgroundColor:"white",
    marginTop:8,
    marginLeft:8,
    paddingLeft:16,
    borderRadius:8,
  },
  textInput_content: {
    height:0.7*HEIGHT
  },
  uploadAvatar: {
    width: 60,
    height: 60
  }
})