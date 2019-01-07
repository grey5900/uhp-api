import React from 'react';
import {IndexRoute, Route} from 'react-router';
import {USER_KEY, TOKEN_KEY, setUserAndToken} from 'redux/modules/auth';
import {
  App,
  Home,
  Login,
  Labour,
  LaborListView,
  NotFound,
  Patients,
  PatientDetail,
  Doctors,
  DoctorDetail,
  Hospitals,
  HospitalDetail,
  Admins,
  AdminDetail,
  ChangePassword,
  AccessDenied,
  Crowd,
  Activities,
  ActivityDetail
} from 'containers';

export default (store, req) => {
  const requireLogin = (nextState, replace, cb) => {
    function checkAuth() {
      let {auth: {user}} = store.getState();
      if (!user) {
        if (req) {
          // try to load from cookie
          const str = req.cookies[USER_KEY];
          if (str) {
            const obj = JSON.parse(str);
            const token = JSON.parse(req.cookies[TOKEN_KEY]);
            if (obj) {
              user = obj;
              store.dispatch(setUserAndToken(user, token));
            }
          }
        }
      }
      if (!user) {
        // oops, not logged in, so can't be here!
        replace('/login');
      }
      cb();
    }

    checkAuth();
  };
  const requireAdmin = (nextState, replace, cb) => {
    const {auth: {user}} = store.getState();
    if (user && user.role !== 'admin') {
      replace('/access_denied');
    }
    cb();
  };
  const requireVisitor = (nextState, replace, cb) => {
    const {auth: {user}} = store.getState();
    if (user && user.role !== 'visitor' && user.role !== 'admin') {
      replace('/access_denied');
    }
    cb();
  };

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App}>
      { /* Home (main) route */ }
      <IndexRoute component={Login} />

      { /* Routes requiring login */ }
      <Route onEnter={requireLogin}>
        <Route onEnter={requireVisitor}>
          <Route onEnter={requireAdmin}>
            <Route path="admins" component={Admins} />
            <Route path="admin/add" component={AdminDetail} />
            <Route path="admin/:adminID" component={AdminDetail} />
          </Route>
          <Route path="home" component={Home} />
          <Route path="chart" component={Crowd} />
        </Route>
        <Route path="patients" component={Patients} />
        <Route path="patient/add" component={PatientDetail} />
        <Route path="patient/:patientID" component={PatientDetail} />
        <Route path="patient/:patientID/:tabIndex" component={PatientDetail} />
        <Route path="doctors" component={Doctors} />
        <Route path="doctor/add" component={DoctorDetail} />
        <Route path="doctor/:doctorID" component={DoctorDetail} />
        <Route path="hospitals" component={Hospitals} />
        <Route path="hospital/add" component={HospitalDetail} />
        <Route path="hospital/:hospitalID" component={HospitalDetail} />
        <Route path="labours" component={Labour} />
        <Route path="labourtype/:typeID" component={LaborListView} />

        <Route path="activities" component={Activities} />
        <Route path="activity/add" component={ActivityDetail} />
        <Route path="activity/:activityID" component={ActivityDetail} />
        <Route path="change_password" component={ChangePassword} />
      </Route>

      { /* Routes */ }
      <Route path="login" component={Login} />
      <Route path="access_denied" component={AccessDenied} />
      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
