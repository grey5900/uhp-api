/**
 * Created by isaac on 16/2/27.
 */
import React, {Component, PropTypes} from 'react';
import NormalButton from '../NormalButton';

export default
class Photo extends Component {
  static propTypes = {
    onCancel: PropTypes.func,
    didScanResult: PropTypes.func,
    checkPhoto: PropTypes.func
  };
  state = {
    result: null,
    img: ''
  };

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    this.stopVideo();
  }

  stopVideo() {
    this.refs.video.pause();
  }

  init() {
    const canvas = this.refs.canvas;
    const video = this.refs.video;

    navigator.getMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);
    const self = this;
    navigator.getMedia({video: true, audio: false},
      (stream) => {
        const vendorURL = window.URL || window.webkitURL;
        video.src = vendorURL.createObjectURL(stream);
        video.play();
      },
      (err) => {
        console.log('An error occured! ', err);
      }
    );

    video.addEventListener('canplay', () => {
      if (!self.streaming) {
        // self.height = self.video.videoHeight / (self.video.videoWidth/self.width);
        self.width = 400;
        self.height = 300;
        video.setAttribute('width', self.width);
        video.setAttribute('height', self.height);
        canvas.setAttribute('width', self.width);
        canvas.setAttribute('height', self.height);
        self.streaming = true;

        canvas.style.width = `${self.width}px`;
        canvas.style.height = `${self.height}px`;
        canvas.width = self.width;
        canvas.height = self.height;
        self.context = canvas.getContext('2d');
        self.context.clearRect(0, 0, self.width, self.height);
      }
    }, false);
  }

  restart = () => {
    let data = '';
    if (this.context && typeof this.context.drawImage === 'function') {
      this.context.drawImage(this.refs.video, 0, 0, this.width, this.height);
      data = this.refs.canvas.toDataURL('image/png');
    }
    this.setState({
      img: data
    });
  };

  _handleCancel = () => {
    const {onCancel} = this.props;
    if (onCancel) {
      onCancel();
    }
  };

  _submitPhoto = () => {
    const {img} = this.state;
    const {checkPhoto} = this.props;
    if (checkPhoto) {
      checkPhoto(img);
    }
    this._handleCancel();
  };

  render() {
    const styles = require('./style.scss');
    const {img} = this.state;
    return (
      <div className={styles.wrapper}>
        <center style={{paddingTop: '160px'}}>
          <div style={{width: '820px'}}>
            <div style={{float: 'left'}}>
              <video className={styles.video} ref="video" width="400" height="300" />
              <br />
              <canvas ref="canvas" className="hidden" width="400" height="300" />
              <br />
              <NormalButton onClick={this._handleCancel}
                            style={{marginRight: '40px', backgroundColor: '#ABABAB'}}>取消</NormalButton>
              <NormalButton style={{marginRight: '40px'}} className="uhs-btn-warning"
                            onClick={this.restart}>拍照</NormalButton>
              <NormalButton onClick={this._submitPhoto}>确认</NormalButton>
            </div>
            <div style={{float: 'right', textAlign: 'center'}}>
              <img ref="photo" src={img} />
            </div>
          </div>
        </center>
      </div>
    );
  }
}
