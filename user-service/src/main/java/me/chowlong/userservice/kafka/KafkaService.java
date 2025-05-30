package me.chowlong.userservice.kafka;

import me.chowlong.userservice.auditLog.AuditLogDto;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class KafkaService {
    private final KafkaTemplate<String, AuditLogDto> kafkaTemplate;

    public KafkaService(KafkaTemplate<String, AuditLogDto> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @Async
    public void produceLog(AuditLogDto auditLogDto) {
        this.kafkaTemplate.send("spaces-log-topic", auditLogDto);
    }
}
