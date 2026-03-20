import { getDb, stores } from '../src/db';
import { eq, inArray } from 'drizzle-orm';

async function main() {
  console.log('🚀 Iniciando expansión a 20 tiendas para el piloto en San Ramón...');
  const db = getDb();

  const pilotStores = [
    { id: 1, name: "Chifa Felipe Siu", city: "San Ramón, Chanchamayo, Junín", address: "Av. Principal 123", email: "felipe.siu@mercanto.pe", phone: "964123456" },
    { id: 2, name: "Restaurant Turístico Chanchamayo's", city: "San Ramón, Chanchamayo, Junín", address: "Jr. Leonardo Alvariño 570", email: "chanchamayos@mercanto.pe", phone: "964789012" },
    { id: 3, name: "Café Perené & Superfoods", city: "San Ramón, Chanchamayo, Junín", address: "Carretera Central Km 75", email: "perene@mercanto.pe", phone: "964345678" },
    { id: 4, name: "Minimarket San José", city: "San Ramón, Chanchamayo, Junín", address: "Jr. Lima 456", email: "sanjose@mercanto.pe", phone: "964901234" },
    { id: 5, name: "Fruti Selva", city: "San Ramón, Chanchamayo, Junín", address: "Jr. Leonardo Alvariño 570", email: "frutiselva@mercanto.pe", phone: "964567890" },
    { id: 6, name: "Farmacia Salud Total", city: "San Ramón, Chanchamayo, Junín", address: "Av. Principal 789", email: "saludtotal@mercanto.pe", phone: "964111222" },
    { id: 7, name: "Fundo D' Fortuna", city: "San Ramón, Chanchamayo, Junín", address: "Sector Campamento", email: "fortuna@mercanto.pe", phone: "964333444" },
    { id: 8, name: "Hogar & Deco San Ramón", city: "San Ramón, Chanchamayo, Junín", address: "Jr. Pardo 200", email: "hogardeco@mercanto.pe", phone: "964555666" },
    { id: 9, name: "Ferretería El Tornillo", city: "San Ramón, Chanchamayo, Junín", address: "Av. Marginal 456", email: "eltornillo@mercanto.pe", phone: "964777888" },
    { id: 10, name: "Panadería La Tradición", city: "San Ramón, Chanchamayo, Junín", address: "Jr. Tarma 123", email: "latradicion@mercanto.pe", phone: "964999000" },
    { id: 11, name: "TJ Estilo & Accesorios", city: "San Ramón, Chanchamayo, Junín", address: "Jr. Junín 321", email: "tjestilo@mercanto.pe", phone: "964222333" },
    { id: 12, name: "Vivero Chanchamayo", city: "San Ramón, Chanchamayo, Junín", address: "Salida a La Merced", email: "vivero@mercanto.pe", phone: "964444555" },
    { id: 13, name: "Artesanías Junín", city: "San Ramón, Chanchamayo, Junín", address: "Plaza de Armas", email: "artesanias@mercanto.pe", phone: "964666777" },
    { id: 14, name: "Parrillada El Fogón", city: "San Ramón, Chanchamayo, Junín", address: "Jr. Libertad 789", email: "elfogon@mercanto.pe", phone: "964888999" },
    { id: 15, name: "TechStore San Ramón", city: "San Ramón, Chanchamayo, Junín", address: "Av. Principal 555", email: "techstore@mercanto.pe", phone: "964000111" },
    { id: 16, name: "La Promisora", city: "San Ramón, Chanchamayo, Junín", address: "Fundo La Promisora", email: "promisora@mercanto.pe", phone: "964222444" },
    { id: 17, name: "Botica San Ramón", city: "San Ramón, Chanchamayo, Junín", address: "Jr. Lima 123", email: "boticasr@mercanto.pe", phone: "964555111" },
    { id: 18, name: "Pollos Pío Pío Rico", city: "San Ramón, Chanchamayo, Junín", address: "Jr. Lima 888", email: "piopio@mercanto.pe", phone: "964777222" },
    { id: 19, name: "Sublichamo Regalos", city: "San Ramón, Chanchamayo, Junín", address: "Jr. Pardo 456", email: "sublichamo@mercanto.pe", phone: "964999333" },
    { id: 20, name: "Licores Selva Central", city: "San Ramón, Chanchamayo, Junín", address: "Av. Marginal 101", email: "licores@mercanto.pe", phone: "964111444" },
  ];

  try {
    for (const storeData of pilotStores) {
      await db.update(stores)
        .set({
          name: storeData.name,
          city: storeData.city,
          address: storeData.address,
          email: storeData.email,
          phone: storeData.phone,
          updated_at: new Date()
        })
        .where(eq(stores.id, storeData.id));
    }

    console.log('✅ Se han actualizado y expandido las 20 tiendas exitosamente para el piloto San Ramón.');
  } catch (error) {
    console.error('❌ Error al actualizar las tiendas:', error);
    process.exit(1);
  }
}

main().then(() => process.exit(0));
