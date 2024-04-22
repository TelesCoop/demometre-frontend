<template>
  <NuxtLayout name="default">
    <div class="container mt-3">
      <h1 class="title">
        Erreur
      </h1>
      <p>Nous sommes désolés, une erreur est survenue.</p>
      <p>Utilisez le menu du haut pour naviguer, ou pour des évaluations passez par Mon compte.</p>
      <div class="mt-2">
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
