package me.chowlong.storageservice.storageservice.item.dto;

import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import lombok.Getter;
import lombok.Setter;
import me.chowlong.storageservice.storageservice.enums.ItemType;

@Getter
@Setter
public class NewItemRequestDTO {
    @Nonnull
    private String name;
    @Nonnull
    private ItemType type;
    @Nullable
    private String parentId;
    @Nullable
    private String contentType;
    @Nullable
    private Long size;
}
