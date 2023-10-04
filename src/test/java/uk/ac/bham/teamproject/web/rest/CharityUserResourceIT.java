package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;
import uk.ac.bham.teamproject.IntegrationTest;
import uk.ac.bham.teamproject.domain.CharityUser;
import uk.ac.bham.teamproject.repository.CharityUserRepository;

/**
 * Integration tests for the {@link CharityUserResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CharityUserResourceIT {

    private static final String DEFAULT_CHARITY_NAME = "AAAAAAAAAA";
    private static final String UPDATED_CHARITY_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_LOGO_URL = "AAAAAAAAAA";
    private static final String UPDATED_LOGO_URL = "BBBBBBBBBB";

    private static final String DEFAULT_WEBSITE = "AAAAAAAAAA";
    private static final String UPDATED_WEBSITE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/charity-users";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CharityUserRepository charityUserRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCharityUserMockMvc;

    private CharityUser charityUser;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CharityUser createEntity(EntityManager em) {
        CharityUser charityUser = new CharityUser()
            .charityName(DEFAULT_CHARITY_NAME)
            .description(DEFAULT_DESCRIPTION)
            .logoURL(DEFAULT_LOGO_URL)
            .website(DEFAULT_WEBSITE);
        return charityUser;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CharityUser createUpdatedEntity(EntityManager em) {
        CharityUser charityUser = new CharityUser()
            .charityName(UPDATED_CHARITY_NAME)
            .description(UPDATED_DESCRIPTION)
            .logoURL(UPDATED_LOGO_URL)
            .website(UPDATED_WEBSITE);
        return charityUser;
    }

    @BeforeEach
    public void initTest() {
        charityUser = createEntity(em);
    }

    @Test
    @Transactional
    void createCharityUser() throws Exception {
        int databaseSizeBeforeCreate = charityUserRepository.findAll().size();
        // Create the CharityUser
        restCharityUserMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(charityUser)))
            .andExpect(status().isCreated());

        // Validate the CharityUser in the database
        List<CharityUser> charityUserList = charityUserRepository.findAll();
        assertThat(charityUserList).hasSize(databaseSizeBeforeCreate + 1);
        CharityUser testCharityUser = charityUserList.get(charityUserList.size() - 1);
        assertThat(testCharityUser.getCharityName()).isEqualTo(DEFAULT_CHARITY_NAME);
        assertThat(testCharityUser.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testCharityUser.getLogoURL()).isEqualTo(DEFAULT_LOGO_URL);
        assertThat(testCharityUser.getWebsite()).isEqualTo(DEFAULT_WEBSITE);
    }

    @Test
    @Transactional
    void createCharityUserWithExistingId() throws Exception {
        // Create the CharityUser with an existing ID
        charityUser.setId(1L);

        int databaseSizeBeforeCreate = charityUserRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCharityUserMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(charityUser)))
            .andExpect(status().isBadRequest());

        // Validate the CharityUser in the database
        List<CharityUser> charityUserList = charityUserRepository.findAll();
        assertThat(charityUserList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCharityUsers() throws Exception {
        // Initialize the database
        charityUserRepository.saveAndFlush(charityUser);

        // Get all the charityUserList
        restCharityUserMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(charityUser.getId().intValue())))
            .andExpect(jsonPath("$.[*].charityName").value(hasItem(DEFAULT_CHARITY_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].logoURL").value(hasItem(DEFAULT_LOGO_URL)))
            .andExpect(jsonPath("$.[*].website").value(hasItem(DEFAULT_WEBSITE)));
    }

    @Test
    @Transactional
    void getCharityUser() throws Exception {
        // Initialize the database
        charityUserRepository.saveAndFlush(charityUser);

        // Get the charityUser
        restCharityUserMockMvc
            .perform(get(ENTITY_API_URL_ID, charityUser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(charityUser.getId().intValue()))
            .andExpect(jsonPath("$.charityName").value(DEFAULT_CHARITY_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.logoURL").value(DEFAULT_LOGO_URL))
            .andExpect(jsonPath("$.website").value(DEFAULT_WEBSITE));
    }

    @Test
    @Transactional
    void getNonExistingCharityUser() throws Exception {
        // Get the charityUser
        restCharityUserMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCharityUser() throws Exception {
        // Initialize the database
        charityUserRepository.saveAndFlush(charityUser);

        int databaseSizeBeforeUpdate = charityUserRepository.findAll().size();

        // Update the charityUser
        CharityUser updatedCharityUser = charityUserRepository.findById(charityUser.getId()).get();
        // Disconnect from session so that the updates on updatedCharityUser are not directly saved in db
        em.detach(updatedCharityUser);
        updatedCharityUser
            .charityName(UPDATED_CHARITY_NAME)
            .description(UPDATED_DESCRIPTION)
            .logoURL(UPDATED_LOGO_URL)
            .website(UPDATED_WEBSITE);

        restCharityUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCharityUser.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCharityUser))
            )
            .andExpect(status().isOk());

        // Validate the CharityUser in the database
        List<CharityUser> charityUserList = charityUserRepository.findAll();
        assertThat(charityUserList).hasSize(databaseSizeBeforeUpdate);
        CharityUser testCharityUser = charityUserList.get(charityUserList.size() - 1);
        assertThat(testCharityUser.getCharityName()).isEqualTo(UPDATED_CHARITY_NAME);
        assertThat(testCharityUser.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCharityUser.getLogoURL()).isEqualTo(UPDATED_LOGO_URL);
        assertThat(testCharityUser.getWebsite()).isEqualTo(UPDATED_WEBSITE);
    }

    @Test
    @Transactional
    void putNonExistingCharityUser() throws Exception {
        int databaseSizeBeforeUpdate = charityUserRepository.findAll().size();
        charityUser.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCharityUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, charityUser.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(charityUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the CharityUser in the database
        List<CharityUser> charityUserList = charityUserRepository.findAll();
        assertThat(charityUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCharityUser() throws Exception {
        int databaseSizeBeforeUpdate = charityUserRepository.findAll().size();
        charityUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCharityUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(charityUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the CharityUser in the database
        List<CharityUser> charityUserList = charityUserRepository.findAll();
        assertThat(charityUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCharityUser() throws Exception {
        int databaseSizeBeforeUpdate = charityUserRepository.findAll().size();
        charityUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCharityUserMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(charityUser)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CharityUser in the database
        List<CharityUser> charityUserList = charityUserRepository.findAll();
        assertThat(charityUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCharityUserWithPatch() throws Exception {
        // Initialize the database
        charityUserRepository.saveAndFlush(charityUser);

        int databaseSizeBeforeUpdate = charityUserRepository.findAll().size();

        // Update the charityUser using partial update
        CharityUser partialUpdatedCharityUser = new CharityUser();
        partialUpdatedCharityUser.setId(charityUser.getId());

        partialUpdatedCharityUser.charityName(UPDATED_CHARITY_NAME).description(UPDATED_DESCRIPTION).website(UPDATED_WEBSITE);

        restCharityUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCharityUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCharityUser))
            )
            .andExpect(status().isOk());

        // Validate the CharityUser in the database
        List<CharityUser> charityUserList = charityUserRepository.findAll();
        assertThat(charityUserList).hasSize(databaseSizeBeforeUpdate);
        CharityUser testCharityUser = charityUserList.get(charityUserList.size() - 1);
        assertThat(testCharityUser.getCharityName()).isEqualTo(UPDATED_CHARITY_NAME);
        assertThat(testCharityUser.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCharityUser.getLogoURL()).isEqualTo(DEFAULT_LOGO_URL);
        assertThat(testCharityUser.getWebsite()).isEqualTo(UPDATED_WEBSITE);
    }

    @Test
    @Transactional
    void fullUpdateCharityUserWithPatch() throws Exception {
        // Initialize the database
        charityUserRepository.saveAndFlush(charityUser);

        int databaseSizeBeforeUpdate = charityUserRepository.findAll().size();

        // Update the charityUser using partial update
        CharityUser partialUpdatedCharityUser = new CharityUser();
        partialUpdatedCharityUser.setId(charityUser.getId());

        partialUpdatedCharityUser
            .charityName(UPDATED_CHARITY_NAME)
            .description(UPDATED_DESCRIPTION)
            .logoURL(UPDATED_LOGO_URL)
            .website(UPDATED_WEBSITE);

        restCharityUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCharityUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCharityUser))
            )
            .andExpect(status().isOk());

        // Validate the CharityUser in the database
        List<CharityUser> charityUserList = charityUserRepository.findAll();
        assertThat(charityUserList).hasSize(databaseSizeBeforeUpdate);
        CharityUser testCharityUser = charityUserList.get(charityUserList.size() - 1);
        assertThat(testCharityUser.getCharityName()).isEqualTo(UPDATED_CHARITY_NAME);
        assertThat(testCharityUser.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testCharityUser.getLogoURL()).isEqualTo(UPDATED_LOGO_URL);
        assertThat(testCharityUser.getWebsite()).isEqualTo(UPDATED_WEBSITE);
    }

    @Test
    @Transactional
    void patchNonExistingCharityUser() throws Exception {
        int databaseSizeBeforeUpdate = charityUserRepository.findAll().size();
        charityUser.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCharityUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, charityUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(charityUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the CharityUser in the database
        List<CharityUser> charityUserList = charityUserRepository.findAll();
        assertThat(charityUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCharityUser() throws Exception {
        int databaseSizeBeforeUpdate = charityUserRepository.findAll().size();
        charityUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCharityUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(charityUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the CharityUser in the database
        List<CharityUser> charityUserList = charityUserRepository.findAll();
        assertThat(charityUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCharityUser() throws Exception {
        int databaseSizeBeforeUpdate = charityUserRepository.findAll().size();
        charityUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCharityUserMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(charityUser))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CharityUser in the database
        List<CharityUser> charityUserList = charityUserRepository.findAll();
        assertThat(charityUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCharityUser() throws Exception {
        // Initialize the database
        charityUserRepository.saveAndFlush(charityUser);

        int databaseSizeBeforeDelete = charityUserRepository.findAll().size();

        // Delete the charityUser
        restCharityUserMockMvc
            .perform(delete(ENTITY_API_URL_ID, charityUser.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CharityUser> charityUserList = charityUserRepository.findAll();
        assertThat(charityUserList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
