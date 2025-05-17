package me.chowlong.storageservice.storageservice.principal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserPrincipal {
    private String userId;
    private String accessToken;
}
