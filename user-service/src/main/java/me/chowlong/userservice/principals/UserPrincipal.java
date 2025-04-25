package me.chowlong.userservice.principals;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import me.chowlong.userservice.user.User;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserPrincipal {
    private User user;
    private String accessToken;
}
