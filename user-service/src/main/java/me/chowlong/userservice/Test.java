package me.chowlong.userservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/users")
@RestController
public class Test {
    @GetMapping("/test")
    public String test() {
        return "hiii";
    }
}
