/*
  # Add More FAQ Items

  This migration adds additional frequently asked questions to provide comprehensive
  information to potential customers.

  ## New FAQ Items
  
  Adds 6 new FAQ items covering:
  - Types of vehicles accepted
  - Difference from regular car wash
  - Starlight ceiling installation
  - Business hours and location
  - Why exterior wash is not included
  - Headlight restoration process

  ## Security
  
  No security changes - inherits existing RLS policies from faq_items table.
*/

-- Add new FAQ items
INSERT INTO faq_items (question, answer, display_order) VALUES
('Ce tipuri de mașini acceptați pentru detailing?', 'Acceptăm orice tip de vehicul: autoturisme, SUV-uri, mașini sport, mașini de lux, motociclete și chiar vehicule comerciale. Fiecare vehicul primește atenția și tratamentul adecvat specificului său.', 5),
('Care este diferența față de o spălătorie auto obișnuită?', 'Detailing-ul auto este mult mai mult decât o simplă spălare. Include corecția vopselei, polish profesional, tratamente de protecție, curățare profundă a interiorului și restaurarea componentelor. Ne concentrăm pe perfecțiune și durabilitate, nu doar pe curățenie superficială.', 6),
('Ce este plafoanul înstelat (starlight) și îl puteți instala?', 'Plafoanul înstelat este un sistem de iluminare prin fibre optice care creează efectul unui cer înstelat în plafonul mașinii. Da, oferim servicii complete de instalare plafon starlight personalizat, cu diferite configurații și culori, pentru un interior cu adevărat unic.', 7),
('Care este programul dumneavoastră și unde vă aflați?', 'Programul nostru este Luni-Sâmbătă: 09:00-18:00. Suntem localizați în Iași. Pentru adresa exactă și programări, vă rugăm să ne contactați pe WhatsApp la +40 726 521 578.', 8),
('De ce nu includeți spălarea exterioară în pachetele de detailing interior?', 'Ne concentrăm pe servicii specializate de detailing interior profund - curățare tapițerie, tratamente piele, igienizare completă. Pentru exteriorul mașinii oferim pachete separate dedicate: polish, corecție vopsea și tratamente ceramice. Această specializare ne permite să oferim rezultate superioare în fiecare domeniu.', 9),
('Cum funcționează recondiționarea farurilor?', 'Recondiționarea farurilor elimină stratul galben și opac de pe faruri prin polișare profesională și aplicarea unui strat protector UV. Procesul restabilește claritatea originală a farurilor, îmbunătățește vizibilitatea nocturnă și aspectul general al mașinii. Durabilitatea este de 2-3 ani cu întreținere corectă.', 10)
ON CONFLICT DO NOTHING;