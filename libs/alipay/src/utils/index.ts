export function generateAlipayOrderNumber() {
  // 生成当前时间戳
  const timestamp = new Date().getTime();

  // 生成随机数，取值范围为 1000 到 9999
  const randomNum = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

  // 拼接订单号
  const orderNumber = timestamp + randomNum.toString();

  return orderNumber;
}
