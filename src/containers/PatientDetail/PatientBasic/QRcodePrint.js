/**
 * Created by isaac on 16/4/12.
 */
import React, {Component, PropTypes} from 'react';
import QRCode from 'qrcode.react';

export default
class QRcodePrint extends Component {
  static propTypes = {
    patientID: PropTypes.any
  };

  render() {
    console.log('patientID', this.props.patientID);
    const {patientID} = this.props;
    return (<div style={{textAlign: 'center'}}>
      <QRCode value={`uhs://patient?id=${patientID}`} size={200} />
    </div>);
  }
}

