package me.chowlong.storageservice.storageservice.item.dto;

import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import lombok.Getter;

@Getter
public class RenameItemRequestDTO {
    @Nonnull
    private String itemId;
    @Nullable
    private String itemFileExtension;
    @Nonnull
    private String newItemName;
}
