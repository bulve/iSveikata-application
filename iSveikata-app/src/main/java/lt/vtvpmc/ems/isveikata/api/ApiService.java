package lt.vtvpmc.ems.isveikata.api;


import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lt.vtvpmc.ems.isveikata.mappers.ApiMapper;

/**
 * The Class ApiService.
 * Active Pharmaceutical Ingredients (API) 
 * @author DTFG 
 * @version 1.0
 * @since 2018
 */
@Service
@Transactional
//@PreAuthorize("hasRole('Doctor')")
public class ApiService {

    /** The api repository. */
    @Autowired
    private JpaApiRepository apiRepository;
    
    /** The mapper. */
    @Autowired
    private ApiMapper mapper;

    /**
     * Converts from DTO to Entitiy API and saves it.
     *
     * @param api the API
     */
    public void createApi(ApiDto api) {
        apiRepository.save(mapper.dtoToApi(api));
    }

    /**
     * Gets the all API from database and converts them to DTO.
     *
     * @return the all APIDTO's
     */
    public List<ApiDto> getAllApi() {
        return mapper.apisToDto(apiRepository.findAll());
    }

}