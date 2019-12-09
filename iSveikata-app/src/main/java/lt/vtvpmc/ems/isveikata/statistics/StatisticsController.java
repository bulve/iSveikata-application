package lt.vtvpmc.ems.isveikata.statistics;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import lt.vtvpmc.ems.isveikata.api.ApiStatDto;
import lt.vtvpmc.ems.isveikata.medical_record.MedicalRecordService;
import lt.vtvpmc.ems.isveikata.prescription.PrescriptionSevice;

@RestController
@RequestMapping(value = "/statistics")
@CrossOrigin(origins = "*")
public class StatisticsController {
	
    @Autowired
    private PrescriptionSevice prescriptionSevice;
    
	@Autowired
	private MedicalRecordService medicalRecordService;
	
    @GetMapping("/api")
    private List<ApiStatDto> getPublicApiStatistics(){
    	return prescriptionSevice.getPublicApiStatistics();
    }
    
	@GetMapping(value = "/tlk")
	@ResponseStatus(HttpStatus.OK)
	private List<Map<String,Object>> getPublicTlkStatistics(){
		return medicalRecordService.publicTlkStatistics();
	}

}
