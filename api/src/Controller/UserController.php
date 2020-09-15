<?php

namespace App\Controller;

use App\Entity\User;

use App\Repository\UserRepository;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;


class UserController extends AbstractController
{
    public function userCreate(Request $request, ValidatorInterface $validator, UserPasswordEncoderInterface $encoder): Response
    {
        $post = json_decode($request->getContent(), true);

        $name = isset($post['name']) ? $post['name'] : '';
        $email = isset($post['email']) ? $post['email'] : '';
        $password = isset($post['password']) ? $post['password'] : '';
        $passwordConfirm = isset($post['passwordConfirm']) ? $post['passwordConfirm'] : '';

        $user = new User();
        $user->setName($name);
        $user->setRole('user');
        $user->setEmail($email);
        $user->setPassword($password);
        $user->setPasswordConfirm($passwordConfirm);
        $user->setCreationDate(new \DateTime());

        $errors = $validator->validate($user);

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

        $encoded = $encoder->encodePassword($user, $password);

        $user->setPassword($encoded);

        $em = $this->getDoctrine()->getManager();
        $em->persist($user);

        $em->flush();

        return $this->json([
            'status' => 'OK',
            'message' => 'Bienvenue! Vous pouvez maintenant vous connecter.'
        ]);
    }

    public function userLogin(Request $request, UserRepository $userRepository, UserPasswordEncoderInterface $encoder)
    {

        $post = json_decode($request->getContent(), true);

        $email = isset($post['email']) ? $post['email'] : '';
        $password = isset($post['password']) ? $post['password'] : '';

        $user = $userRepository->findOneBy(['email' => $email]);

        if (!$user) {
            return $this->json([
                'status' => 'ERROR',
                'errors' => [
                    'email' => 'Cet adresse mail n\'est pas enregistré.'
                ]
            ]);
        }

        if ($user->getRole() === 'deleted') {
            return $this->json([
                'status' => 'ERROR',
                'errors' => [
                    'name' => 'Ce compte a été désactivé.'
                ]
            ]);
        }

        $encoded = $encoder->isPasswordValid($user, $password);

        if (!$encoded) {
            return $this->json([
                'status' => 'ERROR',
                'errors' => [
                    'password' => 'Mauvais mot de passe.'
                ]
            ]);
        }

        return $this->json([
            'status' => 'OK',
            'user' => $this->userToArray($user)
        ]);
    }

    public function userUpdatePassword(
        Request $request,
        ValidatorInterface $validator,
        UserRepository $userRepository,
        UserPasswordEncoderInterface $encoder
    ) {
        $put = json_decode($request->getContent(), true);

        $current = isset($put['current']) ? $put['current'] : '';

        $user = $userRepository->findOneBy(['email' => $current]);
        if (!$user) {
            return $this->json([
                'status' => 'Error',
                'errors' => [
                    'global' => 'Une erreur est survenue.'
                ]
            ]);
        }

        $password = isset($put['password']) ? $put['password'] : '';

        $validPassword = $encoder->isPasswordValid($user, $password);

        if (!$validPassword) {
            return $this->json([
                'status' => 'ERROR',
                'errors' => [
                    'oldPassword' => 'Mauvais mot de passe.'
                ]
            ]);
        }

        $newPassword = isset($put['newPassword']) ? $put['newPassword'] : '';
        $newPasswordConfirm = isset($put['newPasswordConfirm']) ? $put['newPasswordConfirm'] : '';

        $user->setPassword($newPassword);
        $user->setPasswordConfirm($newPasswordConfirm);

        $errors = $validator->validate($user);

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

        $encoded = $encoder->encodePassword($user, $newPassword);

        $user->setPassword($encoded);

        $em = $this->getDoctrine()->getManager();
        $em->flush();

        return $this->json([
            'status' => 'OK',
            'message' => 'Votre mot de passe a bien été modifié.',
            'user' => $this->userToArray($user)
        ]);
    }

    public function userUpdateInfos(
        Request $request,
        ValidatorInterface $validator,
        UserRepository $userRepository,
        UserPasswordEncoderInterface $encoder
    ) {
        $put = json_decode($request->getContent(), true);

        $current = isset($put['current']) ? $put['current'] : null;

        $user = $userRepository->findOneBy(['email' => $current]);
        if (!$user) {
            return $this->json([
                'status' => 'Error',
                'errors' => [
                    'global' => 'Une erreur est survenue.'
                ]
            ]);
        }

        $password = isset($put['password']) ? $put['password'] : null;

        $validPassword = $encoder->isPasswordValid($user, $password);

        if (!$validPassword) {
            return $this->json([
                'status' => 'ERROR',
                'errors' => [
                    'oldPassword' => 'Mauvais mot de passe.'
                ]
            ]);
        }


        $newName = isset($put['newName']) ? $put['newName'] : $user->getName();
        $newEmail = isset($put['newEmail']) ? $put['newEmail'] : $user->getEmail();

        $userVerif = new User();
        $userVerif->setRole('user');
        $userVerif->setName($newName);
        $userVerif->setEmail($newEmail);
        $userVerif->setPassword($password);
        $userVerif->setPasswordConfirm($password);
        $userVerif->setCreationDate(new \DateTime());

        $errors = $validator->validate($userVerif);

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

        $user->setName($newName);
        $user->setEmail($newEmail);
        $em = $this->getDoctrine()->getManager();
        $em->flush();

        return $this->json([
            'status' => 'OK',
            'message' => 'Vos informations ont bien été modifiées.',
            'user' => $this->userToArray($user)
        ]);
    }

    public function userRead(
        Request $request,
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

        $users = $userRepository->findBy([], ['id' => 'ASC'], $limit, $offset);
        $allUsers = $userRepository->findBy([], [], null, null);

        $max = ceil(sizeof($allUsers) / $limit);
        if ((int)$max === $limit) {
            $max = $max + 1;
        }

        $usersArray = [];

        foreach ($users as $user) {
            $usersArray[] = $this->userToArray($user);
        }

        return $this->json([
            'status' => 'OK',
            'users' => $usersArray,
            'max' => $max
        ]);
    }

    public function userDeactivate(
        Request $request,
        UserRepository $userRepository
    ) {
        $put = json_decode($request->getContent(), true);
        $current = isset($put['current']) ? $put['current'] : '';

        $user = $userRepository->findOneBy(['name' => $current]);
        if (!$user) {
            return $this->json([
                'status' => 'ERROR',
                'errors' => [
                    'global' => 'L\'utilisateur n\'existe pas.'
                ]
            ]);
        }

        if ($user->getRole() === 'deleted') {
            return $this->json([
                'status' => 'ERROR',
                'errors' => [
                    'global' => 'Ce compte est déjà désactivé.'
                ]
            ]);
        }

        $user->setRole('deleted');

        $em = $this->getDoctrine()->getManager();
        $em->flush();

        return $this->json([
            'status' => 'OK',
            'user' => $this->userToArray($user)
        ]);
    }

    public function userDelete(
        Request $request,
        UserRepository $userRepository
    ) {
        $delete = json_decode($request->getContent(), true);
        $current = isset($delete['current']) ? $delete['current'] : '';

        $user = $userRepository->findOneBy(['name' => $current]);
        if (!$user) {
            return $this->json([
                'status' => 'ERROR',
                'errors' => [
                    'global' => 'L\'utilisateur n\'existe pas.'
                ]
            ]);
        }
        $em = $this->getDoctrine()->getManager();
        $em->remove($user);
        $em->flush();

        return $this->json([
            'status' => 'OK',
            'message' => 'L\'utilisateur a bien été supprimé.'
        ]);
    }

    private function userToArray(User $user)
    {
        $userArray = [
            'id' => $user->getId(),
            'name' => $user->getName(),
            'email' => $user->getEmail(),
            'role' => $user->getRole(),
            'creation_date' => $user->getCreationDate()
        ];

        return $userArray;
    }
}
