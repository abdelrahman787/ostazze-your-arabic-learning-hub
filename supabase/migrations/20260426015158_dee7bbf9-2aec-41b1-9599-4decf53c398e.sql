UPDATE auth.users
SET encrypted_password = crypt('Test1234!', gen_salt('bf')),
    email_confirmed_at = COALESCE(email_confirmed_at, now()),
    updated_at = now()
WHERE email LIKE '%@ostazze.com' OR email LIKE '%@ostaze.com';