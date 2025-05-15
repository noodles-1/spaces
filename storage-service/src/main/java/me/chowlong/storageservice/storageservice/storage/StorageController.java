package me.chowlong.storageservice.storageservice.storage;

import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import me.chowlong.storageservice.storageservice.util.ResponseHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RateLimiter(name = "storage-controller")
public class StorageController {
    public StorageController() {}

    @GetMapping("/test")
    public ResponseEntity<Object> test() {
        return ResponseHandler.generateResponse("OK!!!", HttpStatus.OK, null);
    }
}
