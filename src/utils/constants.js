/**
 * Created by yons on 16/4/8.
 */
import React from 'react';
import {Link} from 'components';

// same order as in `PatientSchedule.js` of mongoose model
export const DialysisScheduleKeyFromIndex = [
  'monday_items',
  'tuesday_items',
  'wednesday_items',
  'thursday_items',
  'friday_items',
  'saturday_items'
];

export const genderOptions = [
  {value: 'Male', name: '男'},
  {value: 'Female', name: '女'}
];

export const ckdStageOptions = [
  {value: '1', name: '一期'},
  {value: '2', name: '二期'},
  {value: '3', name: '三期'},
  {value: '4', name: '四期'},
  {value: '5', name: '五期'}
];

export const bloodTypeOption = [
  {value: '', name: ''},
  {value: 'A', name: 'A型血'},
  {value: 'B', name: 'B型血'},
  {value: 'O', name: 'O型血'},
  {value: 'AB', name: 'AB型血'},
];

export const diagnosisReason = [
  '慢性肾小球肾炎',
  '糖尿病肾病',
  '狼疮性肾病',
  '紫癜性肾炎',
  '血管炎肾损伤',
  '高血压性肾损伤',
  '间质性肾炎',
  '梗阻性肾炎',
  '遗传性肾病',
  '多囊肾',
  '多脏器功能不全',
  '病因不明'
];

export const systemOptions = [
  {value: '', name: ''},
  {value: '呼吸系统', name: '呼吸系统'},
  {value: '循环系统', name: '循环系统'},
  {value: '消化系统', name: '消化系统'},
  {value: '泌尿系统', name: '泌尿系统'},
  {value: '内分泌系统', name: '内分泌系统'},
  {value: '神经系统', name: '神经系统'},
  {value: '肌肉骨骼系统', name: '肌肉骨骼系统'}
];

export const kidneyTypeOption = [
  {value: '', name: ''},
  {value: '慢性肾小球肾炎', name: '慢性肾小球肾炎'},
  {value: '隐匿型肾炎', name: '隐匿型肾炎'},
  {value: '过敏性紫癜肾', name: '过敏性紫癜肾'},
  {value: '肾盂肾炎', name: '肾盂肾炎'}
];

export const diagnosisOptions = [
  {value: '', name: ''},
  {value: '原发性肾小球疾病', name: '原发性肾小球疾病'},
  {value: '继发性肾小球疾病', name: '继发性肾小球疾病'},
  {value: '遗传性及先天性肾病', name: '遗传性及先天性肾病'},
  {value: '肾小管间质疾病', name: '肾小管间质疾病'},
  {value: '泌尿系肿瘤', name: '泌尿系肿瘤'},
  {value: '泌尿系感染和结石', name: '泌尿系感染和结石'},
  {value: '肾脏切除术后', name: '肾脏切除术后'},
  {value: '急性肾衰', name: '急性肾衰'},
  {value: '移植肾失功', name: '移植肾失功'},
  {value: '不详', name: '不详'},
];

export const patientTypeOptions = [
  {value: 'ckd', name: 'CKD'},
  {value: 'hemodialysis', name: '血液透析患者'},
  {value: 'peritoneal', name: '腹膜透析患者'}
];

export const medicareTypeOptions = [
  {value: '0', name: '城镇职工基本医疗保险（职工医保）'},
  {value: '1', name: '新型农村合作医疗（新农合）'},
  {value: '2', name: '城镇居民基本医疗保险（居民医保）'},
  {value: '3', name: '商业保险'},
  {value: '4', name: '其他'}
];

export const maritalStatusOptions = [
  {value: 'single', name: '未婚'},
  {value: 'married', name: '已婚'},
  {value: 'divorce', name: '离异'}
];

export const educationDegreeOptions = [
  {value: 'primary', name: '小学'},
  {value: 'junior', name: '初中'},
  {value: 'senior', name: '高中'},
  {value: 'college', name: '大专'},
  {value: 'bachelor', name: '本科'},
  {value: 'master', name: '硕士'},
  {value: 'doctor', name: '博士'}
];

export const petientFundLevel = [
  {value: 'level1', name: '种子'},
  {value: 'level2', name: '熟悉'},
  {value: 'level3', name: '知道'},
  {value: 'level4', name: '陌生'}
];

export const patientSource = [
  {value: '实地走访', name: '实地走访'},
  {value: '网络收集', name: '网络收集'},
  {value: '肾友会录入', name: '肾友会录入'},
  {value: '数据库原有', name: '数据库原有'}
];

export const relationOptions = [
  {value: 'parent', name: '父母'},
  {value: 'spouse', name: '配偶'},
  {value: 'child', name: '儿女'}
];

export const roleOptions = [
  {value: 'doctor', name: '医生'},
  {value: 'director', name: '主任'},
  {value: 'admin', name: '管理员'},
  {value: 'superadmin', name: '超级管理员'}
];

export const knowAboutFundOptions = [
  {value: '', name: ''},
  {value: '1级种子', name: '1级种子'},
  {value: '2级熟悉', name: '2级熟悉'},
  {value: '3级知道', name: '3级知道'},
  {value: '4级陌生', name: '4级陌生'}
];

export const patientSourceOptions = [
  {value: '实地走访', name: '实地走访'},
  {value: '网络收集', name: '网络收集'},
  {value: '肾友会录入', name: '肾友会录入'},
  {value: '数据库原有', name: '数据库原有'}
];

export const visitedOptions = [
  {value: '未走访', name: '未走访'},
  {value: '已走访', name: '已走访'}
];

export const patientColumns = {
  '编号': {
    display: '$index'
  },
  '姓名': {
    field: 'real_name', display: (name, model) => {
      const link = `/patient/${model._id}`;
      return (<Link to={link} >{name}</Link>);
    }
  },
  '性别': {
    field: 'gender', display: (gender) => {
      return gender === 'Male' ? '男' : '女';
    }
  },
  '门诊号': {
    field: 'birthday', display: 'string'
  },
  '年龄': {
    field: 'birthday', display: (birthday) => {
      return birthday.substr(0, 10);
    }
  },
  '身份证': {
    field: 'person_id', display: 'string'
  }
};

