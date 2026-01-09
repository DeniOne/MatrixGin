-- Link Telegram account for superuser
-- Email: denisgovako@gmail.com
-- Telegram ID: 441610858

UPDATE users 
SET telegram_id = '441610858' 
WHERE email = 'denisgovako@gmail.com';

-- Verify the update
SELECT id, email, first_name, last_name, telegram_id, role 
FROM users 
WHERE email = 'denisgovako@gmail.com';
