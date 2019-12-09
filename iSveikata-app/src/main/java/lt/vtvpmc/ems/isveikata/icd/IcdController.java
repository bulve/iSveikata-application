package lt.vtvpmc.ems.isveikata.icd;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * The Class EmployeesController.
 */
@RestController
@RequestMapping(value = "/api")
@CrossOrigin(origins = "*")
public class IcdController {
	
	@Autowired
	private IcdService icdService;

	/**
	 * Creates new ICD
	 *
	 * @param icd
	 */
	@PostMapping("/icd")
	private void createIcd(@RequestBody Icd icd) {
		icdService.createIcd(icd);
	}

	/**
	 * Gets all icd
	 *
	 * @return all icd
	 */
	@GetMapping("/icd")
	private List<Icd> getAllIcd() {
		return icdService.getAllIcd();
	}

	/**
	 * Gets specific idc by it's id
	 *
	 * @param icdCode
	 * @return icd title by given icdCode
	 */
	@GetMapping("/icd/{icdCode}")
	private String getIcdTitle(@PathVariable final String icdCode) {
		return icdService.getIcdTitle(icdCode);
	}
}
