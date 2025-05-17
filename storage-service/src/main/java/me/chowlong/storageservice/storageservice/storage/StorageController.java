package me.chowlong.storageservice.storageservice.storage;

import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import me.chowlong.storageservice.storageservice.aws.AwsService;
import me.chowlong.storageservice.storageservice.principal.UserPrincipal;
import me.chowlong.storageservice.storageservice.util.ResponseHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RateLimiter(name = "storage-controller")
public class StorageController {
    private final AwsService awsService;

    public StorageController(AwsService awsService) {
        this.awsService = awsService;
    }

    @GetMapping("/generate-upload-url")
    public ResponseEntity<Object> generateUploadUrl(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @NonNull @RequestParam("fileName") String fileName,
            @NonNull @RequestParam("contentType") String contentType
    ) {
        String keyName = String.format("%s/%s", userPrincipal.getUserId(), fileName);
        String uploadUrl = this.awsService.generateUploadUrl(keyName, contentType);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("uploadUrl", uploadUrl);
        return ResponseHandler.generateResponse("Generated pre-signed upload URL successfully.", HttpStatus.OK, responseData);
    }
}
