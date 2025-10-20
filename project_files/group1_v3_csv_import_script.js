const fs = require('fs');
const { Client } = require('pg');
const Papa = require('papaparse');

// Database configuration
const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'tv_shows_db',
  user: 'your_username',
  password: 'your_password'
};

// File path to your CSV
const CSV_FILE_PATH = './tv_subset.txt';

async function importTVShows() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('Connected to database');

    // Read and parse CSV file
    const fileContent = fs.readFileSync(CSV_FILE_PATH, 'utf8');
    const parseResult = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false // Keep everything as strings initially
    });

    const shows = parseResult.data;
    console.log(`Found ${shows.length} shows to import`);

    // Process each show
    for (let i = 0; i < shows.length; i++) {
      const show = shows[i];
      console.log(`Processing (${i + 1}/${shows.length}): ${show.Name}`);

      try {
        await client.query('BEGIN');

        // 1. Insert or get network (without countries)
        let networkId = null;
        if (show.Networks && show.Networks.trim()) {
          const networkResult = await client.query(
            `INSERT INTO networks (name, logo)
             VALUES ($1, $2)
             ON CONFLICT DO NOTHING
             RETURNING network_id`,
            [show.Networks.trim(), show['Network Logos'] || null]
          );
          
          if (networkResult.rows.length > 0) {
            networkId = networkResult.rows[0].network_id;
          } else {
            const existingNetwork = await client.query(
              'SELECT network_id FROM networks WHERE name = $1',
              [show.Networks.trim()]
            );
            networkId = existingNetwork.rows[0].network_id;
          }
        }

        // 2. Insert TV show (with network_country in tv_show table)
        const showResult = await client.query(
          `INSERT INTO tv_show (
            show_id, name, original_name, first_air_date, last_air_date,
            seasons, episodes, status, overview, popularity, tmdb_rating,
            vote_count, creators, poster_url, backdrop_url, network_id, network_country
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
          ON CONFLICT (show_id) DO UPDATE SET
            name = EXCLUDED.name,
            original_name = EXCLUDED.original_name,
            first_air_date = EXCLUDED.first_air_date,
            last_air_date = EXCLUDED.last_air_date,
            seasons = EXCLUDED.seasons,
            episodes = EXCLUDED.episodes,
            status = EXCLUDED.status,
            overview = EXCLUDED.overview,
            popularity = EXCLUDED.popularity,
            tmdb_rating = EXCLUDED.tmdb_rating,
            vote_count = EXCLUDED.vote_count,
            creators = EXCLUDED.creators,
            poster_url = EXCLUDED.poster_url,
            backdrop_url = EXCLUDED.backdrop_url,
            network_id = EXCLUDED.network_id,
            network_country = EXCLUDED.network_country
          RETURNING show_id`,
          [
            parseInt(show.ID),
            show.Name || null,
            show['Original Name'] || null,
            show['First Air Date'] || null,
            show['Last Air Date'] || null,
            show.Seasons ? parseInt(show.Seasons) : null,
            show.Episodes ? parseInt(show.Episodes) : null,
            show.Status || null,
            show.Overview || null,
            show.Popularity ? parseFloat(show.Popularity) : null,
            show['TMDb Rating'] ? parseFloat(show['TMDb Rating']) : null,
            show['Vote Count'] ? parseInt(show['Vote Count']) : null,
            show.Creators || null,
            show['Poster URL'] || null,
            show['Backdrop URL'] || null,
            networkId,
            show['Network Countries'] || null
          ]
        );

        const showId = showResult.rows[0].show_id;

        // 3. Insert genres
        if (show.Genres && show.Genres.trim()) {
          const genres = show.Genres.split(';').map(g => g.trim()).filter(g => g);
          
          for (const genreName of genres) {
            // Insert genre if not exists
            await client.query(
              `INSERT INTO genres (name)
               VALUES ($1)
               ON CONFLICT (name) DO NOTHING`,
              [genreName]
            );

            // Get genre_id
            const genreResult = await client.query(
              'SELECT genre_id FROM genres WHERE name = $1',
              [genreName]
            );
            const genreId = genreResult.rows[0].genre_id;

            // Link show to genre
            await client.query(
              `INSERT INTO show_genres (show_id, genre_id)
               VALUES ($1, $2)
               ON CONFLICT DO NOTHING`,
              [showId, genreId]
            );
          }
        }

        // 4. Insert companies
        if (show.Studios && show.Studios.trim()) {
          const companies = show.Studios.split(';').map(c => c.trim()).filter(c => c);
          const companyLogos = (show['Company Logos'] || '').split(';').map(l => l.trim());
          const companyCountries = (show['Company Countries'] || '').split(';').map(c => c.trim());

          for (let j = 0; j < companies.length; j++) {
            const companyName = companies[j];
            const companyLogo = companyLogos[j] || null;
            const companyCountry = companyCountries[j] || null;

            // Check if exact company (name + logo + countries) exists
            const existingCompany = await client.query(
              `SELECT company_id FROM company 
               WHERE name = $1 AND logo IS NOT DISTINCT FROM $2 AND countries IS NOT DISTINCT FROM $3`,
              [companyName, companyLogo, companyCountry]
            );

            let companyId;
            if (existingCompany.rows.length > 0) {
              // Exact match found
              companyId = existingCompany.rows[0].company_id;
            } else {
              // No exact match, insert new company (even if name exists with different country)
              const companyResult = await client.query(
                `INSERT INTO company (name, logo, countries)
                 VALUES ($1, $2, $3)
                 RETURNING company_id`,
                [companyName, companyLogo, companyCountry]
              );
              companyId = companyResult.rows[0].company_id;
            }

            // Link show to company
            await client.query(
              `INSERT INTO show_companies (show_id, company_id)
               VALUES ($1, $2)
               ON CONFLICT DO NOTHING`,
              [showId, companyId]
            );
          }
        }

        // 5. Insert actors and characters
        for (let actorNum = 1; actorNum <= 10; actorNum++) {
          const actorName = show[`Actor ${actorNum} Name`];
          const characterName = show[`Actor ${actorNum} Character`];
          const profileUrl = show[`Actor ${actorNum} Profile URL`];

          if (actorName && actorName.trim()) {
            // Insert actor if not exists
            const actorResult = await client.query(
              `INSERT INTO actors (name, profile_url)
               VALUES ($1, $2)
               ON CONFLICT DO NOTHING
               RETURNING actor_id`,
              [actorName.trim(), profileUrl || null]
            );

            let actorId;
            if (actorResult.rows.length > 0) {
              actorId = actorResult.rows[0].actor_id;
            } else {
              const existingActor = await client.query(
                'SELECT actor_id FROM actors WHERE name = $1',
                [actorName.trim()]
              );
              actorId = existingActor.rows[0].actor_id;
            }

            // Link actor to show with character
            if (characterName && characterName.trim()) {
              await client.query(
                `INSERT INTO characters (show_id, actor_id, name, order_num)
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT DO NOTHING`,
                [showId, actorId, characterName.trim(), actorNum]
              );
            }
          }
        }

        await client.query('COMMIT');
        console.log(`✓ Successfully imported: ${show.Name}`);

      } catch (error) {
        await client.query('ROLLBACK');
        console.error(`✗ Error importing ${show.Name}:`, error.message);
      }
    }

    console.log('\n=== Import Complete ===');
    console.log(`Total shows processed: ${shows.length}`);

  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

// Run the import
importTVShows().catch(console.error);