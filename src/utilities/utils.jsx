import { message } from "antd";

export const showNotification = (type, messageContent) => {
  switch (type) {
    case 'success':
      message.success(messageContent, 3);
      break;
    case 'error':
      message.error(messageContent, 3);
      break;
    case 'info':
      message.info(messageContent, 3);
      break;
    case 'warning':
      message.warning(messageContent, 3);
      break;
    default:
      message.info(messageContent, 3);
  }
};
