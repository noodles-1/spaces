package me.chowlong.userservice.user;

import me.chowlong.userservice.auth.dto.LoginRequestDTO;
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

    public User getUserByProviderEmail(String providerEmail) {
        return this.userRepository.findByProviderEmail(providerEmail);
    }

    public boolean userExistsByProviderEmail(String providerEmail) {
        return this.userRepository.existsByProviderEmail(providerEmail);
    }

    public User createUser(LoginRequestDTO loginRequestDTO) {
        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setCustomUsername(loginRequestDTO.getCustomUsername());
        user.setProviderUsername(loginRequestDTO.getProviderUsername());
        user.setProviderEmail(loginRequestDTO.getProviderEmail());
        return this.userRepository.save(user);
    }
}
