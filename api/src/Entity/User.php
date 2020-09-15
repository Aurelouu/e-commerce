<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Entity(repositoryClass=UserRepository::class)
 * @UniqueEntity(
 *      fields = {"name"},
 *      message = "Cet nom d'utilisateur est déjé enregistré."
 * )
 * @UniqueEntity(
 *      fields = {"email"},
 *      message = "Cet adresse mail est déjé enregistrée."
 * )
 */
class User implements UserInterface
{

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotNull(message = " Veuillez renseigner votre nom s'il vous plait.")
     * @Assert\NotBlank(message = " Veuillez renseigner votre nom s'il vous plait.")
     * @Assert\Length(
     *      min = 3,
     *      max = 25,
     *      minMessage = "Votre nom doit faire au moins {{ limit }} caractères.",
     *      maxMessage = "Votre nom doit faire moins de {{ limit }} caractères.",
     *      allowEmptyString = false
     * )
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotNull(message = "veuillez renseigner votre role s'il vous plait.")
     * @Assert\NotBlank(message = " veuillez renseigner votre role s'il vous plait.")
     * @Assert\Choice({"user", "admin", "deleted"})
     */
    private $role;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotNull(message = " Veuillez renseigner votre email s'il vous plait.")
     * @Assert\NotBlank(message = "Veuillez renseigner votre email s'il vous plait.")
     * @Assert\Email(message = "Le format de l'email '{{ value }}' n'est pas valide.")
     */

    private $email;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotNull(message = " veuillez renseigner votre mot de passe s'il vous plait.")
     * @Assert\NotBlank(message = " Veuillez renseigner votre mot de passe s'il vous plait.")
     * @Assert\Length(
     *      min = 8,
     *      max = 30,
     *      minMessage = "Votre mot de passe doit faire au moins {{ limit }} caractères.",
     *      maxMessage = "Votre mot de passe doit faire moins de {{ limit }} caractères.",
     *      allowEmptyString = false
     * )
     */
    private $password;

    /**
     * @Assert\EqualTo(
     *      propertyPath = "password",
     *      message = "Les mots de passes ne correspondent pas."
     * )
     */
    private $passwordConfirm;

    /**
     * @Assert\NotNull(message = " Date obligatoire.")
     * @Assert\NotBlank(message = "Date obligatoire.")
     * @ORM\Column(type="date")
     
     */
    private $creation_date;

    public function getUsername()
    {
        return $this->username;
    }

    public function getSalt()
    {
        // you *may* need a real salt depending on your encoder
        // see section on salt below
        return null;
    }

    public function getRoles()
    {
        return array('ROLE_USER');
    }

    public function eraseCredentials()
    {
    }

    /** @see \Serializable::serialize() */
    public function serialize()
    {
        return serialize(array(
            $this->id,
            $this->username,
            $this->password,
            // see section on salt below
            // $this->salt,
        ));
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getRole(): ?string
    {
        return $this->role;
    }

    public function setRole(string $role): self
    {
        $this->role = $role;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword()
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function setPasswordConfirm(string $passwordConfirm): self
    {
        $this->passwordConfirm = $passwordConfirm;

        return $this;
    }

    public function getCreationDate(): ?\DateTimeInterface
    {
        return $this->creation_date;
    }

    public function setCreationDate(\DateTimeInterface $creation_date): self
    {
        $this->creation_date = $creation_date;

        return $this;
    }
}
