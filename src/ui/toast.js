// 封装轻提示的方法
// import { Notify } from 'vant'
// export default Notify
import { Toast } from 'vant'
// export default Toast
export default ({ type, message }) => {
  // if (type === 'danger') {
  //   type = 'fail'// toast失败图标类型叫fail才行
  // }
  Toast({
    type,
    message
  })
}
