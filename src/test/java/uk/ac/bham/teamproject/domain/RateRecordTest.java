package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class RateRecordTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(RateRecord.class);
        RateRecord rateRecord1 = new RateRecord();
        rateRecord1.setId(1L);
        RateRecord rateRecord2 = new RateRecord();
        rateRecord2.setId(rateRecord1.getId());
        assertThat(rateRecord1).isEqualTo(rateRecord2);
        rateRecord2.setId(2L);
        assertThat(rateRecord1).isNotEqualTo(rateRecord2);
        rateRecord1.setId(null);
        assertThat(rateRecord1).isNotEqualTo(rateRecord2);
    }
}
