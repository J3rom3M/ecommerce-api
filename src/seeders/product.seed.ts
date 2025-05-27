import "dotenv/config"; // Charge les variables d’environnement automatiquement
import { DataSource } from "typeorm";
import { Product } from "../entities/product/product";
import { faker } from "@faker-js/faker";

// Vérification rapide pour s'assurer que les variables sont bien chargées
if (!process.env.DB_USERNAME || !process.env.DB_PASSWORD) {
  throw new Error("❌ Les variables d'environnement de la base de données ne sont pas définies !");
}

// Créer une source de données TypeORM (remplace avec tes configs)
const AppDataSource = new DataSource({
  type: "mariadb",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306", 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Product],
  synchronize: true, // ⚠️ Active temporairement pour dev, à désactiver en prod
});

// Fonction pour récupérer une image aléatoire de produits
const getRandomProductImage = () => {
  const sources = [
    `https://picsum.photos/400/300?random=${faker.number.int({ min: 1, max: 1000 })}`,
    `https://loremflickr.com/400/300/product`,
  ];
  return sources[Math.floor(Math.random() * sources.length)]; // Sélectionne aléatoirement une image Picsum ou Flickr
};


async function seedProducts() {
  await AppDataSource.initialize();
  const productRepository = AppDataSource.getRepository(Product);

  // Génération de 50 produits fictifs en respectant la structure de l'entité
   const fakeProducts = Array.from({ length: 50 }, () => ({
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price({ min: 1, max: 500 })),
    stock: faker.number.int({ min: 0, max: 100 }), // Stock aléatoire entre 0 et 100
    // image: faker.image.urlPicsumPhotos({ width: 400, height: 300 }),
    image: getRandomProductImage(), // Image liée au commerce

  }));

  await productRepository.save(fakeProducts);
  console.log("✅ Faux produits insérés avec succès !");
}

// Exécuter le script
seedProducts()
  .catch((error) => console.error("❌ Erreur lors de l'insertion des produits :", error))
  .finally(() => AppDataSource.destroy()); // Nettoyage de la connexion