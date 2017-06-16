import React, {Component} from "react";
import {
  TextInput,
  StyleSheet,
  Dimensions,
  AsyncStorage,
  Alert,
  DeviceEventEmitter,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';

import { createAnimatableComponent, View, Text } from 'react-native-animatable';

import RightButtonNav from "../common/RightButtonNav";
import HttpUtils from "../util/HttpUtils";
import {HOST, QINIU_UPHOST} from '../util/config';
import AlertBox from '../common/AlertBox';

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const INNERWIDTH =  WIDTH - 16;

const URL = HOST + "notes/save";
const URL_TOKEN = HOST + "util/qiniu_token";//qiniu_token

export default class CreateNotePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title:"",
      content:"",
      isDialogVisible: false,
      animating:false,//HUD
      fileList:[],//[file1:{uri:*,name:*,token:*},file2:{uri:*,name:*,token:*}]
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
        this.state.fileList.map((d,i)=>{
          file = d;
          this.resizeFile(file, ()=>{
            this.uploadFile(file, ()=>{
              console.log('uploadFile success= ', i);
              //不知道RN如何实现NSOperation group
              if (i+1 == this.state.fileList.length) {
                this.showDialog()
              }
            });
          })
        })

      }
    }).catch((error)=>{
        Alert.alert("小提示", '网络故障:(');
    })
  }

  resizeFile(file, complete) {
    if(!file.name) {
      Alert.alert("小提示","图片没有名称哦~");
      return ;
    }
    if(!file.uri) {
      Alert.alert("小提示","图片没有内容哦~");
      return ;
    }

    ImageResizer.createResizedImage(file.uri, file.width, file.height, 'JPEG', 80)
    .then((resizedImageUri) => {
      file.resizedUri = resizedImageUri;
      complete(file);
    }).catch((err) => {
      Alert.alert("小提示","压缩图片失败哦~");
      return ;
    });
  }

  uploadFile(file, complete) {
    if(!file.name) {
      Alert.alert("小提示","图片没有名称哦~");
      return ;
    }
    if(!file.uri) {
      Alert.alert("小提示","图片没有内容哦~");
      return ;
    }

    HttpUtils.post(URL_TOKEN,{
      token: this.props.user.token,
      uid: this.props.user.uid,
      timestamp: this.props.timestamp,
      filename: file.name//"image/twolife/" + this.state.file.name,
    }).then((response)=>{
      if(response.status== 0) {
        file.token = response.qiniu_token;

        var formData = new FormData();
        formData.append('file', {uri: file.resizedUri, type:'application/octet-stream', name: file.name});
        formData.append('key', file.name);
        formData.append('token', file.token);

        return fetch(QINIU_UPHOST, {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/octet-stream'
          },
          body: formData
          }).then((response) => {
            complete();
        }).catch((error) => {
          Alert.alert("小提示", '网络故障:(');
        });

      }
    }).catch((error)=>{
        Alert.alert("小提示", '网络故障:(');
    })
  }

  render() {
    var options = {
      title: 'Select File',
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
        }}/>

        <View style={styles.imageConteainer}>
            {
              this.state.fileList.map((d,i)=>{
                file = d;

                return <View delay={100 + i * 50} animation="bounceInRight">
                    <TouchableOpacity
                      onPress={
                        ()=>{

                        }
                      }>
                      <Image style={styles.addImage} source={{uri:file.uri}}/>
              </TouchableOpacity>
              </View>
              })
            }
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
                    let file = {uri: response.uri, height:response.height, width:response.width, name: 'image/twolife/' + this.props.user.uid + '/' + response.fileName};
                    this.state.fileList.push(file);
                    this.setState({
                      fileList: this.state.fileList
                    })
                  }
                });
              }}>
              <Image style={styles.addImage} source={require('../../res/images/icon_add.png')}></Image>
            </TouchableOpacity>
        </View>
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
    height:0.3*HEIGHT
  },
  imageConteainer: {
    flexDirection: 'row',
  },
  addImage: {
    width:48,
    height:48,
    margin:10
  },
  center: {
  top: 0,
  justifyContent: 'center',
}
})
