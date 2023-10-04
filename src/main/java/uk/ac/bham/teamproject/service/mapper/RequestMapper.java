package uk.ac.bham.teamproject.service.mapper;

import org.mapstruct.*;
import uk.ac.bham.teamproject.domain.Item;
import uk.ac.bham.teamproject.domain.Request;
import uk.ac.bham.teamproject.domain.User;
import uk.ac.bham.teamproject.service.dto.RequestDTO;
import uk.ac.bham.teamproject.service.dto.RequestItemDTO;
import uk.ac.bham.teamproject.service.dto.RequestUserDTO;

@Mapper(componentModel = "spring")
public interface RequestMapper extends EntityMapper<RequestDTO, Request> {
    @Mapping(target = "requester", source = "requester", qualifiedByName = "userLogin")
    @Mapping(target = "requestee", source = "requestee", qualifiedByName = "userLogin")
    @Mapping(target = "item", source = "item", qualifiedByName = "itemId")
    RequestDTO toDto(Request s);

    @Named("userLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    RequestUserDTO toDtoUserLogin(User user);

    @Named("itemId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    RequestItemDTO toDtoItemId(Item item);
}
