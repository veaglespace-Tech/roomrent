USE roomrent_maharashtra;

INSERT INTO listing_sources (source_name, source_domain, allowed_for_ingestion, terms_status, notes)
SELECT
  'Brickplot Open Data / MahaRERA public project records',
  'brickplot.com',
  TRUE,
  'APPROVED',
  'Open Data page states MahaRERA project datasets are published under Open Data Commons Public Domain Dedication and Licence (PDDL). Use for Maharashtra project/buy-side records only; not active rental listings.'
WHERE NOT EXISTS (
  SELECT 1 FROM listing_sources WHERE source_domain = 'brickplot.com'
);

INSERT INTO listing_sources (source_name, source_domain, allowed_for_ingestion, terms_status, notes)
SELECT
  'Rentoverse',
  'rentoverse.com',
  FALSE,
  'REJECTED',
  'Terms of Use prohibit scraping, crawling, or automatically extracting listing data without written permission. Do not ingest listings unless written permission/API access is obtained.'
WHERE NOT EXISTS (
  SELECT 1 FROM listing_sources WHERE source_domain = 'rentoverse.com'
);
