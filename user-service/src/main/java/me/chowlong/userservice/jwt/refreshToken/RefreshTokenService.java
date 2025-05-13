package me.chowlong.userservice.jwt.refreshToken;

import org.springframework.stereotype.Service;

@Service
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public RefreshToken getRefreshTokenByAccessToken(String accessToken) {
        return this.refreshTokenRepository.getRefreshTokenByAccessToken(accessToken);
    }

    public void createRefreshToken(String accessToken, String generatedRefreshToken) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setAccessToken(accessToken);
        refreshToken.setRefreshToken(generatedRefreshToken);
        this.refreshTokenRepository.save(refreshToken);
    }

    public boolean refreshTokenExistsByAccessToken(String accessToken) {
        return this.refreshTokenRepository.existsByAccessToken(accessToken);
    }

    public void deleteRefreshToken(RefreshToken refreshToken) {
        this.refreshTokenRepository.delete(refreshToken);
    }
}
