package lt.vtvpmc.ems.isveikata.medical_record;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;

import javax.transaction.Transactional;

import lt.vtvpmc.ems.isveikata.patient.Patient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import lt.vtvpmc.ems.isveikata.IsveikataApplication;
import lt.vtvpmc.ems.isveikata.appointment.Appointment;
import lt.vtvpmc.ems.isveikata.appointment.JpaAppointmentRepository;
import lt.vtvpmc.ems.isveikata.employees.Doctor;
import lt.vtvpmc.ems.isveikata.employees.JpaEmployeesRepository;
import lt.vtvpmc.ems.isveikata.icd.Icd;
import lt.vtvpmc.ems.isveikata.icd.JpaIcdRepository;
import lt.vtvpmc.ems.isveikata.mappers.MedicalRecordMapper;
import lt.vtvpmc.ems.isveikata.patient.JpaPatientRepository;

/**
 * The Class MedicalRecordService.
 * @author DTFG
 * @version 1.0
 * @since 2018
 */
@Service
@Transactional
public class MedicalRecordService {

	/** The jpa medical record repository. */
	@Autowired
	private JpaMedicalRecordRepository jpaMedicalRecordRepository;

	/** The jpa appointment repository. */
	@Autowired
	private JpaAppointmentRepository jpaAppointmentRepository;

	/** The jpa employees repository. */
	@Autowired
	private JpaEmployeesRepository<Doctor> jpaEmployeesRepository;

	/** The jpa patient repository. */
	@Autowired
	private JpaPatientRepository jpaPatientRepository;

	/** The jpa icd repository. */
	@Autowired
	private JpaIcdRepository jpaIcdRepository;

	/** The mapper. */
	@Autowired
	private MedicalRecordMapper mapper;

	/**
	 * Gets the logged user name for logger.
	 *
	 * @return the user name
	 */
	private String getUserName() {
		User loggedUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return loggedUser.getUsername();
	}

	/**
	 * Gets the logged user role for logger.
	 *
	 * @return the user role
	 */
	private String getUserRole() {
		User loggedUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return loggedUser.getAuthorities().toString();
	}

	/**
	 * Creates the new record.
	 *
	 * @param map the map with keys of "icdCode", "medicalRecord", "appointment"
	 */
	@PreAuthorize("hasRole('Doctor')")
	public boolean createNewRecord(Map<String, Object> map) {
		try {
			final ObjectMapper mapper = new ObjectMapper();

			if(map.get("icdCode") == null ||
                   map.get("medicalRecord") == null ||
                                   map.get("appointment") == null ||
                                               map.get("userName") == null ||
                                                            map.get("patientId") == null){
			    throw new Exception("NullPointerException on creating medicalRecord");
            }


			if(jpaEmployeesRepository.findByUserName(mapper.convertValue(map.get("userName"), String.class)) == null ||
					jpaPatientRepository.findOne(mapper.convertValue(map.get("patientId"), String.class)) == null){
				throw new Exception("MedicalRecord creation -> given Doctor or patient not found");
			}

			Icd icd = jpaIcdRepository.findOne(mapper.convertValue(map.get("icdCode"), String.class));
			MedicalRecord medicalRecord = mapper.convertValue(map.get("medicalRecord"), MedicalRecord.class);
			Appointment appointment = mapper.convertValue(map.get("appointment"), Appointment.class);
			if (!medicalRecord.isRepetitive()) {
				icd.setCounter(icd.getCounter() + 1);
			}

			medicalRecord.setIcd(icd);
			medicalRecord.setAppointment(appointment);
			medicalRecord.setDoctor((Doctor) jpaEmployeesRepository
					.findByUserName(mapper.convertValue(map.get("userName"), String.class)));
			medicalRecord
					.setPatient(
							jpaPatientRepository.findOne(mapper.convertValue(map.get("patientId"), String.class)));
			jpaMedicalRecordRepository.save(medicalRecord);
			jpaAppointmentRepository.save(appointment);
			IsveikataApplication.loggMsg(Level.INFO, getUserName(), getUserRole(), "created new medical record");
			return true;
		} catch (Exception e) {

			IsveikataApplication.loggMsg(Level.WARNING, "public", "[public]",
					"Error creating new record " + map.toString() + "\r\n" + e.getMessage());
			return false;
		}

	}

	/**
	 * Gets the medical record.
	 *
	 * @param medicalRecordId the medical record id
	 * @return the medical record
	 */
	@PreAuthorize("hasRole('Doctor') OR hasRole('Patient')")
	public MedicalRecordDto getMedicalRecord(Long medicalRecordId) {
		try {
			IsveikataApplication.loggMsg(Level.FINE, getUserName(), getUserRole(), "fetching medical record");
			return mapper.medicalRecordToDto(jpaMedicalRecordRepository.findOne(medicalRecordId));
		} catch (Exception e) {
			IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
					"Error fetching medical record id:" + medicalRecordId + "\r\n" + e.getMessage());
			return null;
		}
	}

	/**
	 * Gets the doctor work days statistic.
	 *
	 * @param userName the user name
	 * @param dateFrom the date from
	 * @param dateTill the date till
	 * @return the doctor work days statistic
	 */
	@PreAuthorize("hasRole('Doctor')")
	public List<Object> getDoctorWorkDaysStatistic(String userName, String dateFrom, String dateTill) {
		try {
			Long doctorId = jpaEmployeesRepository.findByUserName(userName).getId();
			IsveikataApplication.loggMsg(Level.FINE, getUserName(), getUserRole(),
					"fetching doctor working days statistics");
			return jpaMedicalRecordRepository.getDoctorWorkDaysStatistic(doctorId, dateFrom, dateTill);
		} catch (Exception e) {
			IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
					"Error fetching doctor working days statistic  from " + dateFrom + " to " + dateTill + "\r\n" + e.getMessage());
			return null;
		}

	}

	/**
	 * Public ICD (TLK) statistics.
	 *
	 * @return the list size of 10 of statistical ICD objects 
	 */
	public List<Map<String, Object>> publicTlkStatistics() {
		try {
			List<Map<String, Object>> newList = new ArrayList<Map<String, Object>>();
			List<Icd> list = jpaIcdRepository.findAllByOrderByCounterDesc(new PageRequest(0, 10));
			Integer total = jpaMedicalRecordRepository.getTotalNonRepetitiveMedicalRecordCount();
			for (Icd icd : list) {
				final Map<String, Object> objectMap = new HashMap<String, Object>();
				objectMap.put("title", icd.getTitle());
				objectMap.put("icdCode", icd.getIcdCode());
				objectMap.put("totalProc", (long) icd.getCounter() * (double) 100 / total);
				objectMap.put("totalCount", icd.getCounter());
				newList.add(objectMap);
			}
			IsveikataApplication.loggMsg(Level.INFO, "public", "[public]", "fetching tlk statistics");

			return newList;
		} catch (Exception e) {
			IsveikataApplication.loggMsg(Level.WARNING, "public", "[public]",
					"Error fetching public tlk satatistics " + e.getMessage());
			return null;
		}

	}
}
