<?php

namespace App\Controller;

use App\Entity\Brand;
use App\Entity\Product;

use App\Repository\BrandRepository;
use App\Repository\CategoryRepository;
use App\Repository\ProductRepository;
use App\Repository\UserRepository;

use Symfony\Component\HttpFoundation\File\UploadedFile;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use Symfony\Component\HttpFoundation\Request;

use Symfony\Component\Validator\Validator\ValidatorInterface;


class ProductController extends AbstractController
{
    /**
     * POST / Create a product
     */
    public function productCreate(
        Request $request,
        ValidatorInterface $validator,
        BrandRepository $brandRepository,
        CategoryRepository $categoryRepository
    ) {
        $post = json_decode($request->getContent(), true);

        $name = isset($post['name']) ? $post['name'] : null;
        $description = isset($post['description']) ? $post['description'] : null;
        $price = isset($post['price']) ? $post['price'] : null;
        $stock = isset($post['stock']) ? $post['stock'] : null;
        $image = isset($post['image']) ? $post['image'] : null;
        $creationDate = new \DateTime('now');
        $brandName = isset($post['brand']) ? $post['brand'] : null;
        $categoryName = isset($post['category']) ? $post['category'] : null;

        $brand = $brandRepository->findOneBy(['name' => $brandName]);
        $category = $categoryRepository->findOneBy(['name' => $categoryName]);

        $product = new Product();
        $product->setName($name);
        $product->setDescription($description);
        $product->setPrice($price);
        $product->setStock($stock);
        $product->setImage($image);
        $product->setCreationDate($creationDate);
        $product->setBrand($brand);
        $product->setCategory($category);

        $errors = $validator->validate($product);

        if (count($errors) > 0) {
            $messages = [];

            foreach ($errors as $violation) {
                $messages[$violation->getPropertyPath()][] = $violation->getMessage();
            }

            return $this->json([
                'status' => 'ERROR',
                'errors' => $messages
            ]);
        }

        $em = $this->getDoctrine()->getManager();
        $em->persist($product);
        $em->flush();

        return $this->json([
            'status' => 'OK',
            'message' => 'Le produit a bien été ajouté.'
        ]);
    }

    public function productReadById(
        $id,
        Request $request,
        ProductRepository $productRepository
    ) {
        $product = $productRepository->find($id);

        if (!$product) {
            return $this->json([
                'status' => 'NOTFOUND',
                'message' => 'Le produit n\'a pas pu être trouvé.'
            ]);
        }

        return $this->json([
            'status' => 'OK',
            'product'  => $this->productToArray($product)
        ]);
    }

    /**
     * GET / Get all products
     */
    public function productList(
        Request $request,
        ProductRepository $productRepository
    ) {
        $query = $request->query;

        $limit = null !== $query->get('limit') ? $query->get('limit') : 25;
        $page = null !== $query->get('page') ? $query->get('page') : 1;
        $brandName = null !== $query->get('brand') ? $query->get('brand') : '';
        $categoryName = null !== $query->get('category') ? $query->get('category') : '';
        $search = null !== $query->get('search') ? $query->get('search') : '';
        $offset = $page > 1 ? (($page - 1) * $limit) : null;

        $products = $productRepository->findAllFromAllField($search, $limit, $offset, $brandName, $categoryName);
        $allProducts = $productRepository->findMaxFromAllField($search, $brandName, $categoryName);

        $max = ceil(sizeof($allProducts) / $limit);
        if ((int)$max === $limit) {
            $max = $max + 1;
        }

        $productsArray = [];

        foreach ($products as $product) {
            $productsArray[] = $this->productToArray($product);
        }

        return $this->json([
            'status' => 'OK',
            'products' => $productsArray,
            'max' => $max
        ]);
    }

    public function productRead(
        Request $request,
        ProductRepository $productRepository,
        UserRepository $userRepository
    ) {
        $post = json_decode($request->getContent(), true);

        $current = isset($post['current']) ? $post['current'] : null;
        $limit = isset($post['limit']) ? $post['limit'] : 15;
        $page = isset($post['page']) ? $post['page'] : 1;
        $offset = $page > 1 ? (($page - 1) * $limit) : null;

        $user = $userRepository->findOneBy(['name' => $current]);

        if (!$user) {
            return $this->json([
                'status' => 'ERROR',
                'message' => 'Seuls les admin peuvent effectuer ce genre de requête.'
            ]);
        }

        if ($user->getRole() !== 'admin') {
            return $this->json([
                'status' => 'ERROR',
                'message' => 'Seuls les admins peuvent effectuer ce genre de requête.'
            ]);
        }

        $products = $productRepository->findBy([], ['id' => 'ASC'], $limit, $offset);
        $allProducts = $productRepository->findBy([], [], null, null);

        $max = ceil(sizeof($allProducts) / $limit);
        if ((int)$max === $limit) {
            $max = $max + 1;
        }

        $productsArray = [];

        foreach ($products as $product) {
            $productsArray[] = $this->productToArray($product);
        }

        return $this->json([
            'status' => 'OK',
            'products' => $productsArray,
            'max' => $max
        ]);
    }

    /**
     * GET / Get last products
     */
    public function productLast(ProductRepository $productRepository)
    {
        $products = $productRepository->findLast();

        $productsArray = [];
        foreach ($products as $product) {
            $productsArray[] = $this->productToArray($product);
        }

        return $this->json([
            'status' => 'OK',
            'products' => $productsArray
        ]);
    }

    public function productDelete(
        Request $request,
        ProductRepository $productRepository,
        UserRepository $userRepository
    ) {
        $delete = json_decode($request->getContent(), true);

        $current = isset($delete['current']) ? $delete['current'] : null;
        $productId = isset($delete['productId']) ? $delete['productId'] : null;

        $user = $userRepository->findOneBy(['name' => $current]);

        if (!$user) {
            return $this->json([
                'status' => 'ERROR',
                'message' => 'Seuls les admin peuvent effectuer ce genre de requête.'
            ]);
        }

        if ($user->getRole() !== 'admin') {
            return $this->json([
                'status' => 'ERROR',
                'message' => 'Seuls les admins peuvent effectuer ce genre de requête.'
            ]);
        }

        $product = $productRepository->find($productId);

        if (!$product) {
            return $this->json([
                'status' => 'ERROR',
                'message' => 'Ce produit n\'éxiste pas.'
            ]);
        }

        $em = $this->getDoctrine()->getManager();
        $em->remove($product);
        $em->flush();

        return $this->json([
            'status' => 'OK',
            'message' => 'Le produit a bien été supprimé.'
        ]);
    }

    private function productToArray(Product $product)
    {
        $productArray = [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'description' => $product->getDescription(),
            'price' => $product->getPrice(),
            'stock' => $product->getStock(),
            'image' => $product->getImage(),
            'creation_date' => $product->getCreationDate(),
            'brand' => $product->getBrand()->getName(),
            'category' => $product->getCategory()->getName()
        ];

        return $productArray;
    }
}
