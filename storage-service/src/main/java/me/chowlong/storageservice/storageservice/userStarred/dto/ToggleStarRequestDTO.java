package me.chowlong.storageservice.storageservice.userStarred.dto;

import jakarta.annotation.Nonnull;
import lombok.Getter;

@Getter
public class ToggleStarRequestDTO {
    @Nonnull
    private String itemId;
}
