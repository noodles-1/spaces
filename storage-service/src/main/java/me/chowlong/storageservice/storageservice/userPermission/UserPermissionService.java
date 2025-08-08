package me.chowlong.storageservice.storageservice.userPermission;

import me.chowlong.storageservice.storageservice.item.Item;
import me.chowlong.storageservice.storageservice.item.ItemRepository;
import me.chowlong.storageservice.storageservice.userPermission.dto.NewUserPermissionRequestDTO;
import me.chowlong.storageservice.storageservice.userPermission.dto.UpdateUserPermissionRequestDTO;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class UserPermissionService {
    private final UserPermissionRepository userPermissionRepository;
    private final ItemRepository itemRepository;

    public UserPermissionService(UserPermissionRepository userPermissionRepository, ItemRepository itemRepository) {
        this.userPermissionRepository = userPermissionRepository;
        this.itemRepository = itemRepository;
    }

    public List<UserPermission> getUserPermissionsByUserId(String userId) {
        return this.userPermissionRepository.findUserPermissionsByUserId(userId);
    }

    public List<UserPermission> getUserPermissionsFromAncestorsByDescendantId(String descendantId) {
        return this.userPermissionRepository.findUserPermissionsFromAncestorsByDescendantId(descendantId);
    }

    public UserPermission checkExistsUserPermissionFromAncestorsByDescendantIdAndUserId(String descendantId, String userId) {
        return this.userPermissionRepository.findUserPermissionFromAncestorsByDescendantIdAndUserId(descendantId, userId);
    }

    public void createUserPermission(NewUserPermissionRequestDTO newUserPermissionRequestDTO) {
        Item item = this.itemRepository.findItemById(newUserPermissionRequestDTO.getItemId());

        UserPermission newUserPermission = new UserPermission();
        newUserPermission.setId(UUID.randomUUID().toString());
        newUserPermission.setUserId(newUserPermissionRequestDTO.getUserId());
        newUserPermission.setType(newUserPermissionRequestDTO.getType());
        newUserPermission.setItem(item);
        newUserPermission.setCreatedAt(new Date());
        newUserPermission.setUpdatedAt(new Date());

        this.userPermissionRepository.save(newUserPermission);
    }

    public void updateUserPermission(UpdateUserPermissionRequestDTO updateUserPermissionRequestDTO) {
        UserPermission userPermission = this.userPermissionRepository.findUserPermissionById(updateUserPermissionRequestDTO.getId());
        userPermission.setType(updateUserPermissionRequestDTO.getType());
        userPermission.setUpdatedAt(new Date());
        this.userPermissionRepository.save(userPermission);
    }

    public void deleteUserPermission(String id) {
        UserPermission userPermission = this.userPermissionRepository.findUserPermissionById(id);
        this.userPermissionRepository.delete(userPermission);
    }
}
