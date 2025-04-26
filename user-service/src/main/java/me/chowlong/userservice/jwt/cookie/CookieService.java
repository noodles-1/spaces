package me.chowlong.userservice.jwt.cookie;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import me.chowlong.userservice.exception.accessToken.AccessTokenNotFoundException;
import me.chowlong.userservice.exception.cookie.MissingCookieException;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Optional;

@Service
public class CookieService {
    public void setSessionCookie(HttpServletResponse response, String cookieValue) {
        Cookie cookie = new Cookie("session", cookieValue);
        cookie.setMaxAge(30 * 24 * 60 * 60);
        cookie.setSecure(true);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);
    }

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

    public void deleteSessionCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("session", null);
        cookie.setMaxAge(0);
        cookie.setSecure(true);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);
    }
}
