
package lt.vtvpmc.ems.isveikata.specialization;


import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lt.vtvpmc.ems.isveikata.mappers.SpecializationMapper;

/**
 * The Class SpecializationService.
 * @author DTFG 
 * @version 1.0
 * @since 2018
 */
@Service
@Transactional
public class SpecializationService {

    /** The jpa specialization repository. */
    @Autowired
    private JpaSpecializationRepository jpaSpecializationRepository;
    
    /** The specialization mapper. */
    @Autowired
    private SpecializationMapper specializationMapper;

    /**
     * Creates the specialization.
     *
     * @param specializationDto the specialization dto
     */
    public void createSpecialization(SpecializationDto specializationDto) {
        jpaSpecializationRepository.save(specializationMapper.dtoToSpecialization(specializationDto));
    }

    /**
     * Gets the all specialization.
     *
     * @return the all specialization
     */
    public List<SpecializationDto> getAllSpecialization() {
        return specializationMapper.specializationsToDto(jpaSpecializationRepository.findAll());
    }

}
