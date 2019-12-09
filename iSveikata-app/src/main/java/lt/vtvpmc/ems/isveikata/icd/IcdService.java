package lt.vtvpmc.ems.isveikata.icd;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

/**
 * The Class IcdService.
 * The International Classification of Diseases
 * @author DTFG 
 * @version 1.0
 * @since 2018
 */
@Service
@Transactional
//@PreAuthorize("hasRole('Doctor')")
public class IcdService {

    /** The JPA ICD repository. */
    @Autowired
    private JpaIcdRepository jpaIcdRepository;

    /**
     * Creates the ICD.
     *
     * @param icd the ICD
     */
    public void createIcd(Icd icd) {
        jpaIcdRepository.save(icd);
    }
    
    /**
     * Gets the all ICD.
     *
     * @return the all ICD
     */
    @PreAuthorize("hasRole('Doctor')")
    public List<Icd> getAllIcd() {
    	return jpaIcdRepository.findAll(new Sort(Sort.Direction.ASC, "icdCode"));
    }
    
    /**
     * Gets the ICD title.
     *
     * @param icdCode the ICD code
     * @return the ICD title
     */
    @PreAuthorize("hasRole('Doctor') OR hasRole('Patient')")
    public String getIcdTitle(String icdCode) {
        return jpaIcdRepository.findOne(icdCode).getTitle();
    }
}
