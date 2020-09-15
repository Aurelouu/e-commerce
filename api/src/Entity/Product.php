<?php

namespace App\Entity;

use App\Repository\ProductRepository;
use App\Entity\Category;
use App\Entity\Brand;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=ProductRepository::class)
 */
class Product
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     * @Assert\NotNull(
     *      message = "Veuillez indiquer un stock."
     * )
     * @Assert\NotBlank(
     *      message = "Veuillez indiquer un stock."
     * )
     * @Assert\PositiveOrZero(
     *      message = "Le stock ne peut pas être négatif."
     * )
     * @Assert\Type(
     *      type = "integer",
     *      message = "Le stock doit être un nombre." 
     * )
     */
    private $stock;

    /**
     * @ORM\Column(type="float")
     * @Assert\NotNull(
     *      message = "Veuillez indiquer un prix."
     * )
     * @Assert\NotBlank(
     *      message = "Veuillez indiquer un prix."
     * )
     * @Assert\PositiveOrZero(
     *      message = "Le price ne peut pas être négatif."
     * )
     * @Assert\Type(
     *      type = "float",
     *      message = "Le prix doit être un nombre." 
     * )
     */
    private $price;

    /**
     * @ORM\Column(type="text")
     * @Assert\NotNull(
     *      message = "Veuillez indiquer une description."
     * )
     * @Assert\Length(
     *      min = 20,
     *      max = 2000,
     *      minMessage = "La descrition doit faire au moins {{ limit }} caractères.",
     *      maxMessage = "La description ne peut pas excéder {{ limit }} caractères.",
     *      allowEmptyString = false
     * )
     */
    private $description;

    /**
     * @ORM\Column(type="date")
     */
    private $creation_date;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotNull(
     *      message = "Veuillez indiquer un titre."
     * )
     * @Assert\Length(
     *      min = 5,
     *      max = 255,
     *      minMessage = "Le titre du produit doit faire plus de {{ limit }} caractères.",
     *      maxMessage = "Le titre du produit ne peux pas excéder {{ limit }} caractères.",
     *      allowEmptyString = false
     * )
     */
    private $name;


    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(
     *      message = "Veuillez lier une image au produit."
     * )
     * @Assert\NotNull(
     *      message = "Veuillez lier une image au produit."
     * )
     */
    private $image;

    /**
     * @ORM\ManyToOne(targetEntity=category::class)
     * @ORM\JoinColumn(nullable=false)
     * @Assert\NotNull(
     *      message = "Veuillez indiquer une catégorie existante."
     * )
     */
    private $category;

    /**
     * @ORM\ManyToOne(targetEntity=brand::class)
     * @ORM\JoinColumn(nullable=false)
     * @Assert\NotNull(
     *      message = "Veuillez indiquer une marque existante."
     * )
     */
    private $brand;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStock(): ?int
    {
        return $this->stock;
    }

    public function setStock(?int $stock): self
    {
        $this->stock = $stock;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(?float $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getCreationDate(): ?\DateTimeInterface
    {
        return $this->creation_date;
    }

    public function setCreationDate(?\DateTimeInterface $creation_date): self
    {
        $this->creation_date = $creation_date;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): self
    {
        $this->image = $image;

        return $this;
    }

    public function getCategory(): ?category
    {
        return $this->category;
    }

    public function setCategory(?category $category): self
    {
        $this->category = $category;

        return $this;
    }

    public function getBrand(): ?brand
    {
        return $this->brand;
    }

    public function setBrand(?brand $brand): self
    {
        $this->brand = $brand;

        return $this;
    }
}
