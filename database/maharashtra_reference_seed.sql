USE roomrent_maharashtra;

INSERT INTO states (name, slug, code)
VALUES ('Maharashtra', 'maharashtra', 'MH')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO districts (state_id, name, slug)
SELECT s.id, d.name, d.slug
FROM states s
JOIN (
    SELECT 'Ahilyanagar' AS name, 'ahilyanagar' AS slug UNION ALL
    SELECT 'Akola', 'akola' UNION ALL
    SELECT 'Amravati', 'amravati' UNION ALL
    SELECT 'Chhatrapati Sambhajinagar', 'chhatrapati-sambhajinagar' UNION ALL
    SELECT 'Beed', 'beed' UNION ALL
    SELECT 'Bhandara', 'bhandara' UNION ALL
    SELECT 'Buldhana', 'buldhana' UNION ALL
    SELECT 'Chandrapur', 'chandrapur' UNION ALL
    SELECT 'Dhule', 'dhule' UNION ALL
    SELECT 'Gadchiroli', 'gadchiroli' UNION ALL
    SELECT 'Gondia', 'gondia' UNION ALL
    SELECT 'Hingoli', 'hingoli' UNION ALL
    SELECT 'Jalgaon', 'jalgaon' UNION ALL
    SELECT 'Jalna', 'jalna' UNION ALL
    SELECT 'Kolhapur', 'kolhapur' UNION ALL
    SELECT 'Latur', 'latur' UNION ALL
    SELECT 'Mumbai City', 'mumbai-city' UNION ALL
    SELECT 'Mumbai Suburban', 'mumbai-suburban' UNION ALL
    SELECT 'Nagpur', 'nagpur' UNION ALL
    SELECT 'Nanded', 'nanded' UNION ALL
    SELECT 'Nandurbar', 'nandurbar' UNION ALL
    SELECT 'Nashik', 'nashik' UNION ALL
    SELECT 'Dharashiv', 'dharashiv' UNION ALL
    SELECT 'Palghar', 'palghar' UNION ALL
    SELECT 'Parbhani', 'parbhani' UNION ALL
    SELECT 'Pune', 'pune' UNION ALL
    SELECT 'Raigad', 'raigad' UNION ALL
    SELECT 'Ratnagiri', 'ratnagiri' UNION ALL
    SELECT 'Sangli', 'sangli' UNION ALL
    SELECT 'Satara', 'satara' UNION ALL
    SELECT 'Sindhudurg', 'sindhudurg' UNION ALL
    SELECT 'Solapur', 'solapur' UNION ALL
    SELECT 'Thane', 'thane' UNION ALL
    SELECT 'Wardha', 'wardha' UNION ALL
    SELECT 'Washim', 'washim' UNION ALL
    SELECT 'Yavatmal', 'yavatmal'
) d
WHERE s.code = 'MH'
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO cities (district_id, name, slug, latitude, longitude)
SELECT d.id, c.name, c.slug, c.latitude, c.longitude
FROM districts d
JOIN (
    SELECT 'Mumbai City' AS district_name, 'Mumbai' AS name, 'mumbai' AS slug, 19.0760 AS latitude, 72.8777 AS longitude UNION ALL
    SELECT 'Pune', 'Pune', 'pune', 18.5204, 73.8567 UNION ALL
    SELECT 'Nagpur', 'Nagpur', 'nagpur', 21.1458, 79.0882 UNION ALL
    SELECT 'Nashik', 'Nashik', 'nashik', 19.9975, 73.7898 UNION ALL
    SELECT 'Thane', 'Thane', 'thane', 19.2183, 72.9781 UNION ALL
    SELECT 'Thane', 'Navi Mumbai', 'navi-mumbai', 19.0330, 73.0297 UNION ALL
    SELECT 'Chhatrapati Sambhajinagar', 'Chhatrapati Sambhajinagar', 'chhatrapati-sambhajinagar', 19.8762, 75.3433 UNION ALL
    SELECT 'Kolhapur', 'Kolhapur', 'kolhapur', 16.7050, 74.2433 UNION ALL
    SELECT 'Solapur', 'Solapur', 'solapur', 17.6599, 75.9064 UNION ALL
    SELECT 'Sangli', 'Sangli', 'sangli', 16.8524, 74.5815 UNION ALL
    SELECT 'Satara', 'Satara', 'satara', 17.6805, 74.0183 UNION ALL
    SELECT 'Ahilyanagar', 'Ahilyanagar', 'ahilyanagar', 19.0952, 74.7496 UNION ALL
    SELECT 'Jalgaon', 'Jalgaon', 'jalgaon', 21.0077, 75.5626 UNION ALL
    SELECT 'Amravati', 'Amravati', 'amravati', 20.9374, 77.7796 UNION ALL
    SELECT 'Akola', 'Akola', 'akola', 20.7002, 77.0082 UNION ALL
    SELECT 'Latur', 'Latur', 'latur', 18.4088, 76.5604 UNION ALL
    SELECT 'Nanded', 'Nanded', 'nanded', 19.1383, 77.3210 UNION ALL
    SELECT 'Ratnagiri', 'Ratnagiri', 'ratnagiri', 16.9902, 73.3120 UNION ALL
    SELECT 'Sindhudurg', 'Kudal', 'kudal', 16.0117, 73.6889 UNION ALL
    SELECT 'Wardha', 'Wardha', 'wardha', 20.7453, 78.6022 UNION ALL
    SELECT 'Chandrapur', 'Chandrapur', 'chandrapur', 19.9615, 79.2961 UNION ALL
    SELECT 'Yavatmal', 'Yavatmal', 'yavatmal', 20.3899, 78.1307 UNION ALL
    SELECT 'Buldhana', 'Buldhana', 'buldhana', 20.5293, 76.1840 UNION ALL
    SELECT 'Beed', 'Beed', 'beed', 18.9891, 75.7601 UNION ALL
    SELECT 'Dharashiv', 'Dharashiv', 'dharashiv', 18.1861, 76.0419 UNION ALL
    SELECT 'Dhule', 'Dhule', 'dhule', 20.9042, 74.7749 UNION ALL
    SELECT 'Gondia', 'Gondia', 'gondia', 21.4602, 80.1920 UNION ALL
    SELECT 'Bhandara', 'Bhandara', 'bhandara', 21.1702, 79.6501
) c
ON d.name = c.district_name
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    latitude = VALUES(latitude),
    longitude = VALUES(longitude);
