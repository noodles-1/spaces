package me.chowlong.logservice.consumer;

import me.chowlong.logservice.auditLog.AuditLogDto;
import me.chowlong.logservice.auditLog.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class AuditLogConsumer {
    @Autowired
    private AuditLogService auditLogService;

    @KafkaListener(
            topics = "spaces-log-topic",
            containerFactory = "auditLogKafkaListenerContainerFactory"
    )
    public void auditLogListener(AuditLogDto auditLogDto) {
        this.auditLogService.publishAuditLog(auditLogDto);
    }
}
