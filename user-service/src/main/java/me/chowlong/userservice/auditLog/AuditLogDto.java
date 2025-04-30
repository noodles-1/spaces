package me.chowlong.userservice.auditLog;

import jakarta.annotation.Nonnull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
