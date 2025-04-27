package me.chowlong.userservice.auth.dto;

import jakarta.annotation.Nonnull;
import lombok.Getter;

@Getter
public class AuthRequestDTO {
    @Nonnull
    private String customUsername;
    @Nonnull
    private String providerUsername;
    @Nonnull
    private String providerEmail;
}
