package me.chowlong.userservice.user.dto;

import jakarta.annotation.Nonnull;
import lombok.Getter;

@Getter
public class UpdateCustomUsernameDto {
    @Nonnull
    private String newCustomUsername;
}
