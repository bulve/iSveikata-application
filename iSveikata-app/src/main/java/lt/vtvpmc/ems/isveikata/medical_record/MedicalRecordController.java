package lt.vtvpmc.ems.isveikata.medical_record;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * The Class MedicalRecordController.
 * @author DTFG 2018
 */
@RestController
@RequestMapping(value = "/api/record")
@CrossOrigin(origins = "http://localhost:3000")
public class MedicalRecordController {

	/** The medical record service. */
	@Autowired
	private MedicalRecordService medicalRecordService;

	/**
	 * Get specific medical record
	 *
	 * @param medicalRecordId
	 *            medicalRecordId Medical record id
	 *
	 * @return medical record
	 */

	@GetMapping(value = "/{medicalRecordId}")
	@ResponseStatus(HttpStatus.OK)
	private MedicalRecordDto getMedicalRecord(@PathVariable final Long medicalRecordId) {
		return medicalRecordService.getMedicalRecord(medicalRecordId);
	}


	/**
	 * Gets the doctor work days statistic.
	 *
	 * @param userName the user name
	 * @param dateFrom the date from
	 * @param dateTill the date till
	 * @return the doctor work days statistic
	 */
	@GetMapping(value = "/doctor/{userName}/statistic/{dateFrom}/{dateTill}")
	@ResponseStatus(HttpStatus.OK)
	private List<Object> getDoctorWorkDaysStatistic(@PathVariable final String userName, @PathVariable final String dateFrom, @PathVariable final String dateTill){
		return medicalRecordService.getDoctorWorkDaysStatistic(userName, dateFrom, dateTill);
	}

}
