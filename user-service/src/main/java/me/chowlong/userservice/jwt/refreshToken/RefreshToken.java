package me.chowlong.userservice.jwt.refreshToken;

import jakarta.annotation.Nonnull;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Table(name = "refresh_token")
@Entity
@Getter
@Setter
public class RefreshToken {
    @Id
    private String accessToken;

    @Nonnull
    private String refreshToken;

    @CreationTimestamp
    private Date createdAt;
}
