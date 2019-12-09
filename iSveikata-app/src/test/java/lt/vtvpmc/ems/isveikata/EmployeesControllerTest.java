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
//import org.junit.Before;
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.mockito.Mock;
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
//import lt.vtvpmc.ems.isveikata.patient.Patient;
//import lt.vtvpmc.ems.isveikata.patient.PatientService;
//
//@RunWith(SpringJUnit4ClassRunner.class)
//@SpringBootTest
//@WebAppConfiguration
//@ContextConfiguration
//@WithMockUser
//public class EmployeesControllerTest {
//
//    private MockMvc mockMvc;
//
//
//    @Autowired
//    private WebApplicationContext webApplicationContext;
//
//    @Mock
//    private PatientService patientService;
//
//
//    @Before
//    public void init(){
//        mockMvc = MockMvcBuilders
//                .webAppContextSetup(webApplicationContext)
//                .apply(SecurityMockMvcConfigurers.springSecurity())
//                .build();
//    }
//
//
//
//    @Test
//    public void performAdminLogin() throws Exception{
//        mockMvc.perform(post("/api/login")
//                .param("userName", "root").param("password", "123"))
//                .andExpect(status().is2xxSuccessful());
//    }
//
//    @Test
//    public void canCreatePatient() throws Exception{
//        performAdminLogin();
//        Long patientId = (long)(Math.random() * 39912319999l + 10001010000l);
//
//        final Patient patient = new Patient();
//        patient.setFirstName("Jomantas");
//        patient.setLastName("Pabredis");
//        patient.setPatientId(String.valueOf(patientId));
//        patient.setPassword("123");
//        patient.setBirthDate(new Date());
//        System.out.println(patientId);
//
//        mockMvc.perform(
//                post("/api/admin/new/patient")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(asJsonString(patient)))
//                .andDo(print())
//                .andExpect(status().isCreated())
//                .andExpect(content().string("Sukurtas naujas pacientas"));
//
//        mockMvc.perform(delete("/api/admin/delete/patient/{patientId}", String.valueOf(patientId)))
//            .andExpect(status().isOk());
//
//    }
//
//    @Test
//    public void cantCreatePatientWithExistingPatientId() throws Exception{
//        performAdminLogin();
//        ObjectMapper mapper = new ObjectMapper();
//        Random rand = new Random();
//
//        MvcResult result = mockMvc.perform(get("/api/patient/?page=0&size=2000"))
//                .andExpect(status().isOk())
//                .andDo(print())
//                .andReturn();
//        Map<String, List<Map<String, String>>> resultMap = mapper.readValue(result.getResponse().getContentAsByteArray(), HashMap.class);
//        System.out.println(resultMap.keySet());
//        System.out.println(resultMap.get("size"));
//        int randomPatientIndex = rand.nextInt(resultMap.get("content").size());
//        String randomPatientPatientId = resultMap.get("content").get(randomPatientIndex).get("id");
//        System.out.println(randomPatientIndex);
//        System.out.println(randomPatientPatientId);
//
//
//        final Patient patient = new Patient();
//        patient.setFirstName("Jomantas");
//        patient.setLastName("Pabredis");
//        patient.setPatientId(randomPatientPatientId);
//        patient.setPassword("123");
//        patient.setBirthDate(new Date());
//
//        mockMvc.perform(
//                post("/api/admin/new/patient")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(asJsonString(patient)))
//                .andDo(print())
//                .andExpect(status().is4xxClientError())
//                .andExpect(content().string("Pacientas su tokiu asmens kodu jau egzistuoja"));
//
//    }
//
//
//    @Test
//    public void canCreateDoctor() throws Exception{
//
//        Random rand = new Random();
//        String userName = "AntJom" + rand.nextInt(50000000);
//        Map<String, Object> employeeMap = new HashMap<>();
//        employeeMap.put("userName", userName );
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
//            .contentType(MediaType.APPLICATION_JSON)
//            .content(asJsonString(objectMap)))
//            .andExpect(status().isCreated());
//
//        mockMvc.perform(delete("/api/admin/delete/user/{userName}", userName))
//                .andExpect(status().isOk());
//    }
//
//
//    @Test
//    public void cantCreateUserWithExistingUserName() throws Exception{
//        performAdminLogin();
//        MvcResult result = mockMvc.perform(get("/api/doctor?page=0&size=2000"))
//                .andExpect(status().isOk())
//                .andDo(print())
//                .andReturn();
//        ObjectMapper mapper = new ObjectMapper();
//
//        Map<String, List<Map<String, String>>> doctorMap = mapper.readValue(result.getResponse().getContentAsByteArray(), HashMap.class);
//        System.out.println(doctorMap.keySet().toString());
//        Random rand = new Random();
//        int randomUserIndex = rand.nextInt(doctorMap.get("content").size());
//        String randomEmployeeUserName = doctorMap.get("content").get(randomUserIndex).get("userName");
//        String [] employeeTypes = {"admin", "doctor", "druggist"};
//        String randomEmployeeType = employeeTypes[rand.nextInt(3)];
//
//        Map<String, Object> employeeMap = new HashMap<>();
//        Map<String, Object> objectMap = new HashMap<>();
//
//        employeeMap.put("userName", randomEmployeeUserName);
//        employeeMap.put("password", "123");
//        employeeMap.put("firstName", "Antanas");
//        employeeMap.put("lastName", "Jomantas");
//        employeeMap.put("type", randomEmployeeType);
//
//        if(randomEmployeeType.equals("doctor")){
//            objectMap.put("specialization", "GYDYTOJAS");
//        }else if(randomEmployeeType.equals("druggist")){
//            employeeMap.put("drugStore", "UAB Testuotojai");
//        }
//        objectMap.put("employee", employeeMap);
//
//        mockMvc.perform(post("/api/admin/new/user")
//            .contentType(MediaType.APPLICATION_JSON)
//            .content(asJsonString(objectMap)))
//            .andDo(print())
//            .andExpect(status().is4xxClientError())
//            .andExpect(content().string("Vartotojas su tokiu prisijungimo slapyvardžiu jau egzistuoja"));
//    }
//
//    @Test
//    public void cantCreateDoctorWithoutSpecializacion() throws Exception{
//        performAdminLogin();
//
//        Random rand = new Random();
//
//        Map<String, Object> employeeMap = new HashMap<>();
//        Map<String, Object> objectMap = new HashMap<>();
//
//        employeeMap.put("userName", "ThisUserNameShoudNotExists" + rand.nextInt(5000));
//        employeeMap.put("password", "123");
//        employeeMap.put("firstName", "Antanas");
//        employeeMap.put("lastName", "Jomantas");
//        employeeMap.put("type", "doctor");
//
//        objectMap.put("employee", employeeMap);
//
//        mockMvc.perform(post("/api/admin/new/user")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(asJsonString(objectMap)))
//                .andDo(print())
//                .andExpect(status().is4xxClientError())
//                .andExpect(content().string("Gydytojas privalo turėti specializaciją"));
//    }
//
//    @Test
//    public void cantCreateDruggistWithoutDrugStore() throws Exception{
//        performAdminLogin();
//
//        Random rand = new Random();
//
//        Map<String, Object> employeeMap = new HashMap<>();
//        Map<String, Object> objectMap = new HashMap<>();
//
//        employeeMap.put("userName", "ThisUserNameShoudNotExists" + rand.nextInt(5000));
//        employeeMap.put("password", "123");
//        employeeMap.put("firstName", "Antanas");
//        employeeMap.put("lastName", "Jomantas");
//        employeeMap.put("type", "druggist");
//
//        objectMap.put("employee", employeeMap);
//
//        mockMvc.perform(post("/api/admin/new/user")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(asJsonString(objectMap)))
//                .andDo(print())
//                .andExpect(status().is4xxClientError())
//                .andExpect(content().string("Vaistininkas privalo turėti darbovietę"));
//    }
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
