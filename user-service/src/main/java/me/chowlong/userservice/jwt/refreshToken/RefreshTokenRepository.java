package me.chowlong.userservice.jwt.refreshToken;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
    RefreshToken getRefreshTokenByAccessToken(String accessToken);
    boolean existsByAccessToken(String accessToken);
}
