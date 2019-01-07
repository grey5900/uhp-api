/**
 * Created by isaac on 16/3/5.
 */
import { Component } from 'reactcss';

export default
class Content extends Component {
  classes() {
    return {
      default: {
        content: {
          marginTop: '20px',
          marginLeft: '30px',
          marginRight: '30px',
          marginBottom: '10px',
          padding: '6px 20px 20px 20px',
          backgroundColor: '#FFFFFF',
          height: 'calc(100% - 100px)',
          borderRadius: '4px',
          border: '1px solid rgba(230,230,230,0.7)'
        },
        breadcrumb: {
          margin: '-15px -15px 15px -15px',
          borderRadius: 0
        },
        panel: {
          height: '100%'
        },
        panelHead: {
          height: '40px',
          marginBottom: '10px'
        },
        panelTitle: {
          fontSize: '22px',
          marginTop: '10px',
          display: 'inline-block'
        },
        panelbody: {
          height: 'calc(100% - 40px)'
        },
        toolbarNearRight: {
          float: 'right',
          margin: '0px 10px 15px 0px'
        },
        toolbarRight: {
          float: 'right',
          margin: '5px 0px 15px 0px'
        }
      }
    };
  }
}
