package lt.vtvpmc.ems.isveikata.prescription;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;

import javax.transaction.Transactional;

import lt.vtvpmc.ems.isveikata.mappers.PrescriptionUsageMapper;
import lt.vtvpmc.ems.isveikata.prescriptionUsage.PrescriptionUsageDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import lt.vtvpmc.ems.isveikata.IsveikataApplication;
import lt.vtvpmc.ems.isveikata.api.Api;
import lt.vtvpmc.ems.isveikata.api.ApiStatDto;
import lt.vtvpmc.ems.isveikata.api.JpaApiRepository;
import lt.vtvpmc.ems.isveikata.employees.Doctor;
import lt.vtvpmc.ems.isveikata.employees.Druggist;
import lt.vtvpmc.ems.isveikata.employees.JpaEmployeesRepository;
import lt.vtvpmc.ems.isveikata.mappers.PrescriptionMapper;
import lt.vtvpmc.ems.isveikata.patient.JpaPatientRepository;
import lt.vtvpmc.ems.isveikata.prescriptionUsage.JpaPrescriptionUsageRepository;
import lt.vtvpmc.ems.isveikata.prescriptionUsage.PrescriptionUsage;

/**
 * The Class PrescriptionSevice.
 * @author DTFG  
 * @version 1.0
 * @since 2018
 */
@Service
@Transactional
public class PrescriptionSevice {

	/** The prescription repository. */
	@Autowired
	private JpaPrescriptionRepository prescriptionRepository;

	/** The prescription usage repository. */
	@Autowired
	private JpaPrescriptionUsageRepository prescriptionUsageRepository;

	/** The patient repository. */
	@Autowired
	private JpaPatientRepository patientRepository;

	/** The employees repository. */
	@Autowired
	private JpaEmployeesRepository<?> employeesRepository;

	/** The api repository. */
	@Autowired
	private JpaApiRepository apiRepository;

	/** The mapper. */
	@Autowired
	private PrescriptionMapper mapper;

	/** The prescriptionUsage mapper */
	@Autowired
	private PrescriptionUsageMapper prescriptionUsageMapper;

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
	 * Creates the new prescription.
	 *
	 * @param map the map wit key names of "prescription", "apiTitle", "patientId"
	 */
	@PreAuthorize("hasRole('Doctor')")
	public void createNewPrescription(Map<String, Object> map) {
		try {
			ObjectMapper mapper = new ObjectMapper();
			Prescription prescription = mapper.convertValue(map.get("prescription"), Prescription.class);
			Api api = apiRepository.findByTitle(mapper.convertValue(map.get("apiTitle"), String.class));
			String patientId = mapper.convertValue(map.get("patientId"), String.class);
			Doctor doctor = (Doctor) employeesRepository
					.findByUserName(mapper.convertValue(map.get("userName"), String.class));
			if (patientId != null)
				prescription.setPatient(patientRepository.findOne(patientId));
			if (api != null) {
				prescription.setApi(api);
				api.setCounter(api.getCounter() + 1l);
			}
			if (doctor != null)
				prescription.setDoctor(doctor);
			prescriptionRepository.save(prescription);
			IsveikataApplication.loggMsg(Level.INFO, getUserName(), getUserRole(),
					doctor.getUserName() + " created new precription for " + patientId);
		} catch (Exception e) {
			IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
					"Error create new prescription:" + e.getMessage());
		}

	}

//	/**
//	 * Gets the all prescriptions.
//	 *
//	 * @return the all prescriptions
//	 */
//	@PreAuthorize("hasRole('Doctor') OR hasRole('Patient')")
//	public List<PrescriptionDto> getAllPrescriptions() {
//		try {
//			IsveikataApplication.loggMsg(Level.FINE, getUserName(), getUserRole(), "fetching all prescriptions");
//			return mapper.prescriptionsToDto(prescriptionRepository.findAll());
//
//		} catch (Exception e) {
//			IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
//					"Error fetching all prescriptions:" + e.getMessage());
//			return null;
//		}
//	}

	/**
	 * Gets the all prescription usages.
	 *
	 * @param prescriptionId the prescription id
	 * @return the all prescription usages
	 */
	@PreAuthorize("hasRole('Doctor') OR hasRole('Patient')")
	public List<PrescriptionUsageDto> getAllPrescriptionUsages(Long prescriptionId) {
		try {
			IsveikataApplication.loggMsg(Level.FINE, getUserName(), getUserRole(), "fetching all prescription usages");
			return prescriptionUsageMapper.prescriptionUsagesToDto(prescriptionUsageRepository.findByPrescriptionUsages(prescriptionId));

		} catch (Exception e) {
			IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
					"Error fetching prescription " + prescriptionId + " usage \r\n" + e.getMessage());
			return null;
		}
	}

	/**
	 * Gets the prescription.
	 *
	 * @param prescriptionId the prescription id
	 * @return the prescription
	 */
	@PreAuthorize("hasRole('Doctor') OR hasRole('Patient') OR hasRole('Druggist')")
	public PrescriptionDto getPrescription(Long prescriptionId) {
		try {
			IsveikataApplication.loggMsg(Level.FINE, getUserName(), getUserRole(), "fetching prescription");
			return mapper.prescriptionToDto(prescriptionRepository.findOne(prescriptionId));

		} catch (Exception e) {
			IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
					"Error fetching prescription " + prescriptionId + "\r\n" + e.getMessage());
			return null;
		}
	}

	/**
	 * Creates the usage for prescription.
	 *
	 * @param map the map
	 * @param prescriptionId the prescription id
	 * @return true, if successful
	 */
	@PreAuthorize("hasRole('Druggist')")
	public boolean createUsageForPrescription(Map<String, Object> map, Long prescriptionId) {
		try {
			ObjectMapper mapper = new ObjectMapper();
			PrescriptionUsage prescriptionUsage = mapper.convertValue(map.get("usage"), PrescriptionUsage.class);
			String userName = mapper.convertValue(map.get("userName"), String.class);

			if (prescriptionUsage != null && prescriptionId != null && userName != null) {
				Prescription prescription = prescriptionRepository.findOne(prescriptionId);
				prescriptionUsage.setPrescription(prescription);
				prescription.addUsage();
				Api api = prescription.getApi();
				api.setCounter(api.getCounter() + 1);
				prescriptionUsage.setDruggist((Druggist) employeesRepository.findByUserName(userName));
				prescriptionUsageRepository.save(prescriptionUsage);
				IsveikataApplication.loggMsg(Level.INFO, getUserName(), getUserRole(),
						"created usage for prescription id " + prescriptionId);
				return true;
			} else {
				IsveikataApplication.loggMsg(Level.INFO, getUserName(), getUserRole(),
						"failed create prescription, prescriptionUsage:" + prescriptionUsage + " prescriptionId:"
								+ prescriptionId + " userName:" + userName + " must not be null");
				return false;
			}
		} catch (Exception e) {
			IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
					"Error creating prescription:" + e.getMessage());
			return false;
		}

	}

	/**
	 * Gets the public api statistics.
	 *
	 * @return the public api statistics
	 */
	public List<ApiStatDto> getPublicApiStatistics() {
		try {
			List<ApiStatDto> stat = new ArrayList<ApiStatDto>();
			List<Api> result = apiRepository.findAllByCounterGreaterThanOrderByCounterDesc(0l, new PageRequest(0, 10));
			for (Api api : result) {
				ApiStatDto apiStatDto = new ApiStatDto();
				apiStatDto.setDescription(api.getDescription());
				apiStatDto.setIngredientName(api.getTitle());
				apiStatDto.setUsedTimes(api.getCounter());
				stat.add(apiStatDto);
			}
			IsveikataApplication.loggMsg(Level.FINE, "public", "[public]", "fetching public API statistics");
			return stat;
		} catch (Exception e) {
			IsveikataApplication.loggMsg(Level.WARNING, "public", "[public]", "Error fetching public statistics " + e.getMessage());
			return null;
		}

	}
}
