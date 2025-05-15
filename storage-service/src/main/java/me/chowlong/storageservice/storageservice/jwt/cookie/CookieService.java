package me.chowlong.storageservice.storageservice.jwt.cookie;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import me.chowlong.storageservice.storageservice.exception.accessToken.AccessTokenNotFoundException;
import me.chowlong.storageservice.storageservice.exception.cookie.MissingCookieException;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Optional;

@Service
public class CookieService {
    public String getSessionCookie(HttpServletRequest request) throws MissingCookieException, AccessTokenNotFoundException {
        Cookie[] requestCookies = request.getCookies();

        if (requestCookies == null) {
            throw new MissingCookieException();
        }

        Optional<Cookie> httpOnlyCookie = Arrays.stream(requestCookies)
                .filter(cookie -> cookie.getName().equals("session"))
                .findFirst();

        if (httpOnlyCookie.isEmpty()) {
            throw new AccessTokenNotFoundException();
        }

        return httpOnlyCookie.get().getValue();
    }
}
