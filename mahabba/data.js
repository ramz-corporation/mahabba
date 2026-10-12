// Remplace les liens Drive par les vrais.
// Le fichier Drive doit être partagé en « Tous les utilisateurs disposant du lien ».
const AUTHORS = [
  {
    id: "ibn-mansour",
    name: "Ibn Mansour",
    role: "Écrivain & Enseignant",
    bio: "Spécialiste de la spiritualité islamique et du soufisme.",
    photo: "" // ex: "img/ibn-mansour.jpg" — vide = silhouette
  }
];

const BOOKS = [
  {
    id: "fi-sumeti",
    title: "Fi Sumeti",
    authorId: "ibn-mansour",
    description: "Un ouvrage de spiritualité publié par Mahabba Éditions. (Remplace par la vraie présentation du livre.)",
    language: "Français",
    pages: "—",
    cover: "",  // ex: "img/fi-sumeti.jpg" — vide = couverture générée
    drive: "https://drive.google.com/file/d/REMPLACE_PAR_ID_DU_FICHIER/view?usp=sharing"
  }
];