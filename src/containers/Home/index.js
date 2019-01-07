/**
 * Created by jiang_mac on 16/3/28.
 */
import React, {PropTypes} from 'react';
import {Content} from 'components';
import {push} from 'react-router-redux';
import {connect} from 'react-redux';
import {loadPage, typeCount} from 'redux/modules/patient';
import {loadLabourCount, loadLabourWeek} from 'redux/modules/labour';
import {countAsCity, loadAll as loadAllHospital} from 'redux/modules/hospital';
import {loadPage as listDoctor} from 'redux/modules/doctor';
import moment from 'moment';
import Highcharts from 'highcharts';
import {Scrollbars} from 'react-custom-scrollbars';

const countStyle = {
  border: '1px solid #eeeeee',
  boxSizing: 'border-box',
  margin: '10px',
  padding: '10px',
  borderRadius: '6px',
};

@connect(
  () => ({}),
  {
    pushState: push,
    loadPage, listDoctor, loadLabourCount, loadLabourWeek, typeCount, loadAllHospital, countAsCity
  })
export default class Home extends Content {
  static propTypes = {
    pushState: PropTypes.func,
  };

  state = {
    patients: [],
    doctors: [],
    allCount: 0,
    doctorCount: 0,
    labourCount: 0
  };

  componentDidMount() {
    this._setTheme();
    this._setCount();
    this._setPatient();
    this._setDoctor();
    this._setLabourWeekData();
    this._setTypeCount();
    this._loadAllHospital();
    this._loadHospitalNumByCity();
  }

  _loadAllHospital = () => {
    this.props.loadAllHospital((error, hosptialData = {}) => {
      const hospitals = hosptialData.data.map((item) => {
        return {
          name: item.name,
          visited: item.visited
        };
      });
      const map = new window.BMap.Map('baiduMap');
      map.centerAndZoom(new window.BMap.Point(104.06, 30.67), 8);
      map.enableScrollWheelZoom(true);
      const myGeo = new window.BMap.Geocoder();

      const addMarker = (point, visited, label) => {
        const marker = new window.BMap.Marker(point);
        const notVisitedIcon = new window.BMap.Icon('http://api.map.baidu.com/img/markers.png', new window.BMap.Size(23, 25), {
          offset: new window.BMap.Size(10, 25),
          imageOffset: new window.BMap.Size(0, 0 - 11 * 25)
        });
        const visitedIcon = new window.BMap.Icon('http://api.map.baidu.com/img/markers.png', new window.BMap.Size(23, 25), {
          offset: new window.BMap.Size(10, 25),
          imageOffset: new window.BMap.Size(0, 0 - 10 * 25)
        });
        if (visited !== '已走访') {
          marker.setIcon(notVisitedIcon);
        } else {
          console.log('visited:', visited);
          marker.setIcon(visitedIcon);
        }
        map.addOverlay(marker);
        if (label) {
          marker.setLabel(label);
        }
      };

      map.addEventListener('zoomend', () => {
        const zoom = map.getZoom();
        map.clearOverlays();
        if (zoom <= 10) {
          for (let index = 0; index < hospitals.length; index++) {
            myGeo.getPoint(hospitals[index].name, (point) => {
              if (point) {
                const address = new window.BMap.Point(point.lng, point.lat);
                addMarker(address, hospitals[index].visited);
              }
            }, '四川省');
          }
        } else {
          for (let index = 0; index < hospitals.length; index++) {
            myGeo.getPoint(hospitals[index].name, (point) => {
              if (point) {
                const address = new window.BMap.Point(point.lng, point.lat);
                addMarker(address, hospitals[index].visited, new window.BMap.Label(`${index}:${hospitals[index].name}`, {offset: new window.BMap.Size(20, -10)}));
              }
            }, '四川省');
          }
        }
      });

      for (let index = 0; index < hospitals.length; index++) {
        myGeo.getPoint(hospitals[index].name, (point) => {
          if (point) {
            const address = new window.BMap.Point(point.lng, point.lat);
            addMarker(address, hospitals[index].visited);
          }
        }, '四川省');
      }
    });
  };

  _loadHospitalNumByCity = () => {
    this.props.countAsCity((response) => {
      const hospitalNumArray = response.data || [];
      this.setState({
        hospitalNumArray
      });
    });
  }
  _setTypeCount = () => {
    this.props.typeCount({}, (countData) => {
      const data = countData.data.map((item) => {
        if (item.name === 'hemodialysis') {
          item.name = '血液透析患者';
        } else if (item.name === 'peritoneal') {
          item.name = '腹膜透析患者';
        }
        return [item.name, item.value];
      });
      this._setDialysisChart(data);
    });
  };

  _setLabourWeekData = () => {
    this.props.loadLabourWeek({}, (weekData = {}) => {
      const {data = []} = weekData;
      const number = [];
      for (let index = -6; index < 1; index++) {
        let count = 0;
        for (let subIndex = 0; subIndex < data.length; subIndex++) {
          const dayFirst = this.addDays(index).toString().substring(0, 15);
          const daySecond = (new Date(data[subIndex].create_time)).toString().substring(0, 15);
          if (dayFirst === daySecond) {
            count++;
          }
        }
        number.push(count);
      }
      const money = [];
      for (let index = -6; index < 1; index++) {
        let count = 0;
        for (let subIndex = 0; subIndex < data.length; subIndex++) {
          const dayFirst = this.addDays(index).toString().substring(0, 15);
          const daySecond = (new Date(data[subIndex].create_time)).toString().substring(0, 15);

          if (dayFirst === daySecond) {
            count += data[subIndex].payment || 0;
          }
        }
        money.push(count);
      }
      this._setLabourChart(number, money);
    });
  };

  addDays = (days) => {
    const result = new Date();
    result.setDate(result.getDate() + days);
    return result;
  }

  _setTheme = () => {
    Highcharts.theme = {
      colors: ['#f45b5b', '#8085e9', '#8d4654', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
        '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
      chart: {
        backgroundColor: null,
      },
      title: {
        style: {
          color: 'black',
          fontSize: '16px',
          fontWeight: 'bold'
        }
      },
      subtitle: {
        style: {
          color: 'black'
        }
      },
      tooltip: {
        borderWidth: 0
      },
      legend: {
        itemStyle: {
          fontWeight: 'bold',
          fontSize: '13px'
        }
      },
      xAxis: {
        labels: {
          style: {
            color: '#6e6e70'
          }
        }
      },
      yAxis: {
        labels: {
          style: {
            color: '#6e6e70'
          }
        }
      },
      plotOptions: {
        series: {
          shadow: true
        },
        candlestick: {
          lineColor: '#404048'
        },
        map: {
          shadow: false
        }
      },

      // Highstock specific
      navigator: {
        xAxis: {
          gridLineColor: '#D0D0D8'
        }
      },
      rangeSelector: {
        buttonTheme: {
          fill: 'white',
          stroke: '#C0C0C8',
          'stroke-width': 1,
          states: {
            select: {
              fill: '#D0D0D8'
            }
          }
        }
      },
      scrollbar: {
        trackBorderColor: '#C0C0C8'
      },

      // General
      background2: '#E0E0E8'

    };
    Highcharts.setOptions(Highcharts.theme);
  };

  _setLabourCount = (labourType, labourTypeCount, labourIncomeCount) => {
    labourIncomeCount = labourIncomeCount.map((item) => (parseInt(item * 10, 10) / 1000));
    Highcharts.chart('labourCount', {
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: labourType
      },
      yAxis: {
        allowDecimals: false,
        title: {
          text: ''
        }
      },
      credits: {
        enabled: false
      },
      series: [{
        name: '劳务总数',
        data: labourTypeCount
      }, {
        name: '收入总数',
        data: labourIncomeCount
      }]
    });
  };

  getDay = () => {
    let day = '';
    const dayData = [];
    for (let index = -6; index < 1; index++) {
      const now = new Date();
      now.setDate(now.getDate() + index);
      day = `${now.getMonth() + 1}月${now.getDate()}日`;
      dayData.push(day);
    }
    return dayData;
  }

  _setDialysisChart = (data) => {
    Highcharts.chart('dialysisChart', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: ''
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
            }
          }
        }
      },
      series: [{
        name: '所占比例',
        colorByPoint: true,
        data
      }]
    });
  };

  _setLabourChart = (personCount, moneyCount) => {
    Highcharts.chart('labourChart', {
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: this.getDay()
      },
      yAxis: {
        allowDecimals: false,
        title: {
          text: ''
        }
      },
      credits: {
        enabled: false
      },
      series: [{
        name: '当天劳务人数',
        data: personCount
      }, {
        name: '当天劳务收入',
        data: moneyCount
      }]
    });
  };

  _setCount = () => {
    this.props.loadLabourCount({}, (error, countData = {}) => {
      const labourType = countData.data.map((item) => item._id.name);
      const labourTypeCount = countData.data.map((item) => item.typecount);
      const labourIncomeCount = countData.data.map((item) => item.income);
      this._setLabourCount(labourType, labourTypeCount, labourIncomeCount);
      let sum = 0;
      for (let index = 0; index < labourTypeCount.length; index++) {
        sum += labourTypeCount[index];
      }
      let incomeSum = 0;
      for (let index = 0; index < labourIncomeCount.length; index++) {
        incomeSum += labourIncomeCount[index];
      }
      this.setState({
        labourCount: sum,
        incomeCount: incomeSum
      });
    });
  };

  _setPatient = () => {
    this.props.loadPage({skip: 0, limit: 16}, (error, patientsData = {}) => {
      if (!error) {
        const {patients = [], total} = patientsData.data;
        this.setState({
          patients,
          allCount: total
        });
      }
    });
  };

  _setDoctor = () => {
    this.props.listDoctor({skip: 0, limit: 16}, (error, doctorsData = {}) => {
      if (!error) {
        const {doctors = [], total} = doctorsData.data;
        this.setState({
          doctors,
          doctorCount: total
        });
      }
    });
  };

  _renderMap = () => {
    return (
      <div style={{...countStyle, padding: '12px 0px 0px 0px'}} className="wide field twelve">
        <div className="fields" style={{marginBottom: '10px'}}>
          <h2 className="uhs-text-title" style={{margin: 'auto'}}>医院分布图</h2>
        </div>
        <div className="fields" id="baiduMap" style={{height: '650px'}}>
        </div>
      </div>
    );
  };

  _renderLabourCount = () => {
    const {labourCount = 0} = this.state;
    const {incomeCount = 0} = this.state;
    return (
      <div style={countStyle} className="wide field eight">
        <div className="fields">
          <h2 className="uhs-text-title">劳务统计</h2>
        </div>
        <div className="fields">
          <h2>数量: {labourCount}个, 总收入: {incomeCount.toFixed(2)}元</h2>
        </div>
        <div className="fields" style={{height: '1px', background: '#eeeeee', marginBottom: '10px'}}></div>
        <div className="fields" id="labourCount">
        </div>
      </div>
    );
  };

  _renderDialysisChart = () => {
    return (
      <div style={countStyle} className="wide field eight">
        <div className="fields" style={{marginBottom: '10px'}}>
          <h2 className="uhs-text-title" style={{margin: 'auto'}}>透析患者结构</h2>
        </div>
        <div className="fields" id="dialysisChart">
        </div>
      </div>
    );
  };

  _renderLabourChart = () => {
    return (
      <div style={countStyle} className="wide field eight">
        <div className="fields" style={{marginBottom: '10px'}}>
          <h2 className="uhs-text-title" style={{margin: 'auto'}}>本周劳务统计</h2>
        </div>
        <div className="fields" id="labourChart">
        </div>
      </div>
    );
  };

  _renderDoctor = () => {
    const {doctors = [], doctorCount} = this.state;
    return (
      <div style={countStyle} className="wide field four">
        <div className="fields">
          <h2 className="uhs-text-title">医生总数</h2>
        </div>
        <div className="fields">
          <h2>{doctorCount}</h2>
        </div>
        <div className="fields" style={{height: '1px', background: '#eeeeee', marginBottom: '10px'}}>
        </div>
        {
          doctors.slice(0, 11).map((doctor) => {
            return (
              <div className="fields">
                <div className="wide field eight" style={{color: '#333333'}}>{doctor.name}</div>
                <div className="wide field eight"
                     style={{textAlign: 'right', fontSize: '12px', color: '#cccccc'}}>
                  ..{moment(doctor.create_time).format('YYYY/MM/DD')}</div>
              </div>
            );
          })
        }
      </div>
    );
  };

  _renderPatientCount = () => {
    const {patients = [], allCount} = this.state;
    console.log(patients, 'dd=====');
    return (
      <div style={countStyle} className="four wide field">
        <div className="fields">
          <h2 className="uhs-text-title">患者总数</h2>
        </div>
        <div className="fields">
          <h2>{allCount}</h2>
        </div>
        <div className="fields" style={{height: '1px', background: '#eeeeee', marginBottom: '10px'}}>
        </div>
        {
          patients.slice(0, 11).map((patient) => {
            return (
              <div className="three fields">
                <div className="field" style={{color: '#333'}}>{patient.real_name}</div>
                <div className="field">
                  {patient.hospital.name || ''}
                </div>
                <div className="wide field three" style={{textAlign: 'right', fontSize: '12px', color: '#ddd'}}>
                  {moment(patient.create_time).format('YYYY/MM/DD')}</div>
              </div>
            );
          })
        }
      </div>
    );
  };

  _renderHospitalCount = () => {
    const {hospitalNumArray = []} = this.state;
    return (
      <div style={countStyle} className="four wide field">
        <div className="fields">
          <h2 className="uhs-text-title">各市医院数量</h2>
        </div>
        <div className="fields" style={{height: '1px', background: '#eeeeee', marginBottom: '10px'}}>
        </div>
        {
          hospitalNumArray.map((hospitalNum) => {
            return (
              <div className="fields">
                <div className="wide field eight" style={{color: '#333333'}}>{hospitalNum._id}</div>
                <div className="wide field eight"
                  style={{textAlign: 'right', fontSize: '12px', color: '#333333'}}>
                  {hospitalNum.count}所
                </div>
              </div>
            );
          })
        }
      </div>
    );
  };

  _renderHome = () => {
    return (
      <form className="ui form">
        <div className="fields">
          {this._renderPatientCount()}
          {this._renderLabourCount()}
          {this._renderDoctor()}
        </div>
        <div className="fields">
          {this._renderLabourChart()}
          {this._renderDialysisChart()}
        </div>
        <div className="fields">
          {this._renderHospitalCount()}
          {this._renderMap()}
        </div>
      </form>
    );
  };

  render() {
    return (
      <div is="content">
        <Scrollbars>
          {this._renderHome()}
        </Scrollbars>
      </div>
    );
  }
}
