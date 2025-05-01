package me.chowlong.userservice.auth.dto;

import jakarta.annotation.Nonnull;
import lombok.Getter;

@Getter
public class LoginRequestDTO {
    @Nonnull
    private String code;
}
