import gettext from "../utils/gettext-util"

const { $gettext } = gettext

export const ErrorMessages = {
  default: $gettext("Une erreur s'est produite dans le serveur"),
  assessment_already_initiated: $gettext("L'évaluation a déjà été initialisée"),
  email_not_corresponding_assessment:
    $gettext("L'email ne correspond pas à l'instance initiatrice"),
  incorrect_initiator_assessment: $gettext("Le type de l'initiateur est incorrect"),
  no_zip_code_municipality: $gettext("Aucune commune ne correspond à ce code postal"),
  no_zip_code_epci: $gettext("Aucune intercommunalité ne correspond à ce code postal"),
  email_already_exists: $gettext("Le mail est déjà utilisé"),
  email_not_valid: $gettext("Le mail n'est pas valide"),
  no_email: $gettext("Cet email ne correspond à aucun utilisateur"),
  wrong_password_for_email: $gettext("Email et mot de passe ne correspondent pas"),
  password_reset_key_outdate:
    $gettext("La clé de réinitialisation du mot de passe est périmée (24h max), veuillez redemander un changement de mot de passe."),
  question_not_needed: $gettext("Vous n'avez pas à répondre à cette question."),
  missing_data_to_validate: $gettext("Il manque des données afin de valider"),
  invalid_email_shape: $gettext("La forme de l'email n'est pas correct"),
}
