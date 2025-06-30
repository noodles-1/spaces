package me.chowlong.storageservice.storageservice.item.dto;

import jakarta.annotation.Nonnull;
import lombok.Getter;

@Getter
public class RenameItemRequestDTO {
    @Nonnull
    private String itemId;
    @Nonnull
    private String newItemName;
}
