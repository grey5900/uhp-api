export default {
  patient: {
    real_name: "姓名",
    gender: {name: "性别", map: {"0": "Female", "1": "Male"}},
    birthday: {
      name: "生日",
      map: (str) => {
        return str.replace(/\//g, '-');
      }
    },
    person_id: "身份证",
    first_treatment: "透析时间",
    city: "城市",
    address_detail: "地址",
    mobile: "电话1",
    mobile2: "电话2"
  },
  /*
   donate: {
   amount: "金额",
   bank_card: "银行卡号",
   openning_bank: "开户行",
   date: {"fixed": true, "value": "2016-08-03"}
   }
   */
}
