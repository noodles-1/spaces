package me.chowlong.userservice.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    User findByProviderEmail(String providerEmail);
    boolean existsByProviderEmail(String providerEmail);
    boolean existsByCustomUsername(String customUsername);
}
