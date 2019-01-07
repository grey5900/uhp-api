/**
 * Created by isaac on 16/8/20.
 */
export default {
  patient: {
    real_name: "姓名",
    gender: "性别",
    person_id: "身份证号",
    mobile: "电话",
    hospital: {name: "医院", ref: 'Hospital', field: 'name'}
  },
  donate: {
    amount: {
      name: "金额",
      map: (str) => {
        return str.replace(/,/g, '');
      }
    },
    bank_card: "银行卡号",
    openning_bank: "开户行",
    date: {
      name: "时间",
      map: (str) => {
        return str.replace(/\//g, '-');
      }
    }
  }
}
