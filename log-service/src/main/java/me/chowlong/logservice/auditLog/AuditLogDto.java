package me.chowlong.logservice.auditLog;

import jakarta.annotation.Nonnull;
import lombok.Getter;

import java.time.Instant;

@Getter
public class AuditLogDto {
    @Nonnull
    private String userId;
    @Nonnull
    private String action; // what user did
    @Nonnull
    private String endpoint; // what endpoint user accessed
    @Nonnull
    private String method; // GET, POST, etc...
    @Nonnull
    private Instant timestamp;
}
