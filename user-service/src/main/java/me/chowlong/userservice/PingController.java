package me.chowlong.userservice;

import me.chowlong.userservice.util.ResponseHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PingController {
    @GetMapping("/ping")
    public ResponseEntity<Object> ping() {
        return ResponseHandler.generateResponse("pong", HttpStatus.OK, null);
    }
}
