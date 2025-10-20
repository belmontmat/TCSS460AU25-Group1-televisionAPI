-- ============================================
-- COMPREHENSIVE VERIFICATION QUERY
-- Get all data for a show in one aggregated row
-- ============================================

SELECT 
    -- TV Show basic info
    ts.show_id,
    ts.name,
    ts.original_name,
    ts.first_air_date,
    ts.last_air_date,
    ts.seasons,
    ts.episodes,
    ts.status,
    ts.overview,
    ts.popularity,
    ts.tmdb_rating,
    ts.vote_count,
    ts.creators,
    ts.poster_url,
    ts.backdrop_url,
    
    -- Network info (with network_country from tv_show table)
    n.name AS network_name,
    n.logo AS network_logo,
    ts.network_country,
    
    -- Aggregated genres
    STRING_AGG(DISTINCT g.name, '; ' ORDER BY g.name) AS genres,
    
    -- Aggregated companies
    STRING_AGG(DISTINCT c.name, '; ' ORDER BY c.name) AS companies,
    STRING_AGG(DISTINCT c.logo, '; ' ORDER BY c.name) AS company_logos,
    STRING_AGG(DISTINCT c.countries, '; ' ORDER BY c.name) AS company_countries,
    
    -- Aggregated actors and characters (ordered)
    STRING_AGG(DISTINCT a.name || ' as ' || ch.name, '; ' ORDER BY ch.order_num) AS cast

FROM tv_show ts
LEFT JOIN networks n ON ts.network_id = n.network_id
LEFT JOIN show_genres sg ON ts.show_id = sg.show_id
LEFT JOIN genres g ON sg.genre_id = g.genre_id
LEFT JOIN show_companies sc ON ts.show_id = sc.show_id
LEFT JOIN company c ON sc.company_id = c.company_id
LEFT JOIN characters ch ON ts.show_id = ch.show_id
LEFT JOIN actors a ON ch.actor_id = a.actor_id

WHERE ts.show_id = 258462  -- Replace with your show ID

GROUP BY 
    ts.show_id, ts.name, ts.original_name, ts.first_air_date, ts.last_air_date,
    ts.seasons, ts.episodes, ts.status, ts.overview, ts.popularity, 
    ts.tmdb_rating, ts.vote_count, ts.creators, ts.poster_url, ts.backdrop_url,
    n.name, n.logo, ts.network_country;


-- ============================================
-- DETAILED VERIFICATION QUERIES
-- Get separate results for each relationship
-- ============================================

-- Show basic info
SELECT * FROM tv_show WHERE show_id = 258462;

-- Network (note: countries is now in tv_show table, not networks table)
SELECT 
    n.*,
    ts.network_country
FROM networks n
JOIN tv_show ts ON n.network_id = ts.network_id
WHERE ts.show_id = 258462;

-- Genres
SELECT g.* FROM genres g
JOIN show_genres sg ON g.genre_id = sg.genre_id
WHERE sg.show_id = 258462
ORDER BY g.name;

-- Companies
SELECT c.* FROM company c
JOIN show_companies sc ON c.company_id = sc.company_id
WHERE sc.show_id = 258462
ORDER BY c.name;

-- Cast with characters
SELECT 
    a.name AS actor_name,
    ch.name AS character_name,
    ch.order_num,
    a.profile_url
FROM characters ch
JOIN actors a ON ch.actor_id = a.actor_id
WHERE ch.show_id = 258462
ORDER BY ch.order_num;


-- ============================================
-- QUICK VERIFICATION - COUNT RELATIONSHIPS
-- ============================================

SELECT 
    ts.show_id,
    ts.name,
    COUNT(DISTINCT sg.genre_id) AS genre_count,
    COUNT(DISTINCT sc.company_id) AS company_count,
    COUNT(DISTINCT ch.actor_id) AS actor_count
FROM tv_show ts
LEFT JOIN show_genres sg ON ts.show_id = sg.show_id
LEFT JOIN show_companies sc ON ts.show_id = sc.show_id
LEFT JOIN characters ch ON ts.show_id = ch.show_id
WHERE ts.show_id = 258462
GROUP BY ts.show_id, ts.name;