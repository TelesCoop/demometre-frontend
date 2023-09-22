# Démomètre - code frontend

## Notes pour les développeurs

### Ordre d'une évaluation

Cf `userStep.ts` :

1. localisation pour trouver s'il existe déjà une évalution pour cette
   localité (commune ou EPCI) -> appelle `assessments/by-locality/`
   pour avoir la réponse. Si une évalution (autre que diagnostic rapide)
   a déja été créée pour cette localité, on rejoint cette évalution. Sinon,
   une nouvelle évaluation est créée.
2. si c'est une nouvelle évaluation, (sinon, on passe à l'étape suivante),
   sur `/evaluation/initialisation`
    - on choisit le type d'évaluation
    - on confirme qu'on accepte les conditions
    - on choisit le nom à afficher publiquement comme porteur et
      au nom de qui on évalue (asso / mairie)
3. sur `/evaluation/initialisation/[id]/question-objectives` on répond aux questions objectives
