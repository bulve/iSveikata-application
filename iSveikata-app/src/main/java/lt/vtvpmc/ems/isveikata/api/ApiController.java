package lt.vtvpmc.ems.isveikata.api;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api")
@CrossOrigin(origins = "*")
public class ApiController {

    @Autowired
    private ApiService apiService;

    /**
     * Creates new Active Pharmaceutical Ingredient
     *
     * @param api
     */
    @PostMapping("/api")
    private void createApi(@RequestBody ApiDto api) {
        apiService.createApi(api);
    }

    /**
     * Gets all Active Pharmaceutical Ingredients
     *
     * @return all specialization
     */
    @GetMapping("/api")
    private List<ApiDto> getAllApi() {
        return apiService.getAllApi();
    }

}
