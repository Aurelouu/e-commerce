<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\Product;

use App\Repository\CategoryRepository;
use App\Repository\UserRepository;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class CategoryController extends AbstractController
{
    /**
     * GET / Return all categories
     */
    public function categoryList(CategoryRepository $categoryRepository)
    {
        $categories = $categoryRepository->findAll();

        $catergoriesArray = [];

        foreach ($categories as $category) {
            $catergoriesArray[] = $this->categoryToArray($category);
        }

        if (sizeof($categoryRepository->findAll()) > 0) {
            return $this->json([
                'status' => 'OK',
                'categories' => $catergoriesArray
            ]);
        }

        return $this->json([
            'status' => 'NOTFOUND',
            'message' => 'Aucune catégorie disponible.'
        ]);
    }

    /**
     * POST / Create a category entity and add it to the database
     * Return a message on success, an array of errors on fail
     */
    public function categoryCreate(
        Request $request,
        ValidatorInterface $validator,
        UserRepository $userRepository
    ) {
        $post = json_decode($request->getContent(), true);

        $current = isset($post['current']) ? $post['current'] : null;
        $categoryName = isset($post['name']) ? $post['name'] : '';

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
        $category = new Category();
        $category->setName($categoryName);

        $errors = $validator->validate($category);

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
        $em->persist($category);
        $em->flush();

        return $this->json([
            'status' => 'OK',
            'category' => $this->categoryToArray($category),
            'message' => 'La catégorie ' . $category->getName() . ' a été ajoutée.'
        ]);
    }

    public function categoryRead(
        Request $request,
        CategoryRepository $categoryRepository,
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

        $categories = $categoryRepository->findBy([], ['id' => 'ASC'], $limit, $offset);
        $allCategories = $categoryRepository->findBy([], [], null, null);

        $max = ceil(sizeof($allCategories) / $limit);
        if ((int)$max === $limit) {
            $max = $max + 1;
        }

        $categoriesArray = [];

        foreach ($categories as $category) {
            $categoriesArray[] = $this->categoryToArray($category);
        }

        return $this->json([
            'status' => 'OK',
            'categories' => $categoriesArray,
            'max' => $max
        ]);
    }

    public function categoryDelete(
        Request $request,
        CategoryRepository $categoryRepository,
        UserRepository $userRepository
    ) {
        $delete = json_decode($request->getContent(), true);

        $current = isset($delete['current']) ? $delete['current'] : null;
        $categoryId = isset($delete['categoryId']) ? $delete['categoryId'] : null;

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

        $category = $categoryRepository->find($categoryId);

        if (!$category) {
            return $this->json([
                'status' => 'ERROR',
                'message' => 'Cette catégorie n\'éxiste pas.'
            ]);
        }

        $em = $this->getDoctrine()->getManager();
        $em->remove($category);
        $em->flush();

        return $this->json([
            'status' => 'OK',
            'message' => 'La catégorie a bien été supprimée.'
        ]);
    }

    /**
     * Converts category objects to php readable array
     */
    private function categoryToArray(Category $category)
    {
        $productRepository = $this->getDoctrine()->getRepository(Product::class);
        $categoryProducts = $productRepository->findBy(['category' => $category]);

        $categoryArray = [
            'id' => $category->getId(),
            'name' => $category->getName(),
            'number_products' => sizeof($categoryProducts)
        ];

        return $categoryArray;
    }
}
