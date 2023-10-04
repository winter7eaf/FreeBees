package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class UserRateTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserRate.class);
        UserRate userRate1 = new UserRate();
        userRate1.setId(1L);
        UserRate userRate2 = new UserRate();
        userRate2.setId(userRate1.getId());
        assertThat(userRate1).isEqualTo(userRate2);
        userRate2.setId(2L);
        assertThat(userRate1).isNotEqualTo(userRate2);
        userRate1.setId(null);
        assertThat(userRate1).isNotEqualTo(userRate2);
    }
}
