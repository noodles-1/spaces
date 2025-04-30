package me.chowlong.logservice.auditLog;

import jakarta.annotation.Nonnull;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Table(name = "audit_logs")
@Entity
@Getter
@Setter
public class AuditLog {
    @Id
    private String id;

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
