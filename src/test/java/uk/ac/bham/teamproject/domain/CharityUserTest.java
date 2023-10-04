package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class CharityUserTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CharityUser.class);
        CharityUser charityUser1 = new CharityUser();
        charityUser1.setId(1L);
        CharityUser charityUser2 = new CharityUser();
        charityUser2.setId(charityUser1.getId());
        assertThat(charityUser1).isEqualTo(charityUser2);
        charityUser2.setId(2L);
        assertThat(charityUser1).isNotEqualTo(charityUser2);
        charityUser1.setId(null);
        assertThat(charityUser1).isNotEqualTo(charityUser2);
    }
}
