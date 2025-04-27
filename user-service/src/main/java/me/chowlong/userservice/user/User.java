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

    @Nonnull
    private String customUsername;

    @Nonnull
    private String providerUsername;

    @Nonnull
    private String providerEmail;

    @Nullable
    private String profilePictureUrl;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;
}
