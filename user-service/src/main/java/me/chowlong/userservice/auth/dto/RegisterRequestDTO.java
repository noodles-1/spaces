package me.chowlong.userservice.auth.dto;

import jakarta.annotation.Nonnull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequestDTO {
    @Nonnull
    private String provider;
    @Nonnull
    private String providerUserId;
    @Nonnull
    private String providerUsername;
}
