/**
 * Created by isaac on 16/8/20.
 */
export default {
  labor: {
    base: "所属基地",
    start_time: {
      name: "起止时间",
      map: (str) => {
        const array = str.split('-');
        return array[0].trim().replace(/\./g, '-');
      }
    },
    dead_line: {
      name: "起止时间",
      map: (str) => {
        const array = str.split('-');
        return array[1].trim().replace(/\./g, '-');
      }
    },
    status: {fixed: true, value: 'Finished'},
    payment: "薪酬",
    type: {name: "劳务类型", exclude: true},
    assignee: {name: "执行人", exclude: true},
  }
}
