package me.chowlong.storageservice.storageservice.item;

import me.chowlong.storageservice.storageservice.item.dto.NewItemDTO;
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

    public Item createItem(NewItemDTO newItemDTO) {
        Item newItem = new Item();
        newItem.setId(UUID.randomUUID().toString());
        newItem.setName(newItemDTO.getName());
        newItem.setType(newItemDTO.getType());
        newItem.setContentType(newItemDTO.getContentType());
        newItem.setRoot(false);
        newItem.setCreatedAt(new Date());
        newItem.setUpdatedAt(new Date());

        Item parentItem;

        if (newItemDTO.getParentId() != null) {
            parentItem = this.itemRepository.findItemById(newItemDTO.getParentId());
        }
        else {
            parentItem = this.itemRepository.findItemByName("ACCESSIBLE");
        }

        parentItem.getChildren().add(newItem);
        this.itemRepository.save(parentItem);

        return newItem;
    }
}
