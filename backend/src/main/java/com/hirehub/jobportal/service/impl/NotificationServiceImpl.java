package com.hirehub.jobportal.service.impl;

import com.hirehub.jobportal.entity.Notification;
import com.hirehub.jobportal.exception.ResourceNotFoundException;
import com.hirehub.jobportal.repository.NotificationRepository;
import com.hirehub.jobportal.response.PagedResponse;
import com.hirehub.jobportal.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<Notification> getUserNotifications(Long userId, Pageable pageable) {
        return PagedResponse.from(notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable));
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));
        n.setRead(true);
        notificationRepository.save(n);
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        var notifs = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, Pageable.unpaged()).getContent();
        notifs.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifs);
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }
}
