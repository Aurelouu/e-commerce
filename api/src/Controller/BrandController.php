<?php

namespace App\Controller;

use App\Entity\Brand;
use App\Entity\Product;

use App\Repository\BrandRepository;
use App\Repository\UserRepository;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class BrandController extends AbstractController
{
    /**
     * GET / Return all brands
     */
    public function brandList(BrandRepository $brandRepository)
    {
        $brands = $brandRepository->findAll();

        $brandsArray = [];

        foreach ($brands as $brand) {
            $brandsArray[] = $this->brandToArray($brand);
        }

        if (sizeof($brandRepository->findAll()) > 0) {
            return $this->json([
                'status' => 'OK',
                'brands' => $brandsArray
            ]);
        }

        return $this->json([
            'status' => 'NOTFOUND',
            'message' => 'Aucune marque disponible.'
        ]);
    }

    /**
     * POST / Create a brand entity and add it to the database
     * Return a message on success, an array of errors on fail
     */
    public function brandCreate(
        Request $request,
        ValidatorInterface $validator,
        UserRepository $userRepository
    ) {
        $post = json_decode($request->getContent(), true);

        $current = isset($post['current']) ? $post['current'] : null;
        $brandName = isset($post['name']) ? $post['name'] : '';

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

        $brand = new Brand();
        $brand->setName($brandName);

        $errors = $validator->validate($brand);

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
        $em->persist($brand);
        $em->flush();

        return $this->json([
            'status' => 'OK',
            'brand' => $this->brandToArray($brand),
            'message' => 'La marque ' . $brand->getName() . ' a été ajoutée.'
        ]);
    }

    public function brandRead(
        Request $request,
        BrandRepository $brandRepository,
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

        $brands = $brandRepository->findBy([], ['id' => 'ASC'], $limit, $offset);
        $allBrands = $brandRepository->findBy([], [], null, null);

        $max = ceil(sizeof($allBrands) / $limit);
        if ((int)$max === $limit) {
            $max = $max + 1;
        }

        $brandsArray = [];

        foreach ($brands as $brand) {
            $brandsArray[] = $this->brandToArray($brand);
        }

        return $this->json([
            'status' => 'OK',
            'brands' => $brandsArray,
            'max' => $max
        ]);
    }

    public function brandDelete(
        Request $request,
        BrandRepository $brandRepository,
        UserRepository $userRepository
    ) {
        $delete = json_decode($request->getContent(), true);

        $current = isset($delete['current']) ? $delete['current'] : null;
        $brandId = isset($delete['brandId']) ? $delete['brandId'] : null;

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

        $brand = $brandRepository->find($brandId);

        if (!$brand) {
            return $this->json([
                'status' => 'ERROR',
                'message' => 'Cette marque n\'éxiste pas.'
            ]);
        }

        $em = $this->getDoctrine()->getManager();
        $em->remove($brand);
        $em->flush();

        return $this->json([
            'status' => 'OK',
            'message' => 'La marque a bien été supprimée.'
        ]);
    }

    /**
     * Converts brand objects to php readable array
     */
    private function brandToArray(Brand $brand)
    {
        $productRepository = $this->getDoctrine()->getRepository(Product::class);
        $brandProducts = $productRepository->findBy(['brand' => $brand]);

        $brandArray = [
            'id' => $brand->getId(),
            'name' => $brand->getName(),
            'number_product' => sizeof($brandProducts)
        ];

        return $brandArray;
    }
}
