<?php

namespace App\Entity;

use App\Repository\CategoryRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ORM\Entity(repositoryClass=CategoryRepository::class)
 * @UniqueEntity(
 *      fields = {"name"},
 *      message = "Cette catégorie est déjé enregistrée."
 * )
 */
class Category
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotNull(
     *      message = "Le nom ne peut pas être vide."
     * )
     * @Assert\NotBlank(
     *      message = "Le nom ne peut pas être vide."
     * )
     * @Assert\Length(
     *      min = 3,
     *      max = 25,
     *      minMessage = "Le nom doit faire au moins {{ limit }} caractères.",
     *      maxMessage = "Le nom ne peut pas excéder {{ limit }} caractères.",
     *      allowEmptyString = false
     * )
     */
    private $name;

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
}
