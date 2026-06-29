import { readFileSync } from "node:fs";
import { join } from "node:path";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";

const vehicles = [
  ["Suzuki Alto","suzuki-alto","Sedan","Rs.3,000/day","Rs.4,500 outside","20,000-24,000","65,000-80,000"],
  ["Suzuki Cultus","suzuki-cultus","Sedan","Rs.3,500/day","Rs.5,000 outside","24,500-28,000","75,000-90,000"],
  ["Suzuki WagonR","suzuki-wagonr","Sedan","Rs.3,000/day","Rs.4,500 outside","24,500-28,000","75,000-90,000"],
  ["Suzuki Swift","suzuki-swift","Sedan","Rs.3,500/day","Rs.5,000 outside","25,000-30,000","80,000-95,000"],
  ["Toyota Corolla","toyota-corolla","Sedan","Rs.4,500/day","Rs.6,000 outside","28,000-35,000","90,000-110,000"],
  ["Toyota Yaris","toyota-yaris","Sedan","Rs.4,500/day","Rs.6,000 outside","28,000-35,000","90,000-110,000"],
  ["Honda Civic X","honda-civic-x","Sedan","Rs.8,000/day","Rs.9,000 outside","45,000-55,000","140,000-160,000"],
  ["Honda Vezel","honda-vezel","SUV","Rs.9,000/day","Rs.12,000 outside","55,000-65,000","160,000-190,000"],
  ["Honda BRV","honda-brv","SUV","Rs.6,000/day","Rs.7,000 outside","38,000-45,000","115,000-135,000"],
  ["Toyota Fortuner","toyota-fortuner","SUV","Rs.15,000/day","Rs.18,000 outside","90,000-105,000","270,000-315,000"],
  ["Toyota Revo","toyota-revo","SUV","Rs.14,000/day","Rs.17,000 outside","85,000-100,000","255,000-300,000"],
  ["Toyota Land Cruiser Prado","toyota-land-cruiser-prado","Luxury","Rs.18,000/day","Rs.25,000 outside","110,000-130,000","330,000-390,000"],
  ["Toyota Land Cruiser V8","toyota-land-cruiser-v8","Luxury","Rs.28,000/day","Rs.35,000 outside","165,000-195,000","500,000-585,000"],
  ["Toyota HiAce","toyota-hiace","Van","Rs.10,000/day","Rs.12,000 outside","60,000-72,000","180,000-216,000"],
  ["Toyota Coaster","toyota-coaster","Van","Rs.12,000/day","Rs.18,000 outside","72,000-90,000","216,000-270,000"]
];

const pricing = [
  ["Sedan","Islamabad","Rs. 17,000"],["7 Seater","Islamabad","Rs. 22,000"],
  ["Sedan","Multan","Rs. 17,000"],["7 Seater","Multan","Rs. 22,000"],
  ["Sedan","Sialkot","Rs. 12,000"],["7 Seater","Sialkot","Rs. 16,000"],
  ["Sedan","Faisalabad","Rs. 12,000"],["7 Seater","Faisalabad","Rs. 12,000"],
  ["Sedan","Gujranwala","Rs. 10,000"],["7 Seater","Gujranwala","Rs. 14,000"]
];

async function main() {
  const schema = readFileSync(join(process.cwd(), "db/schema.sql"), "utf8");
  await sql.query(schema);

  const passwordHash = await bcrypt.hash("ADMIN1", 12);
  await sql`insert into admins (username, password_hash) values ('ADMIN1', ${passwordHash}) on conflict (username) do update set password_hash=excluded.password_hash`;

  await sql`delete from hero_sections`;
  await sql`insert into hero_sections (title, description, button_text, button_link, active) values ('Your Ride, Your Way', 'Premium car rental across Lahore and all major cities of Pakistan. Expert drivers. Reliable vehicles. Affordable prices.', 'Book Now', '#vehicles', true)`;

  await sql`delete from logos`;
  await sql`insert into logos (logo_text, brand_name, active) values ('Mian Rent A Car', 'CarMian®', true)`;

  await sql`delete from contact_info`;
  await sql`
    insert into contact_info (phone1, phone2, phone3, whatsapp, email, address, website_url, facebook_url, instagram_url, tiktok_url, google_maps_embed_url)
    values ('0304-4008105','0301-4708912','0303-4188831','+92 304 4008105','Mianrentacar616@gmail.com','Wapda Town G5 Block, Near Khalid Bridge, Lahore','www.carmian.com','#','#','#','https://www.google.com/maps?q=Wapda%20Town%20G5%20Block%20Near%20Khalid%20Bridge%20Lahore&output=embed')
  `;

  await sql`delete from vehicles`;
  for (const [i, v] of vehicles.entries()) {
    await sql`
      insert into vehicles (name, slug, category, price_lahore, price_outside, weekly_price, monthly_price, rating, description, features, active, sort_order)
      values (${v[0]}, ${v[1]}, ${v[2]}, ${v[3]}, ${v[4]}, ${v[5]}, ${v[6]}, 5, 'Comfortable rental vehicle with professional driver service.', 'AC, Professional driver, Clean interior', true, ${i})
    `;
  }

  await sql`delete from pricing_rates`;
  for (const [i, r] of pricing.entries()) {
    await sql`insert into pricing_rates (car_type, destination_city, one_way_price, timing_note, active, sort_order) values (${r[0]}, ${r[1]}, ${r[2]}, '24 hours, within the same date', true, ${i})`;
  }

  await sql`delete from about_content`;
  await sql`
    insert into about_content (title, description, mission_statement, vision_statement, happy_customers_count, available_vehicles_count, years_experience, support_text)
    values ('Reliable Rental Service in Lahore','Professional drivers, clear pricing, and vehicles prepared for local and intercity travel.','To provide clean, reliable, and affordable rental cars with professional drivers for every journey.','To become Lahore''s most trusted car rental brand for family, business, event, and intercity travel.',500,15,5,'24/7 Support')
  `;

  await sql`delete from about_cards`;
  await sql`insert into about_cards (icon,title,description,active,sort_order) values ('🕐','Reliability in Timing','We guarantee punctuality. Our fleet is always ready to dispatch the right vehicle on time, every time.',true,1),('🚗','Experienced Drivers','Our professional drivers know every route in Lahore and beyond, ensuring a safe and smooth journey.',true,2),('💰','Value for Money','Competitive rates, flexible packages, and no hidden charges. Best service at the best price, guaranteed.',true,3)`;

  await sql`delete from customer_reviews`;
  await sql`insert into customer_reviews (customer_name, customer_city, review_text, rating, avatar_initials, active, sort_order) values ('Ahmed R.','Islamabad','Excellent service! The car was clean and driver was very professional. Will definitely book again.',5,'AR',true,1),('Sara M.','Lahore','Booked a Fortuner for our family trip to Murree. Everything was perfect, very punctual.',5,'SM',true,2),('Usman K.','Lahore','Great prices and reliable service. Used Mian Rent A Car for my wedding and they didn''t disappoint.',5,'UK',true,3),('Bilal T.','Faisalabad','Responsive team, clean vehicle, very easy booking process over WhatsApp. Highly recommend!',4,'BT',true,4)`;

  await sql`insert into blog_categories (name, slug, description, active) values ('Car Rental Guides','car-rental-guides','Helpful rent a car Lahore guides and travel tips.',true) on conflict (slug) do nothing`;
  await sql`
    insert into seo_settings (page_name, page_path, meta_title, meta_description, meta_keywords, focus_keywords)
    values
    ('Home','/','Rent a Car Lahore | Mian Rent A Car CarMian','Premium car rental Lahore service with professional drivers, sedans, SUVs, luxury cars, vans, and intercity travel.','Rent a car Lahore, Car rental Lahore, Mian Rent A Car, CarMian','Rent a car Lahore'),
    ('Blogs','/blogs','Car Rental Lahore Blog | CarMian','Guides for rent a car in Lahore, intercity travel, airport rental, wedding rental, and corporate car rental.','Rent a car Lahore, Car rental service Lahore, Car hire Lahore','Car rental Lahore')
    on conflict (page_path) do nothing
  `;

  console.log("Seed complete");
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
