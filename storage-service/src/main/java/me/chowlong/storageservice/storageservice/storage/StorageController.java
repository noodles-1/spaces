package me.chowlong.storageservice.storageservice.storage;

import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import me.chowlong.storageservice.storageservice.aws.AwsService;
import me.chowlong.storageservice.storageservice.exception.userPermission.InsufficientPermissionException;
import me.chowlong.storageservice.storageservice.item.ItemService;
import me.chowlong.storageservice.storageservice.jwt.JwtService;
import me.chowlong.storageservice.storageservice.jwt.cookie.CookieService;
import me.chowlong.storageservice.storageservice.storage.dto.DuplicateFileRequestDTO;
import me.chowlong.storageservice.storageservice.storage.dto.GenerateDownloadRequestDTO;
import me.chowlong.storageservice.storageservice.storage.dto.GenerateUploadThumbnailRequestDTO;
import me.chowlong.storageservice.storageservice.userPermission.UserPermissionService;
import me.chowlong.storageservice.storageservice.util.PublicEndpointSecurityHandler;
import me.chowlong.storageservice.storageservice.util.ResponseHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RateLimiter(name = "storage-controller")
public class StorageController {
    private final AwsService awsService;
    private final UserPermissionService userPermissionService;
    private final ItemService itemService;
    private final CookieService cookieService;
    private final JwtService jwtService;

    public StorageController(
            AwsService awsService,
            UserPermissionService userPermissionService,
            ItemService itemService,
            CookieService cookieService,
            JwtService jwtService
    ) {
        this.awsService = awsService;
        this.userPermissionService = userPermissionService;
        this.itemService = itemService;
        this.cookieService = cookieService;
        this.jwtService = jwtService;
    }

    @GetMapping("/generate-upload-url")
    public ResponseEntity<Object> generateUploadUrl(
            @NonNull @RequestParam("contentType") String contentType
    ) {
        String fileId = UUID.randomUUID().toString();
        String uploadUrl = this.awsService.generateUploadUrl(fileId, contentType);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("uploadUrl", uploadUrl);
        responseData.put("fileId", fileId);
        return ResponseHandler.generateResponse("Generated pre-signed upload URL successfully.", HttpStatus.OK, responseData);
    }

    @PostMapping("/generate-thumbnail-upload-url")
    public ResponseEntity<Object> generateThumbnailUploadUrl(@Valid @RequestBody GenerateUploadThumbnailRequestDTO generateUploadThumbnailRequestDTO) {
        String uploadUrl = this.awsService.generateThumbnailUploadUrl(generateUploadThumbnailRequestDTO);
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("uploadUrl", uploadUrl);
        return ResponseHandler.generateResponse("Generated pre-signed thumbnail upload URL.", HttpStatus.OK, responseData);
    }

    @PostMapping("/public/generate-download-url")
    public ResponseEntity<Object> generateDownloadUrl(
            @NonNull HttpServletRequest request,
            @Valid @RequestBody GenerateDownloadRequestDTO generateDownloadRequestDTO
    ) throws InsufficientPermissionException  {
        PublicEndpointSecurityHandler publicEndpointSecurityHandler = new PublicEndpointSecurityHandler(this.userPermissionService, this.itemService, this.cookieService, this.jwtService);
        publicEndpointSecurityHandler.handlePublicEndpoint(request, generateDownloadRequestDTO.getFileId());

        String downloadUrl = this.awsService.generateDownloadUrl(generateDownloadRequestDTO);
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("downloadUrl", downloadUrl);
        return ResponseHandler.generateResponse("Generated pre-signed download URL successfully.", HttpStatus.OK, responseData);
    }

    @PostMapping("/public/generate-thumbnail-download-url")
    public ResponseEntity<Object> generateThumbnailDownloadUrl(
            @NonNull HttpServletRequest request,
            @Valid @RequestBody GenerateDownloadRequestDTO generateDownloadRequestDTO
    ) throws InsufficientPermissionException  {
        PublicEndpointSecurityHandler publicEndpointSecurityHandler = new PublicEndpointSecurityHandler(this.userPermissionService, this.itemService, this.cookieService, this.jwtService);
        publicEndpointSecurityHandler.handlePublicEndpoint(request, generateDownloadRequestDTO.getFileId());

        String downloadUrl = this.awsService.generateThumbnailDownloadUrl(generateDownloadRequestDTO);
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("downloadUrl", downloadUrl);
        return ResponseHandler.generateResponse("Generated pre-signed thumbnail download URL.", HttpStatus.OK, responseData);
    }

    @PostMapping("/duplicate")
    public ResponseEntity<Object> duplicateFile(@Valid @RequestBody DuplicateFileRequestDTO duplicateFileRequestDTO) {
        this.awsService.duplicateObject(duplicateFileRequestDTO.getSourceKey(), duplicateFileRequestDTO.getDestinationKey());
        return ResponseHandler.generateResponse("Duplicated file successfully.", HttpStatus.OK, null);
    }

    @PostMapping("/duplicate-thumbnail")
    public ResponseEntity<Object> duplicateVideo(@Valid @RequestBody DuplicateFileRequestDTO duplicateFileRequestDTO) {
        this.awsService.duplicateThumbnail(duplicateFileRequestDTO.getSourceKey(), duplicateFileRequestDTO.getDestinationKey());
        return ResponseHandler.generateResponse("Duplicated thumbnail successfully.", HttpStatus.OK, null);
    }

    @DeleteMapping("/generate-delete-url/{keyName}")
    public ResponseEntity<Object> generateDeleteUrl(@PathVariable("keyName") String keyName) {
        String deleteUrl = this.awsService.generateDeleteUrl(keyName);
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("deleteUrl", deleteUrl);
        return ResponseHandler.generateResponse("Generated pre-signed delete URL successfully.", HttpStatus.OK, responseData);
    }

    @DeleteMapping("/generate-thumbnail-delete-url/{keyName}")
    public ResponseEntity<Object> generateThumbnailDeleteUrl(@PathVariable("keyName") String keyName) {
        String deleteUrl = this.awsService.generateThumbnailDeleteUrl(keyName);
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("deleteUrl", deleteUrl);
        return ResponseHandler.generateResponse("Generated pre-signed thumbnail delete URL.", HttpStatus.OK, responseData);
    }
}
