package me.chowlong.logservice.auditLog;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuditLogService {
    @Autowired
    private AuditLogRepository auditLogRepository;

    public void publishAuditLog(AuditLogDto auditLogDto) {
        AuditLog auditLog = new AuditLog();
        auditLog.setId(UUID.randomUUID().toString());
        auditLog.setUserId(auditLogDto.getUserId());
        auditLog.setAction(auditLogDto.getAction());
        auditLog.setEndpoint(auditLogDto.getEndpoint());
        auditLog.setMethod(auditLogDto.getMethod());
        auditLog.setTimestamp(auditLogDto.getTimestamp());
        this.auditLogRepository.save(auditLog);
    }
}
