package compliance.qualita.controller;

import compliance.qualita.domain.Person;
import compliance.qualita.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;

@RestController
@RequestMapping("/funcionario")
public class PersonController {

    @Autowired
    private PersonService personService;

    @PostMapping
    public Person postPerson(
            @RequestBody Person person
    ) throws MessagingException {
        return personService.addPerson(person);
    }

    @PutMapping("/mudar-senha")
    public Person changePassword(
            @RequestParam String cpf,
            @RequestParam String password
    ) {
        return personService.changePassword(cpf, password);
    }

    @DeleteMapping
    public boolean deletePerson(
            @RequestParam String cpf
    ) {
        return personService.deletePerson(cpf);
    }

    @GetMapping("/login")
    public boolean login(
            @RequestParam String cpfOrCnpj,
            @RequestParam String password
    ) {
        return personService.validadeLogin(cpfOrCnpj, password);
    }
}