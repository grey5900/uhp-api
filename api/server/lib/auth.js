/**
 * Created by isaac on 15/10/29.
 */
var url = require('url');
var mongoose = require('mongoose');
var UserModel = mongoose.model('Admin');
var jwt = require('jwt-simple');
import moment from 'moment';
var token_secret = 'omk-136f7caa-3067-43ad-9861-a09e37caa6af-veritas';
const pathWhiteList = ['/logout'];

import RBAC from 'rbac';
const rbac = new RBAC({
  roles: ['admin', 'visitor', 'operator'],
  permissions: {
    admin: ['create', 'update', 'search', 'logout', 'delete'],
    doctor: ['create', 'update', 'search', 'delete'],
    hospital: ['create', 'update', 'search', 'delete'],
    labor: ['create', 'update', 'search', 'delete'],
    activity: ['create', 'update', 'search', 'delete'],
    medicare: ['create', 'update', 'search', 'delete'],
    patient: ['create', 'update', 'search', 'delete'],
    donate: ['create', 'update', 'search', 'delete']
  },
  grants: {
    operator: ['create_hospital', 'update_hospital', 'search_hospital',
      'create_doctor', 'update_doctor', 'search_doctor',
      'create_patient', 'update_patient', 'search_patient',
      'create_medicare', 'update_medicare', 'search_medicare',
      'create_labor', 'update_labor', 'search_labor',
      'create_activity', 'update_activity', 'search_activity',
      'create_donate', 'update_donate', 'search_donate',
    ],
    visitor: ['search_hospital', 'search_doctor', 'search_patient', 'search_medicare', 'search_labor', 'search_activity', 'search_donate'],
    admin: [
      'operator',
      'delete_hospital', 'delete_doctor', 'delete_patient', 'delete_medicare', 'delete_labor', 'delete_activity',
      'create_admin', 'update_admin', 'search_admin', 'delete_admin', 'delete_donate'
    ],
  }
}, function (err, rbac) {
  if (err) {
    throw err;
  }
  console.log('rbac init ok!');
});


export function jwtEncode(data) {
  return jwt.encode(data, token_secret);
}

export function jwtDecode(data) {
  return jwt.decode(data, token_secret);
}


export function jwtAuth(req, res, next) {

  // Parse the URL, we might need this
  var parsed_url = url.parse(req.url, true);

  /**
   * Take the token from:
   *
   *  - the POST value access_token
   *  - the GET parameter access_token
   *  - the x-access-token header
   *    ...in that order.
   */
  var token = (req.body && req.body.access_token)
    || parsed_url.query.access_token
    || req.headers["x-access-token"];

  if (token) {

    try {
      var decoded = jwtDecode(token);

      if (decoded.exp <= Date.now()) {
        res.end('Token已过期!', 400);
      }

      UserModel.findOne({'_id': decoded.iss}, function (err, user) {

        if (!err) {
          req.user = user;
          return next()
        } else {
          res.end('用户不存在!', 400);
        }
      })

    } catch (err) {
      console.error(err);
      return next()
    }

  } else {
    next()
  }
}

export function userAuth(req, res, next) {

  if (req.isAuthenticated())
    return next();

  res.send({
    code: 401,
    msg: 'Auth failed'
  });
}

export function roleAuth(req, action, resource, next) {

  return (resolve, reject) => {

    const parsed_url = url.parse(req.url, true);

    /**
     * Take the token from:
     *
     *  - the POST value access_token
     *  - the GET parameter access_token
     *  - the x-access-token header
     *    ...in that order.
     */
    const token = (req.body && req.body.access_token)
      || parsed_url.query.access_token
      || req.headers["x-access-token"];

    if (pathWhiteList.indexOf(parsed_url.path) !== -1) {
      next(resolve, reject);
    } else {
      if (token) {

        try {
          const decoded = jwtDecode(token);

          if (decoded.exp <= Date.now()) {
            reject({msg: 'Token已过期!', redirect: '/login', status: 410});
          } else {

            UserModel.findOne({'_id': decoded.iss}, (err, user) => {

              if (!err) {
                if (action && resource) {
                  rbac.can(user.role, action, resource, (error, can) => {
                    if (error) {
                      console.log(error);
                      reject({msg: 'Internal Error!'});
                    } else {
                      if (can) {
                        req.user = user;
                        next(resolve, reject);
                      } else {
                        reject({msg: 'Permission Denied!'});
                      }
                    }
                  });
                } else {
                  //ignore rbac check
                  req.user = user;
                  next(resolve, reject);
                }
              } else {
                reject({msg: '用户不存在!'});
              }
            });
          }
        } catch (err) {
          console.error(err.message);
          reject({msg: 'Internal Error!'});
        }
      } else {
        reject({msg: 'Token missing!'});
      }
    }
  }
}

export function roleAuthPromise(req, action, resource, next) {
  return new Promise(roleAuth(req, action, resource, next));
}

var addRoleFilter = function (req, args, field) {
  const user = req.user;
  if (user) {
    if (user.role === 'director') {
      if (!field) {
        field = 'hospital';
      }
      args[field] = user.hospital;
    }
  }
};

export function updateToken(userID) {

  var expires = moment().add(7, 'days').valueOf();
  return jwtEncode({
    iss: userID,
    exp: expires
  });
}
export function genToken(userID, ext) {

  const expires = moment().add(4, 'hours').valueOf();
  return jwtEncode({
    iss: userID,
    exp: expires,
    ext: ext
  });
}

export function getIP(req) {
  const ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  return ip;
}

export default {
  genToken: genToken,
  getIP: getIP,
  addRoleFilter: addRoleFilter
};
