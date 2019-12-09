package lt.vtvpmc.ems.isveikata.patientTest;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import lt.vtvpmc.ems.isveikata.patient.PatientController;

@RunWith(SpringRunner.class)
@SpringBootTest
public class PatientControllerTest {

    @Autowired
    private PatientController controller;

    @Test
    public void contexLoads() throws Exception {
        assertThat(controller).isNotNull();
    }
}