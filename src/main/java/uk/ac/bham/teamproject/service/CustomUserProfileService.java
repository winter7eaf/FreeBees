package uk.ac.bham.teamproject.service;

import java.util.Optional;
import uk.ac.bham.teamproject.domain.UserProfile;
import uk.ac.bham.teamproject.repository.UserProfileRepository;

public class CustomUserProfileService {

    private UserProfileRepository userProfileRepository;

    public UserProfile save(UserProfile userProfile) {
        return userProfileRepository.save(userProfile);
    }

    public Optional<UserProfile> findByUserId(Long userId) {
        return userProfileRepository.findById(userId);
    }
}
