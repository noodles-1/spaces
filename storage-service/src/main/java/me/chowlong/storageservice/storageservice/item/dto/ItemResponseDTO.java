package me.chowlong.storageservice.storageservice.item.dto;

import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import me.chowlong.storageservice.storageservice.enums.ItemType;
import me.chowlong.storageservice.storageservice.item.Item;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ItemResponseDTO {
    @Nonnull
    private String id;
    @Nonnull
    private String name;
    @Nullable
    private String ownerUserId;
    @Nonnull
    private ItemType type;
    @Nullable
    private String contentType;
    @Nullable
    private Long size;
    @Nonnull
    private boolean isRoot;
    @Nullable
    private boolean isStarred;
    @Nullable
    private List<Item> children;
    @Nullable
    private String accessibleParentId;
    @Nonnull
    private Date createdAt;
    @Nonnull
    private Date updatedAt;
}
