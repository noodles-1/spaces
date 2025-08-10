package me.chowlong.storageservice.storageservice.storage.dto;

import jakarta.annotation.Nonnull;
import lombok.Getter;

@Getter
public class GenerateUploadThumbnailRequestDTO {
    @Nonnull
    private String fileId;
    @Nonnull
    private String contentType;
}
