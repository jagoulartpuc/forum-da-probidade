package compliance.forumdapropriedade.controller;

import compliance.forumdapropriedade.domain.Company;
import compliance.forumdapropriedade.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/empresa")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @PostMapping
    public Company postCompany(
            @RequestBody Company company
    ) {
        return companyService.addCompany(company);
    }

    @GetMapping
    public List<Company> getAllCompanies() {
        return companyService.getCompanies();
    }

    @DeleteMapping
    public boolean deleteCompany(
            @RequestParam String cnpj
    ) {
        return companyService.deleteCompany(cnpj);
    }
}