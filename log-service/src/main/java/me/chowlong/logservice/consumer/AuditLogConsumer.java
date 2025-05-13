package me.chowlong.logservice.consumer;

import me.chowlong.logservice.auditLog.AuditLogDto;
import me.chowlong.logservice.auditLog.AuditLogService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class AuditLogConsumer {
    private final AuditLogService auditLogService;

    public AuditLogConsumer(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @KafkaListener(
            topics = "spaces-log-topic",
            containerFactory = "auditLogKafkaListenerContainerFactory"
    )
    public void auditLogListener(AuditLogDto auditLogDto) {
        this.auditLogService.publishAuditLog(auditLogDto);
    }
}
