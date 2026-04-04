package com.luv2code.spring_boot_library.mapper;

import com.luv2code.spring_boot_library.dto.UserDtos;
import com.luv2code.spring_boot_library.entity.AppUser;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", constant = "USER")
    @Mapping(target = "password", ignore = true)
    AppUser toEntity(UserDtos.SignupRequest request);

    UserDtos.UserInfo toUserInfo(AppUser user);

    @Mapping(target = "user", source = "user")
    @Mapping(target = "token", source = "token")
    @Mapping(target = "isNewUser", source = "isNewUser")
    UserDtos.LoginResponse toLoginResponse(AppUser user, String token, Boolean isNewUser);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", constant = "")
    @Mapping(target = "role", constant = "USER")
    AppUser fromGoogle(UserDtos.GoogleUser googleUser);
}
