const fs = require('fs');
const { Pool } = require('pg');
const csv = require('csv-parser');

// Configure your PostgreSQL connection
const pool = new Pool({
  host: 'localhost',
  database: 'tv_shows_db',
  user: 'your_username',
  password: 'your_password',
  port: 5432
});

// Store unique reference data
const genres = new Map();
const networks = new Map();
const companies = new Map();
const actors = new Map();

async function importData(csvFilePath) {
  const rows = [];
  
  // Read CSV file
  await new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => rows.push(row))
      .on('end', resolve)
      .on('error', reject);
  });

  console.log(`Loaded ${rows.length} rows from CSV`);

  // Extract unique reference data
  console.log('Extracting reference data...');
  rows.forEach(row => {
    // Extract genres (semicolon-separated)
    if (row.Genres) {
      row.Genres.split(';').forEach(g => {
        const genre = g.trim();
        if (genre && !genres.has(genre)) {
          genres.set(genre, null);
        }
      });
    }

    // Extract networks
    if (row.Networks) {
      const networkNames = row.Networks.split(';').map(n => n.trim());
      const networkLogos = row['Network Logos'] ? row['Network Logos'].split(';').map(l => l.trim()) : [];
      const networkCountries = row['Network Countries'] ? row['Network Countries'].split(';').map(c => c.trim()) : [];
      
      networkNames.forEach((name, idx) => {
        if (name && !networks.has(name)) {
          networks.set(name, {
            logo: networkLogos[idx] || null,
            countries: networkCountries[idx] || null
          });
        }
      });
    }

    // Extract companies (Studios)
    if (row.Studios) {
      const companyNames = row.Studios.split(';').map(c => c.trim());
      const companyLogos = row['Company Logos'] ? row['Company Logos'].split(';').map(l => l.trim()) : [];
      const companyCountries = row['Company Countries'] ? row['Company Countries'].split(';').map(c => c.trim()) : [];
      
      companyNames.forEach((name, idx) => {
        if (name && !companies.has(name)) {
          companies.set(name, {
            logo: companyLogos[idx] || null,
            countries: companyCountries[idx] || null
          });
        }
      });
    }

    // Extract actors (Actor 1-10)
    for (let i = 1; i <= 10; i++) {
      const actorName = row[`Actor ${i} Name`];
      const profileUrl = row[`Actor ${i} Profile URL`];
      
      if (actorName && actorName.trim() && !actors.has(actorName)) {
        actors.set(actorName, profileUrl || null);
      }
    }
  });

  console.log(`Found ${genres.size} unique genres`);
  console.log(`Found ${networks.size} unique networks`);
  console.log(`Found ${companies.size} unique companies`);
  console.log(`Found ${actors.size} unique actors`);

  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Insert genres
    console.log('Inserting genres...');
    for (const genre of genres.keys()) {
      const result = await client.query(
        'INSERT INTO genres (name) VALUES ($1) ON CONFLICT DO NOTHING RETURNING genre_id',
        [genre]
      );
      if (result.rows.length > 0) {
        genres.set(genre, result.rows[0].genre_id);
      } else {
        const existing = await client.query('SELECT genre_id FROM genres WHERE name = $1', [genre]);
        genres.set(genre, existing.rows[0].genre_id);
      }
    }

    // Insert networks
    console.log('Inserting networks...');
    for (const [name, data] of networks.entries()) {
      const result = await client.query(
        'INSERT INTO networks (name, logo, countries) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING network_id',
        [name, data.logo, data.countries]
      );
      if (result.rows.length > 0) {
        networks.set(name, result.rows[0].network_id);
      } else {
        const existing = await client.query('SELECT network_id FROM networks WHERE name = $1', [name]);
        networks.set(name, existing.rows[0].network_id);
      }
    }

    // Insert companies
    console.log('Inserting companies...');
    for (const [name, data] of companies.entries()) {
      const result = await client.query(
        'INSERT INTO company (name, logo, countries) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING company_id',
        [name, data.logo, data.countries]
      );
      if (result.rows.length > 0) {
        companies.set(name, result.rows[0].company_id);
      } else {
        const existing = await client.query('SELECT company_id FROM company WHERE name = $1', [name]);
        companies.set(name, existing.rows[0].company_id);
      }
    }

    // Insert actors
    console.log('Inserting actors...');
    for (const [name, profileUrl] of actors.entries()) {
      const result = await client.query(
        'INSERT INTO actors (name, profile_url) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING actor_id',
        [name, profileUrl]
      );
      if (result.rows.length > 0) {
        actors.set(name, result.rows[0].actor_id);
      } else {
        const existing = await client.query('SELECT actor_id FROM actors WHERE name = $1', [name]);
        actors.set(name, existing.rows[0].actor_id);
      }
    }

    // Insert TV shows and characters
    console.log('Inserting TV shows and characters...');
    for (const row of rows) {
      // Get genre_id (use first genre if multiple)
      let genreId = null;
      if (row.Genres) {
        const firstGenre = row.Genres.split(';')[0].trim();
        genreId = genres.get(firstGenre);
      }

      // Get network_id (use first network if multiple)
      let networkId = null;
      if (row.Networks) {
        const firstNetwork = row.Networks.split(';')[0].trim();
        networkId = networks.get(firstNetwork);
      }

      // Get company IDs (up to 8)
      const companyIds = [];
      if (row.Studios) {
        const studioNames = row.Studios.split(';').map(s => s.trim()).filter(s => s);
        studioNames.forEach(name => {
          if (companies.has(name)) {
            companyIds.push(companies.get(name));
          }
        });
      }

      // Insert TV show
      await client.query(
        `INSERT INTO tv_show (
          show_id, name, original_name, first_air_date, last_air_date,
          seasons, episodes, status, overview, popularity,
          tmdb_rating, vote_count, creators, poster_url, backdrop_url,
          network_id, genre_id, company1, company2, company3, company4,
          company5, company6, company7, company8
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
        ON CONFLICT (show_id) DO NOTHING`,
        [
          row.ID,
          row.Name,
          row['Original Name'] || null,
          row['First Air Date'] || null,
          row['Last Air Date'] || null,
          row.Seasons ? parseInt(row.Seasons) : null,
          row.Episodes ? parseInt(row.Episodes) : null,
          row.Status || null,
          row.Overview || null,
          row.Popularity ? parseFloat(row.Popularity) : null,
          row['TMDb Rating'] ? parseFloat(row['TMDb Rating']) : null,
          row['Vote Count'] ? parseInt(row['Vote Count']) : null,
          row.Creators || null,
          row['Poster URL'] || null,
          row['Backdrop URL'] || null,
          networkId,
          genreId,
          companyIds[0] || null,
          companyIds[1] || null,
          companyIds[2] || null,
          companyIds[3] || null,
          companyIds[4] || null,
          companyIds[5] || null,
          companyIds[6] || null,
          companyIds[7] || null
        ]
      );

      // Insert characters
      for (let i = 1; i <= 10; i++) {
        const actorName = row[`Actor ${i} Name`];
        const characterName = row[`Actor ${i} Character`];
        
        if (actorName && actorName.trim() && characterName && characterName.trim()) {
          const actorId = actors.get(actorName);
          
          if (actorId) {
            await client.query(
              `INSERT INTO characters (show_id, actor_id, name, order_num)
               VALUES ($1, $2, $3, $4)
               ON CONFLICT (show_id, actor_id) DO NOTHING`,
              [row.ID, actorId, characterName, i]
            );
          }
        }
      }
    }

    await client.query('COMMIT');
    console.log('Import completed successfully!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error during import:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the import
const csvFilePath = process.argv[2] || 'tv_shows.csv';

importData(csvFilePath)
  .then(() => {
    console.log('All data imported successfully');
    pool.end();
  })
  .catch((error) => {
    console.error('Import failed:', error);
    pool.end();
    process.exit(1);
  });
