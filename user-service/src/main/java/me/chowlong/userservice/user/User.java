package me.chowlong.userservice.user;

import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;

@Table(name = "users")
@Entity
@Setter
@Getter
public class User {
    @Id
    private String id;

    @Nullable
    private String customUsername;

    @Nonnull
    private String provider;

    @Nonnull
    private String providerUserId;

    @Nonnull
    private String providerUsername;

    @Nullable
    private String profilePictureUrl;

    @Nonnull
    private Boolean setupDone = false;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;
}
