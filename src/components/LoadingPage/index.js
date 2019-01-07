/**
 * Created by isaac on 2016/4/5.
 */
import React, {Component} from 'react';

export default
class LoadingPage extends Component {
  render() {
    return (
      <div id="loader-wrapper" >
        <div id="loader" ></div>
        <div className="loader-section" ></div>
      </div>);
  }
}
