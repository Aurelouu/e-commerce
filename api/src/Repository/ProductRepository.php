<?php

namespace App\Repository;

use App\Entity\Product;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Product|null find($id, $lockMode = null, $lockVersion = null)
 * @method Product|null findOneBy(array $criteria, array $orderBy = null)
 * @method Product[]    findAll()
 * @method Product[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

    /**
     * @return Product[] Returns an array of Product objects
     */
    public function findAllFromAllField($search, $limit, $offset, $brandName, $categoryName, $orderPrice = false)
    {
        $query = $this->createQueryBuilder('p')
            ->orWhere('p.name LIKE :search')
            ->orWhere('p.description LIKE :search')
            ->andWhere('b.name LIKE :brand')
            ->andWhere('c.name LIKE :category');

        if ($brandName === '') {
            $brandName = "%%";
        }
        if ($categoryName === '') {
            $categoryName = "%%";
        }

        $query->join('p.brand', 'b')
            ->join('p.category', 'c');

        $query->setParameter('search', "%" . $search . "%")
            ->setParameter('brand', $brandName)
            ->setParameter('category', $categoryName);

        if ($orderPrice) {
            $query->orderBy('p.price', 'ASC');
        }

        return $query->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();
    }

    public function findMaxFromAllField($search, $brandName, $categoryName, $orderPrice = false)
    {
        $query = $this->createQueryBuilder('p')
            ->orWhere('p.name LIKE :search')
            ->orWhere('p.description LIKE :search')
            ->andWhere('b.name LIKE :brand')
            ->andWhere('c.name LIKE :category');

        if ($brandName === '') {
            $brandName = "%%";
        }
        if ($categoryName === '') {
            $categoryName = "%%";
        }

        $query->join('p.brand', 'b')
            ->join('p.category', 'c');

        $query->setParameter('search', "%" . $search . "%")
            ->setParameter('brand', $brandName)
            ->setParameter('category', $categoryName);

        if ($orderPrice) {
            $query->orderBy('p.price', 'ASC');
        }

        return $query->getQuery()
            ->getResult();
    }

    /**
     * @return Product[] Returns an array of Product objects
     */
    public function findLast()
    {
        return $this->createQueryBuilder('p')
            ->orderBy('p.creation_date', 'DESC')
            ->setMaxResults(15)
            ->getQuery()
            ->getResult();
    }
}
