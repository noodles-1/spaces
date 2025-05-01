package me.chowlong.userservice.user;

import me.chowlong.userservice.auth.dto.RegisterRequestDTO;
import me.chowlong.userservice.exception.user.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User getUserById(String userId) throws UserNotFoundException {
        return this.userRepository.findById(userId)
                .orElseThrow(UserNotFoundException::new);
    }

    public User getUserByProviderUserIdAndProviderUsername(String providerUserId, String providerUsername) {
        return this.userRepository.findByProviderUserIdAndProviderUsername(providerUserId, providerUsername);
    }

    public boolean userExistsByCustomUsername(String customUsername) {
        return this.userRepository.existsByCustomUsername(customUsername);
    }

    public boolean userExistsByProviderUserIdAndProviderUsername(String providerUserId, String providerUsername) {
        return this.userRepository.existsByProviderUserIdAndProviderUsername(providerUserId, providerUsername);
    }

    public User createUser(RegisterRequestDTO registerRequestDTO) {
        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setProvider(registerRequestDTO.getProvider());
        user.setProviderUserId(registerRequestDTO.getProviderUserId());
        user.setProviderUsername(registerRequestDTO.getProviderUsername());
        user.setSetupDone(false);
        return this.userRepository.save(user);
    }

    public void updateProfilePicture(User user, String profilePictureUrl) {
        user.setProfilePictureUrl(profilePictureUrl);
        this.userRepository.save(user);
    }

    public void updateCustomUsername(User user, String newCustomUsername) {
        user.setCustomUsername(newCustomUsername);
        this.userRepository.save(user);
    }

    public void updateSetupDone(User user) {
        user.setSetupDone(true);
        this.userRepository.save(user);
    }
}
