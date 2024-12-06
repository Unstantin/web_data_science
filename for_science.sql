SELECT title, count(*) FROM papers_chemistry GROUP BY title ORDER BY count DESC

SELECT title, count(*) FROM papers_joane GROUP BY title ORDER BY count DESC
SELECT * FROM papers_joane ORDER BY title

SELECT authors, count(*) FROM papers_rtj GROUP BY authors ORDER BY count DESC
SELECT * FROM papers_rtj

SELECT year, count(*) FROM papers_tech GROUP BY year ORDER BY count DESC

SELECT title, count(*) FROM papers_ran GROUP BY title ORDER BY count DESC