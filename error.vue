<template>
  <NuxtLayout name="default">
    <div class="container mt-3">
      <h1 class="title">
        Erreur : la page n'existe pas
      </h1>
      <div>
        <NuxtLink
          to="/compte"
          class="button is-dark is-rounded"
        >
          Aller à mon compte
        </NuxtLink>
        <NuxtLink
          to="/"
          class="button is-rounded ml-2"
        >
          Aller à la page d'accueil
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>
