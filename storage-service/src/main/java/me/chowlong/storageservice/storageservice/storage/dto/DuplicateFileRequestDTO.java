package me.chowlong.storageservice.storageservice.storage.dto;

import jakarta.annotation.Nonnull;
import lombok.Getter;

@Getter
public class DuplicateFileRequestDTO {
    @Nonnull
    private String sourceKey;
    @Nonnull
    private String destinationKey;
}
