package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class HandoffTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Handoff.class);
        Handoff handoff1 = new Handoff();
        handoff1.setId(1L);
        Handoff handoff2 = new Handoff();
        handoff2.setId(handoff1.getId());
        assertThat(handoff1).isEqualTo(handoff2);
        handoff2.setId(2L);
        assertThat(handoff1).isNotEqualTo(handoff2);
        handoff1.setId(null);
        assertThat(handoff1).isNotEqualTo(handoff2);
    }
}
