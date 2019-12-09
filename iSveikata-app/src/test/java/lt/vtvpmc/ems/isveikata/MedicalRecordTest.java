//package lt.vtvpmc.ems.isveikata;
//
//
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//import java.util.Date;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//import java.util.Random;
//
//import lt.vtvpmc.ems.isveikata.employees.Doctor;
//import org.junit.Before;
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.http.MediaType;
//import org.springframework.security.test.context.support.WithMockUser;
//import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
//import org.springframework.test.context.ContextConfiguration;
//import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
//import org.springframework.test.context.web.WebAppConfiguration;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.MvcResult;
//import org.springframework.test.web.servlet.setup.MockMvcBuilders;
//import org.springframework.web.context.WebApplicationContext;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//
//@RunWith(SpringJUnit4ClassRunner.class)
//@SpringBootTest
//@WebAppConfiguration
//@ContextConfiguration
//@WithMockUser
//public class MedicalRecordTest {
//
//    private MockMvc mockMvc;
//
//    @Autowired
//    private WebApplicationContext webApplicationContext;
//
//
//    private String doctorUserName = null;
//    private String doctorPassword = null;
//    private String randomIcdCode = null;
//    private String randomPatientId = null;
//    private String randomDocotrUserName = null;
//
//    @Before
//    public void init(){
//        mockMvc = MockMvcBuilders
//                .webAppContextSetup(webApplicationContext)
//                .apply(SecurityMockMvcConfigurers.springSecurity())
//                .build();
//    }
//
//    @Test
//    public void performAdminLogin() throws Exception{
//        mockMvc.perform(post("/api/login")
//                .param("userName", "root").param("password", "123"))
//                .andExpect(status().is2xxSuccessful());
//    }
//
//    @Test
//    public void performDoctorLogin() throws Exception{
//        if(doctorUserName == null || doctorPassword == null){
//            createDoctor();
//            performDoctorLogin();
//        }else {
//            mockMvc.perform(post("/api/login")
//                    .param("userName", doctorUserName).param("password", doctorPassword))
//                    .andExpect(status().is2xxSuccessful());
//        }
//    }
//
//    @Test
//    public void getRandomPatientPatientId() throws Exception{
//        performAdminLogin();
//        ObjectMapper mapper = new ObjectMapper();
//        Random rand = new Random();
//
//        MvcResult result = mockMvc.perform(get("/api/patient/?page=0&size=2000"))
//                .andExpect(status().isOk())
//                .andReturn();
//        Map<String, List<Map<String, String>>> resultMap = mapper.readValue(result.getResponse().getContentAsByteArray(), HashMap.class);
//        System.out.println(resultMap.keySet());
//        System.out.println(resultMap.get("size"));
//        int randomPatientIndex = rand.nextInt(resultMap.get("content").size());
//        String randomPatientPatientId = resultMap.get("content").get(randomPatientIndex).get("id");
//
//        randomPatientId = randomPatientPatientId;
//        if(randomPatientId == null){
//            throw new Exception("Patient with patientId do not exixst at all");
//        }
//    }
//
//    @Test
//    public void getRandomDoctorUserName() throws Exception{
//        performAdminLogin();
//
//
//        ObjectMapper mapper = new ObjectMapper();
//        Random rand = new Random();
//
//        MvcResult result = mockMvc.perform(get("/api/doctor?page=0&size=2000"))
//                .andExpect(status().isOk())
//                .andReturn();
//
//
//        Map<String, List<Map<String, String>>> doctorMap = mapper.readValue(result.getResponse().getContentAsByteArray(), HashMap.class);
//
//        int randomUserIndex = rand.nextInt(doctorMap.get("content").size());
//        String randomEmployeeUserName = doctorMap.get("content").get(randomUserIndex).get("userName");
//
//
//
//        randomDocotrUserName = randomEmployeeUserName;
//        if(randomDocotrUserName== null){
//            throw new Exception("Doctor with userName do not exixst at all");
//        }
//    }
//    @Test
//    public void getRandomIcdCode() throws Exception{
//        performDoctorLogin();
//        ObjectMapper mapper = new ObjectMapper();
//        Random rand = new Random();
//
//        MvcResult result = mockMvc.perform(get("/api/icd"))
//                .andExpect(status().isOk())
//                .andReturn();
//
//        List<Map<String,Object>> objectList= mapper.readValue(result.getResponse().getContentAsByteArray(), List.class);
//        int randomIndex = rand.nextInt(objectList.size());
//        System.out.println(objectList.get(randomIndex).get("icdCode"));
//
//        randomIcdCode = (String)objectList.get(randomIndex).get("icdCode");
//        if(randomIcdCode == null){
//            throw new Exception("IcdCode do not exixst at all");
//        }
//
//    }
//
//
//    @Test
//    public void createDoctor() throws Exception{
//        Random rand = new Random();
//
//        Map<String, String> employeeMap = new HashMap<>();
//        employeeMap.put("userName", "AntJom" + rand.nextInt(50000000));
//        employeeMap.put("password", "123");
//        employeeMap.put("firstName", "Antanas");
//        employeeMap.put("lastName", "Jomantas");
//        employeeMap.put("type", "doctor");
//        Map<String, Object> objectMap = new HashMap<>();
//        objectMap.put("employee", employeeMap);
//        objectMap.put("specialization", "GYDYTOJAS");
//
//        performAdminLogin();
//
//        mockMvc.perform(post("/api/admin/new/user")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(asJsonString(objectMap)))
//                .andExpect(status().isCreated())
//                .andReturn();
//        doctorUserName = employeeMap.get("userName");
//        doctorPassword = employeeMap.get("password");
//
//    }
//
//    @Test
//    public void cantCreateMedicalRecordWithoutDoctor() throws Exception{
//
//        if(randomIcdCode == null) {
//            getRandomIcdCode();
//        }
//        if(randomPatientId == null) {
//            getRandomPatientPatientId();
//        }
//        if(randomDocotrUserName == null){
//            getRandomDoctorUserName();
//        }
//
//        Random rand = new Random();
//        Map<String, Object> appointmentMap = new HashMap<>();
//        appointmentMap.put("description", "Aprasymas");
//        appointmentMap.put("duration", 15);
//        appointmentMap.put("date", new Date());
//
//        Map<String, Object> recordMap = new HashMap<>();
//        recordMap.put("repetitive", rand.nextInt(1) == 0 ? false : true);
//        recordMap.put("compensable",  rand.nextInt(1) == 0 ? false : true);
//
//        Map<String, Object> objectMap = new HashMap<>();
//
//        objectMap.put("icdCode", randomIcdCode);
//        objectMap.put("userName", rand.nextInt(1) == 0 ? null : "00000000000000");
//        objectMap.put("patientId", randomPatientId);
//        objectMap.put("appointment", appointmentMap);
//        objectMap.put("medicalRecord", recordMap);
//
//        performDoctorLogin();
//        mockMvc.perform(post("/api/doctor/new/record")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(asJsonString(objectMap)))
//                .andExpect(status().is4xxClientError())
//                .andExpect(content().string("Ligos įrašas nebuvo sukurtas, dėl netinkamų duomenų"));
//    }
//
//    @Test
//    public void cantCreateMedicalRecordWithoutPatientId() throws Exception{
//        if(randomIcdCode == null) {
//            getRandomIcdCode();
//        }
//        if(randomPatientId == null) {
//            getRandomPatientPatientId();
//        }
//        if(randomDocotrUserName == null){
//            getRandomDoctorUserName();
//        }
//
//        Random rand = new Random();
//        Map<String, Object> appointmentMap = new HashMap<>();
//        appointmentMap.put("description", "Aprasymas");
//        appointmentMap.put("duration", 15);
//        appointmentMap.put("date", new Date());
//
//        Map<String, Object> recordMap = new HashMap<>();
//        recordMap.put("repetitive", rand.nextInt(1) == 0 ? false : true);
//        recordMap.put("compensable",  rand.nextInt(1) == 0 ? false : true);
//
//        Map<String, Object> objectMap = new HashMap<>();
//
//        objectMap.put("icdCode", randomIcdCode);
//        objectMap.put("userName", randomDocotrUserName);
//        objectMap.put("patientId", rand.nextInt(1) == 0 ? null : "10010010000");
//        objectMap.put("appointment", appointmentMap);
//        objectMap.put("medicalRecord", recordMap);
//
//        performDoctorLogin();
//        mockMvc.perform(post("/api/doctor/new/record")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(asJsonString(objectMap)))
//                .andExpect(status().is4xxClientError())
//                .andExpect(content().string("Ligos įrašas nebuvo sukurtas, dėl netinkamų duomenų"));
//    }
//
//
//
//    @Test
//    public void medicalRecordCanBeCreated() throws Exception{
//
//        if(randomIcdCode == null) {
//            getRandomIcdCode();
//        }
//        if(randomPatientId == null) {
//            getRandomPatientPatientId();
//        }
//        if(randomDocotrUserName == null){
//            getRandomDoctorUserName();
//        }
//
//        Random rand = new Random();
//        Map<String, Object> appointmentMap = new HashMap<>();
//        appointmentMap.put("description", "Aprasymas");
//        appointmentMap.put("duration", 15);
//        appointmentMap.put("date", new Date());
//
//        Map<String, Object> recordMap = new HashMap<>();
//        recordMap.put("repetitive", rand.nextInt(1) == 0 ? false : true);
//        recordMap.put("compensable",  rand.nextInt(1) == 0 ? false : true);
//
//        Map<String, Object> objectMap = new HashMap<>();
//
//        objectMap.put("icdCode", randomIcdCode);
//        objectMap.put("userName", randomDocotrUserName);
//        objectMap.put("patientId", randomPatientId);
//        objectMap.put("appointment", appointmentMap);
//        objectMap.put("medicalRecord", recordMap);
//
//        performDoctorLogin();
//        mockMvc.perform(post("/api/doctor/new/record")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(asJsonString(objectMap)))
//                .andExpect(status().isCreated());
//
//
//    }
//
//
//    @Test
//    public void deactiveteDoctorAndPatient() throws Exception{
//        if(doctorUserName == null){
//
//        }else {
//            mockMvc.perform(delete("api/admin/delete/user/{userName}",  doctorUserName))
//                    .andExpect(status().isOk());
//        }
//
//
//    }
//
//
//    public static String asJsonString(final Object obj) {
//        try {
//            return new ObjectMapper().writeValueAsString(obj);
//        } catch (Exception e) {
//            throw new RuntimeException(e);
//        }
//    }
//
//}
