package me.chowlong.userservice.user.dto;

import jakarta.annotation.Nonnull;
import lombok.Getter;

@Getter
public class UpdateCustomUsernameDTO {
    @Nonnull
    private String newCustomUsername;
}
