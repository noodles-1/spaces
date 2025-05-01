package me.chowlong.userservice.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByCustomUsername(String customUsername);
    boolean existsByProviderUserIdAndProviderUsername(String providerUserId, String providerUsername);
    User findByProviderUserIdAndProviderUsername(String providerUserId, String providerUsername);
}
