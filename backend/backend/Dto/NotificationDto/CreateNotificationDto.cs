﻿namespace backend.Dto.NotificationDto
{
    public class CreateNotificationDto
    {
        public int UserId { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
