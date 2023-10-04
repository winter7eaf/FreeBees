package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.bham.teamproject.IntegrationTest;
import uk.ac.bham.teamproject.domain.User;
import uk.ac.bham.teamproject.domain.UserRate;
import uk.ac.bham.teamproject.repository.UserRateRepository;

/**
 * Integration tests for the {@link UserRateResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class UserRateResourceIT {

    private static final Integer DEFAULT_RATE_AS_GIVER = 0;
    private static final Integer UPDATED_RATE_AS_GIVER = 1;

    private static final Integer DEFAULT_RATE_AS_RECEIVER = 0;
    private static final Integer UPDATED_RATE_AS_RECEIVER = 1;

    private static final String ENTITY_API_URL = "/api/user-rates";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserRateRepository userRateRepository;

    @Mock
    private UserRateRepository userRateRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserRateMockMvc;

    private UserRate userRate;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserRate createEntity(EntityManager em) {
        UserRate userRate = new UserRate().rateAsGiver(DEFAULT_RATE_AS_GIVER).rateAsReceiver(DEFAULT_RATE_AS_RECEIVER);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        userRate.setUser(user);
        return userRate;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserRate createUpdatedEntity(EntityManager em) {
        UserRate userRate = new UserRate().rateAsGiver(UPDATED_RATE_AS_GIVER).rateAsReceiver(UPDATED_RATE_AS_RECEIVER);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        userRate.setUser(user);
        return userRate;
    }

    @BeforeEach
    public void initTest() {
        userRate = createEntity(em);
    }

    @Test
    @Transactional
    void createUserRate() throws Exception {
        int databaseSizeBeforeCreate = userRateRepository.findAll().size();
        // Create the UserRate
        restUserRateMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userRate)))
            .andExpect(status().isCreated());

        // Validate the UserRate in the database
        List<UserRate> userRateList = userRateRepository.findAll();
        assertThat(userRateList).hasSize(databaseSizeBeforeCreate + 1);
        UserRate testUserRate = userRateList.get(userRateList.size() - 1);
        assertThat(testUserRate.getRateAsGiver()).isEqualTo(DEFAULT_RATE_AS_GIVER);
        assertThat(testUserRate.getRateAsReceiver()).isEqualTo(DEFAULT_RATE_AS_RECEIVER);
    }

    @Test
    @Transactional
    void createUserRateWithExistingId() throws Exception {
        // Create the UserRate with an existing ID
        userRate.setId(1L);

        int databaseSizeBeforeCreate = userRateRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserRateMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userRate)))
            .andExpect(status().isBadRequest());

        // Validate the UserRate in the database
        List<UserRate> userRateList = userRateRepository.findAll();
        assertThat(userRateList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkRateAsGiverIsRequired() throws Exception {
        int databaseSizeBeforeTest = userRateRepository.findAll().size();
        // set the field null
        userRate.setRateAsGiver(null);

        // Create the UserRate, which fails.

        restUserRateMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userRate)))
            .andExpect(status().isBadRequest());

        List<UserRate> userRateList = userRateRepository.findAll();
        assertThat(userRateList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkRateAsReceiverIsRequired() throws Exception {
        int databaseSizeBeforeTest = userRateRepository.findAll().size();
        // set the field null
        userRate.setRateAsReceiver(null);

        // Create the UserRate, which fails.

        restUserRateMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userRate)))
            .andExpect(status().isBadRequest());

        List<UserRate> userRateList = userRateRepository.findAll();
        assertThat(userRateList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllUserRates() throws Exception {
        // Initialize the database
        userRateRepository.saveAndFlush(userRate);

        // Get all the userRateList
        restUserRateMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userRate.getId().intValue())))
            .andExpect(jsonPath("$.[*].rateAsGiver").value(hasItem(DEFAULT_RATE_AS_GIVER)))
            .andExpect(jsonPath("$.[*].rateAsReceiver").value(hasItem(DEFAULT_RATE_AS_RECEIVER)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllUserRatesWithEagerRelationshipsIsEnabled() throws Exception {
        when(userRateRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restUserRateMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(userRateRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllUserRatesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(userRateRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restUserRateMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(userRateRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getUserRate() throws Exception {
        // Initialize the database
        userRateRepository.saveAndFlush(userRate);

        // Get the userRate
        restUserRateMockMvc
            .perform(get(ENTITY_API_URL_ID, userRate.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userRate.getId().intValue()))
            .andExpect(jsonPath("$.rateAsGiver").value(DEFAULT_RATE_AS_GIVER))
            .andExpect(jsonPath("$.rateAsReceiver").value(DEFAULT_RATE_AS_RECEIVER));
    }

    @Test
    @Transactional
    void getNonExistingUserRate() throws Exception {
        // Get the userRate
        restUserRateMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUserRate() throws Exception {
        // Initialize the database
        userRateRepository.saveAndFlush(userRate);

        int databaseSizeBeforeUpdate = userRateRepository.findAll().size();

        // Update the userRate
        UserRate updatedUserRate = userRateRepository.findById(userRate.getId()).get();
        // Disconnect from session so that the updates on updatedUserRate are not directly saved in db
        em.detach(updatedUserRate);
        updatedUserRate.rateAsGiver(UPDATED_RATE_AS_GIVER).rateAsReceiver(UPDATED_RATE_AS_RECEIVER);

        restUserRateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserRate.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserRate))
            )
            .andExpect(status().isOk());

        // Validate the UserRate in the database
        List<UserRate> userRateList = userRateRepository.findAll();
        assertThat(userRateList).hasSize(databaseSizeBeforeUpdate);
        UserRate testUserRate = userRateList.get(userRateList.size() - 1);
        assertThat(testUserRate.getRateAsGiver()).isEqualTo(UPDATED_RATE_AS_GIVER);
        assertThat(testUserRate.getRateAsReceiver()).isEqualTo(UPDATED_RATE_AS_RECEIVER);
    }

    @Test
    @Transactional
    void putNonExistingUserRate() throws Exception {
        int databaseSizeBeforeUpdate = userRateRepository.findAll().size();
        userRate.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserRateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userRate.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userRate))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserRate in the database
        List<UserRate> userRateList = userRateRepository.findAll();
        assertThat(userRateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserRate() throws Exception {
        int databaseSizeBeforeUpdate = userRateRepository.findAll().size();
        userRate.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserRateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userRate))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserRate in the database
        List<UserRate> userRateList = userRateRepository.findAll();
        assertThat(userRateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserRate() throws Exception {
        int databaseSizeBeforeUpdate = userRateRepository.findAll().size();
        userRate.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserRateMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userRate)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserRate in the database
        List<UserRate> userRateList = userRateRepository.findAll();
        assertThat(userRateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserRateWithPatch() throws Exception {
        // Initialize the database
        userRateRepository.saveAndFlush(userRate);

        int databaseSizeBeforeUpdate = userRateRepository.findAll().size();

        // Update the userRate using partial update
        UserRate partialUpdatedUserRate = new UserRate();
        partialUpdatedUserRate.setId(userRate.getId());

        restUserRateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserRate.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserRate))
            )
            .andExpect(status().isOk());

        // Validate the UserRate in the database
        List<UserRate> userRateList = userRateRepository.findAll();
        assertThat(userRateList).hasSize(databaseSizeBeforeUpdate);
        UserRate testUserRate = userRateList.get(userRateList.size() - 1);
        assertThat(testUserRate.getRateAsGiver()).isEqualTo(DEFAULT_RATE_AS_GIVER);
        assertThat(testUserRate.getRateAsReceiver()).isEqualTo(DEFAULT_RATE_AS_RECEIVER);
    }

    @Test
    @Transactional
    void fullUpdateUserRateWithPatch() throws Exception {
        // Initialize the database
        userRateRepository.saveAndFlush(userRate);

        int databaseSizeBeforeUpdate = userRateRepository.findAll().size();

        // Update the userRate using partial update
        UserRate partialUpdatedUserRate = new UserRate();
        partialUpdatedUserRate.setId(userRate.getId());

        partialUpdatedUserRate.rateAsGiver(UPDATED_RATE_AS_GIVER).rateAsReceiver(UPDATED_RATE_AS_RECEIVER);

        restUserRateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserRate.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserRate))
            )
            .andExpect(status().isOk());

        // Validate the UserRate in the database
        List<UserRate> userRateList = userRateRepository.findAll();
        assertThat(userRateList).hasSize(databaseSizeBeforeUpdate);
        UserRate testUserRate = userRateList.get(userRateList.size() - 1);
        assertThat(testUserRate.getRateAsGiver()).isEqualTo(UPDATED_RATE_AS_GIVER);
        assertThat(testUserRate.getRateAsReceiver()).isEqualTo(UPDATED_RATE_AS_RECEIVER);
    }

    @Test
    @Transactional
    void patchNonExistingUserRate() throws Exception {
        int databaseSizeBeforeUpdate = userRateRepository.findAll().size();
        userRate.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserRateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userRate.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userRate))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserRate in the database
        List<UserRate> userRateList = userRateRepository.findAll();
        assertThat(userRateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserRate() throws Exception {
        int databaseSizeBeforeUpdate = userRateRepository.findAll().size();
        userRate.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserRateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userRate))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserRate in the database
        List<UserRate> userRateList = userRateRepository.findAll();
        assertThat(userRateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserRate() throws Exception {
        int databaseSizeBeforeUpdate = userRateRepository.findAll().size();
        userRate.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserRateMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(userRate)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserRate in the database
        List<UserRate> userRateList = userRateRepository.findAll();
        assertThat(userRateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserRate() throws Exception {
        // Initialize the database
        userRateRepository.saveAndFlush(userRate);

        int databaseSizeBeforeDelete = userRateRepository.findAll().size();

        // Delete the userRate
        restUserRateMockMvc
            .perform(delete(ENTITY_API_URL_ID, userRate.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserRate> userRateList = userRateRepository.findAll();
        assertThat(userRateList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
