/**
 * Created by isaac on 16/8/20.
 */
export default {
  __map: {'/': 0},
  activity: {
    date: {
      name: "时间",
      map: (str) => {
        return str.replace(/\//g, '-');
      }
    },
    address              : "地点",
    theme                : "主题",
    style                : "活动形式",
    participant_num      : {name: "活动人数", map: str => str.replace('人', '')},

    invite_type          : "邀请方式",
    speaker              : "讲师",
    speaker_mobile       : "联系方式",

    worker_num           : {name: "志愿者人数", map: str => str.replace('人', '')},
    cost                 : "活动成本",

    sponsor              : "赞助方",
    sponsor_money        : "赞助金额",
    effect               : "活动效果",
    our_patients         : {name: "医院病人", map: str => str.replace('人', '')},
    newer_num            : {name: "新增病人", map: str => str.replace('人', '')},

    return_visit_num     : {name: "客户回访", map: str => str.replace('人', '')},
    social_participant   : "媒体资源",
  }
}
