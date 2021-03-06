import React, { Component } from 'react';
import {
  View,
  TouchableHighlight,
} from 'react-native';
// react-native-camera is a camera module for react native.
// currently, we only have back camera functionality but the module has built in properties
// to enable various mobile camera features such as flash, front camera view, etc.
import Camera from 'react-native-camera';
// this is a module that reads images and encodes the image into a base64 string
// before sending it to firebase
import ReadTheData from 'NativeModules';
const ReadImageData = ReadTheData.ReadImageData;
import { styles } from './Styles/CameraStyle';

class CameraView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: '',
      base64: ''
    };
  }
  // takes photo, saves to camera roll and sets base64 state to the base64 string of the current image
  takePicture() {
    this.camera.capture()
      // data from photo which has image path as a property
      .then((data) => this.setState({ path: data.path }))
      // takes image from path and converts it to base64 string
      .then(() => ReadImageData.readImage(this.state.path, (image) => {
        this.setState({ base64: 'data:image/jpeg;base64,' + image });
        this._handleNextPage('SubmitImageView');
      }))
      .catch(err => console.error(err));
  }

  _handleNextPage(name) {
    this.props.navigator.push({
      name: name,
      path: this.state.path,
      base64: this.state.base64
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera
            ref={(cam) => {this.camera = cam;}}
            style={styles.preview}
            aspect={Camera.constants.Aspect.fill}>
          <TouchableHighlight onPress={this.takePicture.bind(this)}>
            <View style={styles.capture}/>
          </TouchableHighlight>
        </Camera>
      </View>
    );
  }
}

export { CameraView };
