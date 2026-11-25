package com.hirehub.jobportal.service;

import com.hirehub.jobportal.entity.Notification;
import com.hirehub.jobportal.response.PagedResponse;
import org.springframework.data.domain.Pageable;

public interface NotificationService {
    PagedResponse<Notification> getUserNotifications(Long userId, Pageable pageable);
    void markAsRead(Long notificationId);
    void markAllAsRead(Long userId);
    long getUnreadCount(Long userId);
}
