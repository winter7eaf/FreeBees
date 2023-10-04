package uk.ac.bham.teamproject.service;

import java.util.Optional;
import uk.ac.bham.teamproject.domain.UserProfile;

public interface EditUserProfileService {
    UserProfile save(UserProfile userProfile);

    Optional<UserProfile> findOne(Long id);

    Iterable<UserProfile> findAll();

    void delete(Long id);

    Optional<UserProfile> findByUser(uk.ac.bham.teamproject.domain.User currentUser);

    Optional<UserProfile> findByUserLogin(String userLogin);

    UserProfile updateUserProfile(UserProfile userProfile, uk.ac.bham.teamproject.domain.User user);
}
