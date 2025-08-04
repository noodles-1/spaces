package me.chowlong.storageservice.storageservice.userStarred;

import me.chowlong.storageservice.storageservice.item.Item;
import me.chowlong.storageservice.storageservice.item.ItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserStarredService {
    private final UserStarredRepository userStarredRepository;
    private final ItemRepository itemRepository;

    public UserStarredService(UserStarredRepository userStarredRepository, ItemRepository itemRepository) {
        this.userStarredRepository = userStarredRepository;
        this.itemRepository = itemRepository;
    }

    public List<Item> getAllStarredItemsOfUser(String userId) {
        return this.itemRepository.findAllStarredItemsOfUser(userId);
    }

    public boolean checkItemStarredExists(String userId, String itemId) {
        UserStarred starred = this.userStarredRepository.findUserStarredOfItem(userId, itemId);
        return starred != null;
    }

    public void toggleItemStarred(String userId, String itemId) {
        UserStarred starred = this.userStarredRepository.findUserStarredOfItem(userId, itemId);

        if (starred == null) {
            Item item = this.itemRepository.findItemById(itemId);
            UserStarred newStarred = new UserStarred();
            newStarred.setId(UUID.randomUUID().toString());
            newStarred.setUserId(userId);
            newStarred.setItem(item);
            this.userStarredRepository.save(newStarred);
        }
        else {
            this.userStarredRepository.delete(starred);
        }
    }
}
