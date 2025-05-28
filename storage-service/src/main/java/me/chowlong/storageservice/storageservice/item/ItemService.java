package me.chowlong.storageservice.storageservice.item;

import me.chowlong.storageservice.storageservice.enums.ItemType;
import me.chowlong.storageservice.storageservice.item.dto.NewItemRequestDTO;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class ItemService {
    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public List<Item> getChildrenByParentId(String parentId) {
        return this.itemRepository.findChildrenById(parentId);
    }

    public List<Item> getAccessibleRootChildren(String userId) {
        return this.itemRepository.findAccessibleRootChildren(userId);
    }

    public List<Item> getInaccessibleRootChildren(String userId) {
        return this.itemRepository.findInaccessibleRootChildren(userId);
    }

    public void createUserMainDirectories(String userId) {
        Item userMainAccessibleDirectory = new Item();
        userMainAccessibleDirectory.setId(UUID.randomUUID().toString());
        userMainAccessibleDirectory.setName(userId);
        userMainAccessibleDirectory.setOwnerUserId(userId);
        userMainAccessibleDirectory.setType(ItemType.FOLDER);
        userMainAccessibleDirectory.setRoot(false);
        userMainAccessibleDirectory.setCreatedAt(new Date());
        userMainAccessibleDirectory.setUpdatedAt(new Date());

        Item userMainInaccessibleDirectory = new Item();
        userMainInaccessibleDirectory.setId(UUID.randomUUID().toString());
        userMainInaccessibleDirectory.setName(userId);
        userMainInaccessibleDirectory.setOwnerUserId(userId);
        userMainInaccessibleDirectory.setType(ItemType.FOLDER);
        userMainInaccessibleDirectory.setRoot(false);
        userMainInaccessibleDirectory.setCreatedAt(new Date());
        userMainInaccessibleDirectory.setUpdatedAt(new Date());

        Item accessibleRoot = this.itemRepository.findItemByName("ACCESSIBLE");
        Item inaccessibleRoot = this.itemRepository.findItemByName("INACCESSIBLE");
        accessibleRoot.getChildren().add(userMainAccessibleDirectory);
        inaccessibleRoot.getChildren().add(userMainInaccessibleDirectory);
        this.itemRepository.save(accessibleRoot);
        this.itemRepository.save(inaccessibleRoot);
    }

    public Item createItem(NewItemRequestDTO newItemDTO, String userId) {
        Item newItem = new Item();
        newItem.setId(UUID.randomUUID().toString());
        newItem.setName(newItemDTO.getName());
        newItem.setOwnerUserId(userId);
        newItem.setType(newItemDTO.getType());
        newItem.setContentType(newItemDTO.getContentType());
        newItem.setSize(newItemDTO.getSize());
        newItem.setRoot(false);
        newItem.setCreatedAt(new Date());
        newItem.setUpdatedAt(new Date());

        Item parentItem;

        if (newItemDTO.getParentId() != null) {
            parentItem = this.itemRepository.findItemById(newItemDTO.getParentId());
        }
        else {
            parentItem = this.itemRepository.findMainAccessibleDirectory(userId);
        }

        parentItem.getChildren().add(newItem);
        this.itemRepository.save(parentItem);

        return newItem;
    }
}
