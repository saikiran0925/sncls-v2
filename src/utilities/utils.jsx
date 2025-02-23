import { message, notification } from "antd";

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

export const showNotificationWithDescription = (type, messageContent, description = "", position = "top") => {
  notification[type]({
    message: messageContent,
    description: description,
    duration: 3,
    placement: position,
  });
};

export const timeAgo = (dateString) => {
  const now = new Date();
  const pastDate = new Date(dateString);

  const timeDifference = now - pastDate;

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (seconds > 0) {
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

export const generateISO8601 = () => {
  const now = new Date();

  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
};
